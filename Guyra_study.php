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

global $template_dir;
global $template_url;
global $current_user_id;

/* Set up translations independent of Wordpress */
include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_misc.php';

$newspage = get_page_by_title('News');
$meeting_link = guyra_get_user_meta($current_user_id, 'meetinglink', true)['meta_value'];

get_header();

?>
<main id="intro-content" class="site-main study squeeze position-relative mb-5">

  <?php if (current_user_can('manage_options')): ?>
    <span class="position-absolute top-0 start-0 admin-btn"><a class="btn-sm btn-tall purple" href="<?php echo $gi18n['guyra_admin_link'] ?>"><i class="bi bi-gift-fill"></i></a></span>
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

      <a href="<?php echo $gi18n['home_link']; ?>/reference" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/lab.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['ultilities']; ?></span>
      </a>

      <a href="<?php echo $gi18n['courses_link']; ?>" class="list-group-item">
        <span class="menu-icon"><img alt="courses" src="<?php echo $gi18n['template_link'] . '/assets/icons/online-learning.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['courses']; ?></span>
      </a>

      <a href="<?php echo $meeting_link; ?>" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/video-camera.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['meeting']; ?></span>
      </a>
    </div>

    <?php if (is_object($newspage)) {

      echo '<div class="alert study-news rounded-box position-relative alert-dismissible fade show" role="alert">';
      ?>
      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['whatsnew']; ?></h2>
        <span class="page-icon small"><img alt="sparkle" src="<?php echo $gi18n['template_link']; ?>/assets/icons/star.png"></span>
      </div>
      <?php
      echo apply_filters('the_content', $newspage->post_content);
      echo '<a type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick="setCookie(\'dismissed\', true, 1);"></a>';
      echo '</div>';

    } ?>

    <div class="study-page rounded-box position-relative show" id="study-container">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="text-primary"><?php echo $gi18n['studypage_homework_title']; ?></h1>
        <span class="page-icon"><img alt="learning" src="<?php echo $gi18n['template_link']; ?>/assets/icons/light.png"></span>
      </div>

      <?php GetUserStudyPage($current_user_id); ?>

    </div>

    <div class="study-answers rounded-box">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="text-primary"><?php echo $gi18n['studypage_homework_replytitle']; ?></h1>
        <span class="page-icon"><img alt="homework" src="<?php echo $gi18n['template_link']; ?>/assets/icons/essay.png"></span>
      </div>

      <?php GetUserStudyPage_comments($current_user_id); ?>

    </div>

  </div>

</main>
<?php
get_footer(null, ['js' => 'study.js']);
