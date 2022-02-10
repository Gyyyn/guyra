<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $current_user_data;
global $current_user_meta;
global $current_user_gamedata;
global $site_url;
global $is_logged_in;
global $current_user_subscription_valid;

Guyra_Safeguard_Access();

include_once $template_dir . '/components/StudyPage.php';
include_once $template_dir . '/functions/Assets.php';

$newspage = get_page_by_title('News');
$teacherid = $current_user_data['teacherid'];
$streak_info = json_decode($current_user_gamedata['streak_info'], true);
$completed_daily_challenge = ($current_user_gamedata['challenges']['daily']['levels_completed'] >= $current_user_gamedata['challenges']['daily']['levels']);
$current_streak_is_highest = ($streak_info['streak_length'] == $streak_info['streak_record']);
$daily_challenges_card_class_extra = '';
$streak_card_class_extra = '';

if ($completed_daily_challenge)
$daily_challenges_card_class_extra = 'green';

if ($current_streak_is_highest)
$streak_card_class_extra = 'blue';

get_header();

?>
<main id="intro-content" class="site-main study squeeze position-relative">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

    <div class="rounded-box" id="flashcards-container"></div>

    <div class="greeting-page rounded-box py-3 position-relative">

      <div class="icon-title mb-3 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['hello'] . ' ' . $current_user_data['first_name']; ?></h2>
        <span class="page-icon small"><img alt="learning" src="<?php echo GetImageCache('icons/waving-hand.png', 128); ?>"></span>
      </div>

      <?php if ($current_user_payments['status'] == 'trial'):
      $daysLeft = 30 - $current_user_payments['days_left']; ?>
      <div class="dialog-box">
        <span class="fw-bold">Você tem <?php echo $daysLeft ?> dias no seu teste grátis.</span>
        <progress class="progress" value="<?php echo $daysLeft; ?>" max="30"></progress>
      </div>
      <?php elseif (!$current_user_subscription_valid): ?>
      <div class="dialog-box">
        <span class="fw-bold"><?php echo $gi18n['no_subscription_found'][0] . ' ' . $gi18n['no_subscription_found'][1]; ?></span>
        <ul class="check-list my-3">
          <li class="x"><?php echo $gi18n['no_subscription_found'][2] ?></li>
          <li class="x"><?php echo $gi18n['no_subscription_found'][3] ?></li>
          <li class="x"><?php echo $gi18n['no_subscription_found'][4] ?></li>
          <li><?php echo $gi18n['no_subscription_found'][5] ?></li>
          <li><?php echo $gi18n['no_subscription_found'][6] ?></li>
        </ul>
        <span><?php echo $gi18n['no_subscription_found'][7] ?></span>
        <a class="btn-tall green d-block text-center w-100 my-3" role="button" href="<?php echo $gi18n['purchase_link'] ?>"><?php echo $gi18n['subscribe'] ?></a>
      </div>
      <?php endif; ?>

      <div class="dialog-box">

        <p><?php echo $gi18n['greetings'][random_int(0, count($gi18n['greetings']) - 1)]; ?></p>
        <p><?php echo $gi18n['whats_for_today']; ?></p>
        <?php if ($teacherid): ?>
        <div class="mt-3">
          <a href="#roadmap-container" class="btn-tall btn-sm blue" id="load-roadmap-button"><?php echo $gi18n['load'] . ' ' . $gi18n['roadmap']; ?></a>
        </div>
        <?php endif; ?>
      </div>

      <h2 class="text-blue mb-3"><?php echo $gi18n['daily_challenges']; ?></h2>

      <div class="d-flex flex-wrap justify-content-center justify-content-md-start">

        <div class="card trans mb-3 me-3 <?php echo $streak_card_class_extra; ?>">
          <h4><?php echo $gi18n['streak']; ?></h4>
          <span class="d-flex flex-row fw-bold"><?php echo $gi18n['current'] . ': ' . $streak_info['streak_length'] . ' ' . $gi18n['days']; ?></span>
          <span class="d-flex flex-row"><?php echo $gi18n['biggest'] . ': ' . $streak_info['streak_record'] . ' ' . $gi18n['days']; ?></span>
        </div>

        <div class="card trans mb-3 me-3 <?php echo $daily_challenges_card_class_extra; ?>">
          <h4 class="me-2"><?php echo $gi18n['level']; ?></h4>
          <div class="d-flex align-items-center">
            <span><?php echo $current_user_gamedata['challenges']['daily']['levels_completed']; ?></span><span>/</span><span><?php echo $current_user_gamedata['challenges']['daily']['levels'] ?></span>
          </div>
          <progress class="progress" id="daily-challenge" max="<?php echo $current_user_gamedata['challenges']['daily']['levels']; ?>" value="<?php echo $current_user_gamedata['challenges']['daily']['levels_completed'] ?>"></progress>
        </div>

      </div>

    </div>

    <?php if (is_object($newspage) && $newspage->post_content): ?>
    <div class="alert study-news study-page rounded-box position-relative alert-dismissible fade show" role="alert">
      <div class="icon-title mb-2 d-flex justify-content-between align-items-center">
        <h2 class="text-primary"><?php echo $gi18n['whatsnew']; ?></h2>
        <span class="page-icon small"><img alt="sparkle" src="<?php echo GetImageCache('icons/star.png', 128); ?>"></span>
      </div>
      <div class="text-small">
        <?php echo apply_filters('the_content', $newspage->post_content); ?>
      </div>
      <a type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick="setCookie('dismissed', true, 1);"></a>
    </div>

    <?php endif; ?>

    <?php if ($teacherid && $current_user_subscription_valid): ?>

    <div id="roadmap-container" class="d-none justfade-animation animate"></div>

    <div class="study-page rounded-box position-relative">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="text-blue"><?php echo $gi18n['lessons']; ?></h1>
        <span class="page-icon"><img alt="learning" src="<?php echo GetImageCache('icons/light.png', 128); ?>"></span>
      </div>

      <?php GetUserStudyPage($current_user_id); ?>

    </div>

    <div class="study-answers rounded-box">

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <h1 class="text-blue"><?php echo $gi18n['reply']; ?></h1>
        <span class="page-icon"><img alt="homework" src="<?php echo GetImageCache('icons/essay.png', 128); ?>"></span>
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
      <button type="button" name="button" class="btn-tall ms-3" id="copy-from-notepad"><?php echo $gi18n['button_copy_notepad']; ?></button>
      </div>

      <?php GetUserStudyPage_comments($current_user_id, true, false, $comment_history_size, $redirect); ?>

    </div>

    <?php else: ?>

    <div id="roadmap-container" class="justfade-animation animate"></div>

    <?php endif; ?>

  </div>

</main>
<?php
get_footer(null, ['js' => 'study.js', 'easymde' => 'comment', 'react' => true]);
