<?php

global $template_dir;
global $template_url;

Guyra_Safeguard_File();

require_once $template_dir . '/vendor/autoload.php';

use MatthiasMullie\Minify;

function guyra_handle_pwa() {

  global $template_dir;
  global $template_url;
  global $gi18n;
  global $gLang;

  $root = ABSPATH;
  $image_url = $template_url . '/assets/img';
  $json_path = $template_dir . '/assets/json';
  $js_path = $template_dir . '/assets/js';
  $success = true;

  $PWAjs_file_path = $root . '/GuyraPWA.js';
  $PWAmanifest_file_path = $root . '/GuyraManifest.json';

  // Check if the files are already placed on the root folder.
  $file = file_get_contents($PWAjs_file_path);

  if ($file === false) {

    $file = file_get_contents($js_path . '/PWA_ServiceWorker.js');

    $file = vsprintf($file, [
      $template_url . '/assets/json/i18n/' . $gLang[0] . '/templates/offline.html'
    ]);

    $output = new Minify\JS($file);
    $output->minify($PWAjs_file_path);

  }

  $file = file_get_contents($PWAmanifest_file_path);

  if ($file === false) {

    $file = file_get_contents($json_path . '/PWA_Manifest.json');

    $file = vsprintf($file, [
      $gi18n['company_name'],
      $gi18n['meta_name'],
      $gi18n['meta_desc'],
      $image_url . '/maskable_icon_x48.png',
      $image_url . '/maskable_icon_x128.png',
      $image_url . '/maskable_icon_x192.png',
      $image_url . '/maskable_icon_x512.png'
    ]);

    $output = new Minify\JS($file);
    $output->minify($PWAmanifest_file_path);

  }

  return $success;


}
