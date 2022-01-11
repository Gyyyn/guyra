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
global $current_user_subscription_valid;

Guyra_Safeguard_Access();
if (!$current_user_subscription_valid) { Guyra_Redirect($gi18n['purchase_link']); exit; }

get_header(null, ['css' => 'exercises.css']);
?>

<main id="intro-content" class="site-main page">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

  </div>

  <div id="exercise-container"></div>

</main>
<?php
get_footer(null, ['js' => 'exercises.js', 'react' => true]);
