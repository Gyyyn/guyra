<?php

global $template_dir;
global $current_user_id;
global $current_user_gamedata;
global $gi18n;

include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/Hash.php';

Guyra_Safeguard_File();

if ($_GET['log_wrong_answer']) {
  $current_data = guyra_get_user_meta(1, 'reported_answers', true);
  $current_data = json_decode($current_data['meta_value'], true);
  $data = json_decode(file_get_contents('php://input'), true);

  $current_data[time()] = $data;

  guyra_update_user_meta(1, 'reported_answers', json_encode($current_data, JSON_UNESCAPED_UNICODE));
}

if ($_GET['log_exercise_data']) {

  $theDataJSON = file_get_contents('php://input');
  $theData = json_decode($theDataJSON, true);
  $completed_units = $current_user_gamedata['completed_units'];

  if (!is_array($completed_units)) {
    $completed_units = [];
  }

  $completed_units[] = $theData['unit'];
  $current_user_gamedata['completed_units'] = $completed_units;
  $current_user_gamedata['elo'] = $theData['elo'];

  $levels_gained = 1;

  if ($theData['score'] == 100) {
    $levels_gained = 3;
  }

  Guyra_increase_user_level($current_user_id, $levels_gained);
  PushNotification($gi18n['notification_exercise_levelup']);

  guyra_update_user_data($current_user_id, ['completed_units' => json_encode($completed_units), 'elo' => $theData['elo']], 'gamedata');
  guyra_log_to_db($current_user_id, $theDataJSON);

}

if ($_GET['get_ranking_page']) {
  $users = guyra_get_users();
  $users_by_elo = [];
  $output = [];

  foreach ($users as $user) {

    $user_elo = $user['gamedata']['elo'];

    if ($user_elo > 1) {
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
      'user_ranking' => $user_elo_info,
      'user_private' => $user_private
    ];

    $output[] = $user;

  }

  unset($users);
  unset($users_by_elo);

  guyra_output_json($output, true);
}
