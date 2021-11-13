<?php
/**
 * guyra functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package guyra
 */

define('WP_POST_REVISIONS', 3);

$template_dir = get_template_directory();
$template_url = get_template_directory_uri();
$current_user_id = get_current_user_id();
$is_logged_in = is_user_logged_in();
$site_url = get_site_url();
$admin_url = get_admin_url();

// Setup functions globally
include $template_dir . '/Guyra_database.php';
include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_template_components.php';

$current_user_meta = get_user_meta($current_user_id);
$current_user_data = guyra_get_user_data($current_user_id);

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '0.0.5' );
}

function generateRandomString($length = 10) {
  return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

if ( ! function_exists( 'guyra_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function guyra_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on guyra, use a find and replace
		 * to change 'guyra' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'guyra', $template_dir . '/languages' );


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

		// Remove generator tag
		remove_action('wp_head', 'wp_generator');

		// Remove unused styles
		function deregister_styles() {
			wp_deregister_style('dashicons');
			wp_deregister_style('sweetalert2');
			wp_deregister_style('admin-bar');
			wp_deregister_style('user-registration-general');
			wp_deregister_style('user-registration-smallscreen');
			wp_deregister_style('user-registration-my-account-layout');
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

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'menu-1' => esc_html__( 'Primary', 'guyra' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'guyra_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'guyra_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function guyra_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'guyra_content_width', 640 );
}
add_action( 'after_setup_theme', 'guyra_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function guyra_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'guyra' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'guyra' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'guyra_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function guyra_scripts() {

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'guyra_scripts' );

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require $template_dir . '/inc/jetpack.php';
}

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
    // WP tracks the current page - global the variable to access it
    global $pagenow;
    // Check if a $_GET['action'] is set, and if so, load it into $action variable
    $action = (isset($_GET['action'])) ? $_GET['action'] : '';
    // Check if we're on the login page, and ensure the action is not 'logout'
    if( $pagenow == 'wp-login.php' && ( ! $action || ( $action && ! in_array($action, array('logout', 'lostpassword', 'rp', 'resetpass'))))) {
        // Load the home page url
        $page = get_bloginfo('url') . '/404';
        // Redirect to the home page
        wp_redirect($page);
        // Stop execution to prevent the page loading for any reason
        exit();
    }
}

add_action('init', 'prevent_wp_login');

// Remove the normal WP die handler

function custom_die_handler( $message, $title="", $args = array() ) {

  echo '<html><body>';
  echo '<h1>Erro:</h1>';
  echo print_r($message);
	echo $args['response'];
	echo '<br />';
	echo date('Y-m-d H:i:s');
	echo "<hr />";
	echo "Algum erro grave occoreu. Já coletamos informações sobre o erro.";
  echo '</body></html>';
	guyra_log_error(json_encode([$title, $message, $args['response']]));
  die();
}

// Intermediate function is necessary to customize wp_die
function swap_die_handlers() {
    return 'custom_die_handler';
}

add_filter('wp_die_handler', 'swap_die_handlers' );

add_filter('lostpassword_url', 'guyra_lostpassword_url');
function guyra_lostpassword_url() {
	return $account_link . '#lostpassword';
}
