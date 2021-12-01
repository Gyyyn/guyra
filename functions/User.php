<?php

function Guyra_Login_User($creds) {
  $user = wp_signon($creds, true);

  return $user;
}
