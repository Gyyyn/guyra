<?php

global $template_dir;
global $template_url;

Guyra_Safeguard_File();

function Guyra_message($args) {

  global $gSettings;

  $apiBaseUrl = 'https://graph.facebook.com/v17.0/206324309221106/messages';

  $url = $apiBaseUrl;
  $accessToken = $gSettings['fb_access_token'];

  if ($args['url'])
  $url = $apiBaseUrl . $args['url'];

  $Headers = [
    'Content-Type:application/json',
    'Authorization: Bearer ' . $accessToken
  ];

  $body = [
    'messaging_product' => 'whatsapp',
    'to' => $args['to']
  ];

  // TEMP: Test
  $body['type'] = 'template';
  $body['template'] = [
    'name' => 'hello_world',
      'language' => [
        'code' => 'en_US'
      ]
  ];

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $Headers);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  if ($args['put'] === true)
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');

  if ($args['body'])
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));

  return $ch;

}