<?php

Guyra_Safeguard_File();

global $gi18n;
global $gLang;
global $current_user_id;
global $current_user_data;
global $template_dir;

include_once $template_dir . '/functions/Game.php';

function Game_Wordle($wordlist) {

  $_wordlist = Array();
  
  foreach ($wordlist as $word) {

    if (strlen($word) == 5) {
      $_wordlist[] = $word;
    }

  }

  $random_word = $_wordlist[random_int(0, sizeof($_wordlist ) - 1)];

  return $_wordlist;

}

if ($_GET['get_game']) {

  $game_type = $_GET['get_game'];
  $lang = 'en';

  $wordlistPath = $template_dir . '/assets/json/' . $lang . '.txt';
  $wordlist = file_get_contents($wordlistPath);

  $wordlist = preg_split("/\r\n|\n|\r/", $wordlist);

  guyra_output_json(Game_Wordle($wordlist), true);

}

if ($_GET['transact_game']) {
  
  $game_type = $_GET['transact_game'];

  if ($game_type == 'wordle') {
    
    Guyra_decrease_user_level($current_user_id, 1);

    guyra_output_json('true', true);

  }
  
}