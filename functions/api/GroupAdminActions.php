<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_diary;
global $current_user_gamedata;
global $site_url;
global $is_admin;

Guyra_Safeguard_File();

$user = $_GET['user'];
$allowedUsers = [];
$users = guyra_get_users(['teacherid' => $current_user_id]);
$allowedUsers = array_keys($users);
$usersdata = [];

$canDoActionsHere = (in_array($user, $allowedUsers) || $is_admin);
$user_is_users = explode(',', $user);

if (count($user_is_users) > 1) {

  foreach ($user_is_users as $user) {

    $canActionThisUser = (in_array($user, $allowedUsers) || $is_admin);

    // Exploit prevention.
    if (!$canActionThisUser)
    guyra_output_json('false', true);

    if ($_GET['meetinglink'])
    guyra_update_user_data($user, 'user_meetinglink', $_GET['meetinglink']);

  }

}

// In case someone gets here and shouldn't.
if ($user && !$canDoActionsHere)
guyra_output_json('false', true);

// Manually assign a user to a group.
if ($_GET['assigntogroup'])
guyra_update_user_data($user, 'studygroup', $_GET['assigntogroup']);

// Archive an user.
if ($_GET['clearteacher'])
guyra_update_user_data($user, ['teacherid' => null, 'studygroup' => null]);

// Manually add a link to a user.
if ($_GET['meetinglink'])
guyra_update_user_data($user, 'user_meetinglink', $_GET['meetinglink']);

// Remove an user from a group.
if ($_GET['cleargroup'])
guyra_update_user_data($user, ['studygroup' => null]);

// Update a user's diary.
if ($_GET['action'] == 'update_diary') {

  $theData = json_decode(file_get_contents('php://input'), true);

  $user_diary = $current_user_diary;

  if ($user != $current_user_id)
  $user_diary = guyra_get_user_data($user, 'diary');

  if ($_GET['isGroup']) {
    $user_diary['diaries'][$_GET['isGroup']] = $theData;
  } else {
    $user_diary = $theData;
  }

  guyra_update_user_meta($user, 'diary', json_encode($user_diary));

}

// Get a list of actionable users.
if ($_GET['action'] == 'fetch_users')
guyra_output_json($users, true);
