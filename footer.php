<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $gi18n;

include_once $template_dir . '/functions/Assets.php';

?>

<?php if ($args['recaptcha']): ?>
<script src="https://www.google.com/recaptcha/api.js?render=6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt"></script>
<?php endif; ?>
<?php if ($args['react']): ?>
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/html-react-parser@1/dist/html-react-parser.min.js"></script>
<?php endif; ?>
<?php if ($args['MercadoPago']): ?>
<script async src="https://sdk.mercadopago.com/js/v2"></script>
<script async src="https://www.mercadopago.com/v2/security.js" view="checkout" output="deviceId"></script>
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
<script async src="https://unpkg.com/easymde/dist/easymde.min.js"></script>
<script>
let easyMDE;
window.addEventListener('load', function () {
  easyMDE = new EasyMDE({
    element: document.getElementById('<?php echo $args['easymde']; ?>'),
    autosave: { enabled: true, uniqueId: 'UserPageReplyBox' },
    toolbar: ["bold", "italic", "heading", "|", "quote", "link", "ordered-list", "image", "|", "table", "horizontal-rule"]
  });
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
