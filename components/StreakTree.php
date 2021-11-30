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
    $gamedata = guyra_get_user_game_data($user_id);
  }

  if ($gamedata['streak_info'] == null) {
    $gamedata['streak_info'] = [
      'last_logged_activity' => $now,
      'streak_length' => 0
    ];
  } else {

    $gamedata['streak_info'] = json_decode($gamedata['streak_info'], true);

    $last_login = $now - $gamedata['streak_info']['last_logged_activity'];
    $daysSinceLastLogin = $last_login / $secondsForA['day'];
    $daysSinceLastLogin = round($daysSinceLastLogin, 0, PHP_ROUND_HALF_DOWN);

    if ($daysSinceLastLogin > 2) {
      $gamedata['streak_info']['streak_length'] = 0;
    } else {
      $gamedata['streak_info']['streak_length'] += $daysSinceLastLogin;
    }

  }

  $gamedata['streak_info'] = json_encode($gamedata['streak_info']);

  guyra_update_user_meta($user_id, 'gamedata', json_encode($gamedata, JSON_UNESCAPED_UNICODE));
}
