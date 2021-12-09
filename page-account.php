<?php

global $is_logged_in;

nocache_headers();

get_header(null, ['css' => 'account.css']);
?>

<div id="account-container"></div>

<?php

$getRecaptcha = $is_logged_in ? false : true;
get_footer(null, ['react' => true, 'js' => 'account.js', 'recaptcha' => $getRecaptcha]);
