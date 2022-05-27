<?php

Guyra_Safeguard_File();

function Guyra_Login_User($creds, $nopass=false) {

  global $current_user_id;
  global $current_user_object;
  global $secondsForA;

  $oauth_pass = false;

  if (!$creds['user_login'] && !$creds['oauth_provider'])
  return ['error' => 'login empty'];

  if (!$creds['user_password'] && !$nopass)
  return ['error' => 'password empty'];

  $attempted_login = guyra_get_user_object(null, $creds['user_login']);
  $attempted_login_password = guyra_get_user_meta($attempted_login['user_id'], 'user_pass', true)['meta_value'];

  if (!$attempted_login)
  return ['error' => 'user_not_found'];

  if (!$attempted_login_password && !$nopass)
  return ['error' => 'user_no_password'];

  // If we are trying an OAuth login, we need to check some things.
  if ($creds['oauth_provider']) {

    $attempted_login_flags = json_decode($attempted_login['flags'], true);

    if ($attempted_login_flags[$creds['oauth_provider'] . '_oauth'] == $creds['oauth_id'])
    $oauth_pass = true;

    // If the checks failed we freak out.
    if (!$oauth_pass)
    return ['error' => 'oauth_user_notfound'];

  }

  if (password_verify($creds['user_password'], $attempted_login_password) || $nopass) {

    // Auth passed, set all the globals.
    $current_user_id = (int) $attempted_login['user_id'];

    setcookie(
      'guyra_auth',
      $attempted_login['user_id'] . '_' . md5($attempted_login_password),
      time() + $secondsForA['year'],
      '/'
    );

  } else {
    return ['error' => 'password check failed'];
  }

  return $user;

}

function Guyra_Logout_User($user=0) {

  global $current_user_object;

  unset($_COOKIE['guyra_auth']);
  setcookie('guyra_auth', '', time() - 3600, '/');

  return true;

}
