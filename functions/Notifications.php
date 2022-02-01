<?php

function GetNotifications($user=0, $args=[]) {

  global $current_user_id;
  global $current_user_notifications;

  if ($user === 0)
  $user = $current_user_id;

  if ($user != $current_user_id) {
    $notifications_data = guyra_get_user_meta($user, 'notifications', true)['meta_value'];
    $notifications_data = json_decode($notifications_data, true);
  } else {
    $notifications_data = $current_user_notifications;
  }

  return $notifications_data;
}

function PushNotification($item, $user=0, $args=[]) {

  global $current_user_id;

  if ($user === 0)
  $user = $current_user_id;

  $notifications_data = GetNotifications($user, $args);

  // Freak out if something went wrong.
  if (!is_array($item))
  return false;

  array_unshift($notifications_data, $item);
  guyra_update_user_meta($user, 'notifications', json_encode($notifications_data, JSON_UNESCAPED_UNICODE));

  return $notifications_data;

}

function PopNotification($item=-1, $user=0, $args=[]) {

  global $current_user_id;

  if ($user === 0)
  $user = $current_user_id;

  $notifications_data = GetNotifications($user, $args);

  array_splice($notifications_data, $item, 1);
  guyra_update_user_meta($user, 'notifications', json_encode($notifications_data, JSON_UNESCAPED_UNICODE));

  return $notifications_data;

}

function ClearNotifications($user=0) {

  global $current_user_id;

  if ($user === 0)
  $user = $current_user_id;

  guyra_update_user_meta($user, 'notifications', json_encode([], JSON_UNESCAPED_UNICODE));
}
