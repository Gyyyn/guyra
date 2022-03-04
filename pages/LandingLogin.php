<?php

global $gi18n;

get_header(null, ['css' => 'landing.css']);

?>

<div class="cover">
  <div class="cover-container pt-3">
    <div class="row align-items-center justify-content-around cover-card p-5 bg-white">

      <h1 class="text-center"><?php echo $gi18n['button_alreadyregistered'] ?></h1>
      <div class="text-center py-3">
       <a href="<?php echo $gi18n['account_link']; ?>" class="btn-tall btn-lg green text-larger"><?php echo $gi18n['button_login'] ?></a>
      </div>

    </div>
  </div>
</div>

<?php
get_footer();
