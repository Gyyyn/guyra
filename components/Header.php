<?php

global $template_dir;
global $template_url;
global $site_api_url;
global $current_user_id;
global $current_user_data;
global $current_user_subscription_valid;
global $current_user_notifications;
global $is_logged_in;
global $gi18n;
global $args;

include_once $template_dir . '/components/ProfilePicture.php';
include_once $template_dir . '/components/Header.php';
include_once $template_dir . '/functions/Assets.php';

$where_am_i = CaptureRequest(function($r) {
  return $r;
});

$body_class[0] = 'logged_out';
$home_icon = 'icons/exercises/house.png';
$home_label = $gi18n['homepage'];
$account_label = $gi18n['login'];
$account_button_style = "width: unset;";

if ($is_logged_in) {

  $profile_picture = Guyra_get_profile_picture($current_user_id, 'navbar-profile');
  $body_class[0] = 'logged_in';
  $home_icon = 'icons/learning.png';
  $home_label = $gi18n['lessons'];
  $account_label = $gi18n['account'];
  $account_button_style = '';

}

$highlight_class = 'purple';
$page_Title = $gi18n['company_name'];

if ($where_am_i == '') {

  $body_class[] = 'home';
  $page_Title = $gi18n['study'] . ' ' . $gi18n['at'] . ' ' . $gi18n['company_name'];

  if (!$is_logged_in)
  $page_Title = $gi18n['homepage'];


} elseif ($where_am_i == 'account') {

  $body_class[] = 'profile';
  $page_Title = $gi18n['login'];

  if ($is_logged_in)
  $page_Title = $current_user_data['first_name'] . ' - ' . $gi18n['account'] . ' ' . $gi18n['company_name'];

} else {

  $body_class[] = $where_am_i;
  $page_Title = $where_am_i;

  if ($gi18n[$page_Title])
  $page_Title = $gi18n[$page_Title] . ' - ' . $gi18n['company_name'];

}

?>
<!-- Hello :) -->
<!doctype html>
<html lang="pt-BR">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#06b6f1"/>
<meta name="description" content="<?php echo $gi18n['meta_desc'] ?>">
<meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

<title><?php echo ucfirst($page_Title); ?></title>
<link rel="icon" href="<?php echo GetImageCache('img/maskable_icon.png', 32, 'png'); ?>" type="image/x-icon">
<link href="<?php echo GetMinifiedAsset('css', 'bootstrap.css'); ?>" rel="stylesheet">
<link href="<?php echo GetMinifiedAsset('css', 'bootstrap-icons.css'); ?>" rel="stylesheet">
<link rel="manifest" href="/GuyraManifest.json">
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Regular.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Regular.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Bold.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Bold.woff" as="font" crossorigin>
<link rel="apple-touch-icon" href="<?php echo $template_url; ?>/assets/img/apple-icon.png">
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo $template_url; ?>/assets/img/splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
<link href="<?php echo GetMinifiedAsset('css', 'main.css'); ?>" rel="stylesheet">
<link href="<?php echo GetMinifiedAsset('css', 'animations.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'input.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'editor.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'misc.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<?php if ($args['css']): ?>
<link href="<?php echo GetMinifiedAsset('css', $args['css']); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<?php endif; ?>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7198773595231701" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DCFLSY9LC7"></script>
<script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-DCFLSY9LC7');</script>
<noscript><style media="screen">body>div,body>header,body>main{display:none!important;}</style></noscript>
</head>

<body class="guyra <?php echo implode(' ', $body_class); ?>">
<noscript><?php echo $gi18n['noscript']; ?></noscript>
