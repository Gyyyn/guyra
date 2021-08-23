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
 </main>

 <?php
 get_footer();
