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

global $template_dir;
global $template_url;
global $current_user_id;
global $gi18n;

include_once $template_dir . '/functions/Assets.php';

?>

<footer>
  <div class="squeeze mx-3 mx-md-auto">
    <nav style="--bs-breadcrumb-divider: '';" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['privacy_link'] ?>"><?php echo $gi18n['privacy'] ?></a></li>
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['terms_link'] ?>"><?php echo $gi18n['terms'] ?></a></li>
        <li class="breadcrumb-item"><a href="<?php echo $gi18n['blog_link'] ?>"><?php echo $gi18n['blog'] ?></a></li>
        <?php if (false): ?><li class="breadcrumb-item"><a href="<?php echo $gi18n['schools_footer_link'] ?>"><?php echo $gi18n['schools'] ?></a></li> <?php endif; ?>
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

<?php if ($args['recaptcha']): ?>
<script src="https://www.google.com/recaptcha/api.js?render=6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt"></script>
<?php endif; ?>

<?php if ($args['react']): ?>
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/html-react-parser@1/dist/html-react-parser.min.js"></script>
<?php endif; ?>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>

<?php if ($args['js']): ?>
<script async src="<?php echo GetMinifiedAsset('js', $args['js']); ?>"></script>
<?php endif; ?>

<?php if ($args['aos']): ?>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" crossorigin="anonymous">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js" crossorigin="anonymous"></script>
<script>AOS.init();</script>
<?php endif; ?>

<?php if ($args['easymde']): ?>
<link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css">
<script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
<script>
const easyMDE = new EasyMDE({
  element: document.getElementById('<?php echo $args['easymde']; ?>'),
  autosave: { enabled: true, uniqueId: 'UserPageReplyBox' },
  toolbar: ["bold", "italic", "heading", "|", "quote", "link", "ordered-list", "image", "|", "table", "horizontal-rule"]
});
</script>
<?php endif; ?>

<script async src="<?php echo GetMinifiedAsset('js', 'misc.js'); ?>"></script>

</body>
</html>

<?php

// Peroformance tracker for dev env
// global $timeToExecuteFromStartOfWP;
// echo 'Total execution time in seconds: ' . (microtime(true) - $timeToExecuteFromStartOfWP);
