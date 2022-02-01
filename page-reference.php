<?php

global $template_dir;
global $site_url;
global $is_logged_in;
global $gi18n;

Guyra_Safeguard_Access(['paid_users' => true]);

get_header(null, ['css' => 'reference.css']);
?>

<main id="intro-content" class="site-main study squeeze">

  <div class="page-squeeze"><div id="reference-container"></div></div>

</main>
<?php
get_footer(null, ['js' => 'reference.js', 'react' => true]);
