<?php

get_header();
?>

<main id="intro-content" class="site-main page squeeze">
  <div class="page-squeeze rounded-box">
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    	<?php /* <header class="entry-header d-flex align-items-baseline justify-content-between">
    		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
    	</header><!-- .entry-header --> */ ?>

    	<div class="entry-content">
    		<?php
    		the_content();

    		wp_link_pages(
    			array(
    				'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'guyra' ),
    				'after'  => '</div>',
    			)
    		);
    		?>
    	</div>

    </article>
  </div>
</main>

<?php
get_footer();
