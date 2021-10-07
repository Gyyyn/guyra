<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

// Sanity check, unlogged users shouldn't be here
if (!is_user_logged_in()) {
  wp_redirect(get_site_url());
}

get_header();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

<main id="intro-content" class="site-main page">

  <div class="page-squeeze">

    <div class="list-group study-menu list-group-horizontal container-fluid mb-5 overflow-hidden">
      <a class="list-group-item" href="<?php echo $gi18n['home_link'] ?>">
        <span class="menu-icon"><img alt="homework" src="<?php echo $gi18n['template_link'] . '/assets/icons/light.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['study']; ?></span>
      </a>

      <a class="list-group-item active" href="<?php echo $gi18n['practice_link'] ?>">
        <span class="menu-icon"><img alt="practice" src="<?php echo $gi18n['template_link'] . '/assets/icons/target.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['practice']; ?></span>
      </a>

      <a href="<?php echo get_site_url() ?>/reference" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/notebook.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference']; ?></span>
      </a>

      <a href="<?php echo get_site_url() ?>/courses" class="list-group-item">
        <span class="menu-icon"><img alt="courses" src="<?php echo $gi18n['template_link'] . '/assets/icons/online-learning.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['courses']; ?></span>
      </a>

      <a href="<?php echo $meeting_link ?>" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/video-camera.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['meeting']; ?></span>
      </a>
    </div>

  </div>

  <div id="exercise-container"></div>

</main>
<?php
get_footer(null, ['js' => 'exercises.js', 'aos' => true, 'react' => true]);
