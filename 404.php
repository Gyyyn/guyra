<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package guyra
 */

 /* Set up translations independent of Wordpress */
 include get_template_directory() . '/i18n.php';

get_header();
?>

	<main id="primary" class="site-main container-fluid text-center p-5 m-auto bg-white">

		<section class="error-404 not-found">
			<header class="page-header">
				<span class="w-25 d-inline-block"><img class="float-end" alt="Guyra bird" src="<?php echo $gi18n['logo_img']; ?>" /></span>
				<h1 class="page-title"><?php echo $gi18n['are_you_lost']; ?></h1>
			</header>

			<div class="page-content">
				<p><?php echo $gi18n['are_you_lost_explain']; ?></p>
			</div>
		</section>

	</main>

	<script>

		setTimeout(function(){ window.location.href = "<?php echo get_site_url(); ?>"; }, 5000);

	</script>

<?php
get_footer();
