<?php

global $current_user_id;
global $current_user_data;
global $current_user_diary;
global $gSettings;
global $template_dir;

Guyra_Safeguard_File();

include_once $template_dir . '/functions/Database.php';

if ($_GET['add_course']) {

  // TODO: Make this actually check if the course exists, and maybe more robust security

  $id = $_GET['add_course'];
  $key = $_GET['key'];

  if ($key != 'guyra')
  guyra_output_json(['error' => 'wrong key'], true);

  $current_user_data['courses'][$id]['owned'] = true;

  guyra_update_user_data($current_user_id, $current_user_data, '');
  
}

if ($_GET['gen_pix']) {

  // Attention: this function assumes that the user is generating
  // a payment for themself, so it updates $current_user_diary.
  $thePost = json_decode(file_get_contents('php://input'), true);

  if (!$thePost || !$thePost['value'] || !$thePost['user'])
  guyra_output_json('post error', true);

  if($current_user_data['payment_processor']):

  require_once 'vendor/autoload.php';

  MercadoPago\SDK::setAccessToken($gSettings['mp_access_token']);

  $payment = new MercadoPago\Payment();
  $payment->transaction_amount = $thePost['value'];
  $payment->description = $gi18n['prices_features']['premium']['title'];
  $payment->payment_method_id = "pix";
  $payment->payer = array(
      "email" => $thePost['user']['user_email'],
      "first_name" => $thePost['user']['first_name'],
      "last_name" => $thePost['user']['last_name'],
      "identification" => array(
          "type" => "CPF",
          "number" => $thePost['user']['doc_id']
      ),
    );

  $payment->save();

  if ($thePost['offset']) {
    // Update the payment item with the newly adquired ID.
    $current_user_diary['payments'][$thePost['offset']]['id'] = $payment->id;
    $current_user_diary['payments'][$thePost['offset']]['status'] = $payment->status;

    guyra_update_user_data($current_user_id, $current_user_diary, null, 'diary');
  }

  guyra_output_json([
    'qr_code' => $payment->point_of_interaction->transaction_data->qr_code,
    'qr_code_base64' => $payment->point_of_interaction->transaction_data->qr_code_base64,
    'ticket_url' => $payment->point_of_interaction->transaction_data->ticket_url,
    'status' => $payment->status,
    'id' => $payment->id
  ], true);

  endif;

  // If there is no paymento processor, just give a simple qrCode.

  guyra_output_json([
    'qr_code' => '00020126330014BR.GOV.BCB.PIX0111490419238965204000053039865802BR5925GABRIEL HENRIQUE FRANZONI6009SAO PAULO6226052248kqmCKfToGwUCBlxMcAos6304FC92',
    'qr_code_base64' => file_get_contents($template_dir . '/assets/img/payment_qrcode.b64'),
    'ticket_url' => '',
    'status' => '',
    'id' => 0
  ], true);

}


if ($_GET['update_payment']) {

  // If we don't have payment proof stop here.
  $data = json_decode(file_get_contents('php://input'), true);
  if (!$data)
  guyra_output_json(['error' => 'no payment proof'], true);
  
  end($current_user_diary['payments']);
  $latest_payment_item = &$current_user_diary['payments'][key($current_user_diary['payments'])];
  

  // If the latest item isn't pending we need manual intervention for now.
  if ($latest_payment_item['status'] == 'pending') {

    $latest_payment_item['payment_proof'] = $data['paymentProof'];
    $latest_payment_item['status'] = 'ok';
    $latest_payment_item['payed_on'] = GetStandardDate();

  }

  guyra_update_user_data($current_user_id, $current_user_diary, null, 'diary');
  
}