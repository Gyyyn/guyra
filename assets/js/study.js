import('%template_url/assets/js/roadmap.js');

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

file_upload_input = document.getElementById('file_upload_input');
file_upload_input.addEventListener('input', fileUploadTrigger);

function fileUploadTrigger(e) {
  if (file_upload_input.files.length != 0) {
    document.getElementById('file_list').innerHTML = file_upload_input.files[0].name;
  }
}

function loadRoadmap() {
  document.getElementById('roadmap-container').classList.remove('d-none');
}

loadRoadmapButton = document.getElementById('load-roadmap-button');
loadRoadmapButton.onclick = loadRoadmap;
