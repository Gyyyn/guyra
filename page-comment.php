<?php
/**
 * Custom comment upload page.
 *
 * @package guyra
 */

// Sanity check, unlogged users shouldn't be here
if (!is_user_logged_in()) {
 wp_redirect(get_site_url());
}

include get_template_directory() . '/Guyra_comment.php';
