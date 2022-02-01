<?php
global $template_dir;
global $template_url;

function Guyra_get_profile_picture($user, $classlist=null, $onlylink=false) {

  global $site_api_url;
  global $current_user_id;
  global $current_user_data;

  if (is_array($user)) {
    $user_data = $user;
  } else {

    if ($user == $current_user_id) {
      $user_data = $current_user_data;
    } else {
      $user_data = guyra_get_user_data($user);
    }

  }

  $profile_picture_url = $user_data['profile_picture_url'];

  // If no profile picture is set we are going to use a hashed generator.
  if ($profile_picture_url == '') {
    $theHash = $user_data['first_name'] . $user_data['last_name'];
    $profile_picture_url = $site_api_url . '?get_identicon=1&hash=' . $theHash;
  }

  if ($onlylink) {
    return $profile_picture_url;
  } else {

    $classes = ['avatar'];

    if (is_array($classlist)) {
      foreach ($classlist as $key) {
        $classes[] = $key;
      }
    } else {
      $classes[] = $classlist;
    }

    $output = sprintf('<img class="%s" alt="profile-picture" src="%s">', implode(' ', $classes), $profile_picture_url);
    return $output;

  }

}
