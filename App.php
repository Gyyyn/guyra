<?php

include_once './functions/Init.php';

function DecideStartingPage() {

  global $template_dir;
  global $is_logged_in;
  global $is_admin;
  global $current_user_data;
  global $gSettings;

  if($is_logged_in) {

    if ($is_admin && $_GET['page'] == 'admin')
    return $template_dir . '/pages/SuperAdminControlPanel.php';

    if ($current_user_data['role'] == 'teacher')
    return $template_dir . '/pages/GroupAdminControlPanel.php';

    return $template_dir . '/pages/UserHomePage.php';

  }

  return $template_dir . '/pages/Landing.php';

}

function GetComponent($component, $_args=[]) {
  
  global $template_dir;
  global $args;

  $component_file = $template_dir . '/components/' . $component . '.php';

  if (file_exists($component_file)) {

    $args = $_args;

    include_once $component_file;

  }

}

// Capture request and pass to handler.
CaptureRequest(function($r) {

  global $template_dir;

  $home = DecideStartingPage();
  $page = $home;

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

    $page = $template_dir . '/pages/' . $pageToLoad . '.php';

  }

  if (file_exists($page)) {
    include_once $page;
  } else {

    HandleServerError([
      'message' => 'Page not found'
    ], 404);

  }

});
