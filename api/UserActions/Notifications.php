<?php

Guyra_Safeguard_File();

if ($_GET['push_notification']) {

  global $current_user_id;

  $data = json_decode(file_get_contents('php://input'), true);

  if (!$data)
  guyra_output_json('parameter error', true);

  PushNotification($data, $current_user_id);

  guyra_output_json('true', true);

}

if ($_GET['pop_notification']) {

  global $current_user_id;

  $index = $_GET['index'];

  if (!$index)
  $index = -1;

  PopNotification($index, $current_user_id);

  guyra_output_json('true', true);

}

if ($_GET['clear_notifications']) {

  global $current_user_id;

  ClearNotifications($current_user_id);

  guyra_output_json('true', true);

}
