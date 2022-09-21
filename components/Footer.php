<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $gi18n;
global $gLang;
global $args;

include_once $template_dir . '/functions/Assets.php';

?>

<script>window.guyra_version = '<?php echo GUYRA_VERSION ?>';</script>
<script src="<?php echo GetMinifiedAsset('js', 'react.js'); ?>"></script>
<script src="<?php echo GetMinifiedAsset('js', 'react-dom.js'); ?>"></script>
<script src="<?php echo GetMinifiedAsset('js', 'html-react-parser.js'); ?>"></script>
<script async src="<?php echo GetMinifiedAsset('js', 'marked.js'); ?>"></script>
<script src="https://www.google.com/recaptcha/api.js?render=6LftVY4dAAAAAL9ZUAjUthZtpxD9D8cERB2sSdYt"></script>
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
<link rel="stylesheet" href="<?php echo GetMinifiedAsset('css', 'easymde.css'); ?>">
<script async src="<?php echo GetMinifiedAsset('js', 'easymde.js'); ?>"></script>
<script async src="https://sdk.mercadopago.com/js/v2"></script>
<script async src="https://www.mercadopago.com/v2/security.js" view="checkout" output="deviceId"></script>
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
