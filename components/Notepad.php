<?php

global $template_dir;

include_once $template_dir . '/functions/Assets.php';

function Guyra_notepad() { ?>

  <div class="position-fixed bottom-0 end-0 notepad-toggle overflow-x-visible" id="notepad-wrapper">
    <a class="btn-tall blue opacity-0 animate round-border position-absolute" id="notepad-toggle">
      <img class="page-icon tiny" alt="notes" src="<?php echo GetImageCache('icons/notes.png', 32); ?>">
    </a>
  </div>

  <div class="d-none position-fixed end-0" id="notepad">
    <div id="notepad-header" class="position-absolute top-0 end-0 p-3" style="cursor: move;"><i class="bi bi-arrows-move"></i></div>
    <textarea id="notepad-text" class="text-small" value=""></textarea>
  </div>

  <script async src="<?php echo GetMinifiedAsset('js', 'notepad.js'); ?>"></script>

<?php }
