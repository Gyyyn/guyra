<?php

function Guyra_increase_user_level($user=1, $amount=1) {

  $gamedata = guyra_get_user_game_data($user);

  $amount = $gamedata['level'] + $amount;

  $gamedata['level'] = $amount;

  guyra_update_user_data($user, 'gamedata', $gamedata);

}

function GetUserRanking($user=1) {

  $gamedata = guyra_get_user_game_data($user);

  if (!$user == 0) {

    $elo = (float)$gamedata['elo'];
    $level = (int)$gamedata['level'];

    if ($elo < 17) {

      $ranking = 'bronze';
      $ranking_name = 'Bronze';

      if ($elo < 5) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } else {

        if ($elo <= 10) {
          $ranking .= '-2';
          $ranking_name .= ' 2';
        }

        if ($elo > 10) {
          $ranking .= '-3';
          $ranking_name .= ' 3';
        }

      }

    }

    if ($elo >= 17) {

      $ranking = 'silver';
      $ranking_name = 'Silver';

      if ($elo < 35) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } else {

        if ($elo <= 55) {
          $ranking .= '-2';
          $ranking_name .= ' 2';
        }

        if ($elo > 55) {
          $ranking .= '-3';
          $ranking_name .= ' 3';
        }

      }

    }

    if ($elo >= 75) {

      $ranking = 'diamond';
      $ranking_name = 'Diamond';

      if ($elo < 85) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } else {

        if ($elo <= 85) {
          $ranking .= '-2';
          $ranking_name .= ' 2';

        }

        if ($elo > 85) {
          $ranking .= '-3';
          $ranking_name .= ' 3';
        }

      }

    }

    return [$elo, $ranking, $ranking_name, $level];

  }

  return false;

}
