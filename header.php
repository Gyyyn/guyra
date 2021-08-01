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

<?php if (!current_user_can('manage_options')) { ?>
<style type="text/css">#wpadminbar { display: none }</style>
<?php } ?>

<link rel='stylesheet' id='bootstrap-css'  href='<?php echo get_template_directory_uri(); ?>/assets/dist/css/bootstrap.min.css' media='all' />
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

<?php wp_head(); ?>

</head>

<body <?php body_class('patterned-bg sparse'); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">
<header>
  <nav class="navbar navbar-expand-md navbar-light fixed-top m-0 p-0" <?php if(is_admin_bar_showing() && current_user_can('manage_options')) {?> style="margin-top:32px!important;"<?php } ?>>
    <div class="container">
      <div class="navbar-brand me-3 p-0 position-relative" href="#">
      	<?php echo get_custom_logo(); ?>
        <span class="navbar-center-title"><img src="<?php echo get_template_directory_uri(); ?>/assets/img/guyra-title.png" /></span>
      </div>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0 ms-0">

          <?php if (!is_user_logged_in()) { ?>
          <li class="nav-item me-3">
            <a class=" btn btn-sm btn-outline-primary" href="#jump-info"><?php echo $gi18n['info'] ?></a>
          </li>
          <li class="nav-item me-3">
            <a class=" btn btn-sm btn-primary text-white" href="#jump-prices"><?php echo $gi18n['prices'] ?></a>
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
            <img class="navbar-profile ms-2" alt="profile-picture" src="<?php echo get_template_directory_uri(); ?>/assets/icons/profile.png">
          </li>
        <?php } else { ?>
          <li class="nav-item me-3">
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
    </div>
  </nav>
</header>
