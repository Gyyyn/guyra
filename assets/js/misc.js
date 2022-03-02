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

// Notepad
var copyFromNotepadButton = document.getElementById('copy-from-notepad');

if (copyFromNotepadButton) {
  copyFromNotepadButton.onclick = (e) => {
    easyMDE.value(localStorage.getItem('notepad'));
  }
}


// Header
// TODO: Move this to header.js

function updateBackButton() {

  var mobileHeaderBackButton = document.getElementById('mobile-header-back');
  var backButtonInPage = document.getElementById('back-button');

  if (mobileHeaderBackButton || backButtonInPage) {

    if (window.location.pathname == '/' && !backButtonInPage) {
      mobileHeaderBackButton.classList.add('opacity-0');
      mobileHeaderBackButton.onclick = null;
    }

    mobileHeaderBackButton.onclick = (e) => {

      if (backButtonInPage) {
        backButtonInPage.click();
        return;
      }

      window.location.href = window.location.origin;
    }

  }

}

document.addEventListener('scroll', updateBackButton);
