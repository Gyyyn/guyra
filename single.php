<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package guyra
 */

// Currently we don't want this working
if (!current_user_can('manage_options')) {
  wp_redirect(get_site_url());
} else {

get_header();

?>
<script>
  document.querySelector('#wp-admin-bar-edit a').click();
</script>

<?php
echo "<div class='container-fluid' style='background: #fff; margin-top: 10rem;'>If nothing happened, click the edit button above</div>";

}

?>
