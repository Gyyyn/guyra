<?php

Guyra_Safeguard_File();

function GuyraGetSettings($save=false, $settingsArray=null) {

  global $cache_dir;

  $settings_cache_dir = $cache_dir . '/settings';

  if (!is_dir($settings_cache_dir)) {
    mkdir($settings_cache_dir, 0755, true);
  }

  $fileLocation = $settings_cache_dir . '/settings.json';
  $settingsFile = file_get_contents($fileLocation);

  if (!$settingsFile) {
    $settings = ['guyra_hello' => 'yes'];
    file_put_contents($fileLocation, json_encode($settings));
  } else {
    $settings = json_decode($settingsFile, true);
  }

  if ($save) {
    file_put_contents($fileLocation . '.bak', json_encode($settings));
    file_put_contents($fileLocation, json_encode($settingsArray));
  }

  return $settings;

}
