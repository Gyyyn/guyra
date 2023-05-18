<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $current_user_object;
global $current_user_diary;
global $current_user_notifications;
global $current_user_inventory;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;
global $gSettings;
global $gLang;
global $current_user_payments;
global $current_user_subscription_valid;
global $is_admin;
global $is_GroupAdmin;
global $cache_dir;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Assets.php';
require_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/functions/Game.php';

if ($_GET['get_user_data']) {

    $user = $_GET['user'];
    $theData['is_logged_in'] = false;
    $theData['id'] = 0;
  
    if (!$user && $is_logged_in) {
  
      $user = $current_user_id;
      
      $theData = $current_user_data;
  
      $theData['is_logged_in'] = true;
      $theData['id'] = $user;
      $theData['user_email'] = $current_user_object['user_login'];
      $theData['user_subscription_valid'] = $current_user_subscription_valid;
      $theData['profile_picture_url'] = Guyra_get_profile_picture($user, null, true);
  
      $theData['payments'] = $current_user_payments;
      $theData['notifications'] = $current_user_notifications;
  
      $theData['user_code'] = Guyra_hash($user);
  
    } else if ($user) {
      $theData = guyra_get_user_data($user);
    }

    if ($theData['id'] != 0) {
      $theData['gamedata'] = GetUserRanking($user);
      $theData['gamedata']['raw'] = guyra_get_user_data($user, 'gamedata');
      $theData['user_diary'] = guyra_get_user_data($user, 'diary');
      $theData['inventory'] = guyra_get_user_data($user, 'inventory');
    }
  
    // If user is in a group then set their diary to be the groups's.
    if ($theData['studygroup']) {
  
      $teachers_diary = guyra_get_user_data($theData['teacherid'], 'diary');
  
      $theData['user_diary']['userpage'] = $teachers_diary['diaries'][$theData['studygroup']]['userpage'];
      $theData['user_diary']['teachers_diary'] = $teachers_diary['diaries'][$theData['studygroup']]['teachers_diary'];
  
    }
  
    // Unset some sensitive data;
    unset($theData['user_pass']);
  
    if ($user != $current_user_id) {
      unset($theData['doc_id']);
      unset($theData['userpage']);
      unset($theData['payments']);
      unset($theData['user_diary']['payments']);
      unset($theData['user_diary']['entries']);
      unset($theData['user_diary']['user_comments']);
      unset($theData['user_email']);
    }
  
    guyra_output_json(json_encode($theData), true);
  
  }

if ($_GET['get_image']) {

    if ($_GET['size']) {

    $sizeArray = json_decode($_GET['size']);

    if (is_array($sizeArray)) {
        $size['x'] = $sizeArray[0];
        $size['y'] = $sizeArray[1];
    } else {
        $size = (int) $_GET['size'];
    }
    } else {
        $size = 64;
    }

    $r = GetImageCache($_GET['get_image'], $size, 'png', 80);

    Guyra_Redirect($r);

}

if ($_GET['get_asset']) {

    $file = explode('.', $_GET['get_asset']);

    Guyra_Redirect(GetMinifiedAsset($file[1], $_GET['get_asset']));

}