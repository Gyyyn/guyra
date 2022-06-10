<?php

Guyra_Safeguard_Access();

GetComponent('Header', ['css' => 'shop.css']); ?>

<main id="intro-content" class="site-main page">

  <div id="shop-container"></div>

</main>

<?php GetComponent('Footer', ['js' => 'shop.js', 'react' => true]);
