<?php

Guyra_Safeguard_File();

global $gi18n;
global $gLang;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $template_dir;
global $gSettings;

include_once $template_dir . '/functions/Game.php';

function Game_Wordle($wordlist) {

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

  if ($current_user_gamedata['level'] < 1)
  guyra_output_json('no credit', true);

  $game_type = $_GET['get_game'];
  $lang = 'en';

  $wordlistPath = $template_dir . '/assets/json/words.en.txt';
  $wordlist = file_get_contents($wordlistPath);

  $wordlist = preg_split("/\r\n|\n|\r/", $wordlist);

  Guyra_decrease_user_level($current_user_id, 1);

  guyra_output_json(Game_Wordle($wordlist), true);

}

if ($_GET['transact_game']) {
  
  $game_type = $_GET['transact_game'];
  $action = $_GET['action'];

  if ($game_type == 'wordle') {

    if ($action == 'win') {
      Guyra_increase_user_level($current_user_id, 5);
    }

    guyra_output_json('true', true);

  }
  
}

if ($_GET['get_lyrics']) {

  error_reporting(E_ALL);

  require_once $template_dir . '/vendor/autoload.php';

  $client = new Google_Client();
  $client->setApplicationName('Guyra');
  $client->setScopes([
      'https://www.googleapis.com/auth/youtube.force-ssl',
  ]);

  $fileLocation = $cache_dir . '/settings/gcloud.json';
  $settingsFile = file_put_contents($fileLocation, json_encode($gSettings['google_cloud']));

  $client->setAuthConfig($fileLocation);
  $client->setAccessType('offline');

  $accessToken = $client->fetchAccessTokenWithAuthCode($gSettings['google_api']);
  $client->setAccessToken($accessToken);

  $videoID = 'LjhCEhWiKXk';
  $cacheFile = $cache_dir . '/lyrics/' . $videoID;

  $http = $client->authorize();
  $fp = fopen($cacheFile, 'w');

  $response = $http->request(
    'GET',
    '/youtube/v3/youtube/v3/captions/' . $videoID
  );
  fwrite($fp, $response->getBody()->getContents());
  fclose($fp);

  unlink($fileLocation);

}