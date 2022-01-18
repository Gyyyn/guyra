<?php

function UserLoginUpdateStreakStatus($user_id) {

  global $current_user_id;
  global $current_user_gamedata;
  $now = time();

  $secondsForA = [
    'year' => 31536000,
    'month' => 2592000,
    'week' => 604800,
    'day' => 86400,
    'hour' => 3600,
    'minute' => 60
  ];

  if ($user_id == $current_user_id) {
    $gamedata = $current_user_gamedata;
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

    } else {

      $streak_info['streak_length'] += $daysSinceLastLogin;

      if ($streak_info['streak_length'] > (int) $streak_info['streak_record']) {
        $streak_info['streak_record'] = $streak_info['streak_length'];
      }
      
    }

    $streak_info['last_logged_activity'] = $now;

  }

  $gamedata['streak_info'] = json_encode($streak_info);

  if ($user_id == $current_user_id) {
    $current_user_gamedata = $gamedata;
  }

  guyra_update_user_meta($user_id, 'gamedata', json_encode($gamedata, JSON_UNESCAPED_UNICODE));
}
