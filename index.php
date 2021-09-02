<?php
/**
 * The main template file
 *
 * @package guyra
 */

// Handle JSON API requests
if($_GET['json']) {
  include get_template_directory() . '/Guyra_json.php';

// Handle admin actions
} elseif ($_GET['user']) {

  include get_template_directory() . '/Guyra_actions.php';

// No JSON is requested, no admin actions, proceed as normal
} else {

  // Allow logged users to go straight to a home page
  // and admins to load the admin page
  if ($_GET['page'] == "admin" && current_user_can('manage_options')) {

    load_template(locate_template('Guyra_admin.php'));

  } elseif (is_user_logged_in()) {

    load_template(locate_template('Guyra_study.php'));

  // No special pages requested, continue as normal
  } else {

    require get_template_directory() . '/Guyra_database.php';

    $landing_open = guyra_get_user_meta(1, 'landing_open', true)['meta_value'];

    if ($landing_open === 'true') {
      load_template(locate_template('Guyra_landing.php'));
    } else {
      load_template(locate_template('Guyra_landing_loginonly.php'));
    }

  }

}
