<?php
/**
 * Admin actions
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
 exit; // Exit if accessed directly
}

$thisUserId = get_current_user_id();
$thisUser = get_user_meta($thisUserId);
$user = $_GET['user'];
$redirect = $_GET['redirect'];

if (!$_GET['redirect']) {
  $redirect = get_site_url();
}

include get_template_directory() . '/Guyra_misc.php';

// Case where user is site admin
if (current_user_can('manage_options')) {

  if($user) {

    if ($_GET['assigntoteacher']) {
      update_user_meta($user, 'teacherid', $_GET['assigntoteacher'] );
    }

    if ($_GET['assigntogroup']) {
      update_user_meta($user, 'studygroup', $_GET['assigntogroup'] );
    }

    if ($_GET['cleargroup']) {
      delete_user_meta($user, 'studygroup' );
    }

    if ($_GET['litetill']) {
      update_user_meta($user, 'subscription', 'lite' );
      update_user_meta($user, 'subscribed-until', $_GET['litetill'] );
    }

    if ($_GET['premiumtill']) {
      update_user_meta($user, 'subscription', 'premium' );
      update_user_meta($user, 'subscribed-until', $_GET['premiumtill'] );
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
      guyra_database($_GET['create_db']);
    }

    if ($_GET['change_option']) {
      guyra_update_user_meta(1, (string) $_GET['change_option'], (string) $_GET['value']);
    }

    if ($_GET['create_page'] == "all") {

      $post_data = array(
    		'post_title'    => '',
    		'post_content'  => '',
    		'post_status'   => 'publish',
    		'post_type'     => 'page',
    		'post_author'   => 1,
    		'page_template' => null
    	);

      if (!is_object(get_page_by_title('Register'))) {
        $post_data['post_title'] = 'Register';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Practice'))) {
        $post_data['post_title'] = 'Practice';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Work With Us'))) {
        $post_data['post_title'] = 'Work With Us';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Privacy Policy'))) {
        $post_data['post_title'] = 'Privacy Policy';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Reference'))) {
        $post_data['post_title'] = 'Reference';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Schools'))) {
        $post_data['post_title'] = 'Schools';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Terms'))) {
        $post_data['post_title'] = 'Terms';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Thanks'))) {
        $post_data['post_title'] = 'Thanks';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Questions'))) {
        $post_data['post_title'] = 'Questions';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Purchase'))) {
        $post_data['post_title'] = 'Purchase';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Home'))) {
        $post_data['post_title'] = 'Home';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Classroom'))) {
        $post_data['post_title'] = 'Classroom';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Courses'))) {
        $post_data['post_title'] = 'Courses';
        wp_insert_post($post_data);
      }

      if (!is_object(get_page_by_title('Comment'))) {
        $post_data['post_title'] = 'Comment';
        wp_insert_post($post_data);
      }

      // This one is last so there's not danger of putting the
      // 'post_title' everywhere else
      if (!is_object(get_page_by_title('Account'))) {
        $post_data['post_title'] = 'Account';
        $post_data['post_content'] = '[user_registration_my_account]';
        wp_insert_post($post_data);
      }

    }

  }

}

// Case where user is a teacher

if ($thisUser['role'][0] == "teacher") {

  $users = get_users();

  foreach ($users as $x) {

    $userdata = get_user_meta($x->ID);

    if ($userdata['teacherid'][0] == $thisUserId) {
      $allowedUsers[] = $x->ID;
    }
  }

  if(in_array($user, $allowedUsers)) {

    if ($_GET['assigntogroup']) {
      update_user_meta($user, 'studygroup', $_GET['assigntogroup'] );
    }

    if ($_GET['meetinglink']) {
      guyra_update_user_meta($user, 'meetinglink', $_GET['meetinglink']);
    }

    if ($_GET['cleargroup']) {
      delete_user_meta($user, 'studygroup' );
    }

  }

  $user_is_users = json_decode($user);

  // If we got a list of users there is only a few possible things we can do
  if (is_array($user_is_users)) {

    if ($_GET['meetinglink']) {

      foreach ($user_is_users as $user) {
        guyra_update_user_meta($user, 'meetinglink', $_GET['meetinglink']);
      }

    }

  }

}

// Non admin actions

if ($_GET['get_user_meta']) {
  guyra_database('get_user_meta', null, $thisUserId);
}

if ($_GET['update_elo'] && $_GET['value']) {
  guyra_database('update_elo', $_GET['value'], $thisUserId);
}

if ($_GET['update_level'] && $_GET['value']) {
  guyra_database('update_level', $_GET['value'], $thisUserId);
}

if ($_GET['log_exercise_data']) {
  guyra_log_to_db($thisUserId, file_get_contents('php://input'));
}

if ($_GET['teacher_code']) {
  update_user_meta( $user, 'teacherid', Guyra_hash($_GET['teacher_code'], true) );
}

// Redirect to main once we are done.
wp_redirect($redirect);
