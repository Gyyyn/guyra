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

	<main id="intro-content" class="site-main squeeze" data-aos="fade-up" data-aos-once="true">
        <div class="page-squeeze"><div>

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content', 'page' );

		endwhile; // End of the loop.

        if ( comments_open() || get_comments_number() ) :
            comments_template();
        endif;
		?>

        </div></div>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
