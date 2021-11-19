<?php

function Guyra_mail($template, $subject, $to, $string_replacements) {

  global $template_dir;

  $template = file_get_contents($template_dir . '/templates/mail/' . $template);

  $message = vsprintf($template, $string_replacements);

  $headers = 'From: hello@guyra.me\r\n' .
      'Reply-To: hello@guyra.me\r\n' .
      'MIME-Version: 1.0\r\n' .
      'Content-Type: text/html; charset=ISO-8859-1\r\n' .
      'X-Mailer: PHP/' . phpversion();

  mail($to, $subject, $message, $headers);

}
