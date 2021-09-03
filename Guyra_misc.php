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

    if ($elo <= 17) {

      $ranking = 'bronze';
      $ranking_name = 'Bronze';
      $x = $elo;

      if ($x >= 5) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } elseif ($x >= 11) {
        $ranking .= '-2';
        $ranking_name .= ' 2';
      } else {
        $ranking .= '-3';
        $ranking_name .= ' 3';
      }

    }

    if ($elo <= 75) {

      $ranking = 'silver';
      $ranking_name = 'Silver';
      $x = $elo - 17;

      if ($x <= 19) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } elseif ($x <= 38) {
        $ranking .= '-2';
        $ranking_name .= ' 2';
      } else {
        $ranking .= '-3';
        $ranking_name .= ' 3';
      }

    }

    if ($elo >= 75) {

      $ranking = 'diamond';
      $ranking_name = 'Diamond';
      $x = $elo - 75;

      if ($x <= 5) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } elseif ($x <= 11) {
        $ranking .= '-2';
        $ranking_name .= ' 2';
      } else {
        $ranking .= '-3';
        $ranking_name .= ' 3';
      }

    }

    return [$elo, $ranking, $ranking_name, $level];

  }

  return false;

}
