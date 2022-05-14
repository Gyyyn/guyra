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
  if (!$object || $gSettings['dev_env'] == 1) {

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

function GuyraHandleFileUpload() {

  global $is_GroupAdmin;

  $maxfilesize = 10000000;
  $fileGlobalId = 'file';
  $theFile = $_FILES[$fileGlobalId];

  // EasyMDE uses a different image name.
  if ($_GET['easymde']) {
    $theFile = $_FILES['image'];
  }

  try {

    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.
    if (
        !isset($theFile['error']) ||
        is_array($theFile['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    // check for errors
    switch ($theFile['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }

    // check filesize
    if ($theFile['size'] > $maxfilesize) {
      throw new RuntimeException('Exceeded filesize limit.');
    }

    // check MIME
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search(
        $finfo->file($theFile['tmp_name']),
        array(
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
        ),
        true
    )) {
      throw new RuntimeException('Invalid file format.');
    }

    global $cache_dir;
    global $template_url;

    // check the cache dir.
    $assetsCacheLocation = $cache_dir . '/assets';

    if(!is_dir($assetsCacheLocation)) {
      mkdir($assetsCacheLocation, 0755, true);
    }

    // upload compressed to jpg.
    $manager = new ImageManager();
    $compression = 25;
    $ext = '.jpg';

    // Set all the file paths. We don't use the ext directly yet to check for duplicates later.
    $uploadFileAppend = '/' . md5($current_user_id . '_' . $theFile['name']);
    $uploadFileURL = $template_url . '/cache/assets' . $uploadFileAppend;
    $uploadFile = $assetsCacheLocation . $uploadFileAppend;

    $image = $manager->make($theFile['tmp_name']);

    if (file_get_contents($uploadFile . $ext)) {

      // Group admins can upload more than one picture.
      if ($is_GroupAdmin) {

        $randomness = md5(time());

        $uploadFile = $uploadFile . '_' . $randomness;
        $uploadFileURL = $uploadFileURL . '_' . $randomness;

      } else {
        unlink($uploadFile . $ext);
      }

    }

    // Finally set the final paths.
    $uploadFile = $uploadFile . $ext;
    $uploadFileURL = $uploadFileURL . $ext;

    $image->save($uploadFile, $compression);

    if (!$image) {
      throw new RuntimeException('Failed to move uploaded file.');
    }

    if ($_GET['easymde']) {
      guyra_output_json([
        'data' => ['filePath' => $uploadFileURL]
      ], true);
    }

    guyra_output_json($uploadFileURL, true);

  } catch (RuntimeException $e) {

    if ($_GET['easymde']) {
      guyra_output_json(['error' => $e->getMessage()], true);
    }

    guyra_output_json(['false', $e->getMessage()], true);

  }

}
