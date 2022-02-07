<?php

Guyra_Safeguard_Access(['paid_users' => true]);

get_header();
?>

<main id="intro-content" class="site-main page">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

  </div>

  <div id="ranking-container"></div>

</main>
<?php
get_footer(null, ['js' => 'Ranking.js', 'react' => true]);
