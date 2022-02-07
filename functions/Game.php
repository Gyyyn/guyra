<?php

Guyra_Safeguard_File();

function Guyra_increase_user_level($user=1, $amount=1) {

  $gamedata = guyra_get_user_data($user, 'gamedata');

  $gamedata['level'] += $amount;
  $gamedata['challenges']['daily']['levels_completed'] += 1;

  guyra_update_user_data($user, $gamedata, '', 'gamedata');

}

function Guyra_decrease_user_level($user=1, $amount=1) {

  $gamedata = guyra_get_user_data($user, 'gamedata');
  $gamedata['level'] -= $amount;

  guyra_update_user_data($user, $gamedata, '', 'gamedata');

}

function GetUserRanking($user=1, $gamedata=false) {

  if(!$gamedata)
  $gamedata = guyra_get_user_data($user, 'gamedata');

  $elo = (float)$gamedata['elo'];
  $level = (int)$gamedata['level'];

  if ($elo < 17) {

    $ranking = 'bronze';

    if ($elo < 5)
    $rank_level = '1';

    if ($elo <= 10)
    $rank_level = '2';

    if ($elo > 10)
    $rank_level = '3';


  }

  if ($elo >= 17) {

    $ranking = 'silver';

    if ($elo < 35)
    $rank_level = '1';

    if ($elo <= 55)
    $rank_level = '2';

    if ($elo > 55)
    $rank_level = '3';

  }

  if ($elo >= 75) {

    $ranking = 'diamond';

    if ($elo < 85)
    $rank_level = '1';

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
