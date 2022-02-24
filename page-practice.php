<?php

Guyra_Safeguard_Access(['paid_users' => true]);

get_header(null, ['css' => 'exercises.css']);
?>

<div id="exercise-container"></div>

<?php
get_footer(null, ['js' => 'exercises.js', 'react' => true]);
