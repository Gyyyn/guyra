<?php

global $template_dir;
global $template_url;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;
global $current_user_id;

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
  $guyra_generated_private_mail = false;

  // Run some checks.
  if (!$captchaOk)
  guyra_output_json('captcha_error', true);

  if (!$data['user_email']) {

    if ($_GET['oauth']) {

      $data['user_email'] = $data['user_firstname'] . $data['user_lastname'] . bin2hex(random_bytes(2)) . '@guyra.me';
      $guyra_generated_private_mail = true;

    } else {

      guyra_output_json('login empty', true);

    }

  }

  // Since we allow email auth login a user can register without a password.
  if (!$data['user_password']) {
    $data['user_password'] = bin2hex(random_bytes(8));
  }

  $user = guyra_get_user_object(null, $data['user_email']);

  if ($user)
  guyra_output_json('user already exists', true);

  // All is ok, let's generate a user id and populate the data.
  $user = guyra_create_user($data['user_email']);

  // Stop if anything went wrong.
  if ($user['error'])
  guyra_output_json($user['error'], true);

  $creds = [
    'user_login'    => $data['user_email'],
    'user_password' => $data['user_password']
  ];

  $user_meta = [
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
  ];

  if ($guyra_generated_private_mail)
  $user_meta['guyra_private_mail'] = true;

  guyra_update_user_meta($user, 'userdata', json_encode($user_meta, JSON_UNESCAPED_UNICODE));
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

  if ($_GET['oauth']) {

    $provider = $data['provider'];
    $id = null;

    if ($provider == 'fb')
    $id = $data['payload']['id'];

    if ($provider == 'google')
    $id = $data['payload']['sub'];

    guyra_update_user($current_user_id, ['flags' => [
      $provider . '_oauth' => $id
    ]]);

    guyra_output_json('authorized', true);

  }

  guyra_output_json('true', true);

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
      $hashedPass = password_hash($new_password, PASSWORD_DEFAULT);
      $user_data = guyra_get_user_object($user);
      $user_email = $user_data['user_login'];

      guyra_update_user_meta($user_data['user_id'], 'user_pass', $hashedPass);

      $creds = [
        'user_login'    => $user_email,
        'user_password' => $new_password
      ];

      $login = Guyra_Login_User($creds);
      unset($new_password);

      if ($_GET['passwordless']) {
        Guyra_Redirect($gi18n['home_link']);
      } else {
        Guyra_Redirect($gi18n['password_edit_link']);
      }

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

      $email_title = $gi18n['_mail']['forgot_password']['title'];
      $email_content = $gi18n['_mail']['forgot_password']['content'];
      $mail_template = 'lost_password.html';

      if ($_GET['passwordless']) {
        $email_title = $gi18n['_mail']['passwordless_auth']['title'];
        $email_content = $gi18n['_mail']['passwordless_auth']['content'];
        $mail_template = 'passwordless_auth.html';
        $link = $link . '&passwordless=1';
      }

      $string_replacements = [
        $email_title,
        $email_content,
        $link,
        $link
      ];

      $mail = Guyra_mail($mail_template, $email_title, $userdata['user_login'], $string_replacements);

      if ($mail['error'])
      guyra_output_json($mail['error'], true);

      guyra_output_json('true', true);

    } else {
      guyra_output_json('user_not_found', true);
    }

  }

}

if ($_GET['oauth_login']) {

  // Also see: UsersActions.php/oauth_login api call.

  $data = json_decode(file_get_contents('php://input'), true);
  $provider = $data['provider'];
  $authed_email = false;
  $authed_id = null;
  
  if ($provider == 'google') {

    require_once $template_dir . '/vendor/autoload.php';

    $client = new Google_Client(['client_id' => $data['payload']['clientId']]);
    $payload = $client->verifyIdToken($data['payload']['credential']);

    $authed_email = $payload['email'];
    $authed_id = $payload['sub'];

  }

  if ($provider == 'fb') {

    $authed_email = $data['payload']['email'];
    $authed_id = $data['payload']['id'];

  }

  $login = Guyra_Login_User([
    'user_login' => $authed_email,
    'oauth_provider' => $provider,
    'oauth_id' => $authed_id
  ], true);

  if ($login['error']) {
    guyra_log_to_file($login['error']);
    guyra_output_json($user['error'], true);
  }

  guyra_output_json('authorized', true);

}