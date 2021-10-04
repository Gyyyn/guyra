let btn = document.querySelectorAll('.id-selector')
let targetform = document.querySelectorAll('.user-id')
btn.forEach((item, i) => {
  item.addEventListener('click', function (e) {
    targetform.forEach((item) => {
      item.value = this.innerHTML
    });
  })
});
