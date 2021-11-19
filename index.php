<?php

global $template_dir;
global $is_logged_in;

if($is_logged_in) {

  if ($current_user_data['role'] == 'teacher') {
    include $template_dir . '/Guyra_schools.php';
  } else {
    include $template_dir . '/Guyra_study.php';
  }

} else {

  $landing_open = guyra_get_user_meta(1, 'landing_open', true)['meta_value'];

  if ($landing_open === 'true') {

    load_template(locate_template('Guyra_landing.php'));

  } else {

    load_template(locate_template('Guyra_landing_loginonly.php'));

  }

}
