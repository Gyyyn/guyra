<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;
global $gi18n;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

get_header();
?>

<main id="intro-content" class="site-main page">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

  </div>

  <div id="exercise-container"></div>

</main>
<?php
get_footer(null, ['js' => 'exercises.js', 'react' => true]);
