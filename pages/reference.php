<?php

Guyra_Safeguard_Access(['paid_users' => true]);

GetComponent('Header', ['css' => 'reference.css']); ?>

<div id="reference-container"></div>

<?php GetComponent('Footer', ['js' => 'reference.js', 'react' => true, 'recaptcha' => true]);
