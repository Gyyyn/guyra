// Get the i18n if we have any.
var localStorageI18n = window.localStorage.getItem('guyra_i18n');
var thei18n = { home_link: window.location.origin, api_link: window.location.origin + '/api' };

if (typeof localStorageI18n === 'string') {
  localStorageI18n = JSON.parse(localStorageI18n);
  thei18n = localStorageI18n.i18n;
}

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
  deleteNotificationButtons.forEach((button) => {
    button.onclick = () => {
      fetch(thei18n.api_link + '?pop_notification=1&index=' + button.dataset.index);
      button.parentElement.parentElement.remove();
    }
  });
}

if (clearNotificationsButton) {
  clearNotificationsButton.onclick = () => {
    fetch(thei18n.api_link + '?clear_notifications=1');
    document.querySelectorAll('.notifications.notification-item').forEach((item) => {
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

// OAuth handlers

function _setMessageBox(id, timeout=true) {
  var messageBox = document.getElementById(id);
  var isShowing = true;

  messageBox.classList.forEach((item) => {
    if (item == 'd-none') {
      isShowing = false;
    }
  });

  if (isShowing) {
    messageBox.classList.add('d-none');
  }

  setTimeout(() => {
    // messageBox.innerHTML = message;
    messageBox.classList.remove('d-none');
  }, 250)

  if (timeout) {
    setTimeout(() => {
      // messageBox.innerHTML = '';
      messageBox.classList.add('d-none');
    }, 5000);
  }

}

function GetCaptchaAndDo(action) {

  return new Promise((resolve) => {

    grecaptcha.ready(function() { grecaptcha.execute('6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt', {action: 'submit'}).then(function(token) {
      resolve(action(token));
    })});

  });
}

function SendOAuthPayload(data) {

  var emailField = document.getElementById('profile-email');
  var theApiLink = thei18n.api_link + '?oauth_login=1';

  if (!data.payload.email && emailField) {
    data.payload.email = emailField.value;
  }

  if (window.location.hash == '#register') {

    theApiLink = thei18n.api_link + '?register=1&oauth=1';
    data.user_email = data.payload.email;

    var theName = data.payload.name;
    theName = theName.split(' ');

    data.user_firstname = theName.shift();
    data.user_lastname = theName.join(' ');

  }

  GetCaptchaAndDo((token) => {

    data.captcha = token;

    fetch(theApiLink,
      {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => res.json()).then(res => {
    
        if (res == 'authorized') {
          window.location.href = thei18n.home_link;
          return;
        }
    
        if (res == 'true') {
          return true;
        }
    
        _setMessageBox('message-oauth');
    
      });

  });

}

function FBOAuth() {
  FB.getLoginStatus(function() {
    
    FB.api('/me?fields=id,name,email', function(response) {

      SendOAuthPayload({
        provider: 'fb',
        payload: response
      });

    });
    
  });
}

function GoogleOAuth(payload) {
  
  SendOAuthPayload({
    provider: 'google',
    payload: payload
  });
  
}