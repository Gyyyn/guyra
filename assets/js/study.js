function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
}

if (getCookie('dismissed') == "true") {
  document.querySelector('.alert').className = 'd-none';
}

responseArea = localStorage.getItem('responseArea');
commentArea = document.querySelector("#comment");
submitButton = document.querySelector("#submit");
theInput = document.getElementById('file_upload_input');

if (responseArea !== null) {
  commentArea.value = responseArea;
}

commentArea.onkeyup = eventTrigger;
submitButton.onclick = submitTrigger;
theInput.addEventListener('input', fileUploadTrigger);

function eventTrigger(e) {
  localStorage.setItem('responseArea', commentArea.value);
}

function submitTrigger(e) {
  localStorage.setItem('responseArea', '');
}

function fileUploadTrigger(e) {
  if (theInput.files.length != 0) {
    document.getElementById('file_list').innerHTML = theInput.files[0].name;
  }
}
