<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_gamedata;
global $current_user_inventory;
global $site_url;
global $is_logged_in;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/Exercises.php';
include_once $template_dir . '/functions/Inventory.php';
include_once $template_dir . '/components/Icons.php';

$masterJSON = json_decode(file_get_contents($template_dir . '/assets/json/exercises.json'), true);
$levelMap = json_decode(file_get_contents($template_dir . '/assets/json/levelmap.json'), true);
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

  if ($item[0] = 'progress') {

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
    if ($type == 'WhatYouHear') {
      $ex[] = GetTTSAudioFor($ex[0]);
    }

    // Get a translation
    $ex['translation'] = GetCloudTranslationFor($ex[0]);

    array_unshift($ex, $type);

    $res[] = $ex;

  }

  return $res;

}

if($unit) {

  // If it wasn't the levelmap that was requested, pass on a unit
  if (is_array($masterJSON[$unit]['CompleteThePhrase'])) {
    $responseJSON = array_merge($responseJSON, GetTheExercises('CompleteThePhrase', $unit, 5, $masterJSON));
  }

  if (is_array($masterJSON[$unit]['WhatYouHear'])) {
    $responseJSON = array_merge($responseJSON, GetTheExercises('WhatYouHear', $unit, 2, $masterJSON));
  }

}

if ($_GET['json'] == 'levelmap') {

  foreach ($levelMap as &$level) {
    foreach ($level as &$unit) {
      $unit['image'] = GuyraGetIcon($unit['image']);
    }
  }

  $responseJSON['levelmap'] = $levelMap;

}

if ($_GET['json'] == 'usermeta') {

  $responseJSON['usermeta'] = GetUserRanking($current_user_id);
  $responseJSON['gamedata'] = $current_user_gamedata;

}

if ($_GET['i18n'] == "full") {
  $responseJSON['i18n'] = $gi18n;
}

if (!empty($responseJSON)) {
  guyra_output_json($responseJSON, true);
}
