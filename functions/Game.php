<?php

Guyra_Safeguard_File();

function Guyra_increase_user_level($user=0, $amount=1) {

  global $current_user_id;

  // If the function was called without args we assume it's a 1 level
  // increase for the current user.
  if ($user === 0)
  $user = $current_user_id;

  $gamedata = guyra_get_user_data($user, 'gamedata');

  // If the user has no levels we set a default and continue from there.
  if (!$gamedata['level'])
  $gamedata['level'] = 1;

  if (!$gamedata['level_total'])
  $gamedata['level_total'] = $gamedata['level'];

  // Increase current level balance, total levels and the levels for the current daily challenge.
  $gamedata['level'] += $amount;
  $gamedata['level_total'] += $amount;
  $gamedata['challenges']['daily']['levels_completed'] += 1;

  // Send the data back for saving.
  guyra_update_user_data($user, $gamedata, '', 'gamedata');

}

function Guyra_decrease_user_level($user=0, $amount=1) {

  global $current_user_id;

  // If the function was called without args we assume it's a 1 level
  // increase for the current user.
  if ($user === 0)
  $user = $current_user_id;

  $gamedata = guyra_get_user_data($user, 'gamedata');

  // This function should not remove levels from the daily challenge or total level,
  // for that user Guyra_set_user_level.
  $gamedata['level'] -= $amount;

  guyra_update_user_data($user, $gamedata, '', 'gamedata');

}

function GetUserRanking($user=1, $gamedata=false) {

  if(!$gamedata)
  $gamedata = guyra_get_user_data($user, 'gamedata');

  $elo = (float)$gamedata['elo'];
  $level = (int)$gamedata['level'];

  $rank_level = '1';

  if ($elo < 17) {

    $ranking = 'bronze';

    if ($elo >= 5)
    $rank_level = '2';

    if ($elo > 10)
    $rank_level = '3';


  }

  if ($elo >= 17) {

    $ranking = 'silver';

    if ($elo <= 35)
    $rank_level = '2';

    if ($elo > 45)
    $rank_level = '3';

  }

  if ($elo >= 55) {

    $ranking = 'gold';

    if ($elo <= 57)
    $rank_level = '2';

    if ($elo > 65)
    $rank_level = '3';

  }

  if ($elo >= 75) {

    $ranking = 'diamond';

    if ($elo <= 85)
    $rank_level = '2';

    if ($elo > 85)
    $rank_level = '3';

  }

  $ranking_name = $ranking . ' ' . $rank_level;
  $ranking = $ranking . '-' . $rank_level;

  return [
    'elo' => $elo,
    'ranking' => $ranking,
    'ranking_name' => $ranking_name,
    'level' => $level
  ];

}
