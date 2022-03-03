<?php

Guyra_Safeguard_File();

function Guyra_Login_User($creds) {

  global $current_user_id;
  global $current_user_object;
  global $secondsForA;

  if (!$creds['user_login'])
  return ['error' => 'login empty'];

  if (!$creds['user_password'])
  return ['error' => 'password empty'];

  $attempted_login = guyra_get_user_object(null, $creds['user_login']);
  $attempted_login_password = guyra_get_user_meta($attempted_login['user_id'], 'user_pass', true)['meta_value'];

  if (!$attempted_login)
  return ['error' => 'user_not_found'];

  if (!$attempted_login_password)
  return ['error' => 'user_no_password'];

  if (password_verify($creds['user_password'], $attempted_login_password)) {

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
