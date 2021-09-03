<?php
/**
 * The landing page, loaded when user is logged out
 *
 * @package guyra
 */
 get_header();
 /* Set up translations independent of Wordpress */
 include get_template_directory() . '/i18n.php';
 ?>

   <div class="cover">
     <div class="cover-container container pt-3">

       <div class="row row-cols-auto align-items-start cover-card">

         <div class="col-md text-small">
           <div class="text-center">
             <img class="page-icon medium mb-5" alt="Guyra" src="<?php echo get_template_directory_uri(); ?>/assets/icons/language.png">
           </div>
           <h3><?php echo $gi18n['landing_title1'] ?></h3>
           <p><?php echo $gi18n['landing_explain1'] ?></p>
           <h3><?php echo $gi18n['landing_title2'] ?></h3>
           <p><?php echo $gi18n['landing_explain2'] ?></p>
           <h3><?php echo $gi18n['landing_title3'] ?></h3>
           <p><?php echo $gi18n['landing_explain3'] ?></p>
         </div>

         <div class="col-md d-flex align-items-center flex-column" data-aos="fade">
           <h2 class="marked mb-3">Let's go!</h2>

           <div id="prices_carousel" class="carousel carousel-dark slide w-100" data-bs-ride="carousel">
            <div class="carousel-inner text-center pt-3">

              <div class="carousel-item active">
                <div class="col mx-auto prices primary pro">
                  <div class="card mb-4 border-secondary">
                    <div class="card-header py-2">
                      <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlepro'] ?></h3>
                    </div>
                    <div class="card-body">
                      <h1 class="card-title text-secondary pricing-card-title"><?php echo $gi18n['pricesfeature_pricepro'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
                      <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
                        <li><span>Acesso as video aulas</span> <span>✅</span></li>
                        <li><span>Tire suas duvidas por WhatsApp ou na aula</span> <span>✅</span></li>
                        <li><span>Uma aula por semana</span> <span>✅</span></li>
                        <li><span>Exercicios de conversasao</span> <span>✅</span></li>
                      </ul>
                      <button type="button" data-bs-toggle="modal" data-bs-target="#buy-modal-premium" class="w-100 btn btn-lg"><?php echo $gi18n['button_want'] ?></button>
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
                      <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
                        <li><span>Acesso as video aulas</span> <span>✅</span></li>
                        <li><span>Tire suas duvidas por WhatsApp</span> <span>✅</span></li>
                        <li><span>Uma aula por semana</span> <span>❌</span></li>
                        <li><span>Exercicios de conversasao</span> <span>❌</span></li>
                      </ul>
                      <button type="button" data-bs-toggle="modal" data-bs-target="#buy-modal-lite" class="w-100 btn btn-lg"><?php echo $gi18n['button_want'] ?></button>
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

 	<main id="jump-info" class="landing bg-white">

    <div class="row feature squeeze pt-5">
      <div class="col-md d-flex flex-column justify-content-center align-items-center">

        <div class="p-1 p-md-5 order-2">
          <h2 class="feature-heading" data-aos="fade" data-aos-delay="100"><?php echo $gi18n['company_name'] ?></h2>
          <div class="lead" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['meta_desc'] ?></div>
        </div>

        <div class="picture">
          <img alt="phone" src="<?php echo $gi18n['logo_img'] ?>">
        </div>

      </div>
    </div>

    <hr class="thick squeeze my-5">

   <div class="row feature squeeze pt-5">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title1'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain1'] ?></div>
       </div>
     </div>
     <div class="col-md-3 order-md-1 d-flex justify-content-center">
       <div class="picture" data-aos="fade-left">
         <img alt="phone" src="<?php echo get_template_directory_uri(); ?>/assets/icons/phone.png">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title2'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain2'] ?></div>
       </div>
     </div>
     <div class="col-md-3 d-flex justify-content-center">
       <div class="picture" data-aos="fade-right">
         <img alt="clock" src="<?php echo get_template_directory_uri(); ?>/assets/icons/digital-clock.png">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div id="jump-prices" class="py-5"><div class="squeeze-big">

     <div class="row prices-container with-animation row-cols-1 row-cols-md-3 mb-3 text-center" data-aos="fade-up">
       <div class="col-md prices lite">
         <div class="card mb-4">
           <div class="card-header py-2">
             <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlelite'] ?></h3>
           </div>
           <div class="card-body">
             <h1 class="card-title pricing-card-title"><?php echo $gi18n['pricesfeature_pricelite'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
             <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
               <li><span>Acesso as video aulas</span> <span>✅</span></li>
               <li><span>Tire suas duvidas por WhatsApp</span> <span>✅</span></li>
               <li><span>Uma aula por semana</span> <span>❌</span></li>
               <li><span>Exercicios de conversasao</span> <span>❌</span></li>
             </ul>
             <button type="button" data-bs-toggle="modal" data-bs-target="#buy-modal-lite" class="w-100 btn btn-lg"><?php echo $gi18n['button_want'] ?></button>
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
               <li><span>Acesso as video aulas</span> <span>✅</span></li>
               <li><span>Tire suas duvidas por WhatsApp ou na aula</span> <span>✅</span></li>
               <li><span>Uma aula por semana</span> <span>✅</span></li>
               <li><span>Exercicios de conversasao</span> <span>✅</span></li>
             </ul>
             <button type="button" data-bs-toggle="modal" data-bs-target="#buy-modal-premium" class="w-100 btn btn-lg"><?php echo $gi18n['button_want'] ?></button>
           </div>
         </div>
       </div>
       <div class="col-md prices business">
         <div class="card mb-4">
           <div class="card-header">
             <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlebusiness'] ?></h3>
           </div>
           <div class="card-body">
             <h1 class="card-title pricing-card-title fs-3"><?php echo $gi18n['pricesfeature_pricebusiness'] ?><small class="text-muted fw-light">/<?php echo $gi18n['student'] ?></small></h1>
             <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
               <li><span>Todos os beneficios do plano premium</span> <span>✅</span></li>
               <li><span>Preparatorio IELTS/Cambridge/TOEFL</span> <span>✅</span></li>
               <li><span>A partir de 10 alunos</span> <span>ℹ</span></li>
             </ul>
             <button type="button" class="w-100 btn btn-lg" data-bs-toggle="modal" data-bs-target="#contact-modal"><?php echo $gi18n['button_contact'] ?></button>
           </div>
         </div>
       </div>
     </div>
     
     <div class="modal fade" id="contact-modal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
       <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="contactModalLabel"><?php echo $gi18n['button_contact'] ?></h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             <form>
               <div class="row g-3 mb-3 d-flex flex-row justify-content-between align-items-stretch align-items-center">
                 <label for="exampleFormControlInput1" class="form-label"><?php echo $gi18n['email'] ?></label>
                 <div class="col-auto flex-grow-1">
                   <div class="mb-3">
                     <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
                   </div>
                 </div>
                 <div class="col-auto flex-shrink-1" style="flex: 15em;">
                   <div class="form-check">
                     <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                     <label class="form-check-label" for="flexCheckDefault">
                       <?php echo $gi18n['modal_checkpromoconsent'] ?>
                     </label>
                   </div>
                 </div>
               </div>
               <div class="mb-3">
                 <label for="exampleFormControlTextarea1" class="form-label"><?php echo $gi18n['modal_textarealabel'] ?></label>
                 <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
               </div>
             </form>
           </div>
           <div class="modal-footer">
             <button type="submit" class="btn btn-primary"><?php echo $gi18n['button_submit'] ?></button>
           </div>
         </div>
       </div>
     </div>
     <div class="modal fade" id="buy-modal-lite" tabindex="-1" aria-labelledby="buy-modal-lite-label" aria-hidden="true">
       <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="buy-modal-lite-label"><?php echo $gi18n['youchose'] . $gi18n['pricesfeature_titlelite'] ?></h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             <?php echo $gi18n['buy_warning']; ?>
             <a mp-mode="dftl" href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380847a7b2916017a8846ebad0fb2" name="MP-payButton" class='btn btn-primary w-100'><?php echo $gi18n['payment'] ?></a>
           </div>
         </div>
       </div>
     </div>
     <div class="modal fade" id="buy-modal-premium" tabindex="-1" aria-labelledby="buy-modal-premium-label" aria-hidden="true">
       <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content">
           <div class="modal-header">
             <h5 class="modal-title" id="buy-modal-premium-label"><?php echo $gi18n['youchose'] . $gi18n['pricesfeature_titlepro'] ?></h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             <?php echo $gi18n['buy_warning']; ?>
             <a mp-mode="dftl" href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380847a7b2916017a8846ebad0fb2" name="MP-payButton" class='btn btn-primary w-100'><?php echo $gi18n['payment'] ?></a>
           </div>
         </div>
       </div>
     </div>

   </div></div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title3'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain3'] ?></div>
       </div>
     </div>
     <div class="col-md-3 order-md-1 d-flex justify-content-center">
       <div class="picture" data-aos="fade-left">
         <img alt="diploma" src="<?php echo get_template_directory_uri(); ?>/assets/icons/certificate.png">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col px-md-5 align-self-center">
       <div class="p-1 p-md-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title4'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain4'] ?></div>
       </div>
     </div>
     <div class="col-md-3 d-flex justify-content-center">
       <div class="picture" data-aos="fade-right">
         <img alt="Brazil" src="<?php echo get_template_directory_uri(); ?>/assets/icons/brazil-flag.png">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="row justify-content-center align-items-center px-5">
       <div class="col order-md-2 px-md-5 align-self-center">
         <div class="p-1 p-md-5">
           <h2 class="feature-heading" data-aos="fade" data-aos-delay="20"><?php echo $gi18n['index_feature_title5'] ?></h2>
           <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain5'] ?></div>
         </div>
       </div>
       <div class="col-md-3 order-md-1 d-flex justify-content-center">
         <div class="picture" data-aos="fade-left">
           <img alt="laptop" src="<?php echo get_template_directory_uri(); ?>/assets/icons/laptop.png">
         </div>
       </div>
     </div>

     <div class="row course-showcase text-dark p-1 p-md-5 mx-auto" data-aos="fade-up">
       <h2 class="feature-heading mb-4">Interchange</h2>
       <div class="col">
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
         <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
       </div>
       <div class="col-md-5">
       </div>
     </div>

     <div class="row course-showcase text-dark p-1 p-md-5 mx-auto" data-aos="fade-up">
       <h2 class="feature-heading mb-4">Interchange</h2>
       <div class="col">
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
         <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
       </div>
       <div class="col-md-5">
       </div>
     </div>

   </div>

 </main>

 <?php
 get_footer();
