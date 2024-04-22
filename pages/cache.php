<?php

global $site_root;
global $nests;
global $cache_dir;
global $isPublicFile;

require_once $site_root . '/functions/Server.php';

$requestedCache = $nests[2];
$requestedFile = $nests[3];
$requestedFilePath = $cache_dir . '/' . $requestedCache . '/' . $requestedFile;

if ($isPublicFile) {
  $requestedFilePath = $site_root . '/public/' . implode('/', $nests);
}

$isValid = file_exists($requestedFilePath);

if (!$isValid)
HandleServerError([
  'err' => 'Page 404: ' . $requestedFilePath,
  'message' => 'Page not found'
], 404);

$mime_types = generateUpToDateMimeArray();
$fileMime = $mime_types[explode('.', $requestedFilePath)[1]];

header('Content-type: ' . $fileMime);

readfile($requestedFilePath);