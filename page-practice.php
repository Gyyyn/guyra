<?php

Guyra_Safeguard_Access($args['paid_users']);

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
