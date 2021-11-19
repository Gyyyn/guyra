<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $is_logged_in;

if (!defined('ABSPATH')) { exit; }

include_once $template_dir . '/i18n.php';
include_once $template_dir . '/Guyra_misc.php';

$masterJSON = json_decode(file_get_contents($template_dir . '/assets/json/exercises.json'), true);
$levelMap = json_decode(file_get_contents($template_dir . '/assets/json/levelmap.json'), true);

$responseJSON = [];

if(!$_GET['level'] || !$_GET['unit'] || !$_GET['length']) {

  if ($_GET['json'] == 'levelmap') {

    $responseJSON = $levelMap;

  } elseif ($_GET['json'] == 'i18n') {

    $responseJSON = $gi18n;

  } elseif ($_GET['json'] == 'usermeta') {

    $responseJSON = GetUserRanking($current_user_id);

  } else {

    $responseJSON = ['error: range not specified'];

  }

} else {

  // If it wasn't the levelmap that was requested, pass on a unit

  $level = $_GET['level'];
  $unit = $_GET['unit'];
  $length = $_GET['length'];

  function GetRandomExercise($type, $unit, $json) {
    return random_int(0, sizeof($json[$unit][$type]) - 1);
  }

  function GetTheExercises($type, $unit, $length, $json) {

    $rnd = GetRandomExercise($type, $unit, $json);
    $used_numbers = Array();
    $res = Array();

    for ($x=0; $x < $length; $x++) {

      while(in_array($rnd, $used_numbers)) {
        $rnd = GetRandomExercise($type, $unit, $json);
      }

      $used_numbers[] = $rnd;
      $ex = $json[$unit][$type][$rnd];
      array_unshift($ex, $type);

      $res[] = $ex;

    }

    return $res;

  }

  if (is_array($masterJSON[$unit]['CompleteThePhrase'])) {
    $responseJSON = array_merge($responseJSON, GetTheExercises('CompleteThePhrase', $unit, 5, $masterJSON));
  }

  if (is_array($masterJSON[$unit]['WhatYouHear'])) {
    $responseJSON = array_merge($responseJSON, GetTheExercises('WhatYouHear', $unit, 2, $masterJSON));
  }

}

if ($_GET['i18n'] == "full") {
  $responseJSON['i18n'] = $gi18n;
}

header("Content-Type: application/json");
echo json_encode($responseJSON);

exit;
