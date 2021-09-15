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
           <video class="page-icon large" autoplay playsinline muted loop style="pointer-events: none;" src="<?php echo get_template_directory_uri(); ?>/assets/img/icons.webm">
             <img class="page-icon large" alt="Guyra" src="<?php echo get_template_directory_uri(); ?>/assets/icons/language.png">
           </video>
         </div>

         <div class="col-md text-left">
           <h1 class="text-center"><?php echo $gi18n['button_alreadyregistered'] ?></h1>
           <p class="text-center py-3">
             <a href="<?php echo get_site_url(); echo "/account"; ?>" class="btn-tall blue text-larger"><?php echo $gi18n['button_login'] ?></a>
           </p>
           <hr class="thick" />
           <div class="text-small">
             <p class="text-muted">Ainda não é aluno? Nós estamos em uma fase de testes fechada, mas você pode <a href="mailto:hello@guyra.me">entrar em contato</a> para entrar na lista de espera.</p>
           </div>
         </div>

       </div>
     </div>
   </div>
 </main>

 <style>

 #navbarCollapse > ul:nth-child(1) > li:nth-child(2),
 #navbarCollapse > ul:nth-child(1) > li:nth-child(3),
 #navbarCollapse > ul.navbar-nav.justify-content-end.nav-rightside > li:nth-child(1),
 #navbarCollapse > ul.navbar-nav.justify-content-end.nav-rightside > i {
   display: none;
 }

 </style>

 <?php
 get_footer();
