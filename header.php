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

$logged_in = is_user_logged_in();

if ($logged_in) {

  // Get a profile picture and user data
  $gravatar_image      = get_avatar_url(get_current_user_id(), $args = null);
  $profile_picture_url = get_user_meta(get_current_user_id(), 'user_registration_profile_pic_url', true);
  $profileimage        = ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : $gravatar_image;
  $first_name = get_user_meta(get_current_user_id(), 'first_name', true);
  $userdata = get_user_meta(get_current_user_id());

  // run a check for sub status
  $user_subscription = get_user_meta(get_current_user_id(), 'subscription')[0];
  $user_subscription_till = new DateTime(get_user_meta(get_current_user_id(), 'subscribed-until')[0]);
  $now = new DateTime();
  if($user_subscription != '' && $user_subscription_till < $now) {
    delete_user_meta(get_current_user_id(), 'subscription');
    delete_user_meta(get_current_user_id(), 'subscribed-until');
  }

  $body_class[] = 'logged_in';

}

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

if ($logged_in) {
  $home_icon = '/assets/icons/learning.png';
} else {
  $home_icon = '/assets/icons/exercises/house.png';
}


/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

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

<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/campton_black.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/campton_black.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/komikask-webfont.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/komikask-webfont.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/Rubik-Regular.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/Rubik-Regular.woff" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/Rubik-Bold.woff2" as="font" crossorigin>
<link rel="preload" href="<?php echo get_template_directory_uri(); ?>/assets/fonts/Rubik-Bold.woff" as="font" crossorigin>

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7198773595231701" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DCFLSY9LC7"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-DCFLSY9LC7');
</script>

<?php wp_head(); ?>

<link href="<?php echo get_template_directory_uri(); ?>/style.css" rel="stylesheet">

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
            <a class=" btn btn-sm btn-primary" href="<?php echo $gi18n['home_link'] ?>"><?php echo $gi18n['homepage'] ?></a>
          </li>

          <?php if (!$logged_in) { ?>

          <li class="nav-item me-md-3">
            <a class=" btn btn-sm btn-primary" href="<?php echo $gi18n['home_link'] ?>#jump-info"><?php echo $gi18n['info'] ?></a>
          </li>

          <li class="nav-item me-md-3">
            <a class=" btn btn-sm btn-primary" href="<?php echo $gi18n['home_link'] ?>#jump-prices"><?php echo $gi18n['prices'] ?></a>
          </li>

          <?php } ?>
          <li class="nav-item me-md-3">
            <a class=" btn btn-sm btn-primary" href="<?php echo $gi18n['blog_link'] ?>"><?php echo $gi18n['blog'] ?></a>
          </li>

          <?php if(false): ?>

          <li class="nav-item me-md-3 position-relative">
            <a class=" btn btn-sm btn-primary disabled" href="<?php echo $gi18n['meet_link'] ?>"><?php echo $gi18n['meet'] ?>
              <span class="position-absolute top-0 start-100 translate-middle badge bg-primary rounded-pill">Soon!</span>
            </a>
          </li>

          <?php endif; ?>

          <?php if ($userdata['role'][0] == "teacher" || current_user_can('manage_options')) : ?>
          <li class="nav-item me-md-3">
            <a class=" btn btn-sm btn-primary" href="<?php echo $gi18n['schools_link'] ?>"><?php echo $gi18n['schools'] ?></a>
          </li>

        <?php endif; ?>

        </ul>

        <ul class="navbar-nav justify-content-end nav-rightside">

          <li class="nav-item">
            <a href="https://wa.me/5519982576400" class="btn btn-sm btn-wa"><i class="bi bi-whatsapp"></i></a>
          </li>

          <i class="bi bi-slash-lg mx-3 text-muted"></i>

          <?php if(!$logged_in) { ?>
          <li class="nav-item bg-grey rounded px-3">
            <?php echo $gi18n['button_alreadyregistered'] ?>
            <a href="<?php echo get_site_url(); echo "/account"; ?>" class="btn btn-sm btn-primary border-0"><?php echo $gi18n['button_login'] ?></a>
          </li>
        <?php } else { ?>
          <li class="nav-item profile-item d-flex align-items-center justify-content-around">
            <div class="dropdown m-0 d-inline">
              <a class="dropdown-toggle text-decoration-none" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="text-primary me-2"><?php echo $first_name; ?></span>
                <img class="navbar-profile avatar" alt="profile-picture" src="<?php echo $profileimage; ?>">
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="<?php echo get_site_url(); echo "/account"; ?>">
                    <?php echo $gi18n['button_myaccount'] ?>
                    <img class="dropdown-icon" alt="sair" src="<?php echo $gi18n['template_link'] . '/assets/icons/profile_32.png'; ?>">
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="<?php echo get_site_url(); echo "/account/edit-profile"; ?>">
                    Perfil
                    <img class="dropdown-icon" alt="sair" src="<?php echo $gi18n['template_link'] . '/assets/icons/clipboard_32.png'; ?>">
                  </a>

                </li>
                <li>
                  <a class="dropdown-item text-danger" href="<?php echo get_site_url(); echo "/account/user-logout"; ?>">
                    Sair
                    <img class="dropdown-icon" alt="sair" src="<?php echo $gi18n['template_link'] . '/assets/icons/logout_32.png'; ?>">
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

      <a class="btn-tall page-icon <?php echo $homebtn_class; ?>" href="<?php echo $gi18n['home_link'] ?>">
        <img alt="home" src="<?php echo $gi18n['template_link'] . $home_icon; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['homepage'] ?></span>
      </a>

      <a class="btn-tall page-icon <?php echo $blogbtn_class; ?>" href="<?php echo $gi18n['blog_link'] ?>">
        <img alt="blog" src="<?php echo $gi18n['template_link'] . '/assets/icons/advertising.png'; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['blog'] ?></span>
      </a>

      <?php if ($userdata['role'][0] == "teacher" || current_user_can('manage_options')) : ?>
      <a class="btn-tall page-icon <?php echo $schoolsbtn_class; ?>" href="<?php echo $gi18n['schools_link'] ?>">
        <img alt="schools" src="<?php echo $gi18n['template_link'] . '/assets/icons/exercises/search.png'; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['schools'] ?></span>
      </a>
      <?php endif; ?>

      <a class="btn-tall page-icon <?php echo $profilebtn_class; ?>" href="<?php echo get_site_url(); echo "/account"; ?>">
        <img alt="account" src="<?php echo $gi18n['template_link'] . '/assets/icons/profile.png'; ?>">
        <span class="d-none d-md-inline d-lg-none"><?php echo $gi18n['button_myaccount'] ?></span>
      </a>

    </div>

  </nav>
</header>
