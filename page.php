<?php
/**
 * The template for displaying all pages
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package guyra
 */

 get_header();
 ?>

 	<main id="intro-content" class="site-main page squeeze">
         <div class="page-squeeze rounded-box">

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

 			the_posts_navigation();

 		else :

 			get_template_part( 'template-parts/content', 'none' );

 		endif;
 		?>
 		</div>

 	</main>

 <?php
 get_footer();
