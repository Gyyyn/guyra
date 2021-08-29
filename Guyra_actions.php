<?php
/**
 * Admin actions
 *
 * @package guyra
 */

$thisUser = get_user_meta(get_current_user_id());
$user = $_GET['user'];

// Case where user is site admin
if (current_user_can('manage_options')) {

  if($user) {

    if ($_GET['assigntoteacher']) {
      update_user_meta($user, 'teacherid', $_GET['assigntoteacher'] );
    }

    if ($_GET['assigntogroup']) {
      update_user_meta($user, 'studygroup', $_GET['assigntogroup'] );
    }

    if ($_GET['cleargroup']) {
      delete_user_meta($user, 'studygroup' );
    }

    if ($_GET['litetill']) {
      update_user_meta($user, 'subscription', 'lite' );
      update_user_meta($user, 'subscribed-until', $_GET['litetill'] );
    }

    if ($_GET['premiumtill']) {
      update_user_meta($user, 'subscription', 'premium' );
      update_user_meta($user, 'subscribed-until', $_GET['premiumtill'] );
    }

    if ($_GET['giverole']) {
      update_user_meta($user, 'role', $_GET['giverole'] );
    }

    wp_redirect(get_site_url());
  }

// Case where user is a teacher
} elseif ($thisUser['role'][0] == "teacher") {

  $users = get_users();

  foreach ($users as $x) {

    $userdata = get_user_meta($x->ID);

    if ($userdata['teacherid'][0] == get_current_user_id()) {
      $allowedUsers[] = $x->ID;
    }
  }

  if(in_array($user, $allowedUsers)) {

    if ($_GET['assigntogroup']) {
      update_user_meta($user, 'studygroup', $_GET['assigntogroup'] );
    }

    if ($_GET['cleargroup']) {
      delete_user_meta($user, 'studygroup' );
    }

  }

  wp_redirect(get_site_url());

} else {
  wp_redirect(get_site_url());
}
