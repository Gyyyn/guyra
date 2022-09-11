<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $gi18n;
global $gLang;
global $args;

include_once $template_dir . '/functions/Assets.php';

?>

<footer class="my-5 d-none d-md-flex flex-column text-grey-darker text-s justify-content-center align-items-center">
  <nav style="--bs-breadcrumb-divider: '';" aria-label="breadcrumb">
    <ol class="breadcrumb m-0">
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['faq_link'] ?>"><?php echo $gi18n['help'] ?></a></li>
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['privacy_link'] ?>"><?php echo $gi18n['privacy'] ?></a></li>
      <li class="breadcrumb-item"><a href="<?php echo $gi18n['terms_link'] ?>"><?php echo $gi18n['terms'] ?></a></li>
      <li class="breadcrumb-item d-none"><a href="<?php echo $gi18n['schools_footer_link'] ?>"><?php echo $gi18n['schools'] ?></a></li>
    </ol>
  </nav>
  <span class="my-2">
    &copy; 2019 - <?php echo date('Y') . ' ' . $gi18n['company_name']; ?>
    <?php echo $gi18n['company_cnpj'] . ' / ' . $gi18n['company_address'] ?>
  </span>

  <span class="text-sss"><?php echo $gi18n['meta_thirdparty_credit'] ?></span>
  
</footer>

<script>window.guyra_version = '<?php echo GUYRA_VERSION ?>';</script>
<script src="<?php echo GetMinifiedAsset('js', 'react.js'); ?>"></script>
<script src="<?php echo GetMinifiedAsset('js', 'react-dom.js'); ?>"></script>
<script src="<?php echo GetMinifiedAsset('js', 'html-react-parser.js'); ?>"></script>
<script async src="<?php echo GetMinifiedAsset('js', 'marked.js'); ?>"></script>
<?php if ($args['recaptcha']): ?>
<script src="https://www.google.com/recaptcha/api.js?render=6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt"></script>
<?php endif; ?>
<?php if ($args['OAuth']): ?>
<script src="https://accounts.google.com/gsi/client" async defer></script>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId: '965989684114472',
      cookie: true,
      xfbml: true,
      version: 'v13.0'
    });
    FB.AppEvents.logPageView();   
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/<?php echo $gLang[0] . '_' . $gLang[1]; ?>/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
<?php endif; ?>
<?php if ($args['easymde']): ?>
<link rel="stylesheet" href="<?php echo GetMinifiedAsset('css', 'easymde.css'); ?>">
<script async src="<?php echo GetMinifiedAsset('js', 'easymde.js'); ?>"></script>
<?php endif; ?>
<?php if ($args['MercadoPago']): ?>
<script async src="https://sdk.mercadopago.com/js/v2"></script>
<script async src="https://www.mercadopago.com/v2/security.js" view="checkout" output="deviceId"></script>
<?php endif; ?>
<script async src="<?php echo GetMinifiedAsset('js', 'popper.js'); ?>"></script>
<script async src="<?php echo GetMinifiedAsset('js', 'bootstrap.js'); ?>"></script>
<?php if ($args['js']): ?>
<script async type="module" src="<?php echo GetMinifiedAsset('js', $args['js']); ?>"></script>
<?php endif; ?>
<?php if ($args['aos']): ?>
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" crossorigin="anonymous">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js" crossorigin="anonymous"></script>
<script>AOS.init();</script>
<?php endif; ?>
<script async src="<?php echo GetMinifiedAsset('js', 'misc.js'); ?>"></script>

</body>
</html>
