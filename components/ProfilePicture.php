<?php
global $template_dir;
global $template_url;

function Guyra_get_profile_picture($user, $classlist=null, $onlylink=false) {

  $user_data = guyra_get_user_data($user);
  $profile_picture_url = $user_data['profile_picture_url'];

  $classes = [
    'avatar'
  ];

  if (is_array($classlist)) {

    foreach ($classlist as $key) {
      $classes[] = $key;
    }

  } else {

    $classes[] = $classlist;

  }

  if ($onlylink) {
    return $profile_picture_url;
  } else {
    $output = sprintf('<img class="%s" alt="profile-picture" src="%s">', implode(' ', $classes), $profile_picture_url);

    return $output;
  }

}
