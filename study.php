<?php
/**
 * Logged in user home page
 *
 * @package guyra
 */

get_header();

// Sanity check, unlogged users shouldn't be here
if (!is_user_logged_in()) {
  wp_redirect(get_site_url());
}

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

// Here we see a system where users see a page with the assigned homework
// which can be accessed by sha1ning their group tag or user id, depending on
// which should appear
$current_user = get_current_user_id();
$user_studypage = get_user_meta($current_user, 'custompage_id')[0];
$user_studygroup = get_user_meta($current_user, 'studygroup')[0];

// If user has a group assigned he should see the group's page instead
if ($user_studygroup != '') {
  $user_hasgroup = true;
  $user_studypage_object = get_page_by_title(sha1($user_studygroup), 'OBJECT', 'post');
} else {
  $user_studypage_object = get_page_by_title($user_studypage, 'OBJECT', 'post');
}

if ($user_studypage == '') {
  // User seems to have no study page assigned, create one or reassign from id
  update_user_meta($current_user, 'custompage_id', sha1($current_user) );
  $user_studypage = get_user_meta($current_user, 'custompage_id')[0];
}

// Create a page for this user if one does not exist
if ($user_studypage_object == null) {

  if ($user_hasgroup) {
    $post_title = sha1($user_studygroup);
  } else {
  $post_title = $user_studypage;
  }
  $post_data = array(
		'post_title'    => $post_title,
		'post_content'  => 'Welcome to Guyra!',
		'post_status'   => 'publish',
		'post_type'     => 'post',
		'post_author'   => 1,
		'page_template' => null,
    'comment_status' => 'open'
	);
	wp_insert_post($post_data);
  $user_studypage = get_user_meta($current_user, 'custompage_id')[0];

  // redirect back to restart this mess
  wp_redirect(get_site_url());
}

?>
<main id="intro-content" class="site-main squeeze">

  <div class="page-squeeze" data-aos="fade-up" data-aos-once="true"><div>
    <div class="list-group list-group-horizontal container-fluid overflow-hidden">
      <a href="<?php echo get_site_url() ?>" class="list-group-item active">Homework</a>
      <a href="<?php echo get_site_url() ?>/courses" class="list-group-item">Courses</a>
      <a class="list-group-item disabled">Practice <span class="badge bg-primary rounded-pill">Soon!</span></a>
      <?php if(current_user_can('manage_options')) { echo '
        <a class="list-group-item" data-bs-toggle="collapse" href="#collapse-admin" role="button" aria-expanded="false" aria-controls="collapse-admin">
          Admin panel
        </a>
        '; } ?>
    </div>
    <?php
    // If current user is admin allow him to access all user pages
    if (current_user_can('manage_options')) {

      echo '<div class="collapse hide" id="collapse-admin">';
      // Get users
      $users = get_users();
      echo '
      <h4>User admin:</h4>
      <div class="mb-4 alert alert-info" role="alert">
        <p>Everything in this panel is pretty basic and easy to break to make sure to follow instructions exactly!</p>

        <p>To add an user to a group get the ID of the user listed below and type the tag of the group.
        Users with the same tag will see the same homework page.</p>
      </div>
      ';
      ?>
      <h5 class="mt-4">Management:</h5>
      <div class="admin-forms border rounded p-5 m-0">

        <h5>Assign to group:</h5>
        <form action="<?php echo get_site_url(); ?>" method="GET">
            User ID: <input type="text" name="user">
            Group tag: <input type="text" name="assigntogroup">
            <input type="submit" value="Go" />
        </form>

        <hr />

        <h5>Assign to teacher:</h5>
        <form action="<?php echo get_site_url(); ?>" method="GET">
            User ID: <input type="text" name="user">
            Teacher ID: <input type="text" name="assigntoteacher">
            <input type="submit" value="Go" />
        </form>

        <hr />

        <h5>Give premium:</h5>
        <form action="<?php echo get_site_url(); ?>" method="GET">
            User ID: <input type="text" name="user">
            dd-mm-yyyy formatted date: <input type="text" name="premiumtill">
            <input type="submit" value="Go" />
        </form>

        <h5>Give lite:</h5>
        <form action="<?php echo get_site_url(); ?>" method="GET">
            User ID: <input type="text" name="user">
            dd-mm-yyyy formatted date: <input type="text" name="litetill">
            <input type="submit" value="Go" />
        </form>

      </div>
      <?php
      echo '<h5 class="mt-4">Info:</h5>';
      echo '<ul class="list-group m-0">';
      foreach ($users as $x) {
        // Lord have mercy on those who will maintain this shit
        $userdata = get_user_meta($x->ID);

        if($userdata['studygroup'][0] != "") {
          $page_link = get_site_url() . '/' . sha1($userdata['studygroup'][0]);
        } else {
          $page_link = get_site_url() . '/' . sha1($x->ID);
        }

        echo '<li class="list-group-item">' .
        'ID: ' . $x->ID . ' ' .
        '<a href="' . $page_link . '">' .
        $userdata['first_name'][0] . ' ' .
        $userdata['last_name'][0] . '</a> ' .
        $x->user_email . ' | ' .
        '<span class="text-muted text-end">' .
        'Group: <span class="badge bg-secondary">' . $userdata['studygroup'][0] . '</span>' .
        '</span> ' .
        '<a href="' . get_site_url() . '/?short_load=1&cleargroup=1&user=' . $x->ID . '" class="btn btn-outline-primary btn-sm">Clear Group</a>' .
        '</li>';

      }
      echo '</ul>';

      echo '<hr />';
      echo '</div>';
    } // Admin panel

    ?> <div class="study-page position-relative">
    <div class="d-flex justify-content-between align-items-center my-5">
      <h2><?php echo $gi18n['studypage_homework_title']; ?></h2>
      <span class="page-icon"><img src="<?php echo get_template_directory_uri(); ?>/assets/icons/book.png"></span>
    </div>

    <?php echo apply_filters('the_content', $user_studypage_object->post_content); ?>

    </div>

    <hr class="my-5" />

    <div class="study-answers">
    <div class="d-flex justify-content-between align-items-center my-5">
      <h2><?php echo $gi18n['studypage_homework_replytitle']; ?></h2>
      <span class="page-icon"><img src="<?php echo get_template_directory_uri(); ?>/assets/icons/pencil.png"></span>
    </div>

    <?php
    $args = array(
      'post_id' => $user_studypage_object->ID,
      'date_query' => array(
        'after' => '4 weeks ago',
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
    ?>

    </div>

    <?php comment_form( array('title_reply' => '', 'label_submit' => 'Deixar resposta'), $user_studypage_object->ID); ?>

  </div></div>

</main>
<?php
get_footer();
