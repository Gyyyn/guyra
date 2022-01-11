<?php

global $template_dir;
global $template_url;
global $site_url;
global $site_api_url;
global $is_logged_in;

Guyra_Safeguard_File();

require_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/functions/Mailer.php';
include_once $template_dir . '/functions/User.php';

if ($_GET['i18n'] == 'full') {

  global $gi18n;

  guyra_output_json(['i18n' => $gi18n], true);

}

if ($_GET['get_user_data']) {

  $theData['is_logged_in'] = false;

  guyra_output_json(json_encode($theData), true);

}

if ($_GET['register']) {

  global $gi18n;

  $data = json_decode(file_get_contents('php://input'), true);

  $captchaOk = verifyGoogleCaptcha($data['captcha']);

  if (!$captchaOk) {
    guyra_output_json($gi18n['captcha_error'], true);
  }

  $creds = [
    'user_login' => $data['user_firstname'] . generateRandomString(),
    'user_email' => $data['user_email'],
    'user_pass' => $data['user_password'],
    'first_name' => $data['user_firstname'],
    'last_name' => $data['user_lastname']
  ];

    $user = wp_insert_user($creds);

    if (is_wp_error($user)) {
      guyra_output_json($user->get_error_message(), true);
    } else {

      guyra_update_user_meta($user, 'userdata', json_encode([
        'user_email' => $data['user_email'],
        'mail_confirmed' => 'false',
        'profile_picture_url' => '',
        'first_name' => $data['user_firstname'],
        'last_name' => $data['user_lastname'],
        'role' => '',
        'user_registered' => date('Y-m-d H:i:s'),
        'user_payment_method' => '',
        'user_subscription' => '',
        'user_subscription_since' => '',
        'user_subscription_expires' => '',
        'teacherid' => '',
        'studygroup' => '',
        'user_meetinglink' => ''
      ], JSON_UNESCAPED_UNICODE));

      $creds = [
        'user_login'    => $data['user_email'],
        'user_password' => $data['user_password'],
        'remember'      => true
      ];

      Guyra_Login_User($creds, false);

      guyra_output_json('true', true);

    }
}

if ($_GET['login']) {

  $data = json_decode(file_get_contents('php://input'), true);

  $creds = array(
    'user_login'    => $data['user_email'],
    'user_password' => $data['user_password'],
    'remember'      => true
  );

  $user = Guyra_Login_User($creds, false);

  if (is_wp_error($user)) {
    guyra_output_json($user->get_error_message(), true);
  } else {
    guyra_output_json('true', true);
  }
}
