<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $site_root;

Guyra_Safeguard_File();

$user = $_GET['user'];

// Manually assign a user to a group admin.
if ($_GET['assigntoteacher'])
guyra_update_user_data($user, [
  'teacherid' => $_GET['assigntoteacher'],
  'studygroup' => ''
]);

// Manually assign a user to a role.
if ($_GET['giverole'])
guyra_update_user_data($user, 'role', $_GET['giverole']);

// Manually create the databases if they don't exist.
if ($_GET['create_db'])
guyra_database_create_db();

// Change a site option.
if ($_GET['change_option']) {

  global $gSettings;
  global $redirect;

  $value = stripslashes($_POST["value"]);

  $gSettings[$_POST['change_option']] = $value;

  GuyraGetSettings(true, $gSettings);

}

// Delete a cache folder.
if ($_GET['delete_cache']) {

  include_once $template_dir . '/functions/Assets.php';
  delete_cache($_GET['delete_cache']);

}


if ($_GET['action'] == 'refreshPWA') {

  $PWAjs_file_path = $site_root . '/GuyraPWA.js';
  $PWAmanifest_file_path = $site_root . '/GuyraManifest.json';

  unlink($PWAjs_file_path);
  unlink($PWAmanifest_file_path);

  guyra_handle_pwa();

}
