<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

// Sanity check, unlogged users shouldn't be here
if (!is_user_logged_in()) {
 wp_redirect(get_site_url());
}

get_header();

/* Set up translations independent of Wordpress (note: not currently needed) */
/* include get_template_directory() . '/i18n.php'; */
?>

<main id="intro-content" class="site-main page schools bg-white">

  <div class="squeeze pt-3">

    <?php include 'Guyra_schools.php'; ?>

  </div>

</main>
<?php
get_footer(null, ['aos' => true]);
