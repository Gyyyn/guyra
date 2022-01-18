<?php

function Guyra_Redirect($location, $exit=true) {

  header("Location: $location", true);

  if ($exit) {
    exit;
  }

}

// Blocks guest user access
function Guyra_Safeguard_Access($args=[]) {

  global $site_url;
  global $gi18n;
  global $is_logged_in;
  global $current_user_subscription_valid;

  if (!$is_logged_in)
  Guyra_Redirect($site_url);

  if ($args['paid_users'] && !$current_user_subscription_valid)
  Guyra_Redirect($gi18n['purchase_link']);

}

function Guyra_Safeguard_File() {

  if (!defined('GUYRA_VERSION')) {
    exit;
  }

  if ($_SERVER['REQUEST_URI'] == '/wp-content/themes/guyra/functions.php') {
    exit;
  }

}
