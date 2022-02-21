<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $is_admin;

if ($_GET['disable_cache'] != 'true') {
  nocache_headers();
  error_reporting(0);
}

$redirect = false;

// If user isn't logged in he only has a few options.
if (!$is_logged_in) {
  include $template_dir . '/api/GuestUser.php';
  exit;
}

include $template_dir . '/api/Shop.php';
include $template_dir . '/api/Reference.php';

// Case where user is site admin.
if ($is_admin) {

  include $template_dir . '/api/SuperAdminActions.php';

}

// Case where user is a group admin.
if ($is_admin || $current_user_data['role'] == "teacher") {

  include $template_dir . '/api/GroupAdminActions.php';

}

// Logged in user actions.
include $template_dir . '/api/UserActions.php';

// Game API
include $template_dir . '/api/Exercises.php';

// If we have no redirect then we assume things went right.
if (!$_POST['redirect'] || !$_GET['redirect'])
guyra_output_json('true', true);

$redirect = (!$_GET['redirect']) ? $site_url : $_GET['redirect'];
$redirect = (!$_POST['redirect']) ? $site_url : $_POST['redirect'];

// If we got here we are meant to redirect
Guyra_Redirect($redirect);
