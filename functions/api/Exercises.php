<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_gamedata;
global $current_user_inventory;
global $site_url;
global $is_logged_in;
global $gi18n;
global $gLang;
global $secondsForA;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/functions/Exercises.php';
include_once $template_dir . '/functions/Inventory.php';
include_once $template_dir . '/components/Icons.php';

if ($_GET['log_wrong_answer']) {
  $current_data = guyra_get_user_meta(1, 'reported_answers', true);
  $current_data = json_decode($current_data['meta_value'], true);
  $data = json_decode(file_get_contents('php://input'), true);

  $current_data[time()] = $data;

  guyra_update_user_meta(1, 'reported_answers', json_encode($current_data, JSON_UNESCAPED_UNICODE));
}

if ($_GET['get_ranking_page']) {
  $users = guyra_get_users();
  $users_by_elo = [];
  $output = [];

  foreach ($users as $user) {

    $user_elo = $user['gamedata']['elo'];

    if ($user_elo > 0) {
      $users_by_elo[$user['id']]['elo'] = $user_elo;
      $users_by_elo[$user['id']]['id'] = $user['id'];
    }

  }

  $users_by_elo = array_sort($users_by_elo, 'elo', SORT_DESC);

  foreach ($users_by_elo as &$user) {

    $user_data = $users[$user['id']];
    $user_elo = $user['elo'];
    $user_elo_info = GetUserRanking($user['id'], $user_data['gamedata']);
    $user_first_name = $user_data['userdata']['first_name'];
    $user_private = false;

    if ($user_data['userdata']['privacy']['ranking_info_public'] === false) {
      $user_first_name = substr($user_first_name, 0, 1) . '.';
      $user_private = true;
    }

    $user = [
      'first_name' => $user_first_name,
      'avatar' => Guyra_get_profile_picture($user_data['userdata'], null, true),
      'user_ranking' => $user_elo_info,
      'user_private' => $user_private
    ];

    if ($user_data['gamedata']['elo_validity'] > time())
    $output[] = $user;

  }

  unset($users);
  unset($users_by_elo);

  guyra_output_json($output, true);
}

if ($_GET['fetch_flashcard_deck']) {

  $deck = $_GET['fetch_flashcard_deck'];
  $decksFile = file_get_contents($template_dir . '/assets/json/i18n/' . $gLang[0] . '/flashcards.json');
  $decksi18n = json_decode($decksFile, true);
  $fetchedDeck = $decksi18n[$deck];

  if (!$fetchedDeck)
  guyra_output_json('invalid deck', true);

  Guyra_decrease_user_level($current_user_id, 3);

  guyra_output_json($fetchedDeck, true);

}

if ($_GET['get_exercises']):

  $exercisesJSONPath = $template_dir . '/assets/json/i18n/' . $gLang[0] . '/exercises.json';
  $exercisesJSON = json_decode(file_get_contents($exercisesJSONPath), true);

  $levelMapPath = $template_dir . '/assets/json/i18n/' . $gLang[0] . '/levelmap.json';
  $levelMap = json_decode(file_get_contents($levelMapPath), true);

  if (!$exercisesJSON || !$levelMap)
  guyra_output_json('error_json_notfound');
  
  $responseJSON = [];
  $unit = $_GET['unit'];

  $shopItems = GuyraShop_FetchItems();
  $shopSoldUnits = [];
  $availableProgressPacks = [];
  $iCounter = 0;
  $shopItemsKeys = array_keys($shopItems);

  // Determine what is the furthest a user can go without a shop item.
  // and build a list of available progress packs.
  foreach ($shopItems as $item_listing) {

    if ($item_listing['type'] == 'progress') {

      $availableProgressPacks[$shopItemsKeys[$iCounter]] = $item_listing;

      foreach ($item_listing['items'] as $item) {
        $shopSoldUnits = array_merge($shopSoldUnits, $item);
      }

    }

    $iCounter += 1;

  }

  // Now determine if the user has those units.
  $disallowedUnits = $shopSoldUnits;

  foreach ($current_user_inventory as $inventory_item) {

    $item = explode('_', $inventory_item);

    if ($item[0] == 'progress' && $availableProgressPacks[$inventory_item]) {

      foreach ($availableProgressPacks[$inventory_item]['items'] as $progress_pack_units) {
        foreach ($progress_pack_units as $progress_pack_unit) {

          $disallowedUnitIndex = array_search($progress_pack_unit, $disallowedUnits);
          unset($disallowedUnits[$disallowedUnitIndex]);

        }
      };

    }

  }

  // Set these units as disabled
  foreach ($levelMap as &$level) {

    $unit_keys = array_keys($level);

    foreach ($unit_keys as $unit_key) {
      if (in_array($unit_key, $disallowedUnits)) {
        $level[$unit_key]['disabled'] = true;
      }
    }

  }

  // If a user is being sneaky and trying to get a disallowed unit we freak out.
  if (in_array($unit, $disallowedUnits))
  guyra_output_json('unit not owned', true);

  // Now that we are ok, get the data.
  function GetRandomExercise($type, $unit, $json) {
    return random_int(0, sizeof($json[$unit][$type]) - 1);
  }

  function GetTheExercises($type, $unit, $length, $json) {

    $rnd = GetRandomExercise($type, $unit, $json);
    $used_numbers = Array();
    $res = Array();

    for ($x=0; $x < $length; $x++) {

      while(in_array($rnd, $used_numbers)) {
        $rnd = GetRandomExercise($type, $unit, $json);
      }

      $used_numbers[] = $rnd;
      $ex = $json[$unit][$type][$rnd];

      // Get an audio link for audio questions
      if ($type == 'WhatYouHear')
      $ex[] = GetTTSAudioFor($ex[0]);

      // Get a translation
      $ex['translation'] = GetCloudTranslationFor($ex[0]);

      array_unshift($ex, $type);

      $res[] = $ex;

    }

    return $res;

  }

  if($unit) {

    // If it wasn't the levelmap that was requested, pass on a unit
    // Units currently consist of:
    //
    // * 3 CompleteThePhrase exercises.
    // * 1 WhatYouHear exercises.
    // * 2 Translate exercises.
    // * 1 MultipleChoice exercise
    // * 2 CompleteThePhraseBuilder exercises
    //
    // But this is due for a change to a more dynamic system, so
    // TODO: refactor this

    if (is_array($exercisesJSON[$unit]['CompleteThePhrase']))
    $responseJSON = array_merge($responseJSON, GetTheExercises('CompleteThePhrase', $unit, 3, $exercisesJSON));

    if (is_array($exercisesJSON[$unit]['WhatYouHear']))
    $responseJSON = array_merge($responseJSON, GetTheExercises('WhatYouHear', $unit, 1, $exercisesJSON));

    if (is_array($exercisesJSON[$unit]['Translate']))
    $responseJSON = array_merge($responseJSON, GetTheExercises('Translate', $unit, 2, $exercisesJSON));

    if (is_array($exercisesJSON[$unit]['MultipleChoice']))
    $responseJSON = array_merge($responseJSON, GetTheExercises('MultipleChoice', $unit, 1, $exercisesJSON));

    if (is_array($exercisesJSON[$unit]['CompleteThePhraseBuilder']))
    $responseJSON = array_merge($responseJSON, GetTheExercises('CompleteThePhraseBuilder', $unit, 2, $exercisesJSON));

    // TODO this could be a variable amount
    Guyra_decrease_user_level($current_user_id, 1);

  }

  if ($_GET['get_exercises'] == 'levelmap') {

    foreach ($levelMap as &$level) {
      foreach ($level as &$unit) {
        $unit['image'] = GuyraGetIcon($unit['image']);
      }
    }

    $responseJSON['levelmap'] = $levelMap;

  }

  if (!empty($responseJSON))
  guyra_output_json($responseJSON, true);

endif; // Exercises handler.

if ($_GET['fetch_exercise_hints']) {
  
  $hints = file_get_contents($template_dir . '/assets/json/i18n/' . $gLang[0] . '/hints.json');

  guyra_output_json($hints, true);

}

if ($is_logged_in):

if ($_GET['update_flashcards']) {

  $theDataJSON = file_get_contents('php://input');
  $theData = json_decode($theDataJSON, true);

  Guyra_increase_user_level();

  guyra_update_user_data($current_user_id, ['flashcards' => $theData], null, 'gamedata');

}

if ($_GET['log_exercise_data']) {

  $theDataJSON = file_get_contents('php://input');
  $theData = json_decode($theDataJSON, true);
  $completed_units = $current_user_gamedata['completed_units'];

  if (!is_array($completed_units))
  $completed_units = [];

  $completed_units[] = $theData['unit'];
  $current_user_gamedata['completed_units'] = $completed_units;
  $current_user_gamedata['elo'] = $theData['elo'];

  $levels_gained = 1;

  if ($theData['score'] == 100)
  $levels_gained = 3;

  $newdata = Guyra_increase_user_level($current_user_id, $levels_gained, true);
  $newdata['completed_units'] = json_encode($completed_units);
  
  // Elo validity
  if ($newdata['elo_validity'] < time()) {
    
    $newdata['elo'] = $theData['elo'] - $newdata['elo'];

    if ($newdata['elo'] > 25)
    $newdata['elo'] = 25;

    $newdata['elo_validity'] = time() + $secondsForA['week'];

    PushNotification($gi18n['notification_exercise_rankingreset']);

  } else {

    $newdata['elo'] = $theData['elo'];

    PushNotification($gi18n['notification_exercise_levelup']);
 
  }

  guyra_update_user_data(
    $current_user_id,
    $newdata,
    null,
    'gamedata'
  );

  guyra_log_to_db($current_user_id, $theDataJSON);

}

endif;