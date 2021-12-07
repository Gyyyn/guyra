<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $is_admin;

$user = $_GET['user'];
$allowedUsers = [];
$users = get_users();

foreach ($users as $x) {

  $userdata = guyra_get_user_data($x->ID);

  if ($userdata['teacherid'] == $current_user_id) {
    $allowedUsers[] = $x->ID;
  }
}

$canDoActionsHere = (in_array($user, $allowedUsers) || $is_admin);
$user_is_users = json_decode($user);

if (is_array($user_is_users)) {

  foreach ($user_is_users as $user) {

    $canActionThisUser = (in_array($user, $allowedUsers) || $is_admin);

    if ($canActionThisUser) {

      if ($_GET['meetinglink']) {
        guyra_update_user_data($user, 'user_meetinglink', $_GET['meetinglink']);
      }

    }

  }

} elseif ($canDoActionsHere) {

// ---
// Manually assign a user to a group.
// ---
if ($_GET['assigntogroup']) {
  guyra_update_user_data($user, 'studygroup', $_GET['assigntogroup']);
}

// ---
// Archive an user.
// ---
if ($_GET['clearteacher']) {
  guyra_update_user_data($user, ['teacherid' => 0, 'studygroup' => '']);
}

// ---
// Manually a link to a user.
// ---
if ($_GET['meetinglink']) {
  guyra_update_user_data($user, 'user_meetinglink', $_GET['meetinglink']);
}

// ---
// Remove an user from a group.
// ---
if ($_GET['cleargroup']) {
  guyra_update_user_data($user, 'studygroup', '');
}

// ---
// Get a user's diary.
// ---
if ($_GET['action'] == 'get_diary') {
  guyra_get_user_meta($user, 'diary');
}

// ---
// Update a user's diary.
// ---
if ($_GET['action'] == 'update_diary') {
  guyra_update_user_meta($user, 'diary', file_get_contents('php://input'));
}

} // endif
