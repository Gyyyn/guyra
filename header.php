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
  $page_Title = $gi18n['study'];

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
<link rel="icon" href="<?php echo GetImageCache('img/birdlogo_ver1.5.png', 32, 'png'); ?>" type="image/x-icon">
<link rel="preload" as="style" href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" crossorigin="anonymous" onload="this.onload=null;this.rel='stylesheet'">
<link rel="preload" as="style" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@latest/font/bootstrap-icons.css" crossorigin="anonymous" onload="this.onload=null;this.rel='stylesheet'">
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
<header>
  <nav id="guyra-navbar" class="navbar navbar-expand-lg d-none d-lg-flex navbar-light fixed-top">

    <div class="container-fluid">

      <div class="navbar-brand d-flex me-3">
        <a class="text-decoration-none" href="<?php echo $gi18n['home_link'] ?>">
          <span class="navbar-center-title">
            <img class="mb-1" alt="Guyra" width="55" height="15" src="<?php echo $gi18n['title_img']; ?>" />
          </span>
        </a>
      </div>

      <div class="justify-content-between collapse navbar-collapse" id="navbarCollapse">

        <ul class="navbar-nav">

          <?php if (!$is_logged_in): ?>

          <li class="nav-item me-2">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link']; ?>"><?php echo $gi18n['homepage']; ?></a>
          </li>

          <li class="nav-item me-2">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link']; ?>#jump-info"><?php echo $gi18n['info']; ?></a>
          </li>

          <li class="nav-item me-2">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link']; ?>#jump-prices"><?php echo $gi18n['prices']; ?></a>
          </li>

          <?php else: ?>

          <li class="nav-item me-2">
            <a class="btn-tall btn-sm purple" href="<?php echo $gi18n['home_link']; ?>"><?php echo $gi18n['study']; ?></a>
          </li>

          <li class="nav-item me-2">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['shop_link']; ?>"><?php echo $gi18n['shop']; ?></a>
          </li>

          <li class="nav-item me-2">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['ranking_link']; ?>"><?php echo $gi18n['ranking']; ?></a>
          </li>

          <?php endif; ?>

        </ul>

        <ul class="navbar-nav justify-content-end nav-rightside">

          <?php if(!$is_logged_in):  ?>

          <li class="nav-item">
            <a class="btn-tall btn-sm green" href="<?php echo $gi18n['account_link']; ?>"><?php echo $gi18n['button_login'] ?></a>
          </li>

          <?php else: ?>

          <li class="nav-item me-2">
            <?php RenderNotificationsDropdown(['offset' => '-200,-20']); ?>
          </li>

          <li class="nav-item profile-item">
            <?php RenderAccountDropdown(['profile_picture' => $profile_picture, 'offset' => '-150,-20']); ?>
          </li>

          <?php endif; ?>

        </ul>
      </div>

    </div>

  </nav>

  <nav class="navbar navbar-light fixed-bottom d-block d-lg-none">

    <div class="d-flex w-100 justify-content-evenly">

      <a class="btn-tall page-icon small home-link" href="<?php echo $gi18n['home_link'] ?>">
        <img src="<?php echo GetImageCache($home_icon, 64); ?>">
        <span><?php echo $home_label; ?></span>
      </a>

      <?php if ($current_user_subscription_valid): ?>

      <a class="btn-tall green page-icon small practice-link" href="<?php echo $gi18n['practice_link'] ?>">
        <img src="<?php echo GetImageCache('icons/target.png', 64); ?>">
        <span><?php echo $gi18n['practice'] ?></span>
      </a>

      <a class="btn-tall page-icon small courses-link" href="<?php echo $gi18n['courses_link'] ?>">
        <img src="<?php echo GetImageCache('icons/online-learning.png', 64); ?>">
        <span><?php echo $gi18n['courses'] ?></span>
      </a>

      <?php endif; ?>

      <a style="<?php echo $account_button_style ?>" class="btn-tall page-icon small profile-link" href="<?php echo $gi18n['account_link']; ?>">
        <img src="<?php echo GetImageCache('icons/profile.png', 64); ?>">
        <span><?php echo $account_label ?></span>
      </a>

    </div>

  </nav>

  <?php if ($is_logged_in): ?>
  <div class="mobile-top-header d-flex flex-column d-lg-none justify-content-center align-items-center w-100 text-s fw-bold position-fixed top-0 start-0 pb-0">
    <div class="d-flex flex-row justify-content-center align-items-center">
      <span class="position-absolute start-0"><button class="btn text-white" type="button" name="button" id="mobile-header-back"><i class="bi bi-chevron-left"></i></button></span>
      <span class="capitalize"><?php echo ucfirst($page_Title) ?></span>
      <span class="page-icon tiny position-absolute end-0">
        <?php RenderAccountDropdown(['profile_picture' => $profile_picture, 'name_button' => false, 'offset' => '0,-20']); ?>
      </span>
    </div>
    <div class="d-flex flex-row justify-content-evenly w-100">
      <a class="btn shop-link fw-bold text-white" href="<?php echo $gi18n['shop_link']; ?>"><img alt="home" width="32" height="32" src="<?php echo GetImageCache('icons/exercises/shop.png', 64); ?>"></a>
      <a class="btn reference-link fw-bold text-white" href="<?php echo $gi18n['reference_link']; ?>"><img alt="home" width="32" height="32" src="<?php echo GetImageCache('icons/layers.png', 64); ?>"></a>
      <a class="btn meeting-link fw-bold text-white" href="<?php echo $gi18n['api_link'] . '?redirect_meeting=1'; ?>"><img alt="home" width="32" height="32" src="<?php echo GetImageCache('icons/video-camera.png', 64); ?>"></a>
      <span class="position-relative"><?php RenderNotificationsDropdown(['buttonClass' => 'btn text-white p-1 pt-2']); ?></span>
    </div>
  </div>
  <?php endif; ?>

</header>
