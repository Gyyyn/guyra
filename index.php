<?php
/**
 * The main template file
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $site_url;
global $is_logged_in;

// comment_history here is temp till we rewrite the schools panel
if(empty($_GET) || $_GET['comment_history']):

  if($is_logged_in) {

    if ($current_user_meta['role'][0] == 'teacher') {
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

else:

  if($_GET['json']) {

    include $template_dir . '/Guyra_json.php';

  } elseif ($_GET['user']) {

    include $template_dir . '/Guyra_actions.php';

  } else {

    if ($_GET['page'] == "admin" && current_user_can('manage_options')) {

      load_template(locate_template('Guyra_admin.php'));

    }

  }

endif;
