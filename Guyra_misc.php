<?php
/**
 * Functions with no category
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

include get_template_directory() . '/Guyra_database.php';

function GetUserRanking($user=0) {

  if (!$user == 0) {

    $elo = guyra_get_user_meta($user, 'elo', true)['meta_value'];
    $level = guyra_get_user_meta($user, 'level', true)['meta_value'];

    if (!$elo) {
      $elo = '1';
      guyra_update_user_meta($user, 'elo', $elo);
    }

    if (!$level) {
      $level = '1';
      guyra_update_user_meta($user, 'level', $level);
    }

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
