<?php

Guyra_Safeguard_File();

global $gi18n;
global $gLang;
global $current_user_id;
global $current_user_data;
global $template_dir;

include_once $template_dir . '/functions/Game.php';

function Game_Wordle($wordlist) {

  global $template_dir;

  $_wordlist = Array();
  
  foreach ($wordlist as $word) {

    if (strlen($word) == 5) {
      $_wordlist[] = $word;
    }

  }

  $answersPath = $template_dir . '/assets/json/wordle5.words.en.txt';
  $answers = file_get_contents($answersPath);
  $answers = preg_split("/\r\n|\n|\r/", $answers);

  return [
    'words' => $_wordlist,
    'answers' => $answers
  ];

}

if ($_GET['get_game']) {

  $game_type = $_GET['get_game'];
  $lang = 'en';

  $wordlistPath = $template_dir . '/assets/json/words.en.txt';
  $wordlist = file_get_contents($wordlistPath);

  $wordlist = preg_split("/\r\n|\n|\r/", $wordlist);

  guyra_output_json(Game_Wordle($wordlist), true);

}

if ($_GET['transact_game']) {
  
  $game_type = $_GET['transact_game'];
  $action = $_GET['action'];

  if ($game_type == 'wordle') {

    if ($action == 'win') {
      Guyra_increase_user_level($current_user_id, 5);
    } else {
      Guyra_decrease_user_level($current_user_id, 1);
    }

    guyra_output_json('true', true);

  }
  
}