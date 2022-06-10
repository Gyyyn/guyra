<?php

Guyra_Safeguard_Access(['paid_users' => true]);

GetComponent('Header', ['css' => 'exercises.css']); ?>

<div id="exercise-container"></div>

<?php GetComponent('Footer', ['js' => 'exercises.js', 'react' => true]);
