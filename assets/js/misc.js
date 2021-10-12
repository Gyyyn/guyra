// Misc JS goes here.
// NOTE: Do not overuse this file for performance reasons, as it is
// loaded in every page. For Anything page specific use that page's .js file instead.

var logoutButton = document.getElementById('logout-button');

function logoutTrigger(e) {

  e.preventDefault();

  var logoutConfirm = window.confirm(logoutButton.dataset.confirm);

  if (logoutConfirm) {
    window.location.replace(logoutButton.href);
  }
}

if (logoutButton) {
  logoutButton.addEventListener("click", logoutTrigger);
}

var inactivityTime = function() {
    var time;
    window.onload = resetTimer;
    document.onkeydown = resetTimer;

    function postTextAreaData() {

      var dataToPost = {
        responseArea: localStorage.getItem('responseArea'),
        notepad: localStorage.getItem('notepad')
      }

      fetch(
        window.location.origin.concat('/action/?action=update_user_textareas'),
        {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToPost)
        }
      );
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(postTextAreaData, 3000)
    }
}

window.onload = function() {
  //inactivityTime();
}
