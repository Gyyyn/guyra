<?php

Guyra_Safeguard_Access();

GetComponent('Header'); ?>

<div id="user-home"></div>

<?php GetComponent('Footer', ['js' => 'study.js', 'easymde' => true, 'react' => true]);
