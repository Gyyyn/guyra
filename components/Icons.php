<?php

global $template_dir;

include_once $template_dir . '/functions/Assets.php';

function GuyraGetIcon($path, $size=64, $rawFile=false) {
  global $template_url;

  if ($rawFile == true) {
    $r = $template_url . '/assets/icons/' . $path;
  } else {
    $r = GetImageCache('icons/' . $path, $size);
  }

  return $r;
}
