<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $gi18n;

// Check if this page is supposed to exist but wasn't created yet.

$post_data = [
  'post_title'    => '',
  'post_content'  => '',
  'post_status'   => 'publish',
  'post_type'     => 'page',
  'post_author'   => 1,
  'page_template' => null
];

$criticalPages = [
  'Api',
  'Account',
  'Comment',
  'Reference',
  'Practice',
  'Courses'
];

$weHaveDoneSomething = false;

foreach ($criticalPages as $page) {
  if ( !is_object( get_page_by_title($page) ) ) {

    $weHaveDoneSomething = true;
    $post_data['post_title'] = $page;
    wp_insert_post($post_data);

  }
}

if ($weHaveDoneSomething):
  header('Location: '.$_SERVER['REQUEST_URI']);
else:

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

	<script>setTimeout(() => window.location.href = "<?php echo $site_url; ?>", 5000)</script>

<?php
get_footer();

endif;
