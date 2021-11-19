<?php

function guyra_render_topbar() {

  global $gi18n;
  global $current_user_meta;
  global $current_user_id;
  global $is_admin;

  $meeting_link = $current_user_data['user_meetinglink'];

  ?>

  <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden">

    <?php if ($is_admin): ?>
      <a class="list-group-item admin-link" href="<?php echo $gi18n['guyra_admin_link'] ?>">
        <i class="bi bi-gift-fill"></i>
      </a>
    <?php endif; ?>

    <a class="list-group-item home-link" href="<?php echo $gi18n['home_link'] ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="homework" src="<?php echo $gi18n['template_link'] . '/assets/icons/light.png'; ?>"></span>
      <span class="menu-title"><?php echo ($is_admin) ? $gi18n['schools'] : $gi18n['study']; ?></span>
    </a>

    <a class="list-group-item practice-link" href="<?php echo $gi18n['practice_link'] ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="practice" src="<?php echo $gi18n['template_link'] . '/assets/icons/target.png'; ?>"></span>
      <span class="menu-title"><?php echo $gi18n['practice']; ?></span>
    </a>

    <a class="list-group-item reference-link" href="<?php echo $gi18n['home_link']; ?>/reference">
      <span class="menu-icon"><img class="page-icon tiny" alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/lab.png'; ?>"></span>
      <span class="menu-title"><?php echo $gi18n['ultilities']; ?></span>
    </a>

    <a class="list-group-item courses-link" href="<?php echo $gi18n['courses_link']; ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="courses" src="<?php echo $gi18n['template_link'] . '/assets/icons/online-learning.png'; ?>"></span>
      <span class="menu-title"><?php echo $gi18n['courses']; ?></span>
    </a>

    <?php if ($current_user_meta['teacherid'][0]): ?>

    <a class="list-group-item meeting-link" href="<?php echo $meeting_link; ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/video-camera.png'; ?>"></span>
      <span class="menu-title"><?php echo $gi18n['meeting']; ?></span>
    </a>

    <?php endif; ?>

  </div>
<?php }
