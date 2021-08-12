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
 <style>
 .navbar { display: none; }
 .cover { margin-top: 0; height: 100vh;}
 img.page-icon.large { width: calc(5vw + 5rem); }
 </style>

   <div class="cover">
     <div class="cover-container d-flex w-100 h-100">
       <main class="squeeze d-flex flex-column flex-md-row align-items-center">

         <div class="d-flex flex-column justify-content-between" data-aos="fade">
           <img class="page-icon large" alt="Guyra" src="<?php echo get_template_directory_uri(); ?>/assets/icons/language.png">
         </div>

         <div class="d-flex flex-column m-5">
           <h1><?php echo $gi18n['button_alreadyregistered'] ?></h1>
           <p class="text-center">
             <a href="<?php echo get_site_url(); echo "/account"; ?>" class=" btn btn-lg btn-primary"><?php echo $gi18n['button_login'] ?></a>
           </p>
         </div>

       </main>
     </div>
   </div>

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
