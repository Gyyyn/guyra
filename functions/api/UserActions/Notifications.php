<?php

Guyra_Safeguard_File();

global $gi18n;
global $current_user_id;
global $current_user_data;

include_once $template_dir . '/functions/Mailer.php';

if ($_GET['push_notification']) {

  $data = json_decode(file_get_contents('php://input'), true);

  if (!$data)
  guyra_output_json('parameter error', true);

  PushNotification($data, $current_user_id);

  guyra_output_json('true', true);

}

if ($_GET['pop_notification']) {

  $index = $_GET['index'];

  if (!$index)
  $index = -1;

  PopNotification($index, $current_user_id);

  guyra_output_json('true', true);

}

if ($_GET['clear_notifications']) {

  ClearNotifications($current_user_id);

  guyra_output_json('true', true);

}

if ($_GET['appointment']) {

  $mode = $_GET['action'];
  $user = $_GET['user']; // This is the teacher

  if ($mode == 'request') {

    $notification = $gi18n['notification_appointment_request'];
    $current_user_name = $current_user_data['first_name'] . ' ' . $current_user_data['last_name'];
    $data = json_decode(file_get_contents('php://input'), true);

    $teacher_data = guyra_get_user_data((int) $user);
    $teacher_object = build_user_object((int) $user);

    $notification['actions'][0]['link'] = 
      str_replace('%user', $current_user_id, $notification['actions'][0]['link']);

    $notification['title'] = str_replace('%user', $current_user_name, $notification['title']);
    $notification['contents'] = str_replace('%day', $data['date'], $notification['contents']);
    $notification['contents'] = str_replace('%hour', $data['time'], $notification['contents']);

    if ($data['recurring'])
    $notification['contents'] = $notification['contents'] . ' ' . $notification['is_recurring'];

    $notification['payload'] = [
      'type' => 'calendar',
      'handler' => 'client',
      'data' => [
        'date' => $data['date'],
        'time' => $data['time'],
        'recurring' => $data['recurring'],
        'user' => $current_user_id,
        'value' => $current_user_name
      ]
    ];

    $mail_strings = [
      $notification['title'],
      $notification['contents'],
      '',
      ''
    ];

    PushNotification($notification, (int) $teacher_data['id']);
    Guyra_mail('basic_link.html', $notification['title'], $teacher_object['user_login'], $mail_strings);
    PushNotification($gi18n['notification_appointment_requested'], $current_user_id);

  }

  if ($mode == 'accept') {

    // Make sure the user is actually a teacher.
    if ($teacher_data['role'] != 'teacher')
    guyra_output_json('post error', true);

    if ($current_user_data['role'] == 'teacher')
    guyra_update_user_data($user, [ 'teacherid' => $current_user_id ]);

    PushNotification($gi18n['notification_appointment_accepted'], $user);

  }

  guyra_output_json('true', true);
  
}