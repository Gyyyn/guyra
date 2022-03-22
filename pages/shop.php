<?php

Guyra_Safeguard_Access();

get_header(null, ['css' => 'shop.css']);
?>

<main id="intro-content" class="site-main page">

  <div id="shop-container"></div>

</main>
<?php
get_footer(null, ['js' => 'shop.js', 'react' => true]);
