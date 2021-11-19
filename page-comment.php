<?php
/**
 * Custom comment upload page.
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

include $template_dir . '/Guyra_comment.php';
