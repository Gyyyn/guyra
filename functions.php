<?php

define('WP_POST_REVISIONS', 3);

$template_dir = get_template_directory();
$template_url = get_template_directory_uri();
$current_user_id = get_current_user_id();
$is_logged_in = is_user_logged_in();
$is_admin = current_user_can('manage_options');
$site_url = get_site_url();
$admin_url = get_admin_url();
$site_api_url = $site_url . '/api';

include_once $template_dir . '/components/i18n.php';
include_once $template_dir . '/functions/Database.php';
include_once $template_dir . '/components/StreakTree.php';
include_once $template_dir . '/components/Topbar.php';

if ($is_logged_in) {
	$current_user_meta = get_user_meta($current_user_id);
	$current_user_data = guyra_get_user_data($current_user_id);
	$current_user_gamedata = guyra_get_user_game_data($current_user_id);

	UserLoginUpdateStreakStatus($current_user_id);
}

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '0.0.9' );
}

function generateRandomString($length = 10) {
  return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

if ( ! function_exists( 'guyra_setup' ) ) :

	function guyra_setup() {

		// Kill all feeds
		function itsme_disable_feed() {
		 wp_die( __( 'No feed available, please visit the <a href="'. esc_url( home_url( '/' ) ) .'">homepage</a>!' ) );
		}

		add_action('do_feed', 'itsme_disable_feed', 1);
		add_action('do_feed_rdf', 'itsme_disable_feed', 1);
		add_action('do_feed_rss', 'itsme_disable_feed', 1);
		add_action('do_feed_rss2', 'itsme_disable_feed', 1);
		add_action('do_feed_atom', 'itsme_disable_feed', 1);
		add_action('do_feed_rss2_comments', 'itsme_disable_feed', 1);
		add_action('do_feed_atom_comments', 'itsme_disable_feed', 1);

		// Remove some WP stuff
		remove_action('wp_head', 'wp_generator');
		remove_action('wp_head', 'wlwmanifest_link');
		remove_action('wp_head', 'rsd_link');

		// Remove unused styles
		function deregister_styles() {
			wp_deregister_style('dashicons');
			wp_deregister_style('admin-bar');
			wp_deregister_style('wp-block-library');
		}

		add_action('wp_print_styles', 'deregister_styles', 100);

		// Remove unused JS
		function dequeue_js() {
			wp_deregister_script('hoverintent');
			wp_deregister_script('admin-bar');
			wp_deregister_script('wp-embed');
		}

		add_action( 'wp_print_styles', 'dequeue_js' );
	}
endif;
add_action( 'after_setup_theme', 'guyra_setup' );

/**
 * Filter function used to remove the tinymce emoji plugin.
 *
 * @param array $plugins
 * @return array Difference betwen the two arrays
 */
function disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}

/**
 * Remove emoji CDN hostname from DNS prefetching hints.
 *
 * @param array $urls URLs to print for resource hints.
 * @param string $relation_type The relation type the URLs are printed for.
 * @return array Difference betwen the two arrays.
 */
function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' == $relation_type ) {
		/** This filter is documented in wp-includes/formatting.php */
		$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

		$urls = array_diff( $urls, array( $emoji_svg_url ) );
	}

	return $urls;
}

/**
 * Disable the emoji's
 */
function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', 'disable_emojis_tinymce' );
	add_filter( 'wp_resource_hints', 'disable_emojis_remove_dns_prefetch', 10, 2 );
}

add_action( 'init', 'disable_emojis' );

/* Disable WordPress Admin Bar for all users */
add_filter( 'show_admin_bar', '__return_false' );

// prevent the default WP Login
function prevent_wp_login() {
  global $pagenow;
	global $gi18n;

  if($pagenow == 'wp-login.php') {
    wp_redirect($gi18n['account_link']);
    exit();
  }
}

add_action('init', 'prevent_wp_login');

// Remove the normal WP die handler
function custom_die_handler( $message, $title="", $args = array() ) {
	echo '["server error"]';
  echo '<html><body style="font-family: system-ui,-apple-system,sans-serif;">';
	echo '<hr />';
  echo '<h1>Erro ' . $args['response'] . '</h1>';
	echo "Algum erro grave occoreu. Já coletamos informações sobre o erro. Se alguem pedir, de o seguinte codigo: ";
	echo time();
	echo "<hr />";
	echo date('Y-m-d H:i:s');
  echo '</body></html>';
	guyra_log_error(json_encode([$title, $message, $args['response']]));
  die();
}

// Intermediate function is necessary to customize wp_die
function swap_die_handlers() {
    return 'custom_die_handler';
}
add_filter('wp_die_handler', 'swap_die_handlers' );

// Disable default wp_mails
function disabling_emails( $args ){
    unset ( $args['to'] );
    return $args;
}
add_filter('wp_mail','disabling_emails', 10,1);
add_filter( 'send_password_change_email', '__return_false' );
add_filter( 'send_email_change_email', '__return_false' );
