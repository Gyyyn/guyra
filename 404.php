<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package guyra
 */

get_header();
?>

	<main id="primary" class="site-main container-fluid text-center p-5 m-auto">

		<section class="error-404 not-found">
			<header class="page-header">
				<span class="w-25 d-inline-block"><?php echo get_custom_logo(); ?></span>
				<h1 class="page-title"><?php esc_html_e( 'Are you lost?', 'guyra' ); ?></h1>
			</header><!-- .page-header -->

			<div class="page-content">
				<p><?php esc_html_e( 'It looks like nothing was found at this location...', 'guyra' ); ?></p>
			</div><!-- .page-content -->
		</section><!-- .error-404 -->

	</main><!-- #main -->

<?php
get_footer();
