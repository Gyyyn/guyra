<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

get_header(null, ['css' => 'schools.css']);

?>

<main id="intro-content" class="site-main page schools bg-white">

  <div class="squeeze-big pt-3">

    <?php include $template_dir . '/Guyra_schools.php'; ?>

  </div>

</main>
<?php
get_footer(null, ['react' => true, 'js' => 'schools.js']);
