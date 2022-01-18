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

if ($_GET['fetch_shop_items']) {
  $shopItems = json_decode(file_get_contents($template_dir . '/assets/json/shopItems.json'), true);

  guyra_output_json($shopItems, true);
}
