<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

get_header();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

<main id="intro-content" class="site-main page schools bg-white">

  <div class="squeeze pt-3">

    <?php include 'Guyra_schools.php'; ?>

  </div>

</main>
<?php
get_footer();
