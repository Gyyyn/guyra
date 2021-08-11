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

         <div class="d-flex flex-column m-5" data-aos="fade" data-aos-delay="500">
           <h1><?php echo $gi18n['landing_title1'] ?></h1>
           <p><?php echo $gi18n['landing_explain1'] ?></p>
           <h3><?php echo $gi18n['landing_title2'] ?></h1>
           <p><?php echo $gi18n['landing_explain2'] ?></p>
           <h3><?php echo $gi18n['landing_title3'] ?></h1>
           <p><?php echo $gi18n['landing_explain3'] ?></p>
         </div>

       </main>
     </div>
   </div>

 	<main>

   <div id="jump-info" class="container">

     <div class="row justify-content-start align-items-center featurette px-md-5 feature1 text-dark">
       <div class="col-md-7 order-md-2 px-md-5 align-self-center">
         <div class="bg-gradient-white text-box p-5">
           <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title1'] ?></h2>
           <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain1'] ?></div>
         </div>
       </div>
       <div class="col-md-3 order-md-1 d-flex justify-content-center">
         <div class="picture" data-aos="fade-left">
           <img alt="phone" src="<?php echo get_template_directory_uri(); ?>/assets/icons/phone.png">
         </div>
       </div>
     </div>

     <div class="row justify-content-end align-items-center featurette px-md-5 feature2 text-dark">
       <div class="col-md-7 px-md-5 align-self-center">
         <div class="bg-gradient-white-reverse text-box p-5">
           <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title2'] ?></h2>
           <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain2'] ?></div>
         </div>
       </div>
       <div class="col-md-3 d-flex justify-content-center">
         <div class="picture" data-aos="fade-right">
           <img alt="clock" src="<?php echo get_template_directory_uri(); ?>/assets/icons/digital-clock.png">
         </div>
       </div>
     </div>

     <div id="jump-prices" class="squeeze-big">

       <?php include 'purchase.php'; ?>

     </div>

     <div class="row justify-content-start align-items-center featurette px-md-5 feature3 text-dark">
       <div class="col-md-7 order-md-2 px-md-5 align-self-center">
         <div class="bg-gradient-white text-box p-5">
           <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title3'] ?></h2>
           <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain3'] ?></div>
         </div>
       </div>
       <div class="col-md-3 order-md-1 d-flex justify-content-center">
         <div class="picture" data-aos="fade-left">
           <img alt="diploma" src="<?php echo get_template_directory_uri(); ?>/assets/icons/certificate.png">
         </div>
       </div>
     </div>

     <div class="row end featurette px-md-5 feature4 text-dark">
       <div class="row justify-content-center align-items-center px-5">
         <div class="col-md-7 px-md-5 align-self-center">
           <div class="bg-white text-box p-5">
             <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title4'] ?></h2>
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
         <h2 class="mb-4">Interchange</h2>
         <div class="col-md-7">
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
           <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
         </div>
         <div class="col-md-5">
           <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ywuKYqF0cN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
         </div>
       </div>

       <div class="row course-showcase bg-white text-dark p-5 mx-auto" data-aos="fade-up">
         <h2 class="mb-4">Interchange</h2>
         <div class="col-md-7">
           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
           <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
         </div>
         <div class="col-md-5">
           <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ywuKYqF0cN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
         </div>
       </div>

     </div>

   </div><!-- /.container -->

   <footer class="bg-white">
     <div class="squeeze mx-3 mx-md-auto">
       <nav style="--bs-breadcrumb-divider: '';" aria-label="breadcrumb">
         <ol class="breadcrumb">
           <li class="breadcrumb-item"><a href="<?php echo $gi18n['privacy_link'] ?>"><?php echo $gi18n['privacy'] ?></a></li>
           <li class="breadcrumb-item"><a href="<?php echo $gi18n['terms_link'] ?>"><?php echo $gi18n['terms'] ?></a></li>
           <li class="breadcrumb-item"><a href="<?php echo $gi18n['schools_footer_link'] ?>"><?php echo $gi18n['schools'] ?></a></li>
         </ol>
       </nav>
       <p class="mt-3">
         &copy; <?php echo date('Y') . ' ' . $gi18n['comapny_name']; ?> <br />
         <?php echo $gi18n['company_cnpj'] . ' / ' . $gi18n['company_address'] ?>
       </p>

       <img class="float-end" alt="Guyra bird" src="<?php echo get_template_directory_uri(); ?>/assets/img/birdlogo_ver1-smaller.png" />

     </div>
   </footer>
 </main>

 <?php
 get_footer();
 
