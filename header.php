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

/* Get a profile picture */
$gravatar_image      = get_avatar_url( get_current_user_id(), $args = null );
$profile_picture_url = get_user_meta( get_current_user_id(), 'user_registration_profile_pic_url', true );
$profileimage        = ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : $gravatar_image;

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

// run a check for sub status
$user_subscription = get_user_meta(get_current_user_id(), 'subscription')[0];
$user_subscription_till = new DateTime(get_user_meta(get_current_user_id(), 'subscribed-until')[0]);
$now = new DateTime();
if($user_subscription != '' && $user_subscription_till < $now) {
  delete_user_meta(get_current_user_id(), 'subscription');
  delete_user_meta(get_current_user_id(), 'subscribed-until');
}

?>
<!-- Hello :) -->
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#00d4ff"/>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

<?php wp_head(); ?>

</head>

<body <?php body_class('patterned-bg sparse'); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
<header>
  <nav class="navbar navbar-expand-md navbar-light fixed-top m-0 p-0">
    <div class="container"><div>
      <div class="navbar-brand hover-pop me-3 p-0 position-relative" href="#"><a class="text-decoration-none" href="<?php echo $gi18n['home_link'] ?>">
      	<img alt="Guyra bird" src="<?php echo get_template_directory_uri(); ?>/assets/img/birdlogo_ver1-smaller.png" />
        <span class="navbar-center-title"><img alt="Guyra" src="<?php echo get_template_directory_uri(); ?>/assets/img/guyra-title-smaller.png" /></span>
      </a></div>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse p-3 bg-white rounded" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0 ms-0">

          <?php if (!is_user_logged_in()) { ?>
          <li class="nav-item me-3">
            <a class=" btn btn-sm btn-outline-primary" href="<?php echo $gi18n['home_link'] ?>#jump-info"><?php echo $gi18n['info'] ?></a>
          </li>
          <li class="nav-item me-3">
            <a class=" btn btn-sm btn-primary text-white" href="<?php echo $gi18n['home_link'] ?>#jump-prices"><?php echo $gi18n['prices'] ?></a>
          </li>
          <span class="me-3 p-0 vertical-divider"></span>
          <?php } ?>
          <li class="nav-item me-3">
            <a class=" btn btn-sm btn-primary" href="<?php echo $gi18n['home_link'] ?>"><?php echo $gi18n['homepage'] ?></a>
          </li>
          <li class="nav-item me-3">
            <a class=" btn btn-sm btn-outline-primary" href="<?php echo $gi18n['blog_link'] ?>"><?php echo $gi18n['blog'] ?></a>
          </li>
          <li class="nav-item me-3 position-relative">
            <a class=" btn btn-sm btn-outline-primary disabled" href="<?php echo $gi18n['meet_link'] ?>"><?php echo $gi18n['meet'] ?>
              <span class="position-absolute top-0 start-100 translate-middle badge bg-primary rounded-pill">Soon!</span>
            </a>
          </li>
        </ul>
        <ul class="navbar-nav collapse navbar-collapse justify-content-end nav-rightside" id="navbarCollapse">
          <li class="nav-item me-3">
            <a href="https://wa.me/5519982576400" class="btn btn-sm btn-wa"><span class="dashicons dashicons-whatsapp"></span> WhatsApp</a>
          </li>
          <?php if(!is_user_logged_in()) { ?>
          <li class="nav-item my-auto me-3"><?php echo $gi18n['button_alreadyregistered'] ?></li>
          <li class="nav-item me-3">
            <a href="<?php echo get_site_url(); echo "/account"; ?>" class=" btn btn-sm btn-outline-primary"><?php echo $gi18n['button_login'] ?></a>
          </li>
        <?php } else { ?>
          <li class="nav-item me-3 profile-item">
            <a href="<?php echo get_site_url(); echo "/account"; ?>" class=" btn btn-sm btn-primary"><?php echo $gi18n['button_myaccount'] ?></a>
            <div class="dropstart m-0 d-inline">
              <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><img class="navbar-profile" alt="profile-picture" src="<?php echo $profileimage; ?>"></a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="<?php echo get_site_url(); echo "/account/edit-profile"; ?>">Perfil</a></li>
                <li><a class="dropdown-item text-danger" href="<?php echo get_site_url(); echo "/account/user-logout"; ?>">Sair</a></li>
              </ul>
            </div>
          </li>
        <?php } ?>
        </ul>
      </div>
    </div></div>
  </nav>
</header>
