<?php

global $template_dir;
global $site_url;
global $is_logged_in;

Guyra_Safeguard_Access();

get_header();
?>

<main id="intro-content" class="site-main page squeeze">

  <div class="page-squeeze rounded-box position-relative">

    <div id="help-container"></div>

  </div>

</main>

<?php
get_footer(null, ['js' => 'Help.js', 'react' => true]);
