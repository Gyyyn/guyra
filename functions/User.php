<?php

function Guyra_Login_User($creds) {

  global $current_user_object;

  $attempted_login = guyra_get_user_object(null, $creds['user_login']);
  $attempted_login_password = guyra_get_user_meta($attempted_login['user_id'], 'user_pass', true)['meta_value'];

  // if (password_verify($creds['user_pass'], $attempted_login_password)) {
  //   // Login user here
  //
  //   // WARNING: For now we must login admins through WP as well.
  //   // Remove this once we finish migrating.
  //   if ($creds['user_type'] === 'admin') {
  //     wp_signon($creds, true);
  //   }
  //
  // }

  $user = wp_signon($creds, true);

  // NOTE: Remove this once all users have been migrated.
  if (!$attempted_login_password && $attempted_login['user_id']) {
    guyra_update_user_meta($attempted_login['user_id'], 'user_pass', password_hash($creds['user_pass'], PASSWORD_DEFAULT));
  }

  return $user;
}

function Guyra_Logout_User($user=0) {
  wp_logout();
}
