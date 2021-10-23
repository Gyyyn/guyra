<?php
/**
 * Logged in user home page
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $is_logged_in;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_misc.php';

$newspage = get_page_by_title('News');
$meeting_link = guyra_get_user_meta($current_user_id, 'meetinglink', true)['meta_value'];
$first_name = get_user_meta($current_user_id, 'first_name', true);
$teacherid = get_user_meta($current_user_id, 'teacherid', true);

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

    <div class="greeting-page rounded-box position-relative">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['hello'], ($first_name != '' ? ', ' . $first_name . '!' : null); ?></h2>
        <span class="page-icon small"><img alt="learning" src="<?php echo $gi18n['template_link']; ?>/assets/icons/waving-hand.png"></span>
      </div>

      <p><?php echo $gi18n['greetings'][random_int(0, count($gi18n['greetings']) - 1)]; ?></p>
      <p><?php echo $gi18n['whats_for_today']; ?></p>

    </div>

    <?php if (is_object($newspage)): ?>
    <div class="alert study-news study-page rounded-box position-relative alert-dismissible fade show" role="alert">
      <div class="icon-title mb-2 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['whatsnew']; ?></h2>
        <span class="page-icon small"><img alt="sparkle" src="<?php echo $gi18n['template_link']; ?>/assets/icons/star.png"></span>
      </div>
      <div class="text-small">
        <?php echo apply_filters('the_content', $newspage->post_content); ?>
      </div>
      <a type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick="setCookie('dismissed', true, 1);"></a>
    </div>
    <?php endif; ?>

    <?php if ($teacherid): ?>

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

    <?php endif; ?>

  </div>

</main>
<?php
get_footer(null, ['js' => 'study.js']);
