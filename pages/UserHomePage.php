<?php
/**
 * Logged in user home page
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_meta;
global $site_url;
global $is_logged_in;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

include_once $template_dir . '/components/StudyPage.php';

$newspage = get_page_by_title('News');
$teacherid = $current_user_data['teacherid'];

get_header();

?>
<main id="intro-content" class="site-main study squeeze position-relative mb-5">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

    <div class="greeting-page rounded-box position-relative">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['hello'] . ' ' . $current_user_data['first_name']; ?></h2>
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

    <div class="study-page rounded-box position-relative">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="marked"><?php echo $gi18n['studypage_homework_title']; ?></h1>
        <span class="page-icon"><img alt="learning" src="<?php echo $gi18n['template_link']; ?>/assets/icons/light.png"></span>
      </div>

      <?php GetUserStudyPage($current_user_id); ?>

    </div>

    <div class="study-answers rounded-box">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="marked"><?php echo $gi18n['studypage_homework_replytitle']; ?></h1>
        <span class="page-icon"><img alt="homework" src="<?php echo $gi18n['template_link']; ?>/assets/icons/essay.png"></span>
      </div>

      <?php if ($_GET['comment_history'] == 1) {
        $comment_history_size = '1 years ago';
        $redirect = $site_url;
      } else {
        $comment_history_size = '1 weeks ago';
        $redirect = false;
      }
      ?>

      <div class="replies-control my-5 d-flex">
      <?php if ($redirect): ?>
        <a href="<?php echo $redirect; ?>" class="btn-tall blue"><?php echo $gi18n['back']; ?></a>
      <?php else: ?>
        <a href="<?php echo $site_url . '?comment_history=1'; ?>" class="btn-tall"><?php echo $gi18n['load_more_replies']; ?></a>
      <?php endif; ?>
      </div>

      <?php GetUserStudyPage_comments($current_user_id, true, false, $comment_history_size, $redirect); ?>

    </div>

    <?php endif; ?>

  </div>

</main>
<?php
get_footer(null, ['js' => 'study.js']);
