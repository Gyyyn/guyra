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
var mobileHeaderBackButton = document.getElementById('mobile-header-back');

if (mobileHeaderBackButton) {
  if (window.location.pathname == '/') {
    mobileHeaderBackButton.classList.add('opacity-0');
    mobileHeaderBackButton.onclick = null;
  } else {
    mobileHeaderBackButton.onclick = (e) => {
      // window.history.back();
      window.location.href = window.location.origin;
    }
  }
}

// Translatables
function checkForTranslatables() {
  var translatables = document.querySelectorAll('.translatable');

  translatables.forEach((item, i) => {

    var tooltip = document.createElement('div');
    tooltip.innerHTML = '<i class="bi bi-translate me-2"></i>' + item.dataset['translation'] + '<div class="arrow" data-popper-arrow></div>';
    tooltip.classList.add('gtooltip');
    item.parentNode.insertBefore(tooltip, item.nextSibling);

    var placement = 'top';

    if (item.dataset['placement']) {
      placement = item.dataset['placement'];
    }

    const popperInstance = Popper.createPopper(item, tooltip, {
      placement: placement,
    });

    function show() {
      // Make the tooltip visible
      tooltip.setAttribute('data-show', '');

      // Enable the event listeners
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: true },
        ],
      }));

      // Update its position
      popperInstance.update();
    }

    function hide() {
      // Hide the tooltip
      tooltip.removeAttribute('data-show');

      // Disable the event listeners
      popperInstance.setOptions((options) => ({
        ...options,
        modifiers: [
          ...options.modifiers,
          { name: 'eventListeners', enabled: false },
        ],
      }));
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach((event) => {
      item.addEventListener(event, show);
    });

    hideEvents.forEach((event) => {
      item.addEventListener(event, hide);
    });

  });
}

checkForTranslatables();
