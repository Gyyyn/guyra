<?php
/**
 * Admin actions
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
 exit; // Exit if accessed directly
}

$thisUser = get_user_meta(get_current_user_id());
$user = $_GET['user'];
$redirect = $_GET['redirect'];

if (!$_GET['redirect']) {
  $redirect = get_site_url();
}

include get_template_directory() . '/Guyra_database.php';

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

    if ($_GET['create_db']) {
      guyra_database($_GET['create_db']);
    }

  }

}

// Case where user is a teacher

if ($thisUser['role'][0] == "teacher") {

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

}

// Non admin actions

if ($_GET['get_user_meta']) {
  guyra_database('get_user_meta', null, get_current_user_id());
}

if ($_GET['update_elo'] && $_GET['amount']) {
  guyra_database('update_elo', $_GET['amount'], get_current_user_id());
}

// Redirect to main once we are done.
wp_redirect(get_site_url());
