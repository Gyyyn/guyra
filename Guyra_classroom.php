<?php
/**
 * Classroom functions
 *
 * @package guyra
 */

// Sanity check, unlogged users shouldn't be here
if (!is_user_logged_in()) {
 wp_redirect(get_site_url());
}

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>
