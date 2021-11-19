<?php

function Guyra_hash($string, $decode=false) {

  $secret = 'aryug';

  if ($decode) {

    return str_replace($secret, "", hex2bin($string));

  } else {

    $stringAndSecret = $string . $secret;
    return bin2hex($stringAndSecret);

  }
}
