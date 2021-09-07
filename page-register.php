<?php
/**
 * The landing page, loaded when user is logged out
 *
 * @package guyra
 */

// We don't want registered users here
if(is_user_logged_in()) {
 wp_redirect(get_site_url());
}

get_header();
/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

  <div class="cover">
   <div class="cover-container container pt-5 p-md-5">
     <div class="rounded-box p-0 mt-0 page-squeeze">

       <div class="row">

         <div class="col-5 d-none d-md-flex">
           <img class="left-side-image" alt="Register" src="<?php echo get_template_directory_uri(); ?>/assets/img/register.png" />
         </div>

        <div class="col p-5 d-flex flex-column align-items-center">

          <h2 class="d-block d-md-none mb-3"><?php echo $gi18n['register'] ?></h2>

          <?php if ( have_posts() ) : ?>

       			<?php
       			/* Start the Loop */
       			while ( have_posts() ) :
       				the_post();

       				/*
       				 * Include the Post-Type-specific template for the content.
       				 * If you want to override this in a child theme, then include a file
       				 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
       				 */
       				get_template_part( 'template-parts/content', get_post_type() );

       			endwhile;


       		endif; ?>

        </div>


       </div>

    </div>
   </div>
  </div>

<?php
get_footer();
