<?php
/**
 * The main template file
 *
 * @package guyra
 */

$template_dir = get_template_directory();

if(empty($_GET)) {

  if(is_user_logged_in()) {

    load_template(locate_template('Guyra_study.php'));

  } else {

    require $template_dir . '/Guyra_database.php';

    $landing_open = guyra_get_user_meta(1, 'landing_open', true)['meta_value'];

    if ($landing_open === 'true') {

      load_template(locate_template('Guyra_landing.php'));

    } else {

      load_template(locate_template('Guyra_landing_loginonly.php'));

    }

  }

} else {

  if($_GET['json']) {

    include $template_dir . '/Guyra_json.php';

  } elseif ($_GET['user']) {

    include $template_dir . '/Guyra_actions.php';

  } else {

    if ($_GET['page'] == "admin" && current_user_can('manage_options')) {

      load_template(locate_template('Guyra_admin.php'));

    }

  }

}
