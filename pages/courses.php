<?php

Guyra_Safeguard_Access(['paid_users' => true]);

GetComponent('Header', ['css' => 'courses.css']);
?>

<div id="courses-container"></div>

<?php
GetComponent('Footer', ['js' => 'courses.js', 'react' => true]);
