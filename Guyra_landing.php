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
     <div class="cover-container d-flex w-100 h-100">
       <main class="squeeze d-flex flex-column flex-md-row align-items-center">

         <div class="d-flex flex-column justify-content-between" data-aos="fade">
           <img class="page-icon large" alt="Learning" src="<?php echo get_template_directory_uri(); ?>/assets/icons/language.png">
         </div>

         <div class="d-flex flex-column m-5">
           <h1><?php echo $gi18n['landing_title1'] ?></h1>
           <p><?php echo $gi18n['landing_explain1'] ?></p>
           <h3><?php echo $gi18n['landing_title2'] ?></h3>
           <p><?php echo $gi18n['landing_explain2'] ?></p>
           <h3><?php echo $gi18n['landing_title3'] ?></h3>
           <p><?php echo $gi18n['landing_explain3'] ?></p>
         </div>

       </main>
     </div>
   </div>

 	<main class="landing bg-white">

   <div class="row feature squeeze pt-5">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="bg-gradient-white p-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title1'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain1'] ?></div>
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
       <div class="bg-gradient-white-reverse p-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title2'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain2'] ?></div>
       </div>
     </div>
     <div class="col-md-3 d-flex justify-content-center">
       <div class="picture" data-aos="fade-right">
         <img alt="clock" src="<?php echo get_template_directory_uri(); ?>/assets/icons/digital-clock.png">
       </div>
     </div>
   </div>

   <hr class="thick squeeze my-5">

   <div id="jump-prices" class="bg-grey-darker py-5"><div class="squeeze-big">

     <?php include 'Guyra_purchase.php'; ?>

   </div></div>

   <hr class="thick squeeze my-5">

   <div class="row feature squeeze">
     <div class="col order-md-2 px-md-5 align-self-center">
       <div class="bg-gradient-white p-5">
         <h2 class="feature-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title3'] ?></h2>
         <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain3'] ?></div>
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
     <div class="row justify-content-center align-items-center px-5">
       <div class="col px-md-5 align-self-center">
         <div class="bg-white p-5">
           <h2 class="feature-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title4'] ?></h2>
           <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain4'] ?></div>
         </div>
       </div>
       <div class="col-md-3 d-flex justify-content-center">
         <div class="picture" data-aos="fade-right">
           <img alt="laptop" src="<?php echo get_template_directory_uri(); ?>/assets/icons/laptop.png">
         </div>
       </div>
     </div>

     <div class="row course-showcase bg-white text-dark p-5 mx-auto" data-aos="fade-up">
       <h2 class="feature-heading mb-4">Interchange</h2>
       <div class="col">
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
         <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
       </div>
       <div class="col-md-5">
         <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ywuKYqF0cN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
       </div>
     </div>

     <div class="row course-showcase bg-white text-dark p-5 mx-auto" data-aos="fade-up">
       <h2 class="feature-heading mb-4">Interchange</h2>
       <div class="col">
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
         <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
       </div>
       <div class="col-md-5">
         <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ywuKYqF0cN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
       </div>
     </div>

   </div>

 </main>

 <?php
 get_footer();
