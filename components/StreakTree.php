<?php

global $template_dir;
global $current_user_id;
global $current_user_gamedata;
global $gi18n;

include_once $template_dir . '/functions/Game.php';

Guyra_Safeguard_File();

function UserLoginUpdateStreakStatus($user_id) {

  global $current_user_id;
  global $current_user_gamedata;
  global $gi18n;
  global $secondsForA;

  $now = time();

  if ($user_id == $current_user_id) {
    $gamedata = &$current_user_gamedata;
  } else {
    $gamedata = guyra_get_user_data($user_id, 'gamedata');
  }

  if ($gamedata['streak_info'] === null) {
    $gamedata['streak_info'] = [
      'last_logged_activity' => $now,
      'streak_record' => 0,
      'streak_length' => 0
    ];
  } else {

    $streak_info = json_decode($gamedata['streak_info'], true);

    if ($streak_info['last_logged_activity'] === null) {
      $streak_info['last_logged_activity'] = 0;
    }

    $last_login = $now - $streak_info['last_logged_activity'];
    $daysSinceLastLogin = $last_login / $secondsForA['day'];
    $daysSinceLastLogin = round($daysSinceLastLogin, 0, PHP_ROUND_HALF_DOWN);

    if ($daysSinceLastLogin > 2) {

      $streak_info['streak_length'] = 0;

      // Prevents a notifications being sent on streak reset.
      if ($streak_info['last_logged_activity'] > 1) {
        PushNotification($gi18n['notification_streak_lost']);
      }

      $streak_info['last_logged_activity'] = $now;

    } else {

      // The streak continues.
      if ($daysSinceLastLogin > 0) {

        $streak_info['streak_length'] += $daysSinceLastLogin;
        $notification_message = $gi18n['notification_streak_updated'];

        if ($streak_info['streak_length'] > (int) $streak_info['streak_record']) {
          $streak_info['streak_record'] = $streak_info['streak_length'];
          $notification_message['contents'] .= ' ' . $gi18n['notification_streak_updated_highest'];
        }

        $streak_info['last_logged_activity'] = $now;

        $gamedata['level'] += 1;
        $gamedata['level_total'] += 1;
        $gamedata['challenges']['daily']['levels_completed'] += 1;
        PushNotification($notification_message);

      }

    }

  }

  $gamedata['streak_info'] = json_encode($streak_info);

  if ($user_id == $current_user_id) {
    $current_user_gamedata = $gamedata;
  }

  guyra_update_user_meta($user_id, 'gamedata', json_encode($gamedata, JSON_UNESCAPED_UNICODE));
}
