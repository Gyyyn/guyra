<?php

global $template_dir;
global $template_url;
global $gi18n;

include_once $template_dir . '/functions/Assets.php';

GetComponent('Header', ['css' => 'landing.css']); ?>

<div class="cover">
  <div class="cover-container">

    <div class="row row-cols-auto align-items-start cover-card">

      <div class="col-md p-5 bg-white more-rounded left">

        <div class="row">
          <div class="col-md mb-5 mb-md-0 d-flex align-items-center justify-content-around">
            <img alt="Guyra" class="page-icon large" src="<?php echo $gi18n['title_img']; ?>" />
          </div>
          <div class="col-md d-flex align-items-center justify-content-around">
            <video width="120" height="120" class="page-icon large" autoplay playsinline muted loop style="pointer-events: none;" src="<?php echo $template_url; ?>/assets/img/icons.webm"></video>
          </div>

          <p class="text-n pt-5 d-none d-md-block"><?php echo $gi18n['_landing']['main_subtitle'] ?></p>

          <div class="d-block d-md-none mt-5">

            <a class="btn-tall btn-lg blue d-block text-center" href="<?php echo $gi18n['account_link']; ?>"><?php echo $gi18n['button_login'] ?><i class="bi bi-box-arrow-in-right ms-2"></i></a>
            <a class="btn-tall btn-lg green mt-3 d-block text-center" href="#jump-info"><?php echo $gi18n['button_meet'] ?><i class="bi bi-door-open ms-2"></i></a>

          </div>
        </div>

      </div>

      <div class="col-md p-5 more-rounded right d-none d-md-block" data-aos="fade">

        <h2 class="text-blue"><?php echo $gi18n['_landing']['title4'] ?></h2>
        <p><?php echo $gi18n['_landing']['explain4'] ?></p>

        <div class="mt-5 w-100">
          <a class="green btn-lg btn-tall d-block text-center" href="#jump-prices"><?php echo $gi18n['button_want']; ?></a>
        </div>

      </div>

    </div>

  </div>
</div>

<div id="jump-info" class="landing bg-white">

  <div class="squeeze d-flex justify-content-end pt-5">
    <h1 class="text-purple-darker text-marked pt-5"><?php echo $gi18n['_landing']['title_explain'] ?></h1>
  </div>

  <div class="row feature squeeze pt-5">
   <div class="col order-md-2 px-md-5 align-self-center">
     <div class="p-1 p-md-5">
       <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['_landing']['feature_title1'] ?></h2>
       <div class="explain mb-3" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['_landing']['explain2'] ?></div>
       <div class="explain" data-aos="fade" data-aos-delay="400"><?php echo $gi18n['_landing']['feature_explain1'] ?></div>
     </div>
   </div>
   <div class="col-md-3 order-md-1 d-flex justify-content-center">
     <div class="page-icon large" data-aos="fade-left">
       <img alt="phone" src="<?php echo GetImageCache('icons/phone.png', 256); ?>">
     </div>
   </div>
  </div>

  <div class="row feature squeeze">
   <div class="col px-md-5 align-self-center">
     <div class="p-1 p-md-5">
       <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['_landing']['feature_title2'] ?></h2>
       <div class="explain" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['_landing']['feature_explain2'] ?></div>
     </div>
   </div>
   <div class="col-md-3 d-flex justify-content-center">
     <div class="page-icon large" data-aos="fade-right">
       <img alt="clock" src="<?php echo GetImageCache('icons/digital-clock.png', 256); ?>">
     </div>
   </div>
  </div>

  <div id="jump-prices" class="split-bg bg-dark py-5"><div class="squeeze-small">

   <div class="row prices-container with-animation mb-3 text-center" data-aos="fade-up">
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

  </div></div>

  <div class="squeeze d-flex justify-content-end">
    <h1 class="text-purple-darker text-marked"><?php echo $gi18n['_landing']['title_explain2'] ?></h1>
  </div>

  <div class="row feature squeeze">
   <div class="col order-md-2 px-md-5 align-self-center">
     <div class="p-1 p-md-5">
       <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['_landing']['feature_title3'] ?></h2>
       <div class="explain mb-3" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['_landing']['feature_explain3'] ?></div>
       <div class="explain" data-aos="fade" data-aos-delay="400"><?php echo $gi18n['_landing']['explain1'] ?></div>
     </div>
   </div>
   <div class="col-md-3 order-md-1 d-flex justify-content-center">
     <div class="page-icon large" data-aos="fade-left">
       <img alt="diploma" src="<?php echo GetImageCache('icons/certificate.png', 256); ?>">
     </div>
   </div>
  </div>

  <div class="row feature squeeze">
   <div class="col px-md-5 align-self-center">
     <div class="p-1 p-md-5">
       <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['_landing']['feature_title4'] ?></h2>
       <div class="explain mb-3" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['_landing']['feature_explain4'] ?></div>
       <div class="explain" data-aos="fade" data-aos-delay="400"><?php echo $gi18n['_landing']['explain3'] ?></div>
     </div>
   </div>
   <div class="col-md-3 d-flex justify-content-center">
     <div class="page-icon large" data-aos="fade-right">
       <img alt="Brazil" src="<?php echo GetImageCache('icons/light.png', 256); ?>">
     </div>
   </div>
  </div>

  <div class="row feature squeeze">
   <div class="col order-md-2 px-md-5 align-self-center">
     <div class="p-1 p-md-5">
       <h2 class="text-primary" data-aos="fade" data-aos-delay="20"><?php echo $gi18n['_landing']['feature_title5'] ?></h2>
       <div class="explain" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['_landing']['feature_explain5'] ?></div>
     </div>
   </div>
   <div class="col-md-3 order-md-1 d-flex justify-content-center">
     <div class="page-icon large" data-aos="fade-left">
       <img alt="laptop" src="<?php echo GetImageCache('icons/laptop.png', 256); ?>">
     </div>
   </div>
  </div>

  <div class="bg-dark split-bg py-5"><div class="row feature squeeze">

    <div class="row course-showcase text-dark cover-card p-5 mt-3 position-relative" data-aos="fade-up">
      <img class="page-icon m-5 position-absolute top-0 end-0" src="<?php echo GetImageCache('icons/target.png', 128); ?>">
      <h2 class="text-primary mt-3 mb-5"><?php echo $gi18n['activities'] ?></h2>
      <div class="col">
        <p><?php echo $gi18n['_landing']['showcase_activities'] ?></p>
      </div>
      <div class="col-md-6 d-flex justify-content-center">
        <div class="card trans">
          <img alt="screenshot" src="<?php echo GetImageCache('img/practice_ss.png', ['x' => 320, 'y' => 180]); ?>">
        </div>
      </div>
    </div>

    <div class="row course-showcase text-dark cover-card p-5 mt-3 position-relative" data-aos="fade-up">
     <img class="page-icon m-5 position-absolute top-0 end-0" src="<?php echo GetImageCache('icons/online-learning.png', 128); ?>">
     <h2 class="text-primary mt-3 mb-5"><?php echo $gi18n['courses'] ?></h2>
     <div class="col">
       <p><?php echo $gi18n['_landing']['showcase_courses'] ?></p>
     </div>
     <div class="col-md-6">
       <iframe src="https://www.youtube.com/embed/iW2MXtiGgu4" title="YouTube video player" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture large" allowfullscreen></iframe>
       <iframe src="https://www.youtube.com/embed/qTpsh4YWN7I" title="YouTube video player" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture large" allowfullscreen></iframe>
     </div>
    </div>

    <div class="row course-showcase text-dark cover-card p-5 mt-3 position-relative" data-aos="fade-up">
     <img class="page-icon m-5 position-absolute top-0 end-0" src="<?php echo GetImageCache('icons/layers.png', 128); ?>">
     <h2 class="text-primary mt-3 mb-5"><?php echo $gi18n['ultilities'] ?></h2>
     <div class="col">
       <p><?php echo $gi18n['_landing']['showcase_ultilities'] ?></p>
     </div>
     <div class="col-md-6 d-flex justify-content-center">
       <div class="card trans">
         <img alt="screenshot" src="<?php echo GetImageCache('img/dictionary_ss.png', ['x' => 320, 'y' => 180]); ?>">
       </div>
     </div>
    </div>

  </div></div>

  <div class="d-flex flex-column feature squeeze">
   <div class="px-md-5 align-self-center">
     <div class="p-1 p-md-5">
       <h1 class="text-super text-marked" data-aos="fade" data-aos-delay="20">Ainda com dúvidas?</h2>
       <div class="explain my-3" data-aos="fade" data-aos-delay="300">Não tem por que! Faça sua conta e aprenda por 30 dias sem pagar nada, zero compromisso.</div>
     </div>
   </div>
   <div class="d-flex justify-content-center mb-5">
     <a class="blue btn-lg btn-tall" href="<?php echo $gi18n['register_link'] ?>"><?php echo $gi18n['register']; ?></a>
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

</script>

<?php GetComponent('Footer', ['aos' => true, 'js' => 'Landing.js']);
