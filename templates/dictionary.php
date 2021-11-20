<?php
/**
 * Dictionary crawler
 *
 * Uses a crawler (and soon an API) to display a dictionary
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $current_user_id;
global $gi18n;

?>

<div class="the-header text-center">

  <h1 class="text-primary mb-3"><?php echo $gi18n['dictionary'] . ' ' . $gi18n['company_name']; ?></h1>

  <div class="d-flex flex-row align-items-center justify-content-center mt-1 mb-5">

    <input autocapitalize="off" id="dictionary-word" class="form-control w-75 me-3" type="text" placeholder="<?php echo $gi18n['write_word_here']; ?>">
    <a class="btn-tall blue" id="dictionary-submit"><i class="bi bi-search"></i></a>

  </div>

</div>

<div class="the-definition">

  <h1 class="text-center border-0 mb-3"><span id="dictionary-the-word" class="bg-primary more-rounded text-white px-3 d-none pop-animation"></span></h1>

  <div id="the-controls" class="d-none my-5 justify-content-center">
    <a class="btn-tall blue me-3" href="#Pronunciation"><?php echo $gi18n['definition']; ?></a>
    <a class="btn-tall me-3" href="#Translations"><?php echo $gi18n['translations']; ?></a>
  </div>

  <div id="the-images" class="the-images d-flex flex-row my-5 pop-animation"></div>

  <div class="text-small justfade-animation" id="the-definition-content"></div>

</div>

<div class="cc-warning border-top text-smaller text-muted pt-1 mt-3 text-center">
  <?php echo $gi18n['cc_warning']; ?>
</div>
