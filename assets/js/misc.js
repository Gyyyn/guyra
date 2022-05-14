// Logout button
var logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.onclick = (e) => {

    e.preventDefault();

    var logoutConfirm = window.confirm(logoutButton.dataset.confirm);

    if (logoutConfirm) {
      window.location.replace(logoutButton.href);
    }
  }
}

// PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/GuyraPWA.js');
}

// Notifications
var deleteNotificationButtons = document.querySelectorAll('.delete-notification-button');
var clearNotificationsButton = document.getElementById('clear-notification-button');

if (deleteNotificationButtons) {
  deleteNotificationButtons.forEach((button, i) => {
    button.onclick = (e) => {
      fetch(window.location.origin + '/api?pop_notification=1&index=' + button.dataset.index);
      button.parentElement.parentElement.remove();
    }
  });
}

if (clearNotificationsButton) {
  clearNotificationsButton.onclick = (e) => {
    fetch(window.location.origin + '/api?clear_notifications=1');
    document.querySelectorAll('.notifications.notification-item').forEach((item, i) => {
      item.remove();
    });

  }
}

// Header
// TODO: Move this to header.js
function historyBack() {

  try {

    if (document.getElementById('back-button')) {
      document.getElementById('back-button').click();
      return;
    }

    window.location.href = window.location.origin;

    return true;

  } catch (e) {

    return false;

  }

}

function updateBackButton() {

  var mobileHeaderBackButton = document.getElementById('mobile-header-back');
  var backButtonInPage = document.getElementById('back-button');

  if (mobileHeaderBackButton || backButtonInPage) {

    mobileHeaderBackButton.onclick = historyBack;

    if (window.location.pathname == '/' && !backButtonInPage) {
      mobileHeaderBackButton.classList.add('opacity-0');
      mobileHeaderBackButton.onclick = null;
    }

  }

}

updateBackButton();
document.addEventListener('scroll', updateBackButton);

window.onerror = function errHandle(errorMsg, url, lineNumber) {

  // Big placebo here.
  setTimeout(() => {
    alert('Houve um erro! O site vai tentar concerta-lo, se isso não der certo entre em contato com a gente.');

    console.error(errorMsg, lineNumber);

    setTimeout(() => {
      window.location.reload();
    }, 500);

  }, 1000);

}

// Catch and handle common errors

if (!window.HTMLReactParser) {
  window.location.reload();
}
