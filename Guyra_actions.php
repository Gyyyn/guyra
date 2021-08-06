<?php

$user = $_GET['user'];

if($user) {

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

  wp_redirect(get_site_url());
}
