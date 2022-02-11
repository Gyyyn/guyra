<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $current_user_notifications;
global $current_user_inventory;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;
global $gSettings;
global $current_user_payments;
global $current_user_subscription_valid;

Guyra_Safeguard_File();

require_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/functions/Mailer.php';
include_once $template_dir . '/functions/Exercises.php';
include_once $template_dir . '/functions/Game.php';
include_once $template_dir . '/functions/User.php';
include_once $template_dir . '/functions/Assets.php';
include_once $template_dir . '/functions/Payment.php';
include_once $template_dir . '/components/Icons.php';

include_once $template_dir . '/api/UserActions/Roadmap.php';
include_once $template_dir . '/api/UserActions/Notifications.php';

$user = $_GET['user'];
$auth_token = $_SERVER['HTTP_GUYRA_AUTH'];

if (!$is_logged_in) {

  if ($user !== null) {
    $attempted_login_password = guyra_get_user_meta($_GET['user'], 'user_pass', true)['meta_value'];
    $return = false;

    if ($auth_token !== $attempted_login_password) {
      guyra_output_json('auth invalid', true);
    }
  } else {
    guyra_output_json('not logged in', true);
  }

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
  global $current_user_object;

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
        'user_email' => $current_user_object['user_login'],
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
      guyra_update_user_meta($current_user_id, 'user_pass', password_hash($data['user_pass'], PASSWORD_DEFAULT));

      $creds = array(
        'user_login'    => $current_user_object['user_login'],
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

        if ($field == 'user_email') {

          $userNewMail = $data[$field];

          guyra_update_user($user, ['user_login' => $userNewMail]);

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

        } else {
          $current_user_data[$field] = $data[$field];
        }
      }

    }
  }

  guyra_update_user_meta($current_user_id, 'userdata', json_encode($current_user_data, JSON_UNESCAPED_UNICODE));

  if ($quit) {
    guyra_output_json('true', true);
  }

}

if ($_GET['logout']) {
  Guyra_Logout_User();
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

if ($_GET['get_user_data']) {

  $theData = $current_user_data;

  $theData['is_logged_in'] = true;
  $theData['user_email'] = $current_user_object['user_login'];
  $theData['user_subscription_valid'] = $current_user_subscription_valid;

  $theData['gamedata'] = GetUserRanking($current_user_id);
  $theData['gamedata']['raw'] = $current_user_gamedata;

  $theData['user_diary'] = guyra_get_user_meta($current_user_id, 'diary', true)['meta_value'];
  $theData['user_diary'] = json_decode($theData['user_diary']);

  $theData['payments'] = $current_user_payments;
  $theData['notifications'] = $current_user_notifications;
  $theData['inventory'] = $current_user_inventory;

  guyra_output_json(json_encode($theData), true);

}

if ($_GET['get_identicon']) {

  global $template_dir;
  global $template_url;
  global $cache_dir;
  global $redirect;

  $hash = $_GET['hash'];

  $cached_identicon_path = '/assets/' . md5('Icon' . $hash) . '.png';
  $cached_identicon = $cache_dir . $cached_identicon_path;
  $cached_identicon_file = file_get_contents($cached_identicon);
  $redirect = $template_url . '/cache' . $cached_identicon_path;

  if (!$cached_identicon_file) {

    require $template_dir . '/vendor/autoload.php';

    $icon = new \Jdenticon\Identicon();
    $icon->setValue($hash);
    $icon->setSize(256);

    file_put_contents($cached_identicon, $icon->getImageData('png'));

  }

}

if ($_GET['post_reply']) {

  global $gi18n;

  if (!function_exists('wp_handle_upload')) {
    require_once( ABSPATH . 'wp-admin/includes/file.php' );
  }

  include_once $template_dir . '/functions/Game.php';
  include_once $template_dir . '/components/StudyPage.php';

  $uploadedfile = $_FILES['file'];
  $file_found = false;
  $upload_overrides = ['test_form' => false];
  if (isset($uploadedfile) && $uploadedfile['error'] != 4) {
  	$file_found = true;
  }

  if ($current_user_data['role'] == 'teacher') {
    $comment_post_ID = $_POST['comment_post_ID'];
  } else {
    $user_studypage_object = GetUserStudyPage_object($current_user_id);
    $comment_post_ID = $user_studypage_object->ID;
  }

  $comment_data_toPost = [
    'comment_approved' => 1,
    'comment_author' => $current_user_data['first_name'],
    'comment_author_IP' => $_SERVER['REMOTE_ADDR'],
    'comment_agent' => $_SERVER['HTTP_USER_AGENT'],
    'comment_content' => $_POST['comment_content'],
    'comment_parent' => $_POST['comment_parent'],
    'comment_post_ID' => $comment_post_ID,
    'user_id' => $current_user_id
  ];

  // Post whatever comment we have
  $comment = wp_insert_comment($comment_data_toPost);

  if (!$comment) {

  	guyra_output_json($gi18n['comment_error'] . var_dump($comment_data_toPost), true);

  }

  // Upload the attached image if it is found
  if ($file_found) {
  	$movefile = wp_handle_upload($uploadedfile, $upload_overrides);
  }

  if ($movefile && !isset($movefile['error'])) {

  	update_comment_meta($comment, 'comment_image', $movefile['url']);

  } elseif ($file_found) {

    guyra_output_json($gi18n['file_error'], true);

  }

  Guyra_increase_user_level($current_user_id, 2);

  if (isset($_POST['redirect'])) {
    $redirect  = $_POST['redirect'];
  } else {
    guyra_output_json('true', true);
  }

}

if ($_GET['redirect_meeting']) {
  $redirect = $current_user_data['user_meetinglink'];
}

if ($_GET['get_image']) {

  if ($_GET['size']) {

    $sizeArray = json_decode($_GET['size']);

    if (is_array($sizeArray)) {
      $size['x'] = $sizeArray[0];
      $size['y'] = $sizeArray[1];
    } else {
      $size = (int) $_GET['size'];
    }
  } else {
    $size = 64;
  }

  // $redirect = GetImageCache($_GET['get_image'], $size);

  $r = GetImageCache($_GET['get_image'], $size, 'png', 80, true);

  header ('Content-Type: image/png');
  echo $r; exit;
}

if ($_GET['proccess_payment']) {

  // Only allow payment processing if the setting is enabled.
  if (!$gSettings['payments_open']) {
    guyra_output_json('payments closed', true);
  }

  $thePost = json_decode(file_get_contents('php://input'), true);
  $put = false;
  $url = false;

  if ($thePost['description'] == 'lite') {
    $selectedPlan = $gSettings['mp_lite_planid'];
  } elseif ($thePost['description'] == 'premium') {
    $selectedPlan = $gSettings['mp_premium_planid'];
  } else {
    guyra_output_json('error invalid plan', true);
  }

  $dataToPost = [
    'preapproval_plan_id' => $selectedPlan,
    'card_token_id' => $thePost['token'],
    'payer_email' => $thePost['payer']['email']
  ];

  // If user has already payed we are going to update the payment.
  if ($current_user_payments['status'] == 'approved') {

    $updating = 'plan';
    $put = true;
    $url = '/' . $current_user_payments['processor_data']['id'];

    if ($current_user_payments['payed_for'] == $thePost['description']) {

      $updating = 'payment';

      $dataToPost = [
        'application_id' => $applicationId,
        'card_token_id' => $thePost['token']
      ];
    }

  }

  // If we are updating the plan the previous one needs to be cancelled first.
  if ($updating == 'plan') {

    $cancel_ch = CreateMPcURLObject([
      'body' => ['status' => 'cancelled'],
      'deviceId' => $thePost['deviceId'],
      'put' => true,
      'url' => $url
    ]);
    $res_from_cancel = curl_exec($cancel_ch);
    curl_close($cancel_ch);

    $url = false;
    $put = false;

  }

  $ch = CreateMPcURLObject([
    'body' => $dataToPost,
    'deviceId' => $thePost['deviceId'],
    'put' => $put,
    'url' => $url
  ]);
  $response = curl_exec($ch);

  $response = json_decode($response, true);
  $response['updated'] = $updating;
  $response['card_data'] = [
    'issuer_id' => $thePost['issuer_id'],
    'digits' => $thePost['card_digits']
  ];

  if ($response['status'] == 'authorized') {

    $paymentData = [
      'processor_data' => $response,
      'processor_id' => 'MP',
      'status' => 'approved',
      'payed_for' => $thePost['description']
    ];

    guyra_update_user_meta($current_user_id, 'payment', json_encode($paymentData, JSON_UNESCAPED_UNICODE));

    if ($updating) {
      PushNotification($gi18n['notification_plan_updated']);
    } else {
      PushNotification($gi18n['notification_plan_adquired']);
    }

  }

  curl_close($ch);
  guyra_output_json($response, true);
}

if ($_GET['cancel_membership']) {

  $cancel_ch = CreateMPcURLObject([
    'body' => ['status' => 'cancelled'],
    'deviceId' => $thePost['deviceId'],
    'put' => true,
    'url' => '/' . $current_user_payments['processor_data']['id']
  ]);

  $response = curl_exec($cancel_ch);
  curl_close($cancel_ch);

  $paymentData = [
    'processor_data' => $response,
    'processor_id' => 'MP',
    'status' => 'cancelled',
    'payed_for' => 'free'
  ];

  PushNotification($gi18n['notification_plan_cancelled']);
  guyra_update_user_meta($current_user_id, 'payment', json_encode($paymentData, JSON_UNESCAPED_UNICODE));
  guyra_output_json($response, true);

}

if ($_GET['is_valid_promo']) {

  $supposed_promo = $_GET['is_valid_promo'];
  $return = false;

  $promos = [
    '13OFFGABRIEL' => [
      'price_cut_percent' => 13,
      'valid_until' => '30/12/2022'
    ]
  ];

  $promos_keys = array_keys($promos);

  if (in_array($supposed_promo, $promos_keys)) {
    $return = $promos[$supposed_promo];
  }

  guyra_output_json($return, true);

}

if ($_GET['get_courses']) {

  function createYoutubeApiPlaylistLink($key) {

    global $gSettings;

    $youtubeApi = [
      'Key' => $gSettings['google_api'],
      'Link' => 'https://www.googleapis.com/youtube/v3/'
    ];

    $r = sprintf(
        $youtubeApi['Link'] . 'playlistItems?part=snippet&maxResults=50&playlistId=%s&key=' . $youtubeApi['Key'],
        $key
      );

    return $r;
  }

  $coursesArray = json_decode(file_get_contents($template_dir . '/assets/json/courses.json'), true);

  foreach ($coursesArray as &$current) {
    $current['contents'] = file_get_contents(createYoutubeApiPlaylistLink($current['link']));
    $current['image'] = GuyraGetIcon('courses/' . $current['id'] . '.png');
  }

  guyra_output_json($coursesArray, true);

}

if ($_GET['translate']) {

  $translation = $_GET['translate'];
  $output = GetCloudTranslationFor($translation);

  if ($output)
  guyra_output_json($output, true);

}


if ($_GET['send_help_form']) {

  $theData = json_decode(file_get_contents('php://input'), true);

  if (!is_array($theData))
  guyra_output_json('post error', true);

  $title = 'Support Ticket from ' . $theData['help-email'] . ': ' . $theData['help-subject'];
  $message = 'Message from ' . $theData['help-email'] . ': <hr />' . $theData['help-message'];

  $string_replacements = [
    $title,
    $message
  ];

  Guyra_mail('support_request_form.html', $title, 'hello@guyra.me', $string_replacements);

  guyra_output_json('true', true);

}
