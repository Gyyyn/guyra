<?php
/**
 * Reusable template parts
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

function Guyra_get_profile_picture($user, $classlist) {

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


  $output = sprintf('<img class="%s" alt="profile-picture" src="%s">', implode(' ', $classes), $profile_picture_url);

  return $output;
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

<?php } ?>
