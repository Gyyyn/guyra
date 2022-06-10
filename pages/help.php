<?php

Guyra_Safeguard_Access();

GetComponent('Header'); ?>

<main id="intro-content" class="site-main page squeeze">

  <div class="page-squeeze rounded-box position-relative">

    <div id="help-container"></div>

  </div>

</main>

<?php GetComponent('Footer', ['js' => 'Help.js', 'react' => true]);
