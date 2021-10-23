<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package guyra
 */

global $site_url;

$post_category = get_the_category()[0]->slug;

if ($post_category != 'blog'): wp_redirect($site_url);
else: load_template(locate_template('category-blog.php'));
endif;
