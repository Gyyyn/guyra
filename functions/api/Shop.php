<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $current_user_inventory;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/Inventory.php';
include_once $template_dir . '/functions/Notifications.php';

if ($_GET['fetch_shop_items']) {
  $shopItems = GuyraShop_FetchItems();

  guyra_output_json($shopItems, true);
}

if ($_GET['shop_transaction']) {

  $thePost = json_decode(file_get_contents('php://input'), true);

  if (!$thePost)
  guyra_output_json('no post data', true);

  if ($current_user_gamedata['level'] < $thePost['amount'])
  guyra_output_json('no credit', true);

  Guyra_decrease_user_level($current_user_id, $thePost['amount']);
  AddItemToInventory($thePost['items']);

  PushNotification($gi18n['notification_item_added']);

  guyra_output_json('true', true);

}

if ($_GET['use_item']) {

  $item = $_GET['use_item'];

  if (!in_array($item, $current_user_inventory))
  guyra_output_json('item not in inventory', true);

  $item_sploded = explode('_', $item);

  if ($item_sploded[0] == 'jackpot')
  GuyraShop_RunJackpot();

  if ($item_sploded[0] == 'avatar')
  GuyraShop_SetShopAvatar($item);

  if ($item_sploded[0] == 'challenge')
  AddGameChallenge($item);

  guyra_output_json('true', true);

}
