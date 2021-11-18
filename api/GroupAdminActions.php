<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;

$user = $_GET['user'];
$users = get_users();

foreach ($users as $x) {

  $userdata = guyra_get_user_data($x->ID);

  if ($userdata['teacherid'] == $current_user_id) {
    $allowedUsers[] = $x->ID;
  }
}

// Only allow changes to assigned users.
if(in_array($user, $allowedUsers) || $isAdmin):

// ---
// Manually assign a user to a group.
// ---
if ($_GET['assigntogroup']) {
  guyra_update_user_data($user, 'studygroup', $_GET['assigntogroup'] );
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
  guyra_update_user_meta($user, 'diary', addslashes(file_get_contents('php://input')));
}

// If we got a list of users there is only a few possible things we can do.

$user_is_users = json_decode($user);

if (is_array($user_is_users)) {

  if(in_array($user, $allowedUsers) || $isAdmin):

  if ($_GET['meetinglink']) {

    foreach ($user_is_users as $user) {
      guyra_update_user_data($user, 'user_meetinglink', $_GET['meetinglink']);
    }

  }

  endif;

}

endif;

?>
