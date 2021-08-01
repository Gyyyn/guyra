<?php
/**
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @package guyra
 */

get_header();

// Most posts on the site are user pages, we just want the ones tagged "blog"
$the_query = new WP_Query( array( 'category_name' => 'blog' ) );
?>

	<main id="primary" class="site-main squeeze" data-aos="fade-up" data-aos-once="true">
		<div class="page-squeeze"><div>

		<?php
		if ( $the_query->have_posts() ) :

			if ( is_home() && ! is_front_page() ) :
				?>
				<header>
					<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
				</header>
				<?php
			endif;

			/* Start the Loop */
			while ( $the_query->have_posts() ) :
				$the_query->the_post();

				/*
				* Include the Post-Type-specific template for the content.
				* If you want to override this in a child theme, then include a file
				* called content-___.php (where ___ is the Post Type name) and that will be used instead.
				*/
				get_template_part( 'template-parts/content', get_post_type() );

			endwhile;

			$the_query->the_posts_navigation();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>
		</div></div>

	</main><!-- #main -->

<?php
get_sidebar();
get_footer();
