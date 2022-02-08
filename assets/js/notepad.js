var toggler = document.getElementById('notepad-toggle');
var wrapper = document.getElementById('notepad-wrapper');
var notepadTextWrapper = document.getElementById('notepad');
var notepadText = document.querySelector("#notepad-text");
var notepadStorage = localStorage.getItem('notepad');
var posTracker = localStorage.getItem('pos-tracker');
var lastRelativePos = [0, 0];
var currentRelativePos = [0, 0];
var elementPosTracker = [0, 0];
var maxTopOffset = window.screen.height - (window.screen.height * 2) + Math.round(window.screen.height * 0.3);
var maxLeftOffset = window.screen.width - (window.screen.width * 2) + Math.round(window.screen.width * 0.1);

if (posTracker) {
  posTracker = JSON.parse(posTracker);
} else {
  posTracker = {};
}

if (!localStorage.getItem('notepad-animation-finished')) {

  var y = document.createElement('span');
  y.classList.add('animate', 'ms-2');
  y.innerHTML = toggler.ariaLabel;
  toggler.style.marginLeft = '-25vh';
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

if (notepadStorage !== null) {
  notepadText.value = notepadStorage;
}

toggler.addEventListener("click", toggleNotepad);
notepadText.onkeyup = notepadSave;
dragElement(toggler);
dragElement(notepadTextWrapper);

function updateElementOffset(element, pos) {

  // Make sure the values didn't bug out and set the button out of bounds.
  // WARNING: We are using negative numbers here, so comparisons must be negative.

  if (pos.top < maxTopOffset) { pos.top = maxTopOffset; }
  if (pos.left < maxLeftOffset) { pos.left = maxLeftOffset; }
  if (pos.top > 0) { pos.top = 0; }
  if (pos.left > 0) { pos.left = 0; }

  element.style.top = pos.top + "px";
  element.style.left = pos.left + "px";

  // update the pos trackers
  elementPosTracker = [pos.top, pos.left];

}

function notepadSave(e) {
  localStorage.setItem('notepad', notepadText.value);
}

function toggleNotepad() {

  var notepad = document.getElementById('notepad');
  var relativePosTopCloseness = currentRelativePos[0] == lastRelativePos[0];
  var relativePosLeftCloseness = currentRelativePos[1] == lastRelativePos[1];

  if ( relativePosTopCloseness && relativePosLeftCloseness ) {
    notepad.classList.toggle('d-none');
  }

}

function dragElement(elmnt) {

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var theElement = elmnt;

  if (posTracker[theElement.id]) {
    pos1 = posTracker[theElement.id].pos1;
    pos2 = posTracker[theElement.id].pos2;
    pos3 = posTracker[theElement.id].pos3;
    pos4 = posTracker[theElement.id].pos4;

    updateElementOffset(theElement, { top: posTracker[theElement.id].top, left: posTracker[theElement.id].left});

  }

  toggler.classList.remove('opacity-0');

  // if present, the header is where you move the DIV from:
  if (document.getElementById(theElement.id + "header")) {
    theElement = document.getElementById(theElement.id + "header");
  }

  // add touch events
  theElement.addEventListener('touchstart', (e) => {

    var touches = e.targetTouches[0];
    pos3 = touches.clientX;
    pos4 = touches.clientY;

  })

  theElement.addEventListener('touchmove', (e) => {

    e.preventDefault();

    var touches = e.targetTouches[0];
    pos1 = pos3 - touches.clientX;
    pos2 = pos4 - touches.clientY;
    pos3 = touches.clientX;
    pos4 = touches.clientY;

    // set the element's new position:
    updateElementOffset(theElement, {
      top: theElement.offsetTop - pos2,
      left: theElement.offsetLeft - pos1,
    });

  });

  theElement.addEventListener('touchend', (e) => {

    e.preventDefault();

    lastRelativePos = currentRelativePos;
    currentRelativePos = elementPosTracker;

    toggleNotepad();

    // save the position
    posTracker[theElement.id] = {
      pos1: pos1,
      pos2: pos2,
      pos3: pos3,
      pos4: pos4,
      top: elementPosTracker[0],
      left: elementPosTracker[1]
    };

    localStorage.setItem('pos-tracker', JSON.stringify(posTracker));

  })

  // Add mouse events
  theElement.onmousedown = dragMouseDown;

  function dragMouseDown(e) {

    e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

  }

  function elementDrag(e) {

    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // set the element's new position:
    updateElementOffset(theElement, {
      top: theElement.offsetTop - pos2,
      left: theElement.offsetLeft - pos1,
    });

  }

  function closeDragElement() {

    // save the position
    posTracker[theElement.id] = {
      pos1: pos1,
      pos2: pos2,
      pos3: pos3,
      pos4: pos4,
      top: elementPosTracker[0],
      left: elementPosTracker[1]
    };

    localStorage.setItem('pos-tracker', JSON.stringify(posTracker));

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    lastRelativePos = currentRelativePos;
    currentRelativePos = elementPosTracker;
  }

}
