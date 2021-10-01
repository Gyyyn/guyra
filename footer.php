<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package guyra
 */

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

?>

<footer>
  <div class="squeeze mx-3 mx-md-auto">
    <nav style="--bs-breadcrumb-divider: '';" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['privacy_link'] ?>"><?php echo $gi18n['privacy'] ?></a></li>
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['terms_link'] ?>"><?php echo $gi18n['terms'] ?></a></li>
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['schools_footer_link'] ?>"><?php echo $gi18n['schools'] ?></a></li>
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['thanks_footer_link'] ?>"><?php echo $gi18n['thanks'] ?></a></li>
      </ol>
    </nav>
    <p class="mt-3">
      &copy; <?php echo date('Y') . ' ' . $gi18n['company_name']; ?> <br />
      <?php echo $gi18n['company_cnpj'] . ' / ' . $gi18n['company_address'] ?>
    </p>

    <img class="float-end page-icon" alt="Guyra bird" src="<?php echo $gi18n['title_logo_img'] ?>" />

  </div>
</footer>

<?php wp_footer(); ?>

<?php if ($args['react']): ?>
<script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<?php endif; ?>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj" crossorigin="anonymous"></script>
<?php if ($args['exercise_js']): ?>
<script src="<?php echo get_template_directory_uri(); ?>/exercises.js"></script>
<?php endif;
if ($args['courses_js']): ?>
<script src="<?php echo get_template_directory_uri(); ?>/courses.js"></script>
<?php endif;
if ($args['aos']): ?>
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js" crossorigin="anonymous"></script>
<script>AOS.init();</script>
<?php endif; ?>

</body>
</html>
