<?php
global $template_dir;
global $template_url;

require $template_dir . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function Guyra_mail($template, $subject, $to, $string_replacements) {

  global $template_dir;

  $mail = new PHPMailer();
  $mail->isSendmail();
  $mail->setFrom('hello@guyra.me', 'Guyrá');
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
