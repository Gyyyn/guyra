<?php

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

  if ($gSettings['landing_open'] == true)
  return $template_dir . '/pages/Landing.php';

  return $template_dir . '/pages/LandingLogin.php';

}

include_once DecideStartingPage();
