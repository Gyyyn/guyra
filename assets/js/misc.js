// Get the i18n if we have any.
var localStorageI18n = window.localStorage.getItem('guyra_i18n');
var thei18n = { home_link: window.location.origin, api_link: window.location.origin + '/api' };

if (typeof localStorageI18n === 'string') {
  localStorageI18n = JSON.parse(localStorageI18n);
  thei18n = localStorageI18n.i18n;
}

// PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/GuyraPWA.js');
}

window.onerror = function errHandle(errorMsg, url, lineNumber) {

  setTimeout(() => {
    if (errorMsg !== 'guyra') {
      var reload = confirm('Houve um erro! O site vai tentar concerta-lo, se isso não der certo entre em contato com a gente.'); 
    } else {
      reload = true;
    }

    console.error('Guyra: ', errorMsg, '--Line: ', lineNumber, '--Reload: ', reload);

    localStorage.removeItem('guyra_userdata');
    localStorage.removeItem('guyra_i18n');
    localStorage.removeItem('guyra_levelmap');
    localStorage.removeItem('guyra_courses');
    localStorage.removeItem('guyra_cache');

    if (reload) {
      window.location.reload();
    }

  }, 1000);

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

  var nests = document.body.dataset.nests.split('/');

  if (nests[1] == 'register') {

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