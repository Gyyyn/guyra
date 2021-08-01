<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package guyra
 */

get_header();
?>

	<main id="intro-content" class="site-main archive squeeze">
        <div class="page-squeeze"><div>

		<?php if ( have_posts() ) : ?>

			<header class="page-header">
				<h1 class="mb-5">The Guyra Blog</h1>
			</header><!-- .page-header -->

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
		</div></div>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
