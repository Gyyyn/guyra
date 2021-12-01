<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;
global $site_api_url;

include_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/functions/Mailer.php';
include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/User.php';

$user = $_GET['user'];

if ($_GET['update_elo'] && $_GET['value']) {
  $current_user_gamedata['elo'] = $_GET['value'];
  guyra_update_user_meta($current_user_id, 'gamedata', json_encode($current_user_gamedata, JSON_UNESCAPED_UNICODE));
}

if ($_GET['update_level'] && $_GET['value']) {
  Guyra_increase_user_level($current_user_id, 'level', $_GET['value']);
}

if ($_GET['log_exercise_data']) {
  guyra_log_to_db($current_user_id, mysql_real_escape_string(file_get_contents('php://input')));
}

if ($_GET['action'] == 'update_user_textareas') {
  guyra_update_user_meta($current_user_id, 'textareas', mysql_real_escape_string(file_get_contents('php://input')));
}

if ($_GET['teacher_code']) {

  $the_code = Guyra_hash($_GET['teacher_code'], true);

  if (is_numeric($the_code)) {
    guyra_update_user_data($current_user_id, [
      'teacherid' => $the_code,
      'studygroup' => ''
    ]);
  }

  unset($the_code);

  guyra_output_json('true', true);

}

// 'update_userdata' handles many different actions related to the userdata
// meta key. Most of them require a POST to be set but not all. Specifically
// those relating to nonce confirmation of actions.
if ($_GET['update_userdata']) {

  global $current_user_data;

  $data = json_decode(file_get_contents('php://input'), true);
  $nonce = $_GET['nonce'];
  $user = $current_user_id;

  session_start();

  // If any action requires nonce we can do them first, then
  // the json output will exit and nothing else will run.
  if ($nonce) {
    if ($_GET['action'] == 'confirm_mail' && $_SESSION['confirm_mail'][$current_user_id] == $nonce) {

      // For now we need to update the WP DB too.
      wp_update_user([
        'ID' => $user,
        'user_email' => $current_user_data['user_email']
      ]);

      $current_user_data['mail_confirmed'] = 'true';
      $quit = false;

    } else {
      guyra_output_json('false', true);
    }
  }

  if ($data) {

    // 'user_pass' fields needs different logic and can only be
    // set by itself because of it.
    if ($data['fields'][0] == 'user_pass') {

      wp_set_password($data['user_pass'], $current_user_id);

      $creds = array(
        'user_login'    => $current_user_data['user_email'],
        'user_password' => $data['user_pass'],
        'remember'      => true
      );

      $user = Guyra_Login_User($creds);

      if (is_wp_error($user)) {
        guyra_output_json($user->get_error_message(), true);
      } else {
        guyra_output_json('true', true);
      }

    } else {

      foreach ($data['fields'] as $field) {
        $current_user_data[$field] = $data[$field];

        if ($field == 'user_email') {

          $userNewMail = $data[$field];
          $current_user_data['mail_confirmed'] = 'false';
          $bytes = bin2hex(random_bytes(16));
          $_SESSION['confirm_mail'][$user] = $bytes;

          $link = $site_api_url . '?update_userdata=1&user=' . $user . '&action=confirm_mail&nonce=' . $bytes;

          $string_replacements = [
            $gi18n['confirm_email_email_title'],
            $gi18n['confirm_email_email_message'],
            $link,
            $link
          ];

          Guyra_mail('lost_password.html', $gi18n['confirm_email_email_title'], $userNewMail, $string_replacements);

          $quit = true;

        }
      }

    }
  }

  guyra_update_user_meta($current_user_id, 'userdata', json_encode($current_user_data, JSON_UNESCAPED_UNICODE));

  if ($quit) {
    guyra_output_json('true', true);
  }

}

if ($_GET['update_user_picture']) {

  if ( ! function_exists( 'wp_handle_upload' ) ) {
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
  }

  $file = $_FILES['file'];

  if ($file['size'] < 3000000) {
    $movefile = wp_handle_upload($file, ['test_form' => false]);

    if ( $movefile && ! isset( $movefile['error'] ) ) {

      $current_user_data['profile_picture_url'] = $movefile['url'];

      guyra_update_user_meta($current_user_id, 'userdata', json_encode($current_user_data, JSON_UNESCAPED_UNICODE));

      guyra_output_json($movefile['url'], true);

    } else {
      guyra_output_json('error', true);
    }
  } else {
    guyra_output_json('file too big', true);
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

if ($_GET['logout']) {
  wp_logout();
}

if ($_GET['register']) {

  $data = json_decode(file_get_contents('php://input'), true);

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
      guyra_output_json('user not found', true);
    }

  }

}

if ($_GET['get_user_data']) {

  global $is_logged_in;

  if ($is_logged_in) {
    $theData = $current_user_data;
    $theData['gamedata'] = GetUserRanking($current_user_id);
    $theData['gamedata_raw'] = $current_user_gamedata;
    $user_diary = guyra_get_user_meta($current_user_id, 'diary', true)['meta_value'];
    $theData['user_diary'] = json_decode($user_diary);
    $theData['is_logged_in'] = true;
  } else {
    $theData['is_logged_in'] = false;
  }

  guyra_output_json(json_encode($theData), true);

}

if ($_GET['get_identicon']) {
  global $template_dir;
  require $template_dir . '/vendor/autoload.php';

  header('Cache-Control: max-age=604800');

  $hash = $_GET['hash'];

  $icon = new \Jdenticon\Identicon();
  $icon->setValue($hash);
  $icon->setSize(256);
  $icon->displayImage('png');
  exit;
}

?>
