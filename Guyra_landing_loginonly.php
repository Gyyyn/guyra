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
     <div class="cover-container container pt-3">
       <div class="row row-cols-auto align-items-center justify-content-around cover-card">

         <div class="col-md text-center">
           <img class="page-icon large" alt="Guyra" src="<?php echo get_template_directory_uri(); ?>/assets/icons/language.png">
         </div>

         <div class="col-md text-left">
           <h1><?php echo $gi18n['button_alreadyregistered'] ?></h1>
           <p>
             <a href="<?php echo get_site_url(); echo "/account"; ?>" class=" btn btn-lg btn-primary"><?php echo $gi18n['button_login'] ?></a>
           </p>
         </div>

       </div>
     </div>
   </div>
 </main>

 <?php
 get_footer();
