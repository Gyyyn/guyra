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
        'teacherid' => '',
        'studygroup' => '',
        'user_meetinglink' => ''
      ], JSON_UNESCAPED_UNICODE));

      PushNotification($gi18n['notification_welcome'], $user);

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

if ($_GET['lost_password']) {

  session_start();

  $nonce = $_GET['nonce'];

  if ($nonce) {

    if ($_SESSION['lost_password'][$user] == $nonce) {

      $new_password = bin2hex(random_bytes(8));

      $user_email = get_user_by('id', $user)->user_email;

      wp_set_password($new_password, $user);

      $creds = [
        'user_login'    => $user_email,
        'user_password' => $new_password,
        'remember'      => true
      ];

      Guyra_Login_User($creds, false);

      $redirect = $gi18n['password_edit_link'];

      unset($_SESSION['lost_password'][$user]);
      unset($new_password);

    } else {

      unset($_SESSION['lost_password'][$user]);
      guyra_output_json('false', true);

    }

  } else {

    $userdata = get_user_by('email', $user);
    $user = $userdata->ID;
    global $gi18n;

    if ($userdata) {

      $bytes = bin2hex(random_bytes(16));
      $_SESSION['lost_password'][$user] = $bytes;

      $link = $site_api_url . '?lost_password=1&user=' . $user . '&nonce=' . $bytes;

      $string_replacements = [
        $gi18n['forgot_password_email_title'],
        $gi18n['forgot_password_email_explain'],
        $link,
        $link
      ];

      Guyra_mail('lost_password.html', $gi18n['forgot_password_email_title'], $userdata->user_email, $string_replacements);

      guyra_output_json('sent', true);

    } else {
      guyra_output_json($gi18n['user_not_found'], true);
    }

  }

}
