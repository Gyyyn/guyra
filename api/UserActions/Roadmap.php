<?php

Guyra_Safeguard_File();

if ($_GET['get_roadmap']) {

  global $template_dir;
  global $template_url;
  global $gi18n;
  global $gLang;

  $roadmap_location = $template_dir . '/assets/json/roadmap.json';
  $roadmap_file = file_get_contents($roadmap_location);
  $output = false;

  if ($roadmap_file) {

    $roadmap_file = json_decode($roadmap_file, true);

    foreach ($roadmap_file as &$level) {

      $template = file_get_contents($template_dir . '/assets/json/i18n/' . $gLang[0] . '/templates/roadmap/' . $level['id'] . '.html');
      $template = str_replace("%home_link", $gi18n['home_link'], $template);
      $template = str_replace("\r\n", '', $template);
      $template = str_replace("\n", '', $template);
      $template = str_replace("\r", '', $template);

      $level['body'] = $template;
    }

    $output = $roadmap_file;

  }

  guyra_output_json($output, true);
}
