<?php

global $template_url;
global $template_dir;
global $admin_url;
global $site_url;
global $is_logged_in;
global $site_api_url;
global $gLang;
global $gi18n;
global $gSettings;
global $is_admin;

// For now, limit this to admin users.
if (!$is_admin)
exit;

// Note: this file is run through the api call /cron, by anyone,
// but is not accesible directly and has a run limit of 1x per second

$lastRunFile = $template_dir . '/cache/cron_lastrun';
$lastRun = file_get_contents($lastRunFile);

// if (($lastRun + 30) > time())
// exit;

// Get a list of Cron components
$arrFiles = scandir($template_dir . '/components/Cron');
$components = [];

foreach ($arrFiles as $file) {

  $ext = explode('.', $file)[1];
  
  if ($ext == 'php') {
    $components[] = $file;
  }

}

foreach ($components as $component) {

  include_once $template_dir . '/components/Cron/' . $component;

}

file_put_contents($lastRunFile, time());