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

function dragElement(theElement, clickFunction) {

  if (typeof clickFunction !== 'function') {
    clickFunction = () => {};
  }

  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var theElementDragPoint = theElement;
  var posTracker = localStorage.getItem('pos-tracker');

  if (posTracker) {
    posTracker = JSON.parse(posTracker);
  } else {
    posTracker = {};
  }

  if (typeof posTracker[theElement.id] !== 'object') {
    posTracker[theElement.id] = {}
  }

  // if present, the header is where you move the DIV from:
  if (document.getElementById(theElement.id + "-header")) {
    theElementDragPoint = document.getElementById(theElement.id + "-header");
  }

  function updateElementOffset(element, pos, force=false) {

    if (!force) {
      pos.top = element.offsetTop - pos.top;
      pos.left = element.offsetLeft - pos.left;
    }

    var minTopOffset = 0 - element.offsetHeight;
    var minLeftOffset = 0 - element.offsetWidth;
    var maxTopOffset = 0 - window.screen.availHeight + Math.round(window.screen.availHeight * 0.1);
    var maxLeftOffset = 0 - window.screen.availWidth + Math.round(window.screen.availWidth * 0.01);

    // Make sure the values didn't bug out and set the button out of bounds.
    // WARNING: We are using negative numbers here, so comparisons must be negative.
    if (pos.top < maxTopOffset) { pos.top = maxTopOffset; }
    if (pos.left < maxLeftOffset) { pos.left = maxLeftOffset; }
    if (pos.top > minTopOffset) { pos.top = minTopOffset; }
    if (pos.left > minLeftOffset) { pos.left = minLeftOffset; }

    element.style.top = pos.top + "px";
    element.style.left = pos.left + "px";

    posTracker[element.id].top = pos.top;
    posTracker[element.id].left = pos.left;

  }

  // If there is a saved position set that.
  if (posTracker[theElement.id]) {
    updateElementOffset(theElement, { top: posTracker[theElement.id].top, left: posTracker[theElement.id].left }, true);
  } else {
    // Or make sure the elements are within bounds.
    updateElementOffset(theElement, {top:0,left:0});
  }

  // Set up vars used to determine clickness.
  var lastRelativePos = [0, 0];
  var currentRelativePos = [0, 0];

  function isAClick() {

    var relativePosTopCloseness = currentRelativePos[0] == lastRelativePos[0];
    var relativePosLeftCloseness = currentRelativePos[1] == lastRelativePos[1];

    if ( relativePosTopCloseness && relativePosLeftCloseness ) {
      return true;
    } else {
      return false;
    }

  }

  // Add touch events
  theElementDragPoint.addEventListener('touchstart', (e) => {

    var touches = e.targetTouches[0];
    pos3 = touches.clientX;
    pos4 = touches.clientY;

  })

  theElementDragPoint.addEventListener('touchmove', (e) => {

    e.preventDefault();

    var touches = e.targetTouches[0];
    pos1 = pos3 - touches.clientX;
    pos2 = pos4 - touches.clientY;
    pos3 = touches.clientX;
    pos4 = touches.clientY;

    // set the element's new position:
    updateElementOffset(theElement, {
      top: pos2,
      left: pos1,
    });

  });

  theElementDragPoint.addEventListener('touchend', (e) => {

    e.preventDefault();

    lastRelativePos = currentRelativePos;
    currentRelativePos = [posTracker[theElement.id].top, posTracker[theElement.id].left];

    if (isAClick()) {
      clickFunction();
    }

    localStorage.setItem('pos-tracker', JSON.stringify(posTracker));

  })

  // Add mouse events
  theElementDragPoint.onmousedown = dragMouseDown;

  function dragMouseDown(e) {

    e = e || window.event;
    e.preventDefault();

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;

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
      top: pos2,
      left: pos1,
    });

  }

  function closeDragElement() {

    lastRelativePos = currentRelativePos;
    currentRelativePos = [posTracker[theElement.id].top, posTracker[theElement.id].left];

    if (isAClick()) {
      clickFunction();
    }

    localStorage.setItem('pos-tracker', JSON.stringify(posTracker));

    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

  }

}
