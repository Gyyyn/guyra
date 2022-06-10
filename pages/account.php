<?php

global $is_logged_in;

GetComponent('Header', ['css' => 'account.css']); ?>

<div id="account-container"></div>

<?php

$getRecaptcha = $is_logged_in ? false : true;

GetComponent('Footer', [
  'react' => true,
  'js' => 'account.js',
  'MercadoPago' => true,
  'recaptcha' => $getRecaptcha,
  'OAuth' => true
]);
