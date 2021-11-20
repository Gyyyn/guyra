<?php

global $wp;
global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $is_logged_in;
global $gi18n;

include_once $template_dir . '/components/ProfilePicture.php';
include_once $template_dir . '/components/Notepad.php';

$body_class[0] = 'logged_out';

if ($is_logged_in) {
  $profile_picture = Guyra_get_profile_picture($current_user_id, 'navbar-profile');
  $body_class[0] = 'logged_in';
}

$where_am_i = $wp->request;
$highlight_class = 'purple';
$page_Title = $gi18n['company_name'];

if ($where_am_i == '') {
  $homebtn_class = $highlight_class;
  $body_class[] = 'home';
}

if ($where_am_i == 'practice') {
  $homebtn_class = $highlight_class;
  $body_class[] = 'practice';
}

if ($where_am_i == 'reference') {
  $homebtn_class = $highlight_class;
  $body_class[] = 'reference';
}

if ($where_am_i == 'category/blog') {
  $blogbtn_class = $highlight_class;
  $body_class[] = 'blog';
  if ($is_logged_in) {
    $page_Title =  $gi18n['blog'] . ' ' . $gi18n['company_name'];
  }
}

if ($where_am_i == 'account') {
  $profilebtn_class = $highlight_class;
  $body_class[] = 'profile';
  if ($is_logged_in) {
    $page_Title = $current_user_data['first_name'] . ' - ' . $gi18n['company_name'];
  }
}

if ($where_am_i == 'schools') {
  $schoolsbtn_class = $highlight_class;
  $body_class[] = 'schools';
}

if ($where_am_i == 'register') {
  $body_class[] = 'register';
}

if ($where_am_i == 'courses') {
  $body_class[] = 'courses';
}

if ($is_logged_in) {
  $home_icon = '/assets/icons/learning.png';
} else {
  $home_icon = '/assets/icons/exercises/house.png';
}

?>
<!-- Hello :) -->
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#06b6f1"/>
<meta name="description" content="<?php echo $gi18n['meta_desc'] ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<title><?php echo $page_Title; ?></title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css">
<?php if ($args['css']): ?>
<link rel="stylesheet" href="<?php echo $gi18n['css_link'] . $args['css']; ?>">
<?php endif; ?>

<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/campton_black.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/campton_black.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/komikask-webfont.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/komikask-webfont.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Regular.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Regular.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Bold.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo $template_url; ?>/assets/fonts/Rubik-Bold.woff" as="font" crossorigin>
<link rel="apple-touch-icon" href="<?php echo $template_url; ?>/assets/img/apple-icon.png">
<?php if ($args['zoom']): ?>
<link type="text/css" rel="stylesheet" href="https://source.zoom.us/<?php echo $args['zoomver']; ?>/css/bootstrap.css" />
<link type="text/css" rel="stylesheet" href="https://source.zoom.us/<?php echo $args['zoomver']; ?>/css/react-select.css" />
<?php endif; ?>
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

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7198773595231701" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DCFLSY9LC7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DCFLSY9LC7');
</script>

<?php wp_head(); ?>

<link href="<?php echo $template_url; ?>/style.css?ver=<?php echo _S_VERSION; ?>" rel="stylesheet">

</head>

<body class="guyra <?php echo implode(' ', $body_class); ?>">
<header>
  <nav id="guyra-navbar" class="navbar navbar-expand-lg d-none d-lg-flex navbar-light fixed-top">

    <div class="container-fluid">

      <div class="navbar-brand d-flex me-3">
        <a class="text-decoration-none" href="<?php echo $gi18n['home_link'] ?>">
          <span class="navbar-center-title">
            <img class="mb-1" alt="Guyra" src="<?php echo $gi18n['title_img']; ?>" />
          </span>
        </a>
      </div>

      <div class="justify-content-between collapse navbar-collapse" id="navbarCollapse">

        <ul class="navbar-nav">

          <li class="nav-item me-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link'] ?>"><?php echo $gi18n['homepage'] ?></a>
          </li>

          <?php if (!$is_logged_in): ?>

          <li class="nav-item me-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link'] ?>#jump-info"><?php echo $gi18n['info'] ?></a>
          </li>

          <li class="nav-item me-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link'] ?>#jump-prices"><?php echo $gi18n['prices'] ?></a>
          </li>

          <?php endif; ?>

        </ul>

        <ul class="navbar-nav justify-content-end nav-rightside">

          <?php if(!$is_logged_in) { ?>
          <li class="nav-item">
            <a class="btn-tall btn-sm green" href="<?php echo $gi18n['account_link']; ?>"><?php echo $gi18n['button_login'] ?></a>
          </li>
        <?php } else { ?>
          <li class="nav-item profile-item">
            <div class="dropdown m-0 d-inline">
              <a class="text-decoration-none d-flex" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="btn-tall btn-sm text-small text-primary me-2"><?php echo $current_user_data['first_name']; ?></span>
                <?php echo $profile_picture; ?>
              </a>
              <ul class="dropdown-menu pop-animation animate fast">
                <li>
                  <a class="dropdown-item" href="<?php echo $gi18n['account_link']; ?>">
                    <img class="page-icon tiny me-1" alt="sair" src="<?php echo $gi18n['template_link'] . '/assets/icons/profile_32.png'; ?>">
                    <?php echo $gi18n['button_myaccount'] ?>
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="<?php echo $gi18n['profile_link']; ?>">
                    <img class="page-icon tiny me-1" alt="sair" src="<?php echo $gi18n['template_link'] . '/assets/icons/clipboard_32.png'; ?>">
                    <?php echo $gi18n['profile'] ?>
                  </a>
                </li>
                <li>
                  <a id="logout-button" data-confirm="<?php echo $gi18n['logout_confirm'] ?>" class="dropdown-item text-danger" href="<?php echo $gi18n['logout_link']; ?>">
                    <img class="page-icon tiny me-1" alt="sair" src="<?php echo $gi18n['template_link'] . '/assets/icons/logout_32.png'; ?>">
                    <?php echo $gi18n['logout'] ?>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        <?php } ?>
        </ul>
      </div>

    </div>

  </nav>

  <nav class="navbar navbar-light fixed-bottom d-block d-lg-none">

    <div class="d-flex w-100 justify-content-evenly">

      <a class="btn-tall page-icon small <?php echo $homebtn_class; ?>" href="<?php echo $gi18n['home_link'] ?>">
        <img alt="home" src="<?php echo $gi18n['template_link'] . $home_icon; ?>">
        <span class="ms-1"><?php echo $gi18n['homepage'] ?></span>
      </a>

      <a class="btn-tall page-icon small <?php echo $profilebtn_class; ?>" href="<?php echo $gi18n['account_link']; ?>">
        <img alt="account" src="<?php echo $gi18n['template_link'] . '/assets/icons/profile.png'; ?>">
        <span class="ms-1"><?php echo $gi18n['account'] ?></span>
      </a>

    </div>

  </nav>
</header>

<?php Guyra_notepad(); ?>
