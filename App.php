<?php

// Define the app version.
if (!defined('GUYRA_VERSION'))
define('GUYRA_VERSION', '0.8.3');

// Initialize the App enviroment
include_once './functions/Init.php';

function GetComponent($component, $_args=[]) {
  
  global $template_dir;
  global $args;

  $component_file = $template_dir . '/components/' . $component . '.php';

  if (file_exists($component_file)) {

    $args = $_args;

    include_once $component_file;

  }

}

function isFilePublic($file): bool {

  global $site_root;

  $publicDir = $site_root . '/public';
  $isDir = false;

  if (!is_dir($publicDir))
  return false;

  if (sizeof($file) > 1)
  $isDir = true;

  $publicDirFiles = scandir($publicDir);

  // TODO: handle dirs

  if (array_search($file[1], $publicDirFiles))
  return true;

  return false;
  
}

// Capture request and pass to handler.
CaptureRequest(function($r, $_nests) {

  global $site_root;
  global $template_dir;
  global $is_logged_in;
  global $is_admin;
  global $current_user_data;
  global $gSettings;
  global $nests;
  global $route;
  global $isPublicFile;

  $nests = array_filter($_nests);

  // First set up some default pages.
  $page = $template_dir . '/pages/Home.php';

  if ($is_admin && $_GET['page'] == 'admin')
  $page = $template_dir . '/pages/SuperAdminControlPanel.php';

  // $r is the requested URL, if it's empty we are on root.
  if ($r) {

    $checkForGetVars = explode('?', $r);
    $pageToLoad = $r;

    if (is_array($checkForGetVars)) {

      $pageToLoad = $checkForGetVars[0];

      // Nuke trailing slash (annoying things :<)
      if(substr($pageToLoad, -1) == '/') {
        $pageToLoad = substr($pageToLoad, 0, -1);
      }

    }

    $pageAsJs = $template_dir . '/assets/js/' . $pageToLoad . '.js';

    if (file_exists($pageAsJs) || $pageToLoad == 'home' ) {
      $route[] = $pageToLoad;
    } else {
      $page = $template_dir . '/pages/' . $pageToLoad . '.php';
    }

    if(isFilePublic($nests)) {
      $isPublicFile = true;
      $page = $site_root . '/pages/public.php';
    }

  }

  // If the requested page exists load it, otherwise 404.
  if (file_exists($page)) {
    include_once $page;
  } else {

    HandleServerError([
      'err' => 'Page 404: ' . $page,
      'message' => 'Page not found'
    ], 404);

  }

});
