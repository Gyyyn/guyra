<?php

function Guyra_Redirect($location, $exit=true) {

  header("Location: $location", true);

  if ($exit) {
    exit;
  }

}

// Blocks guest user access
function Guyra_Safeguard_Access() {

  global $site_url;
  global $is_logged_in;

  if (!$is_logged_in) { Guyra_Redirect($site_url); }

}

function Guyra_Safeguard_File() {

  if (!defined('GUYRA_VERSION')) {
    exit;
  }

  if ($_SERVER['REQUEST_URI'] == '/wp-content/themes/guyra/functions.php') {
    exit;
  }

}
