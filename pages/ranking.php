<?php

Guyra_Safeguard_Access(['paid_users' => true]);

GetComponent('Header'); ?>

<main>

  <div id="ranking-container"></div>

</main>

<?php GetComponent('Footer', ['js' => 'Ranking.js', 'react' => true]);
