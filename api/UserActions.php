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
global $is_admin;
global $is_GroupAdmin;
global $cache_dir;

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

if ($_GET['i18n'] == "full")
guyra_output_json($gi18n, true);

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

    if ($_GET['action'] == 'confirm_mail' && $_SESSION['confirm_mail'][$current_user_id] == $nonce)
    $current_user_data['mail_confirmed'] = 'true';

    // TODO: Handle nonce fail.

    $redirect = $gi18n['account_link'];

  }

  // By now if we don't have any posted date the logic can't continue.
  if (!$data)
  guyra_output_json('post error');

  // 'user_pass' fields needs different logic and can only be
  // set by itself because of it.
  if ($data['fields'][0] == 'user_pass') {

    guyra_update_user_meta($current_user_id, 'user_pass', password_hash($data['user_pass'], PASSWORD_DEFAULT));

    $creds = array(
      'user_login'    => $current_user_object['user_login'],
      'user_password' => $data['user_pass'],
      'remember'      => true
    );

    $user = Guyra_Login_User($creds);

    if ($user['error']) {
      guyra_output_json($user['error'], true);
    }

    guyra_output_json('true', true);

  }

  // Since we got here, it means we are updating other data fields.
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

    } else {
      $current_user_data[$field] = $data[$field];
    }

  }

  guyra_update_user_meta($current_user_id, 'userdata', json_encode($current_user_data, JSON_UNESCAPED_UNICODE));

  if ($redirect)
  Guyra_Redirect($redirect);

}

if ($_GET['logout']) {
  ?>
  <script type="text/javascript">
  localStorage.removeItem('guyra_userdata');
  localStorage.removeItem('guyra_i18n');

  localStorage.setItem('guyra_members', JSON.stringify({
    user_name: "<?php echo $current_user_data['first_name']; ?>",
    user_email: "<?php echo $current_user_object['user_login']; ?>"
  }));

  window.location.href = "<?php echo $gi18n['home_link']; ?>";
  </script>
  <?php
  Guyra_Logout_User();
  exit;
}

if ($_GET['get_user_data']) {

  $theData = $current_user_data;

  $theData['is_logged_in'] = true;
  $theData['id'] = $current_user_id;
  $theData['user_email'] = $current_user_object['user_login'];
  $theData['user_subscription_valid'] = $current_user_subscription_valid;

  $theData['gamedata'] = GetUserRanking($current_user_id);
  $theData['gamedata']['raw'] = $current_user_gamedata;

  $theData['user_diary'] = guyra_get_user_meta($current_user_id, 'diary', true)['meta_value'];
  $theData['user_diary'] = json_decode($theData['user_diary']);

  $theData['payments'] = $current_user_payments;
  $theData['notifications'] = $current_user_notifications;
  $theData['inventory'] = $current_user_inventory;

  if ($is_GroupAdmin || $is_admin) {
    $theData['user_code'] = Guyra_hash($current_user_id);
  }

  // Unset some sensitive data;
  unset($theData['user_pass']);

  guyra_output_json(json_encode($theData), true);

}

if ($_GET['get_identicon']) {

  $hash = $_GET['hash'];

  $cached_identicon_path = '/assets/' . md5('Icon' . $hash) . '.png';
  $cached_identicon = $cache_dir . $cached_identicon_path;
  $cached_identicon_file = file_exists($cached_identicon);

  if (!$cached_identicon_file) {

    require $template_dir . '/vendor/autoload.php';

    $icon = new \Jdenticon\Identicon();
    $icon->setValue($hash);
    $icon->setSize(256);

    file_put_contents($cached_identicon, $icon->getImageData('png'));

  }

  Guyra_Redirect($template_url . '/cache' . $cached_identicon_path);

}

if ($_GET['post_reply']) {

  $thePost = json_decode(file_get_contents('php://input'), true);
  $notify = false;

  // Validations
  if (!$thePost['comment'])
  guyra_output_json('comment empty', true);

  if (isset($thePost['replyTo']) && (!$is_GroupAdmin || !$is_admin))
  guyra_output_json('action not allowed', true);

  if (isset($thePost['diaryId']) && ($thePost['diaryId'] != $current_user_id) && (!$is_GroupAdmin || !$is_admin))
  guyra_output_json('action not allowed', true);

  $user = (int) $thePost['diaryId'];

  if (!isset($thePost['diaryId']))
  $user = $current_user_id;

  if ($user == $current_user_id) {

    $diary = &$current_user_diary;
    $notify = $current_user_data['teacherid'];

  } else {
    $diary = guyra_get_user_data($user, 'diary');
  }

  if (!is_array($diary['user_comments']))
  $diary['user_comments'] = [];

  $replyTo = $thePost['replyTo'];

  $commentData = [
    'date' => GetStandardDate(),
    'author' => $current_user_data['first_name'],
    'author_id' => $current_user_id,
    'attachment' => $thePost['attachment'],
    'comment' => nl2br($thePost['comment'])
  ];

  if (isset($thePost['replyTo'])) {

    if (!is_array($diary['user_comments'][$replyTo]['replies']))
    $diary['user_comments'][$replyTo]['replies'] = [];

    $diary['user_comments'][$replyTo]['replies'][] = $commentData;

  } else {
    $diary['user_comments'][] = $commentData;
  }

  guyra_update_user_data($user, ['user_comments' => $diary['user_comments']], null, 'diary');

  Guyra_increase_user_level($current_user_id, 2);

  // Finally send a notification to the Group Admin.
  if ($notify != false) {

    $notification = $gi18n['notification_user_posted'];
    $notification['title'] = str_replace("%user", $current_user_data['first_name'], $notification['title']);

    PushNotification($notification, $notify);

  }

  guyra_output_json('true', true);

}

if ($_GET['post_attachment']) {
  GuyraHandleFileUpload();
}

if ($_GET['redirect_meeting']) {
  Guyra_Redirect($current_user_data['user_meetinglink']);
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
