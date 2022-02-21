<?php

Guyra_Safeguard_Access(['paid_users' => true]);

get_header();
?>

<main>

  <div id="ranking-container"></div>

</main>
<?php
get_footer(null, ['js' => 'Ranking.js', 'react' => true]);
