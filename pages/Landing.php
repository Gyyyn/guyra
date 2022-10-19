<?php

global $template_dir;
global $template_url;
global $gi18n;

include_once $template_dir . '/functions/Assets.php';

GetComponent('Header', ['css' => 'landing.css']); ?>

<div id="landing-carousel" class="carousel slide cover" data-bs-ride="true">
  <div class="carousel-indicators d-none d-md-block text-center">
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="5" aria-label="Slide 6"></button>
    <button type="button" data-bs-target="#landing-carousel" data-bs-slide-to="6" aria-label="Slide 7"></button>
  </div>
  <div class="carousel-inner cover-container">

    <div class="carousel-item active">

      <div class="d-block w-100">
        <div class="col-md mb-5 mb-md-0 d-flex align-items-center justify-content-around">
          <img alt="<?php echo $gi18n['company_name']; ?>" class="page-icon large" src="<?php echo $gi18n['title_img']; ?>" />
        </div>

        <p class="text-n pt-5 d-none d-md-block"><?php echo $gi18n['_landing']['main_subtitle'] ?></p>

        <div class="d-block mt-5">

          <h2 class="welcome-greeting mb-3 d-none"></h2>
          <a class="btn-tall btn-lg blue d-block text-center" href="<?php echo $gi18n['account_link']; ?>"><?php echo $gi18n['button_login'] ?><i class="bi bi-box-arrow-in-right ms-2"></i></a>
          <button class="btn-tall btn-lg green mt-3 d-block text-center button-meet w-100" type="button" data-bs-target="#landing-carousel" data-bs-slide="next">
            <?php echo $gi18n['button_meet'] ?><i class="bi bi-door-open ms-2"></i>
          </button>

        </div>
      </div>

    </div>

    <div class="carousel-item">

      <div class="d-block w-100">
        <h2 class="text-blue"><?php echo $gi18n['_landing']['title1'] ?></h2>
        <p><?php echo $gi18n['_landing']['explain1'] ?></p>

        <h2 class="text-blue"><?php echo $gi18n['_landing']['title2'] ?></h2>
        <p><?php echo $gi18n['_landing']['explain2'] ?></p>

        <h2 class="text-blue"><?php echo $gi18n['_landing']['title4'] ?></h2>
        <p><?php echo $gi18n['_landing']['explain4'] ?></p>
      </div>

    </div>

    <div class="carousel-item">
      <div class="row feature squeeze pt-5">
        <div class="col order-md-2 px-md-5 align-self-center">
          <div class="p-1 p-md-5">
            <h2 class="text-primary"><?php echo $gi18n['_landing']['feature_title1'] ?></h2>
            <div class="explain mb-3"><?php echo $gi18n['_landing']['explain2'] ?></div>
            <div class="explain"><?php echo $gi18n['_landing']['feature_explain1'] ?></div>
          </div>
        </div>
        <div class="col-md-3 order-md-1 d-flex justify-content-center">
          <div class="page-icon large">
            <img alt="<?php echo $gi18n['phone']; ?>" src="<?php echo GetImageCache('icons/phone.png', 256); ?>">
          </div>
        </div>
      </div>
  </div>

  <div class="carousel-item">
    <div class="row feature squeeze">
      <div class="col px-md-5 align-self-center">
        <div class="p-1 p-md-5">
          <h2 class="text-primary"><?php echo $gi18n['_landing']['feature_title2'] ?></h2>
          <div class="explain"><?php echo $gi18n['_landing']['feature_explain2'] ?></div>
        </div>
      </div>
      <div class="col-md-3 d-flex justify-content-center">
        <div class="page-icon large">
          <img alt="<?php echo $gi18n['time']; ?>" src="<?php echo GetImageCache('icons/digital-clock.png', 256); ?>">
        </div>
      </div>
    </div>
  </div>

  <div class="carousel-item">
    <div class="row feature squeeze">
      <div class="col order-md-2 px-md-5 align-self-center">
        <div class="p-1 p-md-5">
          <h2 class="text-primary"><?php echo $gi18n['_landing']['feature_title3'] ?></h2>
          <div class="explain mb-3"><?php echo $gi18n['_landing']['feature_explain3'] ?></div>
          <div class="explain"><?php echo $gi18n['_landing']['explain1'] ?></div>
        </div>
      </div>
      <div class="col-md-3 order-md-1 d-flex justify-content-center">
        <div class="page-icon large">
          <img alt="<?php echo $gi18n['lessons']; ?>" src="<?php echo GetImageCache('icons/certificate.png', 256); ?>">
        </div>
      </div>
    </div>
  </div>

  <div class="carousel-item">
    <div class="row feature squeeze">
    <div class="col px-md-5 align-self-center">
      <div class="p-1 p-md-5">
        <h2 class="text-primary"><?php echo $gi18n['_landing']['feature_title4']; ?></h2>
        <div class="explain mb-3"><?php echo $gi18n['_landing']['feature_explain4']; ?></div>
        <div class="explain"><?php echo $gi18n['_landing']['explain3']; ?></div>
      </div>
    </div>
    <div class="col-md-3 d-flex justify-content-center">
      <div class="page-icon large">
        <img alt="<?php echo $gi18n['study']; ?>" src="<?php echo GetImageCache('icons/light.png', 256); ?>">
      </div>
    </div>
    </div>
  </div>

  <div class="carousel-item">
    <div class="row prices-container with-animation mb-3 text-center">
     <div class="col-md prices lite">
       <div class="card mb-4">
         <div class="card-header py-2">
           <h3 class="my-1 fw-normal"><?php echo $gi18n['prices_features']['lite']['title'] ?></h3>
         </div>
         <div class="card-body">
           <h1 class="card-title pricing-card-title"><?php echo $gi18n['prices_features']['lite']['price'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
           <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
             <li class="fw-bold mb-3"><span class="text-normal"><?php echo $gi18n['prices_features']['feature_oneclass']; ?></span> <span class="text-normal d-flex align-items-center"><i class="bi bi-x-lg text-red"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_courses_access']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_whatsapp_questions']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_exercises']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_pictionary']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
           </ul>
           <a href="<?php echo $gi18n['register_link']; ?>" type="button" class="landing-buy-button w-100 btn-tall"><?php echo $gi18n['button_want_this']; ?></a>
         </div>
       </div>
     </div>
     <div class="col-md prices primary">
       <div class="card mb-4 border-secondary">
         <div class="card-header py-2">
           <h3 class="my-1 fw-normal"><?php echo $gi18n['prices_features']['premium']['title'] ?></h3>
         </div>
         <div class="card-body">
           <h1 class="card-title text-secondary pricing-card-title"><?php echo $gi18n['prices_features']['premium']['price'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
           <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
             <li class="fw-bold mb-3"><span class="text-normal"><?php echo $gi18n['prices_features']['feature_oneclass']; ?></span> <span class="text-normal d-flex align-items-center"><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_courses_access']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_whatsapp_questions']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_exercises']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             <li><span><?php echo $gi18n['prices_features']['feature_pictionary']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
           </ul>
           <a href="<?php echo $gi18n['register_link']; ?>" type="button" class="landing-buy-button w-100 btn-tall"><?php echo $gi18n['button_want_this']; ?></a>
         </div>
       </div>
     </div>
   </div>
  </div>

  </div>
</div>

<script>
var buyButtons = document.querySelectorAll('a.landing-buy-button');

buyButtons.forEach(element => {
  element.onclick = function () {

    var localOptions = window.localStorage.getItem('guyra_options');

    if (typeof localOptions === 'string') {
    localOptions = JSON.parse(localOptions); }

    if (!localOptions) {
    localOptions = {}; }

    localOptions.redirect_to_payment = true;

    window.localStorage.setItem('guyra_options', JSON.stringify(localOptions));

  }
});

var member = window.localStorage.getItem('guyra_members');

if (typeof member === 'string') {
member = JSON.parse(member); }

if (member && member.user_name) {
  document.querySelector('.button-meet').remove();

  var greeting = document.querySelector('.welcome-greeting');
  greeting.classList.remove('d-none');
  greeting.innerHTML = 'Olá ' + member.user_name + '!';
}
</script>

<?php GetComponent('Footer');
