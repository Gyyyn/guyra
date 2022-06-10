<?php

global $template_dir;
global $template_url;
global $site_url;
global $gi18n;

GetComponent('Header', ['css' => 'landing.css']); ?>

 <div class="cover bg-dark">
   <div class="cover-container container pt-3">

     <div class="cover-card row p-5 bg-white">
       <div class="col-md order-md-2 px-md-5 align-self-center">
         <h2 class="text-primary" data-aos="fade" data-aos-delay="100"><?php echo $gi18n['prices_features']['business']['title']; ?></h2>
         <p data-aos="fade" data-aos-delay="500"><?php echo $gi18n['workwithus_thesell'] ?></p>
         <p data-aos="fade" data-aos-delay="1500">
           <?php echo $gi18n['workwithus_thesell_explain'] ?>
           <p data-aos="fade" data-aos-delay="1500" class="d-flex"><a class="btn-tall purple align-self-center" href="#jump-prices"><?php echo $gi18n['button_how']; ?></a></p>
         </p>
       </div>
       <div class="col-md-3">
         <div class="page-icon large">
           <img alt="phone" src="<?php echo $gi18n['logo_img'] ?>">
         </div>
       </div>
     </div>

   </div>
  </div>

 	<div id="jump-info" class="landing bg-white">

    <div class="row feature squeeze">
      <div class="col order-md-2 px-md-5 align-self-center">
        <div class="p-1 p-md-5">
          <h2 class="text-primary" data-aos="fade" data-aos-delay="200"><?php echo $gi18n['index_feature_title3'] ?></h2>
          <div class="lead" data-aos="fade" data-aos-delay="300"><?php echo $gi18n['index_feature_explain3'] ?></div>
        </div>
      </div>
      <div class="col-md-3 order-md-1 d-flex justify-content-center">
        <div class="page-icon large" data-aos="fade-left">
          <img alt="diploma" src="<?php echo $template_url; ?>/assets/icons/certificate.png">
        </div>
      </div>
    </div>

    <hr class="thick squeeze my-5">

    <div id="jump-prices" class="split-bg bg-primary py-5"><div class="squeeze-big">

      <div class="row prices-container row-cols-1 row-cols-md-3 mb-3 text-center" data-aos="fade-up">
        <div class="col-md prices primary business">
          <div class="card mb-4">
            <div class="card-header">
              <h3 class="my-1 fw-normal"><?php echo $gi18n['prices_features']['business']['title'] ?></h3>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title fs-3"><?php echo $gi18n['prices_features']['business']['price'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
              <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
                <li class="fw-bold mb-3"><span class="text-normal"><?php echo $gi18n['prices_features']['feature_allfrompremium']; ?></span></li>

                <li><span><?php echo $gi18n['prices_features']['feature_courses_access']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
                <li><span><?php echo $gi18n['prices_features']['feature_whatsapp_questions2']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
                <li><span><?php echo $gi18n['prices_features']['feature_exercises']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
                <li><span><?php echo $gi18n['prices_features']['feature_pictionary']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>

                <hr />
                <li class="fw-bold mb-3"><span class="text-normal"><?php echo $gi18n['prices_features']['feature_andforyourschool']; ?></span></li>

                <li><span><?php echo $gi18n['prices_features']['feature_school_management']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
                <li><span><?php echo $gi18n['prices_features']['feature_payment_processor']; ?></span> <span><i class="bi bi-check-lg text-green"></i></span></li>
              </ul>
              <button type="button" class="w-100 btn-tall" data-bs-toggle="modal" data-bs-target="#contact-modal"><?php echo $gi18n['button_contact'] ?></button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade pop-animation animate" id="contact-modal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="contactModalLabel"><?php echo $gi18n['button_contact'] ?></h3>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="row">
                  <div class="col-auto flex-grow-1">
                    <div class="mb-3">
                      <input type="email" class="form-control" id="contactControlInput1" placeholder="voce@exemplo.com">
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                      <label class="form-check-label" for="flexCheckDefault">
                        <?php echo $gi18n['modal_checkpromoconsent'] ?>
                      </label>
                    </div>
                  </div>
                </div>
                <hr />
                <div class="mb-3">
                  <p class="my-3"><?php echo $gi18n['workwithus_tellusaboutyourschool']; ?></p>
                  <label for="contactControlTextarea1" class="form-label"><?php echo $gi18n['modal_textarealabel'] ?></label>
                  <textarea class="form-control bg-grey" id="contactControlTextarea1" rows="5"></textarea>
                </div>
                <button type="submit" class="btn-tall blue w-100"><?php echo $gi18n['button_submit'] ?></button>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div></div>

 </div>

<?php GetComponent('Footer', ['aos' => true]);
