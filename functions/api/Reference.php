<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $site_api_url;
global $is_logged_in;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Assets.php';

if ($_GET['fetch_irregulars_object']) {
  header("Content-Type: application/json");
  echo GetMinifiedAsset('json', 'irregularVerbs.json', true);
  exit;
}

if ($_GET['fetch_phrasals_object']) {
  header("Content-Type: application/json");
  echo GetMinifiedAsset('json', 'phrasalVerbs.json', true);
  exit;
}
