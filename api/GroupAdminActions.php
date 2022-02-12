<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $is_admin;

Guyra_Safeguard_File();

$user = $_GET['user'];
$allowedUsers = [];
$users = guyra_get_users(['teacherid' => $current_user_id]);
$usersdata = [];

foreach ($users as $x) {

  if ($x['userdata']['teacherid'] == $current_user_id) {
    $allowedUsers[] = $x['id'];
  }
}

$canDoActionsHere = (in_array($user, $allowedUsers) || $is_admin);
$user_is_users = explode(',', $user);

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
  guyra_update_user_data($user, 'studygroup', null);
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

// ---
// Get a list of actionable users.
// ---
if ($_GET['action'] == 'fetch_users') {

  $users_array = [];

  foreach ($users as $x) {

    $theUserID = $x['id'];

    if (in_array($theUserID, $allowedUsers)) {

      $users_array[$theUserID]['id'] = $theUserID;
      $users_array[$theUserID]['data'] = $x['userdata'];

    }

  }

  guyra_output_json($users_array, true);
}

} // endif
