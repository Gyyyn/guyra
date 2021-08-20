<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package guyra
 */

// If the user has admin permissions he edits the page, otherwise
// gtfo of here
if (!current_user_can('manage_options')) {

  wp_redirect(get_site_url());

} else {

  wp_redirect(get_admin_url() . 'post.php?post=' . get_the_ID() . '&action=edit');

}
