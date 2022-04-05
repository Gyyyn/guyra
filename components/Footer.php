<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $gi18n;
global $args;

include_once $template_dir . '/functions/Assets.php';

?>

<div class="position-fixed bottom-0 end-0 notepad-element overflow-x-visible">
  <a class="btn-tall blue opacity-0 round-border position-absolute" id="notepad-toggle" aria-label="<?php echo $gi18n['notepad'] ?>">
    <img class="page-icon tiny" alt="notes" width="32" height="32" src="<?php echo GetImageCache('icons/notes.png', 64); ?>">
  </a>
</div>

<div class="position-fixed bottom-0 end-0 notepad-element">
  <div class="position-absolute opacity-0 pop-animation animate" id="notepad">
    <div id="notepad-header" class="position-absolute top-0 end-0 p-3" style="cursor: move;"><i class="bi bi-arrows-move"></i></div>
    <textarea id="notepad-text" class="text-small" value=""></textarea>
  </div>
</div>

<footer class="d-none d-md-flex flex-column my-3 text-grey-darker text-sss justify-content-center align-items-center">
  <nav style="--bs-breadcrumb-divider: '';" aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['help_link'] ?>"><?php echo $gi18n['help'] ?></a></li>
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['privacy_link'] ?>"><?php echo $gi18n['privacy'] ?></a></li>
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['terms_link'] ?>"><?php echo $gi18n['terms'] ?></a></li>
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['schools_footer_link'] ?>"><?php echo $gi18n['schools'] ?></a></li>
    </ol>
  </nav>
  <span><?php echo $gi18n['meta_thirdparty_credit'] ?></span>
  <p class="mt-3">
    &copy; 2019 - <?php echo date('Y') . ' ' . $gi18n['company_name']; ?>
    <?php echo $gi18n['company_cnpj'] . ' / ' . $gi18n['company_address'] ?>
  </p>
</footer>

<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script async src="https://unpkg.com/html-react-parser@1/dist/html-react-parser.min.js"></script>
<script async src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" crossorigin="anonymous" type="text/javascript"></script>
<?php if ($args['recaptcha']): ?>
<script src="https://www.google.com/recaptcha/api.js?render=6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt"></script>
<?php endif; ?>
<?php if ($args['easymde']): ?>
<link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css">
<script async src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
<?php endif; ?>
<?php if ($args['MercadoPago']): ?>
<script async src="https://sdk.mercadopago.com/js/v2"></script>
<script async src="https://www.mercadopago.com/v2/security.js" view="checkout" output="deviceId"></script>
<?php endif; ?>
<script src="https://unpkg.com/@popperjs/core@2"></script>
<script async src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" crossorigin="anonymous"></script>
<?php if ($args['js']): ?>
<script async type="module" src="<?php echo GetMinifiedAsset('js', $args['js']); ?>"></script>
<?php endif; ?>
<script async type="module" src="<?php echo GetMinifiedAsset('js', 'notepad.js'); ?>"></script>
<?php if ($args['aos']): ?>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" crossorigin="anonymous">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js" crossorigin="anonymous"></script>
<script>AOS.init();</script>
<?php endif; ?>
<script async src="<?php echo GetMinifiedAsset('js', 'misc.js'); ?>"></script>

</body>
</html>
