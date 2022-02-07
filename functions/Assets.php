<?php

global $template_dir;
global $template_url;

Guyra_Safeguard_File();

require_once $template_dir . '/vendor/autoload.php';

use MatthiasMullie\Minify;
use Intervention\Image\ImageManager;

function GetMinifiedAsset($assetFolder, $assetFile, $inline=false) {

  if ($assetFolder != 'js' && $assetFolder != 'css' && $assetFolder != 'json') {
    return false;
  }

  global $template_dir;
  global $template_url;
  global $gSettings;

  $assetsCacheLocation = $template_dir . '/cache/assets/';

  if(!is_dir($assetsCacheLocation)) {
    mkdir($assetsCacheLocation, 0755, true);
  }

  $realObject = $template_dir . '/assets/' . $assetFolder . '/' . $assetFile;
  $realLink = $template_url . '/assets/' . $assetFolder . '/' . $assetFile;

  $cachedObjectAppend = md5($assetFolder . $assetFile . GUYRA_VERSION) . '.' . $assetFolder;
  $cachedObject = $assetsCacheLocation . $cachedObjectAppend;

  $object = file_get_contents($cachedObject);
  $theLink = $template_url . '/cache/assets/' . $cachedObjectAppend;

  // Create a cache for a file that's not found
  // In a dev enviroment we aren't going to minify anything.
  if (!$object || $gSettings['dev_env']) {

    $object = file_get_contents($realObject);

    // Replace URLs
    $object = str_replace("%template_url", $template_url, $object);

    if ($assetFolder == 'js' || $assetFolder == 'json') {
      $objectMinified = new Minify\JS($object);
    } elseif ($assetFolder == 'css') {
      $objectMinified = new Minify\CSS($object);
    }

    $objectMinified->minify($cachedObject);
    $object = file_get_contents($realObject);

  }

  if ($inline) {
    return $object;
  } else {
    return $theLink;
  }

}

function GetImageCache($asset, $size=null, $type='png', $compression=80, $full_image=false) {

  global $template_dir;
  global $template_url;

  $assetsCacheLocation = $template_dir . '/cache/assets/';

  if(!is_dir($assetsCacheLocation)) {
    mkdir($assetsCacheLocation, 0755, true);
  }

  $realObject = $template_dir . '/assets/' . $asset;
  $cachedObjectAppend = md5($asset . $size) . '.' . $type;
  $cachedObject = $assetsCacheLocation . $cachedObjectAppend;

  $object = file_get_contents($cachedObject);
  $theLink = $template_url . '/cache/assets/' . $cachedObjectAppend;

  if (!$object) {

    $manager = new ImageManager();

    $image = $manager->make($realObject);

    if (is_array($size)) {
      $image->resize($size['x'], $size['y']);
    } elseif ($size !== null) {
      $image->resize($size, $size);
    }

    $image->save($cachedObject, $compression);

  }

  if ($full_image) {
    return $object;
  } else {
    return $theLink;
  }

}

// Very dangerous function, keep away from children.
function delete_directory($dirname) {
  if (is_dir($dirname))
    $dir_handle = opendir($dirname);
  if (!$dir_handle)
    return false;
  while($file = readdir($dir_handle)) {
    if ($file != "." && $file != "..") {
      if (!is_dir($dirname."/".$file))
        unlink($dirname."/".$file);
      else
        delete_directory($dirname.'/'.$file);
    }
  }
  closedir($dir_handle);
  rmdir($dirname);
  return true;
}

function delete_cache($cacheName) {
  global $template_dir;
  $cache = $template_dir . '/cache/' . $cacheName;
  return guyra_output_json(delete_directory($cache), true);
}
