<?php
// Force HTTPS independent of server config.
function ForceHTTPS() {
	if($_SERVER["HTTPS"] != "on") {
	    header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
	    exit;
	}
}

add_action('init', 'ForceHTTPS');

// Define the app version.
if (!defined('GUYRA_VERSION')) {
	define('GUYRA_VERSION', '0.1.2');
}

// Setup some globals.
$secondsForA = [
	'year' => 31536000,
	'month' => 2592000,
	'week' => 604800,
	'day' => 86400,
	'hour' => 3600,
	'minute' => 60
];

$template_dir = get_template_directory();
$template_url = get_template_directory_uri();
$cache_dir = $template_dir . '/cache';
$site_url = get_site_url();
$admin_url = get_admin_url();
$site_api_url = $site_url . '/api';

// Prevent direct execution
include_once $template_dir . '/functions/Server.php';
Guyra_Safeguard_File();

// Handle settings and authentication.
include_once $template_dir . '/functions/Security.php';

// Setup some user-specific globals.
$gSettings = GuyraGetSettings();
$current_user_id = get_current_user_id();
$is_logged_in = is_user_logged_in();
$is_admin = Guyra_Is_Admin();

// If the site is closed load no further.
if ($gSettings['site_closed'] && !$is_admin) {
	echo "<body style=\" display: flex; justify-content: center; align-items: center; font-family: sans-serif; font-size: 32px; padding: 15vw; \">";
	echo "Closed for maintenance | Fechado para manutenção | Cerrado por mantenimiento | закрыт на техническое обслуживание | 关闭进行维修 | メンテナンスのため閉鎖";
	echo "</body>";
	exit;
}

include_once $template_dir . '/components/i18n.php';

// Detect compatibility
if (strpos($_SERVER["HTTP_USER_AGENT"], 'MSIE') ? true : false ||
		strpos($_SERVER["HTTP_USER_AGENT"], 'Trident') ? true : false) {
	echo $gi18n['ie_unsupported_warning'];
	exit;
}

include_once $template_dir . '/functions/Database.php';
include_once $template_dir . '/functions/PWA.php';
include_once $template_dir . '/functions/Notifications.php';
include_once $template_dir . '/components/ProfilePicture.php';
include_once $template_dir . '/components/StreakTree.php';
include_once $template_dir . '/components/Topbar.php';

// All functions are loaded, from this point on we can change data.

// Build an user meta associative array.
$current_user_meta = guyra_get_user_meta($current_user_id, null, true);

// Convert the simple array into an associative array.
// This allows it to be used by the guyra_get_user_meta function.
for ($i=0; $i <= count($current_user_meta); $i++) {
	$current_user_meta[$current_user_meta[$i]['meta_key']] = $current_user_meta[$i];
	unset($current_user_meta[$i]);
}

// Do all the necessary PWA stuff.
$enable_PWA = guyra_handle_pwa();

// Setup current user's globals.
if ($is_logged_in) {

	// Set up user object for authentication.
	$current_user_object = build_user_object($current_user_id);

	// Set up WP data. TODO: Remove this once we migrate out of WP
	$current_user_meta = get_user_meta($current_user_id);

	// Set up user data.
	$current_user_data = guyra_get_user_data($current_user_id);

	// Set up data for use in game events.
	$current_user_gamedata = guyra_get_user_data($current_user_id, 'gamedata');

	// Set up user payment trackers.
	$current_user_payments = guyra_get_user_meta($current_user_id, 'payment', true)['meta_value'];
	$current_user_payments = json_decode($current_user_payments, true);
	$current_user_subscription_valid = false;

	// Set up notifications data.
	$current_user_notifications = guyra_get_user_meta($current_user_id, 'notifications', true)['meta_value'];
	$current_user_notifications = json_decode($current_user_notifications, true);

	// Set up inventory data.
	$current_user_inventory = guyra_get_user_meta($current_user_id, 'inventory', true)['meta_value'];
	$current_user_inventory = json_decode($current_user_inventory, true);

	// Set up diary data.
	$current_user_diary = guyra_get_user_meta($current_user_id, 'diary', true)['meta_value'];
	$current_user_diary = json_decode($current_user_diary, true);

	// Set up some defaults for uncreated data, and handle some time-based events.

	// If there is no payment data it means the user never payed for anything.
	if (!$current_user_payments)
	$current_user_payments = [
		'status' => 'none'
	];

	// If the user never engaged with the challenge system set it as so.
	if (!$current_user_gamedata['challenges'])
	$current_user_gamedata['challenges'] = [
		'daily' => [
			'last_update' => 0
		]
	];

	// Update the daily challenges
	if (($current_user_gamedata['challenges']['daily']['last_update'] + 86400) < time()) {

		$current_user_gamedata['challenges']['daily'] = [
			'last_update' => time(),
			'levels' => 5,
			'levels_completed' => 0
		];

		guyra_update_user_meta($current_user_id, 'gamedata', json_encode($current_user_gamedata));

	}

	// Set up some default so no errors occur.
	if (!$current_user_notifications)
	$current_user_notifications = [];

	if (!$current_user_inventory)
	$current_user_inventory = [];

	// Update the login streak.
	UserLoginUpdateStreakStatus($current_user_id);

}

// Now we can determine special user privileges.
$is_GroupAdmin = ($current_user_data['role'] == 'teacher' || $current_user_data['role'] == 'schooladmin');
$is_tester = ($current_user_data['role'] == 'tester');

// Allow payed users to access the site.
if ($current_user_payments['status'] == 'approved')
$current_user_subscription_valid = true;

// Allow payment through direct payment
if ($current_user_diary && is_array($current_user_diary)) {

	$latest_item = end($current_user_diary['payments']);
	$latest_item_due_unix = strtotime($latest_item['due']);

	// Allow if the latest oked payment is less than a month ago.
	if ( $latest_item['status'] == 'ok' && ( ($latest_item_due_unix + $secondsForA['month']) > time() ) ) {
		$current_user_subscription_valid = true;
	}

}

// Handle trial accounts and non-payed access.
if (!$current_user_subscription_valid) {
	$date_user_registered = strtotime($current_user_data['user_registered']);
	$now = time();

	// Users newer than a month old are considered trial users.
	if (($date_user_registered + $secondsForA['month']) > $now) {
		$current_user_subscription_valid = true;
		$current_user_payments['status'] = 'trial';
		$current_user_payments['days_left'] = ($now - $date_user_registered) / $secondsForA['day'];
		$current_user_payments['days_left'] = round($current_user_payments['days_left']);
	}

	// Remove the need for admins and testers to adquire a subscription.
	if ($is_admin || $is_GroupAdmin || $is_tester)
	$current_user_subscription_valid = true;

}

// Set up avatar and inventory stuff.
if ($current_user_data['profile_picture_url'] == '') {
	$current_user_data['profile_picture_url'] = Guyra_get_profile_picture($current_user_id, null, true);
}

// --- Wordpress Stuff
function itsme_disable_feed() { exit; }
add_action('do_feed', 'itsme_disable_feed', 1);
add_action('do_feed_rdf', 'itsme_disable_feed', 1);
add_action('do_feed_rss', 'itsme_disable_feed', 1);
add_action('do_feed_rss2', 'itsme_disable_feed', 1);
add_action('do_feed_atom', 'itsme_disable_feed', 1);
add_action('do_feed_rss2_comments', 'itsme_disable_feed', 1);
add_action('do_feed_atom_comments', 'itsme_disable_feed', 1);
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
function deregister_styles() {
	wp_deregister_style('dashicons');
	wp_deregister_style('admin-bar');
	wp_deregister_style('wp-block-library');
}
add_action('wp_print_styles', 'deregister_styles', 100);
function dequeue_js() {
	wp_deregister_script('hoverintent');
	wp_deregister_script('admin-bar');
	wp_deregister_script('wp-embed');
}
add_action( 'wp_print_styles', 'dequeue_js' );
function disable_emojis_tinymce( $plugins ) {
	if ( is_array( $plugins ) ) {
		return array_diff( $plugins, array( 'wpemoji' ) );
	} else {
		return array();
	}
}
function disable_emojis_remove_dns_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' == $relation_type ) {
		/** This filter is documented in wp-includes/formatting.php */
		$emoji_svg_url = apply_filters( 'emoji_svg_url', 'https://s.w.org/images/core/emoji/2/svg/' );

		$urls = array_diff( $urls, array( $emoji_svg_url ) );
	}

	return $urls;
}
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
add_filter( 'show_admin_bar', '__return_false' );
function prevent_wp_login() {
  global $pagenow;
	global $gi18n;

  if($pagenow == 'wp-login.php') {
    Guyra_Redirect($gi18n['account_link']);
    exit;;
  }
}
add_action('init', 'prevent_wp_login');
function custom_die_handler( $message, $title="", $args = array() ) {

	global $gSettings;

	if (!$gSettings['dev_env']) {
		$message = null;
	}

	echo '["server error"]';
  echo '<html><body style="font-family: system-ui,-apple-system,sans-serif;">';
	echo '<hr />';
  echo '<h1>Erro ' . $args['response'] . '</h1>';
	echo "<pre>";
	print_r($message);
	echo "</pre>";
	echo "<hr />";
	echo "Algum erro grave occoreu. Já coletamos informações sobre o erro. Se alguem pedir, de o seguinte codigo: ";
	echo time();
	echo "<hr />";
	echo date('Y-m-d H:i:s');
  echo '</body></html>';
	guyra_log_error(json_encode([$title, $message, $args['response']]));
  exit;
}
// Intermediate function is necessary to customize wp_die
function swap_die_handlers() {
    return 'custom_die_handler';
}
add_filter('wp_die_handler', 'swap_die_handlers' );
function disabling_emails( $args ){
    unset ( $args['to'] );
    return $args;
}
add_filter('wp_mail','disabling_emails', 10,1);
add_filter( 'send_password_change_email', '__return_false' );
add_filter( 'send_email_change_email', '__return_false' );
