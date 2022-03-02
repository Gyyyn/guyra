<?php

global $template_dir;

include_once $template_dir . '/functions/Assets.php';

function Guyra_notepad() {

  global $gi18n;

  ?>

  <div class="position-fixed bottom-0 end-0 notepad-element overflow-x-visible">
    <a class="btn-tall blue opacity-0 round-border position-absolute" id="notepad-toggle" aria-label="<?php echo $gi18n['notepad'] ?>">
      <img class="page-icon tiny" alt="notes" width="32" height="32" src="<?php echo GetImageCache('icons/notes.png', 64); ?>">
    </a>
  </div>

  <div class="position-fixed bottom-0 end-0 notepad-element">
    <div class="position-absolute opacity-0 pop-animation animate" id="notepad">
      <div id="notepad-header" class="position-absolute top-0 end-0 p-3" style="cursor: move;"><i class="bi bi-arrows-move"></i></div>
      <textarea id="notepad-text" class="text-small" value=""></textarea>
    </div>
  </div>

  <script async type="module" src="<?php echo GetMinifiedAsset('js', 'notepad.js'); ?>"></script>

<?php }
