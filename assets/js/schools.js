editHomeworkButtons = document.querySelectorAll('.edit-homework-button');

editHomeworkButtons.forEach((button) => {
  targetId = button.dataset.target;
  var target = document.getElementById('inner-'.concat(targetId));
  var previousState = false;
  var buttonPreviousInner = button.innerHTML;
  var pageLink = button.dataset.link;

  button.onclick = editTrigger;

  function editTrigger(e) {

    var frameId = 'frame-'.concat(targetId);

    if (!previousState) {

      button.innerHTML = '<i class="bi bi-check-lg"></i>'
      previousState = target.innerHTML;
      target.innerHTML = '<iframe id="'.concat(frameId).concat('" class="editor-inline" src="').concat(pageLink).concat('"/>');

    } else {

      var frame = document.getElementById(frameId).contentDocument;
      frame.querySelector('.editor-post-publish-button').click();
      button.innerHTML = '<i class="bi bi-three-dots"></i>';

      setTimeout(function(){
        document.location.reload();

        target.innerHTML = previousState;
        previousState = false;
      }, 2000);

    }

    button.classList.toggle('blue');
    button.classList.toggle('green');

  }
});

var theCode = document.getElementById("your-code");
var copyCodeButton = document.getElementById("copy-code");

function copyCode() {
  theCode.focus();
  theCode.select();
  document.execCommand("copy");
}

theCode.onclick = () => { copyCode() };
copyCodeButton.onclick = () => {
  copyCode();
  var before = copyCodeButton.innerHTML;
  copyCodeButton.innerHTML = '<i class="bi bi-check-lg"></i>'
  setTimeout(() => { copyCodeButton.innerHTML = before; }, 1000)
};
