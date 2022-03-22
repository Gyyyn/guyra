<?php

Guyra_Safeguard_Access(['paid_users' => true]);

get_header(null, ['css' => 'reference.css']);
?>

<div id="reference-container"></div>

<?php
get_footer(null, ['js' => 'reference.js', 'react' => true]);
