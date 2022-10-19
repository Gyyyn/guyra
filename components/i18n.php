<?php

global $template_url;
global $admin_url;
global $site_url;
global $is_logged_in;
global $site_api_url;
global $gLang;
global $gi18n;
global $gSettings;

function FetchBrowserLangs() {

	$header = explode(';', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
	$accepted_langs = explode(',', $header[0]);

	return $accepted_langs;

}

$i18n_links = [
	'guyra_version' => GUYRA_VERSION,
	'home_link' => $site_url,
	'landing_link' => $site_url . '/Landing',
	'api_link' => $site_api_url,
	'practice_link' => $site_url . '/practice',
	'courses_link' => $site_url . '/courses',
	'account_link' => $site_url . '/account',
	'profile_link' => $site_url . '/account/options',
	'register_link' => $site_url . '/account/register',
	'shop_link' => $site_url . '/shop',
	'reference_link' => $site_url . '/reference',
	'ranking_link' => $site_url . '/ranking',
	'lost_password_link' => $site_url . '/account/lostpassword',
	'password_edit_link' => $site_url . '/account/changepassword',
	'logout_link' => $site_url . '/api?logout=1',
	'privacy_link' => $site_url . '/privacy',
	'terms_link' => $site_url . '/terms',
	'schools_link' => $site_url . '/schools',
	'purchase_link' => $site_url . '/account/payment',
	'help_link' => $site_url . '/help',
	'faq_link' => $site_url . '/faq',
	'help_wp_link' => 'https://wa.me/+5519982576400',
	'schools_footer_link' => $site_url . '/work-with-us',
	'thanks_footer_link' => $site_url . '/thanks',
	'guyra_admin_link' => $site_url . '/SuperAdminControlPanel',
	'template_link' => $template_url,
	'assets_link' => $template_url . '/assets/',
	'audio_link' => $template_url . '/assets/audio/',
	'logo_img' => $template_url . '/assets/img/birdlogo_ver1.5.svg',
	'title_img' => $template_url . '/assets/img/guyra-title.svg',
	'title_logo_img' => $template_url . '/assets/img/guyra-title-logo.svg',
	'mp_public_key' => $gSettings['mp_public_key']
];

if ($gSettings['dev_env']) {

	$i18n_links['mp_public_key'] = $gSettings['mp_public_key_dev'];
	$gSettings['mp_access_token'] = $gSettings['mp_access_token_dev'];
	
}


function Fetchi18n($args=[]) {

	global $template_dir;
	global $site_url;

	if (!$args['lang'])
	$args['lang'] = 'pt';

	if (!$args['files'])
	$args['files'] = ['general', 'shop'];

	$final = [];

	foreach ($args['files'] as $file) {

		$fetched_file = file_get_contents($template_dir . '/assets/json/i18n/' . $args['lang'] . '/' . $file . '.json');
		$fetched_file = str_replace("%site_url", $site_url, $fetched_file);
		$fetched_file = json_decode($fetched_file, true);

		if (is_array($fetched_file)) {
			$final = array_merge($final, $fetched_file);
		}

	}

	return $final;

}

$gi18n = Fetchi18n(['lang' => $gLang[0]]);
$gi18n = array_merge($gi18n, $i18n_links);

unset($i18n_links);
