<?php
/**
 * Reusable template parts
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

function Guyra_get_profile_picture($user, $classlist=null, $onlylink=false) {

  $gravatar_image = get_avatar_url($user, $args = null);
  $ur_image = get_user_meta($user, 'user_registration_profile_pic_url', true);
  $profile_picture_url = ( ! empty( $ur_image ) ) ? $ur_image : $gravatar_image;

  $classes = [
    'avatar'
  ];

  if (is_array($classlist)) {

    foreach ($classlist as $key) {
      $classes[] = $key;
    }

  } else {

    $classes[] = $classlist;

  }

  if ($onlylink) {
    return $profile_picture_url;
  } else {
    $output = sprintf('<img class="%s" alt="profile-picture" src="%s">', implode(' ', $classes), $profile_picture_url);

    return $output;
  }

}

function Guyra_notepad() { ?>

  <div class="position-fixed bottom-0 end-0 notepad-toggle">
    <a class="btn-tall blue round-border" id="notepad-toggle">
      <img class="page-icon tiny" alt="notes" src="<?php echo get_template_directory_uri() . '/assets/icons/notes.png'; ?>">
    </a>
  </div>

  <div class="d-none position-fixed end-0" id="notepad">
    <textarea id="notepad-text" class="text-small" value=""></textarea>
  </div>

  <script>
    let toggler = document.getElementById('notepad-toggle');

    function toggleNotepad() {
      let notepad = document.getElementById('notepad');

      notepad.classList.toggle('d-none');
    }

    toggler.addEventListener("click", toggleNotepad);

    notepadStorage = localStorage.getItem('notepad');
    notepadText = document.querySelector("#notepad-text");

    if (notepadStorage !== null) {
      notepadText.value = notepadStorage;
    }

    notepadText.onkeyup = eventTrigger;

    function eventTrigger(e) {
      localStorage.setItem('notepad', notepadText.value);
    }

  </script>

<?php }

function guyra_render_topbar() {

  global $gi18n;
  global $current_user_meta;
  global $current_user_id;

  $meeting_link = guyra_get_user_meta($current_user_id, 'meetinglink', true)['meta_value'];

  ?>

  <?php if (current_user_can('manage_options')): ?>
    <span class="position-absolute admin-btn"><a class="btn-sm btn-tall purple" href="<?php echo $gi18n['guyra_admin_link'] ?>"><i class="bi bi-gift-fill"></i></a></span>
  <?php endif; ?>

  <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden">

    <a class="list-group-item home-link" href="<?php echo $gi18n['home_link'] ?>">
      <span class="menu-icon"><img class="page-icon tiny" alt="homework" src="<?php echo $gi18n['template_link'] . '/assets/icons/light.png'; ?>"></span>
      <span class="menu-title"><?php echo $gi18n['study']; ?></span>
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
