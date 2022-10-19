<?php

/**
 * Init.php
 * loads all of the required functions for
 * user authentication and server settings, etc.
 */

// Force HTTPS independent of server config.
if($_SERVER["HTTPS"] != "on") {
    header("Location: https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"]);
    exit;
}

// Force disable error reporting.
error_reporting(0);

// Setup some globals.
$secondsForA = [
	'year' => 31536000,
	'month' => 2592000,
	'week' => 604800,
	'day' => 86400,
	'hour' => 3600,
	'minute' => 60
];

$site_url =
	$_SERVER['REQUEST_SCHEME'] . '://' .
	$_SERVER['SERVER_NAME'] .
	explode('index.php', $_SERVER['PHP_SELF'])[0];

if(substr($site_url, -1) == '/')
$site_url = substr($site_url, 0, -1);

$site_root = explode('index.php', $_SERVER['SCRIPT_FILENAME'])[0];

if(substr($site_root, -1) == '/')
$site_root = substr($site_root, 0, -1);

$template_dir = $site_root;
$template_url = $site_url;
$cache_dir = $template_dir . '/cache';
$admin_url = $site_root;
$site_api_url = $site_url . '/api';

// Set up default language.
$gLang = ['pt', 'BR'];

// Include server functions.
include_once $template_dir . '/functions/Server.php';

// Prevent direct execution.
Guyra_Safeguard_File();

// Handle settings and authentication.
include_once $template_dir . '/functions/Security.php';

$gSettings = GuyraGetSettings();

// Define DB access.
define('DB_NAME', $gSettings['db_name']);
define('DB_USER', $gSettings['db_user']);
define('DB_PASSWORD', $gSettings['db_password']);
define('DB_HOST', $gSettings['db_host']);
define('DB_CHARSET', $gSettings['db_charset']);

// Load database functions
include_once $template_dir . '/functions/Database.php';

// Setup some user-specific globals.
$is_logged_in = Guyra_IsLoggedIn();

// Make sure this var is acessible anywhere.
global $current_user_meta;

// Build an user meta associative array.
$current_user_meta = guyra_get_user_meta($current_user_id, null, true);

// Convert the simple array into an associative array.
// This allows it to be used by the guyra_get_user_meta function.
for ($i=0; $i < count($current_user_meta); $i++) {
	$current_user_meta[$current_user_meta[$i]['meta_key']] = $current_user_meta[$i];
	unset($current_user_meta[$i]);
}

// If the site is closed load no further.
if ($gSettings['site_closed'] && !$is_admin) {
	echo "<body style=\" display: flex; justify-content: center; align-items: center; font-family: sans-serif; font-size: 32px; padding: 15vw; \">";
	echo "Closed for maintenance | Fechado para manutenção | Cerrado por mantenimiento | закрыт на техническое обслуживание | 关闭进行维修 | メンテナンスのため閉鎖";
	echo "</body>";
	exit;
}

include_once $template_dir . '/components/i18n.php';

// Detect compatibility
if ((strpos($_SERVER["HTTP_USER_AGENT"], 'MSIE') ? true : false) ||
		(strpos($_SERVER["HTTP_USER_AGENT"], 'Trident') ? true : false)) {
	echo $gi18n['ie_unsupported_warning'];
	exit;
}

// All functions are loaded, from this point on we can change data.

// Setup current user's globals.
if ($is_logged_in) {

	// Set up user object for authentication.
	$current_user_object = build_user_object($current_user_id);

	// Set up user data.
	$current_user_data = guyra_get_user_data($current_user_id);

	// Set up data for use in game events.
	$current_user_gamedata = guyra_get_user_data($current_user_id, 'gamedata');

	// Set up user payment trackers.
	$current_user_payments = guyra_get_user_data($current_user_id, 'payment');
	$current_user_subscription_valid = false;

	// Set up notifications data.
	$current_user_notifications = guyra_get_user_data($current_user_id, 'notifications');

	// Set up inventory data.
	$current_user_inventory = guyra_get_user_data($current_user_id, 'inventory');

	// Set up diary data.
	$current_user_diary = guyra_get_user_data($current_user_id, 'diary');

	// If a language has been set we can load it here.
	if (is_array($current_user_data['lang'])) {
		$gLang = $current_user_data['lang'];
	}

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

	// Set up some default so no errors occur.
	if (!$current_user_notifications)
	$current_user_notifications = [];

	if (!$current_user_inventory)
	$current_user_inventory = [];

	$changedGamedata = false;
	$dailyStreakBroken = false;
	$sendNotification = false;

	// Update the challenges
	if (($current_user_gamedata['challenges']['daily']['last_update'] + 86400) < time()) {

		$current_user_gamedata['challenges']['daily'] = [
			'last_update' => time(),
			'levels' => 5,
			'levels_completed' => 0
		];

		$changedGamedata = true;

	}

	$iCount = 0;
	$challengeKeys = array_keys($current_user_gamedata['challenges']);

	foreach ($current_user_gamedata['challenges'] as &$challenge) {

		$now = time();
		$expireTime = $challenge['started'] + $challenge['limiter']['amount'];
		$delete = false;

		// Check if the goals are done.
		if ($challenge['goal']['amount'] == $challenge['goal']['done'] && !$failed && $challenge['type']) {

			$current_user_gamedata['level'] += $challenge['reward'];
			$delete = true;
			$sendNotification = $gi18n['notification_challenge_won'];

		}

		// Check if challenge has expired.
		if ($expireTime > $now)
		$delete = true;

		if ($delete) {

			unset($current_user_gamedata['challenges'][$challengeKeys[$iCount]]);
			$changedGamedata = true;

		}

		$iCount +=1;

	}

	unset($iCount);
	
	if ($changedGamedata)
	guyra_update_user_meta($current_user_id, 'gamedata', json_encode($current_user_gamedata));

}

// Now we can determine special user privileges.
$is_admin = Guyra_Is_Admin();
$is_GroupAdmin = ($current_user_data['role'] == 'teacher' || $current_user_data['role'] == 'schooladmin');
$is_tester = ($current_user_data['role'] == 'tester');

// Allow admins to debug errors
if ($is_admin && $_GET['show_errors'])
error_reporting(E_ALL);

include_once $template_dir . '/functions/Payment.php';

UpdateDirectPaymentsStatus();

$current_user_subscription_valid = IsSubscriptionValid($current_user_id);

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

// If payment was determined valid we need to check it every once in a while.
if ($current_user_subscription_valid) {

	$last_subscription_check = $current_user_payments['last_check'];
	$now = time();

	if (($last_subscription_check + $secondsForA['month']) < $now) {

		$subscription_check = CheckSubscription();

		if (!$subscription_check) {
			$current_user_subscription_valid = false;
			$current_user_payments['status'] == 'cancelled';
		}

		guyra_update_user_data($current_user_id, 'last_check', $now, 'payment');

	}

}

include_once $template_dir . '/functions/Notifications.php';
include_once $template_dir . '/components/ProfilePicture.php';
include_once $template_dir . '/components/StreakTree.php';

// Update the login streak.
UserLoginUpdateStreakStatus($current_user_id);

// Do all the necessary PWA stuff.
include_once $template_dir . '/functions/PWA.php';

$enable_PWA = guyra_handle_pwa();

if ($sendNotification)
PushNotification($sendNotification);
