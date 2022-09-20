<?php

global $current_user_id;
global $template_dir;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Assets.php';

function GuyraShop_FetchItems($args=[]) {

  global $template_dir;

  $return = json_decode(file_get_contents($template_dir . '/assets/json/shopItems.json'), true);

  return $return;
}

function GetInventory($user=0) {
  
  global $current_user_id;
  global $current_user_inventory;

  // Validate our inputs
  if ($user === 0)
  $user = $current_user_id;

  if ($user == $current_user_id) {
    $theInventory = $current_user_inventory;
  } else {
    $theInventory = guyra_get_user_data($user, 'inventory');
  }

  // If we got anything other than an array here something has gone wrong.
  if (!is_array($theInventory))
  $theInventory = [];

  return $theInventory;

}

function AddItemToInventory($item, $user=0, $args=[]) {

  global $current_user_id;

  if (!$item)
  return false;

  if ($user === 0)
  $user = $current_user_id;

  $theInventory = GetInventory($user);

  if (is_array($item)) {
    $theInventory = array_merge($item, $theInventory);
  } else {
    array_unshift($theInventory, $item);
  }

  guyra_update_user_meta($user, 'inventory', json_encode($theInventory));
  return $theInventory;

}

function RemoveItemFromInventory($item, $user=0, $args=[]) {

  global $current_user_id;
  
  if (!$user)
  $user = $current_user_id;

  $theInventory = GetInventory($user);
  
  $indexOf = array_search($item, $theInventory);

  if ($indexOf !== false) {

    array_splice($theInventory, $indexOf, 1);
    
    guyra_update_user_meta($user, 'inventory', json_encode($theInventory));

  }

  return $theInventory;

}

function GuyraShop_RunJackpot($item, $user=0) {

  global $current_user_id;

  if ($user === 0)
  $user = $current_user_id;

}

function GuyraShop_SetShopAvatar($item, $user=0) {

  global $current_user_id;
  global $site_api_url;

  if ($user === 0)
  $user = $current_user_id;

  $items = GuyraShop_FetchItems();

  foreach ($items as $item_listing) {

    if ($item_listing['items'][$item])
    $item = $item_listing['items'][$item];

  }

  $avatar_location = GetImageCache($item['location'], 128, 'jpg');

  guyra_update_user_data($current_user_id, 'profile_picture_url', $avatar_location);

}
