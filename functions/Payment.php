<?php

Guyra_Safeguard_File();

function CreateMPcURLObject($args=[]) {

  global $gSettings;

  $apiBaseUrl = 'https://api.mercadopago.com/preapproval';
  $url = $apiBaseUrl;
  $accessToken = $gSettings['mp_access_token'];
  $applicationId = $gSettings['mp_app_id'];

  if ($args['url'])
  $url = $apiBaseUrl . $args['url'];

  $MP_Headers = [
    'Content-Type:application/json',
    'Authorization: Bearer ' . $accessToken
  ];

  if ($args['deviceId'])
  $MP_Headers[] = 'X-meli-session-id: ' . $args['deviceId'];

  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $MP_Headers);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  if ($args['put'] === true)
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');

  if ($args['body'])
  curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($args['body']));

  return $ch;

}

function CheckMPSubscriptionByPayerId($id) {

  $ch = CreateMPcURLObject([
    'url' => '/search?status=authorized&payerId=' . $id
  ]);

  $response = curl_exec($ch);
  curl_close($ch);

  return $response;

}

function CheckSubscription($user_id=0) {

  global $current_user_payments;
  global $current_user_id;

  $active = false;

  if (!$user_id)
  $user_id = $current_user_id;

  if ($user_id == $current_user_id) {
    $user_payments = &$current_user_payments;
  } else {
    $user_payments = guyra_get_user_data($user_id, 'payment');
  }

  // Determine what payment method was used.

  // Case for MercadoPago (LATAM Market)
  if ($user_payments['processor_id'] == 'MP') {

    $processor_data = $user_payments['processor_data'];

    $MP_search_results = CheckMPSubscriptionByPayerId($processor_data['payer_id']);
    $MP_search_results = json_decode($MP_search_results, true);

    // Check if we have results.
    if ($MP_search_results && is_array($MP_search_results['results'])) {

      // Go through each result searching for an authorized payment.
      foreach ($MP_search_results['results'] as $MP_search_result) {

        if ( ($MP_search_result['id'] === $processor_data['id']) && ($MP_search_result['status'] == 'authorized') ) {
          $active  = true;
        }

      }

    }

  }

  // Case for Paypal (USA/Can Market)
  if ($user_payments['processor_id'] == 'PP') {
    // TODO: this
  }

  return $active;

}
