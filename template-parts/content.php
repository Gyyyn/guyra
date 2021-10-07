<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package guyra
 */

$canEdit = current_user_can('edit_posts');
$postTitle = the_title(null, null, false);
$postId = get_the_ID();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

?>

<article id="post-<?php echo $postId; ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<h1 class="entry-title"><?php echo $postTitle; ?></h1>
	</header>

	<?php if ( is_singular() ) :?>

		<div class="post-thumbnail">
			<?php the_post_thumbnail(); ?>
		</div>

	<?php else : ?>

		<a class="post-thumbnail" aria-hidden="true" tabindex="-1">
			<?php
				the_post_thumbnail(
					'post-thumbnail',
					['alt' => the_title_attribute(['echo' => false])]
				);
			?>
		</a>

	<?php endif; ?>

	<?php if ($canEdit): ?>

	<div class="d-flex align-items-center justify-content-center bg-grey py-3">

		<span class="badge bg-primary me-3">
			<?php echo $postTitle ?>
			<i class="bi bi-arrow-right"></i>
			<?php echo $gi18n['you_can'] . ':'; ?>
		</span>

		<span>
			<a class="btn-tall btn-sm blue" href="<?php echo get_edit_post_link(); ?>">
				<i class="bi bi-pencil-square"></i>
				<?php echo $gi18n['edit']; ?>
			</a>
		</span>

	</div>

	<?php endif; ?>

	<div class="entry-content squeeze-small">
		<?php
		the_content(
			sprintf(
				wp_kses(
					/* translators: %s: Name of current post. Only visible to screen readers */
					__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'guyra' ),
					['span' => ['class' => []]]
				),
				wp_kses_post( $postTitle )
			)
		);

		wp_link_pages(
			[
				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'guyra' ),
				'after'  => '</div>'
			]
		);
		?>
	</div>

	<footer class="entry-footer">
		<p class="written-by"><?php echo $gi18n['writtenby'] . ' ' . get_the_author(); ?></p>
		<span class="author-avatar rounded-circle"><?php echo get_avatar( get_the_author_meta( 'ID' ), 128 ); ?></span>
	</footer>
</article>
