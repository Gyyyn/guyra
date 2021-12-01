<?php
/**
 * Functions with no category
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $site_url;
global $is_logged_in;
global $current_user_id;

if (!defined('ABSPATH')) { exit; }

function GuyraGetIcon($path='') {
  global $template_url;
  return $template_url . '/assets/icons/' . $path;
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

function Guyra_get_user_level($user=1) {

  $level = guyra_get_user_meta($user, 'level', true)['meta_value'];

  if (!$level) {
    $level = '1';
    guyra_update_user_meta($user, 'level', $level);
  }

  return $level;

}

function Guyra_increase_user_level($user=1, $amount=1) {

  $level = Guyra_get_user_level($user);

  $amount = $level + $amount;

  guyra_update_user_meta($user, 'level', $amount);

}

function GetUserRanking($user=1) {

  if (!$user == 0) {

    $elo = guyra_get_user_meta($user, 'elo', true)['meta_value'];
    $level = Guyra_get_user_level($user);

    if (!$elo) {
      $elo = '1';
      guyra_update_user_meta($user, 'elo', $elo);
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

function GetUserStudyPage($user, $returnObject=false) {

  $object = GetUserStudyPage_object($user);

  if ($returnObject) {
    return $object;
  } else {
    echo apply_filters('the_content', $object->post_content);
  }

}


function RenderReplyBox($comment_post_ID, $user_id, $comment_author_email, $comment_author, $comment_parent=0, $redirect=false) {

global $gi18n;

  ?>
  <form action="<?php echo get_site_url() . '/comment' ?>" method="POST" id="commentform" class="form-control" enctype="multipart/form-data">
    <textarea id="comment" name="comment_content" cols="45" rows="8" maxlength="65525" required="required"></textarea>

    <div class="mb-3">
      <span><?php echo $gi18n['attached'] . ': '; ?></span><span id="file_list"></span>
    </div>

    <span class="form-submit">

      <label class="me-3 w-25">
        <input id="file_upload_input" class="d-none" type="file" name="file" accept="image/jpeg,image/jpg,image/gif,image/png">
        <a id="file_upload_button" class="btn-tall blue"><img class="page-icon tiny" alt="upload" src="<?php echo GuyraGetIcon('add-image.png'); ?>"></a>
      </label>

      <input name="submit" type="submit" id="submit" class="btn-tall blue w-50" value="Deixar resposta">

      <input type="hidden" name="comment_post_ID" value="<?php echo $comment_post_ID; ?>" id="comment_post_ID">
      <input type="hidden" name="user_id" value="<?php echo $user_id; ?>" id="comment_user_ID">
      <input type="hidden" name="comment_author_email" value="<?php echo $comment_author_email; ?>" id="comment_author_email">
      <input type="hidden" name="comment_author" value="<?php echo $comment_author; ?>" id="comment_author">
      <?php if ($comment_parent != 0): ?>
      <input type="hidden" name="comment_parent" value="<?php echo $comment_parent; ?>" id="comment_parent">
      <?php endif; ?>
      <?php if ($redirect): ?>
      <input type="hidden" name="redirect" value="<?php echo $redirect; ?>">
      <?php endif; ?>
    </span>
  </form>
  <?php
}

function GetUserStudyPage_comments($user, $reply_box=true, $all_comments=false, $max_history='1 weeks ago', $redirect=false) {

  global $gi18n;
  global $current_user_id;

  $object = GetUserStudyPage_object($user);
  $current_user = wp_get_current_user();
  $alreadyAnswered = [];

  $args = [
    'post_id' => $object->ID,
    'date_query' => [
      'after' => $max_history,
      'before' => 'tomorrow',
      'inclusive' => true
    ]
  ];

  // if ($all_comments == false) {
  //   $args['user_id'] = $user;
  // }

  $comments = get_comments($args);

  foreach ($comments as $comment) {

    $first_name = get_user_meta( $comment->user_id, 'first_name', true );

    // Build a list of people who already answered
    if ( (!in_array($first_name, $alreadyAnswered)) && $current_user_id != $comment->user_id) {
      if ($comment->comment_parent == 0) {
        $alreadyAnswered[] = $first_name;
      }
    }

    if ( ($comment->comment_parent == 0 && $comment->user_id == $user) || ($all_comments && $comment->comment_parent == 0)):

    $profile_picture = Guyra_get_profile_picture($comment->user_id, ['page-icon', 'tiny']);
    $comment_image = get_comment_meta($comment->comment_ID, 'comment_image')[0];
    if (empty($first_name)) {
    	$first_name = $comment->comment_author;
    }

    $comment_date_formatted = date_format(date_create($comment->comment_date), 'd/m/Y H:i:s');

    $children = $comment->get_children();

    ?>

    <div id="comment-<?php echo $comment->comment_ID; ?>" class="comment-body">

      <div class="comment-meta">
        <span id="user-<?php echo $comment->user_id; ?>" class="author-name">
          <?php echo $profile_picture; ?>
          <span class="ms-1"><?php echo $first_name; ?></span>
          <?php if ($all_comments): ?>
          <span>
            <a class="btn-tall btn-sm blue ms-1" data-bs-toggle="collapse" href="#replyto-<?php echo $comment->comment_ID; ?>" role="button">
              <i class="bi bi-reply-fill"></i>
            </a>
          </span>
          <?php endif; ?>
        </span>
        <span class="comment-time text-small text-muted"><?php echo $comment_date_formatted; ?></span>
      </div>

      <?php if ($all_comments): ?>
      <div class="collapse my-3" id="replyto-<?php echo $comment->comment_ID; ?>">
        <?php RenderReplyBox($object->ID, $current_user->ID, $current_user->user_email, $current_user->display_name, $comment->comment_ID, $redirect); ?>
      </div>
      <?php endif; ?>

      <div class="comment-content dialog-box">
		    <?php

        echo nl2br($comment->comment_content);

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

        <?php if (!empty($children)): ?>
          <hr />
          <?php foreach ($children as $comment):
            $first_name = get_user_meta( $comment->user_id, 'first_name', true );
            if (empty($first_name)) {
            	$first_name = $comment->comment_author;
            }
            $comment_image = get_comment_meta($comment->comment_ID, 'comment_image')[0];
            ?>
            <div id="comment-<?php echo $comment->comment_ID; ?>" class="comment-body">
              <div class="comment-content dialog-box info">
                <div class="comment-meta mb-1 text-small">
                  <span id="user-<?php echo $comment->user_id; ?>">
                    <span class="ms-1"><?php echo $first_name . ': '; ?></span>
                  </span>
                </div>
                <?php

                echo nl2br($comment->comment_content);

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
          <?php endforeach; ?>
        <?php endif; ?>
    	</div>

    </div>

  <?php

  endif;

  }

  if ($reply_box) { ?>

    <p class="already-answered fst-italic">
    <?php
      $howManyAnswered = count($alreadyAnswered);
      if ($howManyAnswered == 1):
        echo $alreadyAnswered[0] . ' ' . $gi18n['already_answered_singular'] . '!';
      elseif ($howManyAnswered > 1):
        echo implode($alreadyAnswered, ', ') . ' ' . $gi18n['already_answered'] . '!';
      endif;
    ?>
    </p>

    <?php RenderReplyBox($object->ID, $current_user->ID, $current_user->user_email, $current_user->display_name);
  }

}
