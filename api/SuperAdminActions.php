<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_gamedata;
global $site_url;

$user = $_GET['user'];

// ---
// Manually assign a user to a group admin.
// ---
if ($_GET['assigntoteacher']) {
  guyra_update_user_data($user, [
    'teacherid' => $_GET['assigntoteacher'],
    'studygroup' => ''
  ]);
}

// ---
// Manually give a user a subscription plan.
// ---
if ($_GET['subscription']) {
  guyra_update_user_data($user, [
    'subscription' => $_GET['subscription'],
    'subscribed_until' => $_GET['till'],
    'subscribed_since' => date('d-m-Y H:i:s')
  ]);
}

// ---
// Manually assign a user to a role.
// ---
if ($_GET['giverole']) {

  guyra_update_user_data($user, 'role', $_GET['giverole']);

  // Temp wordpress stuff

  if ($_GET['giverole'] == 'teacher') {
    $theUser = get_userdata($user);
    $theUser->add_role('author');
    $theUser->add_cap('edit_others_posts');
    unset($theUser);
  }
}

// ---
// Manually create the databases if they don't exist.
// ---
if ($_GET['create_db']) {
  guyra_database_create_db();
}

// ---
// Change a site option.
// ---
if ($_GET['change_option']) {
  guyra_update_user_meta(1, $_GET['change_option'], $_GET['value']);
}

// ---
// Manually create all of the pages the site uses.
// ---
if ($_GET['create_page'] == "all") {

  $posts = [
    'Register',
    'Practice',
    'Work With Us',
    'Privacy Policy',
    'Reference',
    'Schools',
    'Terms',
    'Thanks',
    'Questions',
    'Purchase',
    'Classroom',
    'Courses',
    'Comment',
    'Account',
  ];

  $post_data = array(
    'post_title'    => '',
    'post_content'  => '',
    'post_status'   => 'publish',
    'post_type'     => 'page',
    'post_author'   => 1,
    'page_template' => null
  );

  foreach ($posts as $post) {

    if (is_array($post)) {
      $post_title = $post[0];
      $post_data['post_content'] = $post[1];
    } else {
      $post_title = $post;
    }

    $post_data['post_title'] = $post_title;

    (!is_object(get_page_by_title($post_title))) ? wp_insert_post($post_data) : null;

  }

}

// ---
// Delete a cache folder.
// ---
if ($_GET['delete_cache']) {

  include_once $template_dir . '/functions/Assets.php';

  delete_cache($_GET['delete_cache']);
}
