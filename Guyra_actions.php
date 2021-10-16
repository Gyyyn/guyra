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
      guyra_database($_GET['create_db']);
    }

    if ($_GET['change_option']) {
      guyra_update_user_meta(1, $_GET['change_option'], $_GET['value']);
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

      if (!is_object(get_page_by_title('Action'))) {
        $post_data['post_title'] = 'Action';
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
