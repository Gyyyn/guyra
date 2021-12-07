<?php

require $template_dir . '/vendor/autoload.php';

include_once $template_dir . '/components/ProfilePicture.php';
include_once $template_dir . '/components/Icons.php';

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

  global $current_user_id;
  global $current_user_data;

  if ($current_user_id == $user) {
    $userdata = $current_user_data;
  } else {
    $userdata = guyra_get_user_data($user);
  }

  $user_studygroup = $userdata['studygroup'];
  $user_teacherid = $userdata['teacherid'];
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

function RenderHTMLReplyBox($comment_post_ID, $comment_parent=0, $redirect=false) {

  global $site_api_url;
  global $gi18n;

  ?>
  <form action="<?php echo $site_api_url . '?post_reply=1' ?>" method="POST" id="commentform" class="form-control" enctype="multipart/form-data">
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

function RenderReplyBox($comment_post_ID, $comment_parent=0, $redirect=false) {

  global $site_api_url;
  global $gi18n;

  ?>
  <h2 class="text-blue"><?php echo $gi18n['leave_reply'] ?></h2>
  <div class="dialog-box">
    <textarea id="comment"></textarea>
  </div>

  <div class="mb-3">
    <span><?php echo $gi18n['attached'] . ': '; ?></span><span id="file_list"></span>
  </div>

  <label class="me-3 w-25">
    <input id="file_upload_input" class="d-none" type="file" name="file" accept="image/jpeg,image/jpg,image/gif,image/png">
    <a id="file_upload_button" class="btn-tall blue"><img class="page-icon tiny" alt="upload" src="<?php echo GuyraGetIcon('add-image.png'); ?>"></a>
  </label>

  <button id="submitReply" class="btn-tall blue w-50"><?php echo $gi18n['leave_reply']; ?></button>

  <script type="text/javascript">

  function CommentSubmit() {
    var form_data = new FormData();

    var theFiles = document.getElementById('file_upload_input');
    if (theFiles.files.length > 0) {
      form_data.append('file', theFiles.files[0]);
    }

    form_data.append('comment_post_ID', <?php echo $comment_post_ID; ?>);
    form_data.append('comment_parent', <?php echo $comment_parent; ?>);
    form_data.append('comment_content', easyMDE.value());

    fetch(
       '<?php echo $site_api_url; ?>' + '?post_reply=1',
      {
        method: "POST",
        body: form_data
      }
    ).then(res => res.json())
    .then(res => {
      if (res[0] != 'true') {
        console.log(res[0]);
      } else {
        if (easyMDE) {
          easyMDE.value('');
          easyMDE.clearAutosavedValue();
        }
        location.reload();
      }
    });
  }

  var submitReply = document.getElementById('submitReply');
  submitReply.onclick = CommentSubmit;

  </script>

  <?php
}

function GetUserStudyPage_comments($user, $reply_box=true, $all_comments=false, $max_history='1 weeks ago', $redirect=false) {

  global $gi18n;
  global $current_user_id;

  $object = GetUserStudyPage_object($user);
  $alreadyAnswered = [];

  $args = [
    'post_id' => $object->ID,
    'date_query' => [
      'after' => $max_history,
      'before' => 'tomorrow',
      'inclusive' => true
    ]
  ];

  $comments = get_comments($args);

  foreach ($comments as $comment) {

    $user_data = guyra_get_user_data($comment->user_id);
    $first_name = $user_data['first_name'];

    // Build a list of people who already answered
    if ( (!in_array($first_name, $alreadyAnswered)) && $current_user_id != $comment->user_id) {
      if ($comment->comment_parent == 0) {
        $alreadyAnswered[] = $first_name;
      }
    }

    if ( ($comment->comment_parent == 0 && $comment->user_id == $user) || ($all_comments && $comment->comment_parent == 0)):
    $profile_picture = Guyra_get_profile_picture($comment->user_id, ['page-icon', 'tiny']);
    $comment_image = get_comment_meta($comment->comment_ID, 'comment_image')[0];
    $comment_date_formatted = date_format(date_create($comment->comment_date), 'd/m/Y H:i:s');
    $children = $comment->get_children();

    ?>

    <div class="comment-body">

      <div class="comment-meta">
        <span class="author-name">
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
      <div class="collapse my-3">
        <?php RenderHTMLReplyBox($object->ID, $comment->comment_ID, $redirect); ?>
      </div>
      <?php endif; ?>

      <div class="comment-content dialog-box">
		    <?php

        $Parsedown = new Parsedown();
        $Parsedown->setSafeMode(true);

        echo nl2br($Parsedown->text($comment->comment_content));

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

  if ($reply_box) {

      $howManyAnswered = count($alreadyAnswered);

      if ($howManyAnswered > 0) {
        ?> <p class="dialog-box info d-inline-block mt-3 already-answered fst-italic"> <?php
        if ($howManyAnswered == 1):
          echo $alreadyAnswered[0] . ' ' . $gi18n['already_answered_singular'] . '!';
        elseif ($howManyAnswered > 1):
          echo implode($alreadyAnswered, ', ') . ' ' . $gi18n['already_answered'] . '!';
        endif;if ($howManyAnswered == 1):
          echo $alreadyAnswered[0] . ' ' . $gi18n['already_answered_singular'] . '!';
        elseif ($howManyAnswered > 1):
          echo implode($alreadyAnswered, ', ') . ' ' . $gi18n['already_answered'] . '!';
        endif;
        ?> </p><?php
      }

    ?>

    <div class="mt-5">
      <?php RenderReplyBox($object->ID); ?>
    </div>

    <?php
  }

}
