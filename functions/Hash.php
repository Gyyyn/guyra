<?php

function generateRandomString($length = 10) {
  return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
}

function Guyra_hash($string, $decode=false) {

  $secret = 'aryug';

  if ($decode) {

    return str_replace($secret, "", hex2bin($string));

  } else {

    $stringAndSecret = $string . $secret;
    return bin2hex($stringAndSecret);

  }
}

function verifyGoogleCaptcha($token) {
    try {

        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = ['secret'   => '6LftVY4dAAAAAIOmDqYvcUq6mIOoDhJAleDWPbVW',
                 'response' => $token,
                 'remoteip' => $_SERVER['REMOTE_ADDR']];

        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            ]
        ];

        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        return json_decode($result)->success;
    }
    catch (Exception $e) {
        return null;
    }
}
