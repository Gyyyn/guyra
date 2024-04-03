<?php


global $secondsForA;
global $template_dir;
global $current_user_object;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Database.php';
include_once $template_dir . '/functions/Mailer.php';

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

function CheckMPSubscriptionById($id) {

  $ch = CreateMPcURLObject([
    'url' => '/search?status=authorized&id=' . $id
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

    $MP_search_results = CheckMPSubscriptionById($processor_data['id']);
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

  // Case for Paypal (NA/EU Market) SoonTM
  // if ($user_payments['processor_id'] == 'PP') {
  // }

  return $active;

}


function IsSubscriptionValid($user_id, $data=false) {

  global $secondsForA;
  global $current_user_payments;
  global $current_user_id;
  global $gi18n;

  if (is_array($data)) {
    
    $user_payments = $data['payment'];
    $user_diary = $data['diary'];

  } else {
    
    $user_payments = guyra_get_user_data($user_id, 'payment');
    $user_diary = guyra_get_user_data($user_id, 'diary');

  }

  $return = false;

  // Allow payed users to access the site.
  if ($user_payments['status'] == 'approved') {

    $return = true;

    if ($user_payments['payed_for'] == 'premium' && $user_id == $current_user_id)
    $current_user_payments['feature_set'] = 'premium';

  }
  
  // Allow payment through direct payment
  if (is_array($user_diary) && $user_diary['payments']) {

    $latest_item = end($user_diary['payments']);
    $secondtolast_item = prev($user_diary['payments']);

    if ($latest_item['status'] != 'ok' && $secondtolast_item['status'] == 'ok')
    $latest_item = $secondtolast_item;

    $latest_item_due_unix = strtotime($latest_item['due']);
    $payment_grace_period = $latest_item_due_unix + ($secondsForA['day'] * 40) > time();

    // Allow if the latest oked payment is less than a month ago.
    if ( $latest_item['status'] == 'ok' && $payment_grace_period ) {

      $return = true;
      
      // Allow direct payments to be 'premium'
      if ($user_id == $current_user_id)
      $current_user_payments['feature_set'] = 'premium';

    }
    

  }

  return $return;

}

function GetMPPaymentStatus($payment_id) {

  global $gSettings;
  
  require_once 'vendor/autoload.php';

  MercadoPago\SDK::setAccessToken($gSettings['mp_access_token']);

  $payment = MercadoPago\Payment::find_by_id($payment_id);

  return $payment->status;

}

function UpdateDirectPaymentsStatus() {
  
  global $current_user_id;
  global $current_user_diary;
  global $current_user_data;
  global $secondsForA;
  global $gi18n;

  $updateNeeded = false;

  foreach ($current_user_diary['payments'] as &$payment_item) {

    // Check and update payments through a payment processor
    if ($payment_item['status'] == 'pending' && $payment_item['id']) {

      $newStatus = GetMPPaymentStatus($payment_item['id']);

      if ($newStatus !== $payment_item['status']) {

        if ($newStatus == 'approved') {
          $payment_item['status'] = 'ok';
        } else {
          $payment_item['status'] = 'pending';
          $payment_item['response'] = $newStatus;
        }
        
        $updateNeeded = true;

      }

    }

  }

  $latest_payment_item = end($current_user_diary['payments']);

  // Check and create new bills for direct payment
  if ($latest_payment_item['status'] == 'ok') {

    $item_due_unix = strtotime($latest_payment_item['due']);
    $item_due_date = date('Y-m-d', $item_due_unix + $secondsForA['month']);

    if ($item_due_unix < time()) {

      $newBill = [
        'value' => $latest_payment_item['value'],
        'status' => 'pending',
        'due' => $item_due_date
      ];
      
      array_push($current_user_diary['payments'], $newBill);

      $updateNeeded = true;

      $mail_strings = [
        $gi18n['bill_arived'],
        $item_due_date,
        $latest_payment_item['value']
      ];

      Guyra_mail('bill_generated.html', $gi18n['bill_arived'], $current_user_data['user_email'], $mail_strings);

    }

  }

  if ($updateNeeded)
  guyra_update_user_data($current_user_id, $current_user_diary, null, 'diary');

}