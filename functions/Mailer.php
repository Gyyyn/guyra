<?php

global $template_dir;
global $template_url;

Guyra_Safeguard_File();

require $template_dir . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function Guyra_mail($template, $subject, $to, $string_replacements) {

  global $template_dir;
  global $gLang;
  global $gi18n;
  global $gSettings;

  if (!$gSettings['twilioApiKey'])
  return ['error' => 'no twilio api key'];

  $mail = new PHPMailer();
  $mail->CharSet = 'UTF-8';
  // $mail->isSendmail();
  $mail->setFrom('hello@guyra.me', $gi18n['company_name']);
  $mail->addAddress($to);
  $mail->Subject = $subject;

  // Auth stuff
  $mail->isSMTP();
  $mail->SMTPAuth = true;
  $mail->Host = 'smtp.sendgrid.net';
  $mail->SMTPSecure = 'tls'; 
  $mail->Port = 587;
  $mail->Username="apikey";
  $mail->Password = $gSettings['twilioApiKey'];

  $template_link = $template_dir . '/assets/json/i18n/' . $gLang[0] . '/templates/mail/' . $template;

  $template = file_get_contents($template_link);

  $message = vsprintf($template, $string_replacements);

  if (!$message) {
    guyra_log_to_file(json_encode($string_replacements));
    return ['error' => 'message error'];
  }

  $mail->msgHTML($message);

  if (!$mail->send()) {
    guyra_log_to_file(json_encode($mail->ErrorInfo));
    return ['error' => $mail->ErrorInfo];
  } else {
    return true;
  }

}
