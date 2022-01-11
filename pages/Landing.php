<?php
/**
 * The landing page, loaded when user is logged out
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $site_url;
global $gi18n;

include_once $template_dir . '/functions/Assets.php';

get_header(null, ['css' => 'landing.css']);
 ?>

   <div class="cover">
     <div class="cover-container container pt-3">

       <div class="row row-cols-auto align-items-start cover-card">
         <div class="col-md p-5 bg-white more-rounded left">

           <div class="row mb-5">
             <div class="col-md mb-5 mb-md-0 d-flex align-items-center justify-content-around">
               <img alt="Guyra" class="page-icon large" src="<?php echo $gi18n['title_img']; ?>" />
             </div>
             <div class="col-md d-flex align-items-center justify-content-around">
               <video class="page-icon large" autoplay playsinline muted loop style="pointer-events: none;" src="<?php echo $template_url; ?>/assets/img/icons.webm">
                 <img class="page-icon large" alt="Guyra" src="<?php echo GetImageCache('icons/language.png', 128); ?>">
               </video>
             </div>
           </div>

           <h3><?php echo $gi18n['landing_title1'] ?></h3>
           <p><?php echo $gi18n['landing_explain1'] ?></p>
           <h3><?php echo $gi18n['landing_title2'] ?></h3>
           <p><?php echo $gi18n['landing_explain2'] ?></p>
           <h3><?php echo $gi18n['landing_title3'] ?></h3>
           <p><?php echo $gi18n['landing_explain3'] ?></p>
         </div>

         <div class="col-md p-5 d-flex align-items-center flex-column" data-aos="fade">

           <div class="mt-3 flex-grow-1">

             <h1 class="text-center"><?php echo $gi18n['button_alreadyregistered']; ?></h1>
             <p class="text-center py-3">
               <a href="<?php echo $gi18n['account_link']; ?>" class="btn-tall blue text-larger"><?php echo $gi18n['button_login'] ?></a>
             </p>

           </div>

           <div class="mt-5 flex-grow-1 d-flex align-items-center flex-column w-100">

             <h2 class="mb-3"><?php echo $gi18n['button_notyetregistered']; ?></h2>
             <div id="prices_carousel" class="carousel carousel-dark slide w-100" data-bs-ride="carousel">
              <div class="carousel-inner text-center pt-3">

                <div class="carousel-item active">
                  <div class="col mx-auto prices primary pro">
                    <div class="card mb-4 border-secondary">
                      <div class="card-header py-2">
                        <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlepro'] ?></h3>
                      </div>
                      <div class="card-body">
                        <h1 class="card-title text-secondary pricing-card-title">
                          <?php echo $gi18n['pricesfeature_pricepro'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small>
                        </h1>
                        <a href="#jump-prices" type="button" class="w-100 btn-tall"><?php echo $gi18n['button_want']; ?></a>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="carousel-item">
                  <div class="col mx-auto prices lite">
                    <div class="card mb-4">
                      <div class="card-header py-2">
                        <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlelite'] ?></h3>
                      </div>
                      <div class="card-body">
                        <h1 class="card-title pricing-card-title"><?php echo $gi18n['pricesfeature_pricelite'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
                        <a href="#jump-prices" type="button" class="w-100 btn-tall"><?php echo $gi18n['button_want']; ?></a>
                      </div>
                    </div>
                  </div>
                </div>

                <button class="carousel-control-prev" type="button" data-bs-target="#prices_carousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#prices_carousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>

              </div>
            </div>

           </div>

       </div>

     </div>
   </div>
  </div>

 	<main id="jump-info" class="landing bg-white">

    <div class="row feature squeeze pt-5">
      <div class="col-md d-flex flex-column justify-content-center align-items-center">

        <div class="p-1 p-md-5 order-2">
          <h2 class="text-primary" data-aos="fade" data-aos-delay="100"><?php echo $gi18n['company_name'] ?></h2>
          <div class="lead" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['meta_desc'] ?></div>
        </div>

        <div class="page-icon large">
          <img alt="phone" src="<?php echo $gi18n['logo_img'] ?>">
        </div>

      </div>
    </div>

    <hr class="thick squeeze my-5">

   <div class="row feature squeeze pt-5">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title1'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain1'] ?></div>
       </div>
     </div>
     <div class="col-md-3 order-md-1 d-flex justify-content-center">
       <div class="page-icon large" data-aos="fade-left">
         <img alt="phone" src="<?php echo GetImageCache('icons/phone.png', 128); ?>">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title2'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain2'] ?></div>
       </div>
     </div>
     <div class="col-md-3 d-flex justify-content-center">
       <div class="page-icon large" data-aos="fade-right">
         <img alt="clock" src="<?php echo GetImageCache('icons/digital-clock.png', 128); ?>">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div id="jump-prices" class="split-bg bg-dark py-5"><div class="squeeze-big">

     <div class="row prices-container with-animation row-cols-1 row-cols-md-3 mb-3 text-center" data-aos="fade-up">
       <div class="col-md prices lite">
         <div class="card mb-4">
           <div class="card-header py-2">
             <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlelite'] ?></h3>
           </div>
           <div class="card-body">
             <h1 class="card-title pricing-card-title"><?php echo $gi18n['pricesfeature_pricelite'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
             <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
               <li class="fw-bold mb-3"><span class="text-normal"><?php echo $gi18n['pricesfeature_oneclass']; ?></span> <span class="text-normal d-flex align-items-center"><i class="bi bi-x-lg text-red"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_courses_access']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_whatsapp_questions']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_exercises']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_pictionary']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             </ul>
             <a href="<?php echo $gi18n['register_link']; ?>" type="button" class="w-100 btn-tall"><?php echo $gi18n['button_want']; ?></a>
           </div>
         </div>
       </div>
       <div class="col-md prices primary">
         <div class="card mb-4 border-secondary">
           <div class="card-header py-2">
             <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlepro'] ?></h3>
           </div>
           <div class="card-body">
             <h1 class="card-title text-secondary pricing-card-title"><?php echo $gi18n['pricesfeature_pricepro'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
             <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
               <li class="fw-bold mb-3"><span class="text-normal"><?php echo $gi18n['pricesfeature_oneclass']; ?></span> <span class="text-normal d-flex align-items-center"><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_courses_access']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_whatsapp_questions']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_exercises']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
               <li><span><?php echo $gi18n['pricesfeature_pictionary']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
             </ul>
             <a href="<?php echo $gi18n['register_link']; ?>" type="button" class="w-100 btn-tall"><?php echo $gi18n['button_want']; ?></a>
           </div>
         </div>
       </div>
     </div>

   </div></div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title3'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain3'] ?></div>
       </div>
     </div>
     <div class="col-md-3 order-md-1 d-flex justify-content-center">
       <div class="page-icon large" data-aos="fade-left">
         <img alt="diploma" src="<?php echo GetImageCache('icons/certificate.png', 128); ?>">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title4'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain4'] ?></div>
       </div>
     </div>
     <div class="col-md-3 d-flex justify-content-center">
       <div class="page-icon large" data-aos="fade-right">
         <img alt="Brazil" src="<?php echo GetImageCache('icons/brazil-flag.png', 128); ?>">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="text-primary" data-aos="fade" data-aos-delay="20"><?php echo $gi18n['index_feature_title5'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain5'] ?></div>
       </div>
     </div>
     <div class="col-md-3 order-md-1 d-flex justify-content-center">
       <div class="page-icon large" data-aos="fade-left">
         <img alt="laptop" src="<?php echo GetImageCache('icons/laptop.png', 128); ?>">
       </div>
     </div>
   </div>

   <div class="bg-dark split-bg py-5"><div class="row feature squeeze">

     <div class="row course-showcase text-dark cover-card p-5 mt-5 position-relative" data-aos="fade-up">
       <img class="page-icon m-5 position-absolute top-0 end-0" alt="quicktips" src="<?php echo GetImageCache('icons/courses/quicktips.png', 64); ?>">
       <h2 class="text-primary my-5">Gramática Rápida</h2>
       <div class="col">
         <p>Todas as gramáticas do inglês, explicadas em menos de 5 minutos por vez.</p>
         <p>No primeiro vídeo da séries vamos ver uma explicação rápida do "Simple Present".</p>
       </div>
       <div class="col-md-6">
         <iframe src="https://www.youtube.com/embed/iW2MXtiGgu4" title="YouTube video player" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture large" allowfullscreen></iframe>
       </div>
     </div>

     <div class="row course-showcase text-dark cover-card p-5 mt-5 position-relative" data-aos="fade-up">
       <img class="page-icon m-5 position-absolute top-0 end-0" alt="quicktips" src="<?php echo GetImageCache('icons/courses/speaking.png', 64); ?>">
       <h2 class="text-primary my-5">Fonética 1</h2>
       <div class="col">
         <p>Introdução a fonética do inglês e dicas de pronúncia.</p>
         <p>No segundo vídeo da série vamos ver como ler as vogais do IPA (alfabeto fonético internacional).</p>
       </div>
       <div class="col-md-6">
         <iframe src="https://www.youtube.com/embed/qTpsh4YWN7I" title="YouTube video player" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture large" allowfullscreen></iframe>
       </div>
     </div>

   </div></div>

 </main>

 <?php
 get_footer(null, ['aos' => true]);
