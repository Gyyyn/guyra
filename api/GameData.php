<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $is_logged_in;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/Exercises.php';
include_once $template_dir . '/components/Icons.php';

$masterJSON = json_decode(file_get_contents($template_dir . '/assets/json/exercises.json'), true);
$levelMap = json_decode(file_get_contents($template_dir . '/assets/json/levelmap.json'), true);
$responseJSON = [];
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

    // Get an audio link for audio questions
    if ($type == 'WhatYouHear') {
      $ex[] = GetTTSAudioFor($ex[0]);
    }

    // Get a translation
    $ex['translation'] = GetCloudTranslationFor($ex[0]);

    array_unshift($ex, $type);

    $res[] = $ex;

  }

  return $res;

}

if($unit) {

  // If it wasn't the levelmap that was requested, pass on a unit
  if (is_array($masterJSON[$unit]['CompleteThePhrase'])) {
    $responseJSON = array_merge($responseJSON, GetTheExercises('CompleteThePhrase', $unit, 5, $masterJSON));
  }

  if (is_array($masterJSON[$unit]['WhatYouHear'])) {
    $responseJSON = array_merge($responseJSON, GetTheExercises('WhatYouHear', $unit, 2, $masterJSON));
  }

}

if ($_GET['json'] == 'levelmap') {

  foreach ($levelMap as &$level) {
    foreach ($level as &$unit) {
      $unit['image'] = GuyraGetIcon($unit['image']);
    }
  }

  $responseJSON['levelmap'] = $levelMap;

}

if ($_GET['json'] == 'usermeta') {

  $responseJSON['usermeta'] = GetUserRanking($current_user_id);

}

if ($_GET['i18n'] == "full") {
  $responseJSON['i18n'] = $gi18n;
}

if (!empty($responseJSON)) {
  guyra_output_json($responseJSON, true);
}
