<?php
/**
 * The main template file
 *
 * @package guyra
 */

// Handle JSON API requests
if($_GET['json']) {
  include get_template_directory() . '/Guyra_json.php';
}

// Handle admin actions
if (current_user_can('manage_options')) {

  include get_template_directory() . '/Guyra_actions.php';

}

// Allow logged users to go straight to a home page
if (is_user_logged_in()) {

  load_template(locate_template('Guyra_study.php'));

// No special pages requested, continue as normal
} else {
  load_template(locate_template('Guyra_landing_loginonly.php'));
}
