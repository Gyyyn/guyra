<?php
/**
 * Dictionary crawler
 *
 * Uses a crawler (and soon an API) to display a dictionary
 *
 * @package guyra
 */

// $thisUser = get_current_user_id();
$template_dir = get_template_directory();
// $template_url = get_template_directory_uri();

include $template_dir . '/i18n.php';

?>

<div class="the-header text-center">

  <h1 class="text-primary"><?php echo $gi18n['dictionary'] . ' ' . $gi18n['company_name']; ?></h1>

  <div class="d-flex flex-row align-items-center justify-content-center mt-1 mb-5">

    <input id="dictionary-word" class="form-control w-50 me-5" type="text" placeholder="<?php echo $gi18n['write_word_here']; ?>">
    <a class="btn-tall blue" id="dictionary-submit"><i class="bi bi-search"></i></a>

  </div>

</div>

<div class="the-definition">

  <h1 class="text-center mb-3"><span id="dictionary-the-word" class="bg-primary more-rounded text-white px-3 d-none fade-animation"></span></h1>

  <div id="the-images" class="the-images d-flex flex-row my-5 fade-animation"></div>

  <div class="text-small fade-animation" id="the-definition-content"></div>

</div>

<div class="cc-warning border-top text-smaller text-muted pt-1 mt-3 text-center">
  <?php echo $gi18n['cc_warning']; ?>
</div>
