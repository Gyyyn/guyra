<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $is_admin;

$redirect = (!$_GET['redirect']) ? $site_url : $_GET['redirect'];

// Reply submission
if ($_GET['reply']) {
  include $template_dir . '/api/Reply.php';
}

// Game data
if ($_GET['json']) {
  include $template_dir . '/api/GameData.php';
}

// Case where user is site admin
if ($is_admin) {

  include $template_dir . '/api/SuperAdminActions.php';

}

// Case where user is a teacher
if ($is_admin || $current_user_data['role'] == "teacher") {

  include $template_dir . '/api/GroupAdminActions.php';

}

include $template_dir . '/api/UserActions.php';

// Game API
if ($_GET['exercises']) {

  include $template_dir . '/api/Exercises.php';

}

// If we got here we are meant to redirect
wp_redirect($redirect);
