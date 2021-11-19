<?php

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
