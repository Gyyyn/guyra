<?php

Guyra_Safeguard_Access(['paid_users' => true]);

get_header(null, ['css' => 'courses.css']);
?>

<div id="courses-container"></div>

<?php
get_footer(null, ['js' => 'courses.js', 'react' => true]);
