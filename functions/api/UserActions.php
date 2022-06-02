<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $current_user_object;
global $current_user_diary;
global $current_user_notifications;
global $current_user_inventory;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;
global $gSettings;
global $gLang;
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
include_once $template_dir . '/functions/Security.php';
include_once $template_dir . '/components/Icons.php';

include_once $template_dir . '/functions/api/UserActions/Roadmap.php';
include_once $template_dir . '/functions/api/UserActions/Notifications.php';

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

  $data = json_decode(file_get_contents('php://input'), true);
  $nonce = $_GET['nonce'];
  $user = $current_user_id;

  // If any action requires nonce we can do them first, then
  // the json output will exit and nothing else will run.
  if ($nonce) {

    $nonce_pass = Guyra_CheckNonce([
      'user' => $current_user_id,
      'id' => 'confirm_mail',
      'nonce' => $nonce
    ]);

    if ($_GET['action'] == 'confirm_mail' && $nonce_pass) {
      $redirect = $gi18n['account_link'];
      $current_user_data['mail_confirmed'] = 'true';
    } else {

      GuyraDisplayErrorPage('Erro!', 'Este link é inválido. Certifique que está usando o mesmo navegador e dispositivo para fazer esta ação!');

    }

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
      $bytes = Guyra_GenNonce([
        'user' => $current_user_id,
        'id' => 'confirm_mail'
      ]);

      $link = $site_api_url . '?update_userdata=1&user=' . $user . '&action=confirm_mail&nonce=' . $bytes;

      $string_replacements = [
        $gi18n['confirm_email_email_title'],
        $gi18n['confirm_email_email_message'],
        $link,
        $link
      ];

      Guyra_mail('basic_link.html', $gi18n['confirm_email_email_title'], $userNewMail, $string_replacements);

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
  $theData['profile_picture_url'] = Guyra_get_profile_picture($current_user_id, null, true);

  $theData['gamedata'] = GetUserRanking($current_user_id);
  $theData['gamedata']['raw'] = $current_user_gamedata;

  $theData['user_diary'] = $current_user_diary;
  $theData['payments'] = $current_user_payments;
  $theData['notifications'] = $current_user_notifications;
  $theData['inventory'] = $current_user_inventory;

  if ($is_GroupAdmin || $is_admin) {
    $theData['user_code'] = Guyra_hash($current_user_id);
  }

  // If user is in a group then set their diary to be the groups's.
  if ($current_user_data['studygroup']) {
    $teachers_diary = guyra_get_user_data($current_user_data['teacherid'], 'diary');
    $theData['user_diary'] = $teachers_diary['diaries'][$current_user_data['studygroup']];
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
  $replyTo = $thePost['replyTo'];
  $notify = false;

  // Set the diary we are replying to.
  $user = (int) $thePost['diaryId'];

  if (!isset($thePost['diaryId']))
  $user = $current_user_id;

  // diary_owner_id is used later to save the data.
  $diary_owner_id = $user;

  // Validations
  if (!$thePost['comment'])
  guyra_output_json('comment empty', true);

  if (isset($thePost['replyTo']) && (!$is_GroupAdmin || !$is_admin))
  guyra_output_json('action not allowed', true);

  if (isset($thePost['diaryId']) && ($thePost['diaryId'] != $current_user_id) && (!$is_GroupAdmin || !$is_admin))
  guyra_output_json('action not allowed', true);

  // If user is replying to it's own diary we allow more actions.
  if ($user == $current_user_id) {

    $diary = &$current_user_diary;
    $notify = $current_user_data['teacherid'];


    // If user has a group their diary will be stored in their teacher's data.
    if ($current_user_data['studygroup']) {

      // We use diary_group_name to recombine data later.
      $diary_group_name = $current_user_data['studygroup'];
      $diary_owner_id = $current_user_data['teacherid'];

      // We use teachers_diary to check if we need to recombine data later.
      $teachers_diary = guyra_get_user_data($current_user_data['teacherid'], 'diary');

      if (!is_array($teachers_diary))
      $teachers_diary = [];

      $diary = $teachers_diary['diaries'][$current_user_data['studygroup']];

    }

  } else { $diary = guyra_get_user_data($user, 'diary'); }

  // If after all of this we came up empty, we need to create new sections.
  if (!is_array($diary))
  $diary = [];

  if (!is_array($diary['user_comments']))
  $diary['user_comments'] = [];

  // Check if we are sending messages inside a group.
  if (isset($thePost['groupName']) && ($is_GroupAdmin || $is_admin)) {

    // We use teachers_diary to check if we need to recombine data later.
    $teachers_diary = $diary;
    $diary = $diary['diaries'][$thePost['groupName']];

    // We use diary_group_name to recombine data later.
    $diary_group_name = $thePost['groupName'];

  }

  $commentData = [
    'date' => GetStandardDate(),
    'author' => $current_user_data['first_name'],
    'author_id' => $current_user_id,
    'attachment' => $thePost['attachment'],
    'comment' => nl2br($thePost['comment'])
  ];

  // If reply to is set we are replying.
  if (isset($thePost['replyTo'])) {

    if (!is_array($diary['user_comments'][$replyTo]['replies']))
    $diary['user_comments'][$replyTo]['replies'] = [];

    $diary['user_comments'][$replyTo]['replies'][] = $commentData;

  } else {
    $diary['user_comments'][] = $commentData;
  }

  // Join everything together for uploading.
  if (isset($teachers_diary)) {
    $new_diary = $teachers_diary;
    $new_diary['diaries'][$diary_group_name] = $diary;
  } else {
    $new_diary = $diary;
  }

  // Save everything.
  guyra_update_user_data($diary_owner_id, $new_diary, null, 'diary');

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

  $teacher_id = (int) $current_user_data['teacherid'];

  if ($teacher_id) {

    $teachers_data = guyra_get_user_data($teacher_id);
    $meeting_link = $teachers_data['user_meetinglink'];

  } else {
    $meeting_link = $current_user_data['user_meetinglink'];
  }

  Guyra_Redirect($meeting_link);

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
    'processor_data' => $current_user_payments['processor_data'],
    'cancellation' => $response,
    'processor_id' => 'MP',
    'status' => 'cancelled',
    'payed_for' => 'free',
    'cancel_quiz' => [ 'reason' => $_GET['cancel_reason'] ]
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

  $coursesJSON = $template_dir . '/assets/json/i18n/' . $gLang[0] . '/courses.json';
  $coursesArray = json_decode(file_get_contents($coursesJSON), true);

  foreach ($coursesArray as &$current) {
    $current['contents'] = file_get_contents(createYoutubeApiPlaylistLink($current['link']));
    $current['image'] = GuyraGetIcon('courses/' . $current['id'] . '.png');
  }

  guyra_output_json($coursesArray, true);

}

if ($_GET['translate']) {

  $to = 'en';
  $from = $gLang[0] . '-' . $gLang[1];

  if ($_GET['to'])
  $to = $_GET['to'];

  if ($_GET['from'])
  $from = $_GET['from'];

  $translation = $_GET['translate'];
  $output = GetCloudTranslationFor($translation, $to, $from);

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


if ($_GET['oauth_login']) {
  
  // Yes, we provide two api calls for this, one for logged out users,
  // and another one here. Here we connect users' social media accounts
  // so they can login again through them, and in the GuestUsers call,
  // we check if that connection is valid.

  $data = json_decode(file_get_contents('php://input'), true);
  $id = false;
  $provider = $data['provider'];

  if ($provider == 'fb')
  $id = $data['payload']['id'];

  if ($provider == 'google') {

    require_once $template_dir . '/vendor/autoload.php';

    $client = new Google_Client(['client_id' => $data['payload']['clientId']]);
    $payload = $client->verifyIdToken($data['payload']['credential']);

    $id = $payload['sub'];
  }

  guyra_update_user($current_user_id, ['flags' => [
    $provider . '_oauth' => $id
  ]]);

}