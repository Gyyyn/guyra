<?php

global $template_dir;
global $template_url;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;

Guyra_Safeguard_File();

$user = $_GET['user'];

require_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/functions/Mailer.php';
include_once $template_dir . '/functions/User.php';

if ($_GET['i18n'] == 'full')
guyra_output_json($gi18n, true);

if ($_GET['get_user_data']) {

  $theData['is_logged_in'] = false;

  guyra_output_json(json_encode($theData), true);

}

if ($_GET['register']) {

  $data = json_decode(file_get_contents('php://input'), true);

  $captchaOk = verifyGoogleCaptcha($data['captcha']);

  if (!$captchaOk) {
    guyra_output_json('captcha_error', true);
  }

  // All is ok, let's generate a user id and populate the data.
  $user = guyra_create_user($data['user_email']);

  // Stop if anything went wrong.
  if ($user['error']) {
    guyra_output_json($user['error'], true);
  }

  $creds = [
    'user_login'    => $data['user_email'],
    'user_password' => $data['user_password']
  ];

  guyra_update_user_meta($user, 'userdata', json_encode([
    'user_email' => $data['user_email'],
    'mail_confirmed' => 'false',
    'profile_picture_url' => '',
    'first_name' => $data['user_firstname'],
    'last_name' => $data['user_lastname'],
    'role' => '',
    'user_registered' => date('Y-m-d H:i:s'),
    'teacherid' => '',
    'studygroup' => '',
    'user_meetinglink' => ''
  ], JSON_UNESCAPED_UNICODE));

  guyra_update_user_meta($user, 'user_pass', password_hash($data['user_password'], PASSWORD_DEFAULT));
  PushNotification($gi18n['notification_welcome'], $user);

  Guyra_Login_User($creds, false);

  $bytes = Guyra_GenNonce([
    'user' => $user,
    'id' => 'confirm_mail'
  ]);

  $link = $site_api_url . '?update_userdata=1&user=' . $user . '&action=confirm_mail&nonce=' . $bytes;

  $string_replacements = [
    $link,
    $link
  ];

  $mail = Guyra_mail('welcome.html', $gi18n['notification_welcome']['title'], $data['user_email'], $string_replacements);

}

if ($_GET['login']) {

  $data = json_decode(file_get_contents('php://input'), true);

  $creds = array(
    'user_login'    => $data['user_email'],
    'user_password' => $data['user_password']
  );

  $user = Guyra_Login_User($creds, false);

  if ($user['error']) {
    guyra_output_json($user['error'], true);
  }

}

if ($_GET['lost_password']) {

  $nonce = $_GET['nonce'];

  if ($nonce) {

    $nonce_pass = Guyra_CheckNonce([
      'user' => $user,
      'id' => 'lost_password',
      'nonce' => $nonce
    ]);

    if ($nonce_pass) {

      $new_password = bin2hex(random_bytes(8));
      $user_data = guyra_get_user_object($user);
      $user_email = $user_data['user_login'];

      guyra_update_user_meta($user_data['user_id'], 'user_pass', password_hash($new_password, PASSWORD_DEFAULT));

      $creds = [
        'user_login'    => $user_email,
        'user_password' => $new_password
      ];

      Guyra_Login_User($creds);
      unset($new_password);
      Guyra_Redirect($gi18n['password_edit_link']);

      exit;

    } else {

      GuyraDisplayErrorPage('Erro!', 'Este link é inválido. Certifique que está usando o mesmo navegador e dispositivo para fazer esta ação!');

    }

  } else {

    $userdata = guyra_get_user_object(null, $user);
    $user = $userdata['user_id'];

    if ($userdata) {

      $bytes = Guyra_GenNonce([
        'user' => $user,
        'id' => 'lost_password'
      ]);

      $link = $site_api_url . '?lost_password=1&user=' . $user . '&nonce=' . $bytes;

      $string_replacements = [
        $gi18n['forgot_password_email_title'],
        $gi18n['forgot_password_email_explain'],
        $link,
        $link
      ];

      $mail = Guyra_mail('lost_password.html', $gi18n['forgot_password_email_title'], $userdata['user_login'], $string_replacements);

      if ($mail['error'])
      guyra_output_json($mail['error'], true);

      guyra_output_json('true', true);

    } else {
      guyra_output_json('user_not_found', true);
    }

  }

}
