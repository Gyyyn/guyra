// Misc JS goes here.
// NOTE: Do not overuse this file for performance reasons, as it is
// loaded in every page. For Anything page specific use that page's .js file instead.

var logoutButton = document.getElementById('logout-button');

function logoutTrigger() {

  var logoutConfirm = window.confirm('Tem certeza que deseja sair?');

  if (logoutConfirm) {
    window.location.replace(logoutButton.href);
  }
}

logoutButton.addEventListener("click", logoutTrigger)
