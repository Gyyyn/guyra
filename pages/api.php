<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $is_admin;
global $redirect;
global $is_logged_in;
global $nests;

if ($nests[2] == 'cron') {
  include $template_dir . '/components/Cron.php';
  exit;
}

$redirect = false;

// First include some actions for all users.
include $template_dir . '/functions/api/Common.php';

// Game API
include $template_dir . '/functions/api/Exercises.php';
include_once $template_dir . '/functions/api/UserActions/Reference.php';

// If user isn't logged in he only has a few options.
if (!$is_logged_in) {
  include $template_dir . '/functions/api/GuestUser.php';
  guyra_output_json('true', true);
}

include $template_dir . '/functions/api/Shop.php';
include $template_dir . '/functions/api/Reference.php';

// Case where user is site admin.
if ($is_admin) {

  include $template_dir . '/functions/api/SuperAdminActions.php';

}

// Case where user is a group admin.
if ($is_admin || $current_user_data['role'] == "teacher") {

  include $template_dir . '/functions/api/GroupAdminActions.php';

}

// Logged in user actions.
include $template_dir . '/functions/api/UserActions.php';

// If we have no redirect then we assume things went right.
if (!$_POST['redirect'] && !$_GET['redirect'] && !$redirect)
guyra_output_json('true', true);

$redirect = (!$_GET['redirect']) ? $site_url : $_GET['redirect'];
$redirect = (!$_POST['redirect']) ? $site_url : $_POST['redirect'];

// If we got here we are meant to redirect
Guyra_Redirect($redirect);
