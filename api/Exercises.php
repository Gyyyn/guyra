<?php

global $template_dir;
global $current_user_id;
global $current_user_gamedata;

include_once $template_dir . '/functions/Game.php';

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

  guyra_update_user_data($current_user_id, 'completed_units', json_encode($completed_units), 'gamedata');
  guyra_log_to_db($current_user_id, $theDataJSON);

}

if ($_GET['update_elo'] && $_GET['value']) {
  $current_user_gamedata['elo'] = $_GET['value'];
  guyra_update_user_meta($current_user_id, 'gamedata', json_encode($current_user_gamedata, JSON_UNESCAPED_UNICODE));
}

if ($_GET['update_level'] && $_GET['value']) {
  Guyra_increase_user_level($current_user_id, $_GET['value']);
}
