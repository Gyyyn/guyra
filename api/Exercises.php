<?php

global $current_user_id;

Guyra_Safeguard_File();

if ($_GET['log_wrong_answer']) {
  $current_data = guyra_get_user_meta(1, 'reported_answers', true);
  $current_data = json_decode($current_data['meta_value'], true);
  $data = json_decode(file_get_contents('php://input'), true);

  $current_data[time()] = $data;

  guyra_update_user_meta(1, 'reported_answers', json_encode($current_data, JSON_UNESCAPED_UNICODE));
}

if ($_GET['log_exercise_data']) {

  $theData = file_get_contents('php://input');
  guyra_log_to_db($current_user_id, mysql_real_escape_string($theData));

  $theData = json_decode($theData, true);
}

if ($_GET['update_elo'] && $_GET['value']) {
  $current_user_gamedata['elo'] = $_GET['value'];
  guyra_update_user_meta($current_user_id, 'gamedata', json_encode($current_user_gamedata, JSON_UNESCAPED_UNICODE));
}

if ($_GET['update_level'] && $_GET['value']) {
  Guyra_increase_user_level($current_user_id, 'level', $_GET['value']);
}
