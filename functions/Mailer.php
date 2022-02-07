<?php

global $template_dir;
global $template_url;

Guyra_Safeguard_File();

require $template_dir . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function Guyra_mail($template, $subject, $to, $string_replacements) {

  global $template_dir;
  global $gi18n;

  $mail = new PHPMailer();
  $mail->CharSet = 'UTF-8';
  $mail->isSendmail();
  $mail->setFrom('hello@guyra.me', $gi18n['company_name']);
  $mail->addAddress($to);
  $mail->Subject = $subject;

  $template = file_get_contents($template_dir . '/templates/mail/' . $template);

  $message = vsprintf($template, $string_replacements);

  $mail->msgHTML($message);

  if (!$mail->send()) {
    guyra_output_json('Mailer Error: ' . $mail->ErrorInfo);
  } else {
    return true;
  }

}
