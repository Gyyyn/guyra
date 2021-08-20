<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package guyra
 */

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php
		if ( is_singular() ) :
			the_title( '<h1 class="entry-title">', '</h1>' );
		else :
			the_title( '<h2 class="entry-title">', '</h2>' );
		endif; ?>
	</header>

	<?php guyra_post_thumbnail(); ?>

	<div class="entry-content squeeze-small">
		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'guyra' ),
					array(
						'span' => array(
							'class' => array(),
						),
					)
				),
				wp_kses_post( get_the_title() )
			)
		);

		wp_link_pages(
			array(
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'guyra' ),
				'after'  => '</div>',
			)
		);
		?>
	</div>

	<footer class="entry-footer">
		<p class="written-by"><?php echo $gi18n['writtenby'] . ' ' . get_the_author(); ?></p>
		<span class="author-avatar rounded-circle"><?php echo get_avatar( get_the_author_meta( 'ID' ), 128 ); ?></span>
	</footer>
</article>
