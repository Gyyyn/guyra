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