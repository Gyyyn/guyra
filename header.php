<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package guyra
 */

global $wp;
global $template_dir;
global $template_url;
global $current_user_id;

$logged_in = is_user_logged_in();
$body_class[0] = 'logged_out';

/* Set up translations independent of Wordpress */
include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_template_components.php';

if ($logged_in):

// Get a profile picture and user data
$profile_picture = Guyra_get_profile_picture($current_user_id, 'navbar-profile');
$first_name = get_user_meta($current_user_id, 'first_name', true);
$userdata = get_user_meta($current_user_id);

// run a check for sub status
$user_subscription = guyra_get_user_meta($current_user_id, 'subscription', true)['meta_value'];
$user_subscription_till = new DateTime(guyra_get_user_meta($current_user_id, 'subscribed_until', true)['meta_value']);
$now = new DateTime();
if($user_subscription != '' && $user_subscription_till < $now) {
  guyra_update_user_meta($current_user_id, 'subscription', '');
}

$body_class[0] = 'logged_in';

endif; // logged in

$where_am_i = $wp->request;
$highlight_class = 'purple';

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
}

if ($where_am_i == 'account') {
  $profilebtn_class = $highlight_class;
  $body_class[] = 'profile';
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

if ($logged_in) {
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

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
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
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<link href="<?php echo $template_url; ?>/style.css" rel="stylesheet">

</head>

<body class="guyra <?php echo implode(' ', $body_class); ?>">
<header>
  <nav id="guyra-navbar" class="navbar navbar-expand-lg d-none d-lg-flex navbar-light fixed-top">

    <div class="container-fluid">

      <div class="navbar-brand d-flex">
        <a class="text-decoration-none" href="<?php echo $gi18n['home_link'] ?>">
          <span class="navbar-center-title">
            <img class="mb-1" alt="Guyra" src="<?php echo $gi18n['title_img']; ?>" />
          </span>
          <i class="bi bi-slash-lg mx-3 text-muted"></i>
        </a>
      </div>

      <div class="justify-content-between collapse navbar-collapse" id="navbarCollapse">

        <ul class="navbar-nav">

          <li class="nav-item me-md-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link'] ?>"><?php echo $gi18n['homepage'] ?></a>
          </li>

          <?php if (!$logged_in) { ?>

          <li class="nav-item me-md-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link'] ?>#jump-info"><?php echo $gi18n['info'] ?></a>
          </li>

          <li class="nav-item me-md-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['home_link'] ?>#jump-prices"><?php echo $gi18n['prices'] ?></a>
          </li>

          <?php } ?>
          <li class="nav-item me-md-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['blog_link'] ?>"><?php echo $gi18n['blog'] ?></a>
          </li>

          <?php if(false): ?>

          <li class="nav-item me-md-3 position-relative">
            <a class="btn-tall btn-sm blue disabled" href="<?php echo $gi18n['meet_link'] ?>"><?php echo $gi18n['meet'] ?>
              <span class="position-absolute top-0 start-100 translate-middle badge bg-primary rounded-pill">Soon!</span>
            </a>
          </li>

          <?php endif; ?>

          <?php if ($userdata['role'][0] == "teacher" || current_user_can('manage_options')) : ?>
          <li class="nav-item me-md-3">
            <a class="btn-tall btn-sm blue" href="<?php echo $gi18n['schools_link'] ?>"><?php echo $gi18n['schools'] ?></a>
          </li>

        <?php endif; ?>

        </ul>

        <ul class="navbar-nav justify-content-end nav-rightside">

          <li class="nav-item">
            <a href="https://wa.me/5519982576400" class="btn-tall btn-sm btn-wa"><i class="bi bi-whatsapp"></i></a>
          </li>

          <i class="bi bi-slash-lg mx-3 text-muted"></i>

          <?php if(!$logged_in) { ?>
          <li class="nav-item">
            <a class="btn-tall btn-sm green" href="<?php echo $gi18n['account_link']; ?>"><?php echo $gi18n['button_login'] ?></a>
          </li>
        <?php } else { ?>
          <li class="nav-item profile-item">
            <div class="dropdown m-0 d-inline">
              <a class="text-decoration-none d-flex" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="btn-tall btn-sm text-small text-primary me-2"><?php echo $first_name; ?></span>
                <?php echo $profile_picture; ?>
              </a>
              <ul class="dropdown-menu">
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
                  <a id="logout-button" data-confirm="<?php echo $gi18n['logout_confirm'] ?>" class="dropdown-item text-danger" href="<?php echo wp_nonce_url($gi18n['logout_link'], 'user-logout'); ?>">
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

    <div class="d-flex w-100 justify-content-around">

      <a class="btn-tall page-icon small <?php echo $homebtn_class; ?>" href="<?php echo $gi18n['home_link'] ?>">
        <img alt="home" src="<?php echo $gi18n['template_link'] . $home_icon; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['homepage'] ?></span>
      </a>

      <a class="btn-tall page-icon small <?php echo $blogbtn_class; ?>" href="<?php echo $gi18n['blog_link'] ?>">
        <img alt="blog" src="<?php echo $gi18n['template_link'] . '/assets/icons/advertising.png'; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['blog'] ?></span>
      </a>

      <?php if ($userdata['role'][0] == "teacher" || current_user_can('manage_options')) : ?>
      <a class="btn-tall page-icon small <?php echo $schoolsbtn_class; ?>" href="<?php echo $gi18n['schools_link'] ?>">
        <img alt="schools" src="<?php echo $gi18n['template_link'] . '/assets/icons/textbook.png'; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['schools'] ?></span>
      </a>
      <?php endif; ?>

      <a class="btn-tall page-icon small <?php echo $profilebtn_class; ?>" href="<?php echo $gi18n['account_link']; ?>">
        <img alt="account" src="<?php echo $gi18n['template_link'] . '/assets/icons/profile.png'; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['button_myaccount'] ?></span>
      </a>

    </div>

  </nav>
</header>

<?php Guyra_notepad(); ?>
