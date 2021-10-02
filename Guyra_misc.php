<?php
/**
 * Functions with no category
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

function GuyraGetIcon($path='') {
  return get_template_directory_uri() . '/assets/icons/' . $path;
}

function Guyra_hash($string, $decode=false) {

  $secret = 'aryug';

  if ($decode) {

    return str_replace($secret, "", hex2bin($string));

  } else {

    $stringAndSecret = $string . $secret;
    return bin2hex($stringAndSecret);

  }
}

include get_template_directory() . '/Guyra_database.php';

function GetUserRanking($user=0) {

  if (!$user == 0) {

    $elo = guyra_get_user_meta($user, 'elo', true)['meta_value'];
    $level = guyra_get_user_meta($user, 'level', true)['meta_value'];

    if (!$elo) {
      $elo = '1';
      guyra_update_user_meta($user, 'elo', $elo);
    }

    if (!$level) {
      $level = '1';
      guyra_update_user_meta($user, 'level', $level);
    }

    if ($elo < 17) {

      $ranking = 'bronze';
      $ranking_name = 'Bronze';

      if ($elo < 5) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } else {

        if ($elo <= 10) {
          $ranking .= '-2';
          $ranking_name .= ' 2';
        }

        if ($elo > 10) {
          $ranking .= '-3';
          $ranking_name .= ' 3';
        }

      }

    }

    if ($elo >= 17) {

      $ranking = 'silver';
      $ranking_name = 'Silver';

      if ($elo < 35) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } else {

        if ($elo <= 55) {
          $ranking .= '-2';
          $ranking_name .= ' 2';
        }

        if ($elo > 55) {
          $ranking .= '-3';
          $ranking_name .= ' 3';
        }

      }

    }

    if ($elo >= 75) {

      $ranking = 'diamond';
      $ranking_name = 'Diamond';

      if ($elo < 85) {
        $ranking .= '-1';
        $ranking_name .= ' 1';
      } else {

        if ($elo <= 85) {
          $ranking .= '-2';
          $ranking_name .= ' 2';

        }

        if ($elo > 85) {
          $ranking .= '-3';
          $ranking_name .= ' 3';
        }

      }

    }

    return [$elo, $ranking, $ranking_name, $level];

  }

  return false;

}

function CreateStudyPage($id) {

  $post_data = array(
    'post_title'    => sha1($id),
    'post_content'  => '<!-- wp:paragraph --><p> Welcome to Guyrá!</p><!-- /wp:paragraph -->',
    'post_status'   => 'publish',
    'post_type'     => 'post',
    'post_author'   => 1,
    'page_template' => null,
    'comment_status' => 'open'
  );
  $post = wp_insert_post($post_data);

  if (!is_wp_error($post)) {
    return get_post($post, 'OBJECT');
  }

}

function GetUserStudyPage_object($user) {

  $user_studygroup = get_user_meta($user, 'studygroup')[0];
  $user_teacherid = get_user_meta($user, 'teacherid')[0];
  $user_group_studypage = $user_studygroup . $user_teacherid;

  // If user has a group assigned he should see the group's page instead
  if ($user_studygroup != '') {
    $user_hasgroup = true;
    $user_studypage_object = get_page_by_title(sha1($user_group_studypage), 'OBJECT', 'post');
  } else {
    $user_studypage_object = get_page_by_title(sha1($user), 'OBJECT', 'post');
  }

  // Create a page for this user if one does not exist
  if ($user_studypage_object == null) {

    if ($user_hasgroup) {
      $user_studypage_object = CreateStudyPage($user_group_studypage);
    } else {
      $user_studypage_object = CreateStudyPage($user);
    }

  }

  return $user_studypage_object;

}

function GetUserStudyPage($user) {

  $object = GetUserStudyPage_object($user);

  echo apply_filters('the_content', $object->post_content);
}

function GetUserStudyPage_comments($user, $reply_box=true) {

  $object = GetUserStudyPage_object($user);
  $current_user = wp_get_current_user();

  $gravatar_image      = get_avatar_url($current_user->ID, $args = null);
  $profile_picture_url = get_user_meta($current_user->ID, 'user_registration_profile_pic_url', true);
  $profileimage        = ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : $gravatar_image;

  $args = array(
    'post_id' => $object->ID,
    'date_query' => array(
      'after' => '1 weeks ago',
      'before' => 'tomorrow',
      'inclusive' => true,
    )
  );

  $comments = get_comments( $args );

  foreach ($comments as $comment) {

    $comment_image = get_comment_meta($comment->comment_ID, 'comment_image')[0];
    $first_name = get_user_meta( $comment->user_id, 'first_name', true );
    if (empty($first_name)) {
    	$first_name = $comment->comment_author;
    }

    ?>

    <div id="comment-<?php echo $comment->comment_ID; ?>" class="comment-body">

      <div class="comment-meta">
        <span id="user-<?php echo $comment->user_id; ?>" class="author-name">
          <img class="page-icon tiny avatar" alt="profile-picture" src="<?php echo $profileimage; ?>">
          <span class="ms-1"><?php echo $first_name; ?></span>
        </span>
        <span class="comment-time text-small text-muted"><?php echo $comment->comment_date; ?></span>
      </div>

      <div class="comment-content">
		    <?php

        echo $comment->comment_content;

        if ($comment_image != '') { ?>
          <hr />
          <div class="comment-image position-relative">
            <a href="<?php echo $comment_image; ?>" target="_blank">
              <img alt="comment-<?php echo $comment->comment_ID; ?>-image"
              src="<?php echo $comment_image; ?>"
              class="page-icon" loading="lazy">
            </a>
            <a class="btn-tall blue download position-absolute bottom-0 start-0" href="<?php echo $comment_image; ?>" download><i class="bi bi-download"></i></a>
          </div>

          <?php } ?>
    	</div>

    </div>

  <?php }

  if ($reply_box) {
    ?>

    <form action="<?php echo get_site_url() . '/comment' ?>" method="POST" id="commentform" class="form-control" enctype="multipart/form-data">
      <textarea id="comment" name="comment_content" cols="45" rows="8" maxlength="65525" required="required"></textarea>
      <span class="form-submit">

        <label class="me-3">
          <input class="d-none" type="file" name="file" accept="image/jpeg,image/jpg,image/gif,image/png">
          <a class="btn-tall blue"><img class="page-icon tiny" alt="upload" src="<?php echo GuyraGetIcon('add-image.png'); ?>"></a>
        </label>

        <input name="submit" type="submit" id="submit" class="btn-tall blue" value="Deixar resposta">

        <input type="hidden" name="comment_post_ID" value="<?php echo $object->ID; ?>" id="comment_post_ID">
        <input type="hidden" name="user_id" value="<?php echo $current_user->ID; ?>" id="comment_user_ID">
        <input type="hidden" name="comment_author_email" value="<?php echo $current_user->user_email; ?>" id="comment_author_email">
        <input type="hidden" name="comment_author" value="<?php echo $current_user->display_name; ?>" id="comment_author">
      </span>
    </form>

    <?php
  }

}
