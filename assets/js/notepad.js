import {
  dragElement
} from '%template_url/assets/js/Common.js';

var toggler = document.getElementById('notepad-toggle');
var notepadTextWrapper = document.getElementById('notepad');
var notepadText = document.querySelector("#notepad-text");
var notepadStorage = localStorage.getItem('notepad');

// Check for the initial animation.
if (!localStorage.getItem('notepad-animation-finished')) {

  var y = document.createElement('span');
  y.classList.add('animate', 'ms-2');
  y.innerHTML = toggler.ariaLabel;
  toggler.appendChild(y);

  setTimeout(() => {
    y.classList.add('justfadeout-animation', 'animate');
  }, 7000);

  setTimeout(() => {
    y.remove();
    toggler.style.marginLeft = '0';
    localStorage.setItem('notepad-animation-finished', true);
  }, 7500);

}

// Set up the saving of the notepad value.
if (notepadStorage !== null) {
  notepadText.value = notepadStorage;
}

notepadText.onkeyup = () => {
  localStorage.setItem('notepad', notepadText.value);
};

// Finally allow the element to move.
dragElement(toggler, () => {
  notepadTextWrapper.classList.toggle('d-none');
});

dragElement(notepadTextWrapper);

// We set these here because we use boundingRect information above, so we
// can't start with a d-none class.
notepadTextWrapper.classList.add('d-none');
notepadTextWrapper.classList.remove('opacity-0');
toggler.classList.remove('opacity-0');
