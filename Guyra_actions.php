<?php
/**
 * Admin actions
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
 exit; // Exit if accessed directly
}

global $template_dir;
global $template_url;
global $current_user_id;

$thisUser = get_user_meta($current_user_id);
$user = $_GET['user'];
$redirect = $_GET['redirect'];
$isAdmin = current_user_can('manage_options');

if (!$_GET['redirect']) {
  $redirect = get_site_url();
}

include $template_dir . '/Guyra_misc.php';

// Case where user is site admin
if ($isAdmin) {

  if($user) {

    if ($_GET['assigntoteacher']) {
      update_user_meta($user, 'teacherid', $_GET['assigntoteacher']);
      update_user_meta($user, 'studygroup', '');
    }

    if ($_GET['subscription']) {
      guyra_update_user_meta($user, 'subscription', $_GET['subscription']);
      guyra_update_user_meta($user, 'subscribed_until', $_GET['till']);
      guyra_update_user_meta($user, 'subscribed_since', date('d-m-Y H:i:s'));
    }

    if ($_GET['giverole']) {
      update_user_meta($user, 'role', $_GET['giverole'] );

      if ($_GET['giverole'] == 'teacher') {
        $theUser = get_userdata($user);
        $theUser->add_role('author');
        $theUser->add_cap('edit_others_posts');
        unset($theUser);
      }
    }

    if ($_GET['create_db']) {
      guyra_database_create_db();
    }

    if ($_GET['change_option']) {
      guyra_update_user_meta(1, $_GET['change_option'], $_GET['value']);
    }

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
        'Action',
        ['Account', '[user_registration_my_account]']
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

  }

}

// Case where user is a teacher

if ($isAdmin || $thisUser['role'][0] == "teacher") {

  $users = get_users();

  foreach ($users as $x) {

    $userdata = get_user_meta($x->ID);

    if ($userdata['teacherid'][0] == $current_user_id) {
      $allowedUsers[] = $x->ID;
    }
  }

  if(in_array($user, $allowedUsers) || $isAdmin):

  if ($_GET['assigntogroup']) {
    update_user_meta($user, 'studygroup', $_GET['assigntogroup'] );
  }

  if ($_GET['clearteacher']) {
    update_user_meta($user, 'teacherid', 0);
    update_user_meta($user, 'studygroup', '');
  }

  if ($_GET['meetinglink']) {
    guyra_update_user_meta($user, 'meetinglink', $_GET['meetinglink']);
  }

  if ($_GET['cleargroup']) {
    delete_user_meta($user, 'studygroup' );
  }

  if ($_GET['action'] == 'get_diary') {
    guyra_get_user_meta($user, 'diary');
  }

  if ($_GET['action'] == 'update_diary') {
    guyra_update_user_meta($user, 'diary', addslashes(file_get_contents('php://input')));
  }

  endif;

  $user_is_users = json_decode($user);

  // If we got a list of users there is only a few possible things we can do
  if (is_array($user_is_users)) {

    if(in_array($user, $allowedUsers) || $isAdmin):

    if ($_GET['meetinglink']) {

      foreach ($user_is_users as $user) {
        guyra_update_user_meta($user, 'meetinglink', $_GET['meetinglink']);
      }

    }

    endif;

  }

}

// Non admin actions

if ($_GET['get_user_meta']) {
  guyra_database('get_user_meta', null, $current_user_id);
}

if ($_GET['update_elo'] && $_GET['value']) {
  guyra_database('update_elo', $_GET['value'], $current_user_id);
}

if ($_GET['update_level'] && $_GET['value']) {
  guyra_database('update_level', $_GET['value'], $current_user_id);
}

if ($_GET['log_exercise_data']) {
  guyra_log_to_db($current_user_id, addslashes(file_get_contents('php://input')));
}

if ($_GET['action'] == 'update_user_textareas') {
  guyra_update_user_meta($current_user_id, 'textareas', addslashes(file_get_contents('php://input')));
}

if ($_GET['teacher_code']) {

  $the_code = Guyra_hash($_GET['teacher_code'], true);

  if (is_numeric($the_code)) {
    update_user_meta($current_user_id, 'teacherid', $the_code);
    update_user_meta($current_user_id, 'studygroup', '');
  }

  unset($the_code);
}

// Redirect to main once we are done.
wp_redirect($redirect);
