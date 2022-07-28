<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $site_root;

Guyra_Safeguard_File();

require_once $template_dir . '/vendor/autoload.php';

use MatthiasMullie\Minify;

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
  delete_cache($_GET['delete_cache'], $_GET['limiter']);

}


if ($_GET['action'] == 'refreshPWA') {

  $PWAjs_file_path = $site_root . '/GuyraPWA.js';
  $PWAmanifest_file_path = $site_root . '/GuyraManifest.json';

  unlink($PWAjs_file_path);
  unlink($PWAmanifest_file_path);

  guyra_handle_pwa();

}

if ($_GET['update_special_cache']) {

  $special_caches = [
      ["https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css", "bootstrap.css", "css"],
      ["https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css", "bootstrap-icons.css", "css"],
      ["https://unpkg.com/react@17/umd/react.production.min.js", "react.js", "js"],
      ["https://unpkg.com/react-dom@17/umd/react-dom.production.min.js", "react-dom.js", "js"],
      ["https://unpkg.com/html-react-parser@1/dist/html-react-parser.min.js", "html-react-parser.js", "js"],
      ["https://cdn.jsdelivr.net/npm/marked/marked.min.js", "marked.js", "js"],
      ["https://unpkg.com/easymde/dist/easymde.min.css", "easymde.css", "css"],
      ["https://unpkg.com/easymde/dist/easymde.min.js", "easymde.js", "js"],
      ["https://unpkg.com/@popperjs/core@2", "popper.js", "js"],
      ["https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js", "bootstrap.js", "js"]
  ];

  $assetsCacheLocation = $template_dir . '/cache/assets/';

  foreach ($special_caches as $cache) {

      $assetFolder = $cache[2];
      $assetFile = $cache[1];
      $object = file_get_contents($cache[0]);

      $cachedObjectAppend = md5($assetFolder . $assetFile . GUYRA_VERSION) . '.' . $assetFolder;
      $cachedObject = $assetsCacheLocation . $cachedObjectAppend;

      if ($assetFile == 'bootstrap-icons.css') {
        $object = str_replace('./fonts', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/fonts', $object);
      }

      file_put_contents($cachedObject, $object);

  }

}