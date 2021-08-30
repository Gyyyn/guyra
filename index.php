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
  if (is_user_logged_in()) {

    load_template(locate_template('Guyra_study.php'));

  // No special pages requested, continue as normal
  } else {
    load_template(locate_template('Guyra_landing_loginonly.php'));
  }

}
