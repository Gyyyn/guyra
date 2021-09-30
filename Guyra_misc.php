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
    'post_content'  => 'Welcome to Guyrá!',
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

  // If user has a group assigned he should see the group's page instead
  if ($user_studygroup != '') {
    $user_hasgroup = true;
    $user_studypage_object = get_page_by_title(sha1($user_studygroup), 'OBJECT', 'post');
  } else {
    $user_studypage_object = get_page_by_title(sha1($user), 'OBJECT', 'post');
  }

  // Create a page for this user if one does not exist
  if ($user_studypage_object == null) {

    if ($user_hasgroup) {
      $user_studypage_object = CreateStudyPage($user_studygroup);
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

  $args = array(
    'post_id' => $object->ID,
    'date_query' => array(
      'after' => '1 weeks ago',
      'before' => 'tomorrow',
      'inclusive' => true,
    )
  );

  $comments = get_comments( $args );

  if($comments != '') {
    echo '<ol class="comment-list ms-0 p-0">';
    wp_list_comments(
      array(
        'style'      => 'ol',
        'short_ping' => true,
      ),
      $comments
    );
    echo '</ol>';
  }

  if ($reply_box) {
    ?>

    <form action="<?php echo get_site_url() . '/?comment=1' ?>" method="post" id="commentform" class="form-control">
      <textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" required="required"></textarea>
      <input type="file" name="attachment" accept="image/jpeg,image/jpg,image/gif,image/png">
      <span class="form-submit">
        <input name="submit" type="submit" id="submit" class="btn-tall blue" value="Deixar resposta">
        <input type="hidden" name="comment_post_ID" value="144" id="comment_post_ID">
      </span>
    </form>

    <?php
  }

}
