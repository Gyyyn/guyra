<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;

if ($_GET['json']) {
  include $template_dir . '/api/GameData.php';
}

$redirect = $_GET['redirect'];
$isAdmin = current_user_can('manage_options');

if (!$_GET['redirect']) {
  $redirect = $site_url;
}

// Case where user is site admin
if ($isAdmin) {

  include $template_dir . '/api/SuperAdminActions.php';

}

// Case where user is a teacher
if ($isAdmin || $current_user_data['role'] == "teacher") {

  include $template_dir . '/api/GroupAdminActions.php';

}

include $template_dir . '/api/UserActions.php';

// Game API
if ($_GET['exercises']) {

  include $template_dir . '/api/Exercises.php';

}

// If we got here we are meant to redirect
wp_redirect($redirect);
