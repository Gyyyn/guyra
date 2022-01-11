<?php
/**
 * Courses page. Interprets some data on the courses.json file and passes it to the React frontend.
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;

Guyra_Safeguard_Access();

get_header(null, ['css' => 'courses.css']);
?>

<main id="intro-content" class="site-main page squeeze">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

  </div>

  <div class="page-squeeze rounded-box p-0 position-relative">

    <div id="courses-container"></div>

  </div>

</main>

<?php
get_footer(null, ['js' => 'courses.js', 'react' => true]);
