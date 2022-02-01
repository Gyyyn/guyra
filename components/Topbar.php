<?php

include_once $template_dir . '/functions/Assets.php';

function guyra_render_topbar() {

global $gi18n;
global $current_user_data;
global $current_user_id;
global $is_admin;
global $current_user_subscription_valid;

?>

  <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden d-none d-md-flex">

    <?php if ($is_admin): ?>
      <a class="list-group-item admin-link" href="<?php echo $gi18n['guyra_admin_link'] ?>">
        <i class="bi bi-gift-fill"></i>
      </a>
    <?php endif; ?>

    <a class="list-group-item home-link" href="<?php echo $gi18n['home_link'] ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="homework" src="<?php echo GetImageCache('icons/learning.png', 64); ?>"></span>
      <span class="menu-title"><?php echo ($is_admin) ? $gi18n['schools'] : $gi18n['study']; ?></span>
    </a>

    <?php if ($current_user_subscription_valid): ?>

    <a class="list-group-item practice-link" href="<?php echo $gi18n['practice_link'] ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="practice" src="<?php echo GetImageCache('icons/target.png', 64); ?>"></span>
      <span class="menu-title"><?php echo $gi18n['practice']; ?></span>
    </a>

    <a class="list-group-item courses-link" href="<?php echo $gi18n['courses_link']; ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="courses" src="<?php echo GetImageCache('icons/online-learning.png', 64); ?>"></span>
      <span class="menu-title"><?php echo $gi18n['courses']; ?></span>
    </a>

    <a class="list-group-item reference-link" href="<?php echo $gi18n['reference_link']; ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="reference" src="<?php echo GetImageCache('icons/layers.png', 64); ?>"></span>
      <span class="menu-title"><?php echo $gi18n['ultilities']; ?></span>
    </a>

    <?php endif; ?>

    <?php if ($current_user_data['teacherid']): ?>

    <a class="list-group-item meeting-link" href="<?php echo $gi18n['api_link'] . '?redirect_meeting=1'; ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="reference" src="<?php echo GetImageCache('icons/video-camera.png', 64); ?>"></span>
      <span class="menu-title"><?php echo $gi18n['meeting']; ?></span>
    </a>

    <?php endif; ?>

  </div>
<?php }
