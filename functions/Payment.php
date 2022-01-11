<?php

Guyra_Safeguard_File();

function CreateMPcURLObject($args=[]) {

  global $gSettings;

  $apiBaseUrl = 'https://api.mercadopago.com/preapproval';
  $url = $apiBaseUrl;
  $accessToken = $gSettings['mp_access_token'];
  $applicationId = $gSettings['mp_app_id'];

  if ($args['url']) {
    $url = $apiBaseUrl . $args['url'];
  }

  $MP_Headers = array(
    'Content-Type:application/json',
    'Authorization: Bearer ' . $accessToken,
    'X-meli-session-id: ' . $args['deviceId']
  );

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $MP_Headers);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  if ($args['put'] === true) {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
  }
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($args['body']));

  return $ch;

  curl_close($ch);

}
