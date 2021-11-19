<?php

global $template_dir;
global $is_logged_in;
global $is_admin;

if($is_logged_in) {

  if ($is_admin && $_GET['page'] == 'admin') {

    include $template_dir . '/pages/SuperAdminControlPanel.php';

  } else {

    if ($current_user_data['role'] == 'teacher') {

      include $template_dir . '/pages/GroupAdminControlPanel.php';

    } else {

      include $template_dir . '/pages/UserHomePage.php';

    }
  }

} else {

  $landing_open = guyra_get_user_meta(1, 'landing_open', true)['meta_value'];

  if ($landing_open === 'true') {

    include $template_dir . '/pages/Landing.php';

  } else {

    include $template_dir . '/pages/LandingLogin.php';

  }

}
