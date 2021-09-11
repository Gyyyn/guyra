<?php
/**
 * Logged in user home page
 *
 * @package guyra
 */

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
$newspage = get_page_by_title('News');

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

get_header();

?>
<main id="intro-content" class="site-main study squeeze position-relative mb-5">

  <?php if (current_user_can('manage_options')): ?>
  <a class="btn btn-tall position-absolute top-0 start-0 admin-btn" href="<?php echo $gi18n['guyra_admin_link'] ?>">
    🎁
  </a>
  <?php endif; ?>

  <div class="page-squeeze">

    <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden">
      <a class="list-group-item" data-bs-toggle="collapse" href="#study-container" role="button" aria-expanded="true" aria-controls="study-container">
        <span class="menu-icon"><img alt="homework" src="<?php echo $gi18n['template_link'] . '/assets/icons/light.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['study']; ?></span>
      </a>

      <a class="list-group-item" href="<?php echo $gi18n['practice_link'] ?>">
        <span class="menu-icon"><img alt="practice" src="<?php echo $gi18n['template_link'] . '/assets/icons/target.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['practice']; ?></span>
      </a>

      <a href="<?php echo get_site_url() ?>/reference" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/notebook.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference']; ?></span>
      </a>

      <a href="<?php echo get_site_url() ?>/courses" class="list-group-item disabled position-relative">
        <span class="position-absolute top-50 start-50 translate-middle badge bg-primary rounded-pill">Soon!</span>
        <span class="menu-icon"><img alt="courses" src="<?php echo $gi18n['template_link'] . '/assets/icons/online-learning.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['courses']; ?></span>
      </a>
    </div>

    <?php if (is_object($newspage)) {

      echo '<div class="alert study-news rounded-box position-relative alert-dismissible fade show" role="alert">';
      ?>
      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['whatsnew']; ?></h2>
        <span class="page-icon small"><img alt="sparkle" src="<?php echo get_template_directory_uri(); ?>/assets/icons/star.png"></span>
      </div>
      <?php
      echo apply_filters('the_content', $newspage->post_content);
      echo '<a type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick="setCookie(\'dismissed\', true, 1);"></a>';
      echo '</div>';

    } ?>

    <div class="study-page rounded-box position-relative show" id="study-container">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="text-primary"><?php echo $gi18n['studypage_homework_title']; ?></h1>
        <span class="page-icon"><img alt="learning" src="<?php echo get_template_directory_uri(); ?>/assets/icons/light.png"></span>
      </div>

      <?php echo apply_filters('the_content', $user_studypage_object->post_content); ?>

    </div>

    <div class="study-answers rounded-box">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="text-primary"><?php echo $gi18n['studypage_homework_replytitle']; ?></h1>
        <span class="page-icon"><img alt="homework" src="<?php echo get_template_directory_uri(); ?>/assets/icons/pencil.png"></span>
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

      <?php comment_form( array(
        'title_reply' => '',
        'label_submit' => 'Deixar resposta',
        'class_submit' => 'btn-tall blue',
        'class_form' => 'form-control'
      ), $user_studypage_object->ID); ?>

    </div>

  </div>

</main>

<script async>
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}

if (getCookie('dismissed') == "true") {
  document.querySelector('.alert').className = 'd-none';
}
</script>
<?php
get_footer();
