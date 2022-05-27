<?php

global $gi18n;
global $gLang;

$faqItems = json_decode(file_get_contents($template_dir . '/assets/json/i18n/' . $gLang[0] . '/faq.json'), true);

get_header();
?>

<main class="squeeze">

  <div class="rounded-box">

    <h1 class="text-blue"><?php echo $gi18n['faq']; ?></h1>

    <div class="accordion accordion-flush" id="faq-accordion">
      <?php

      foreach ($faqItems as $faqItem) {

        $itemId = md5($faqItem['title']);
        ?>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button text-black collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-<?php echo $itemId; ?>">
              <?php echo $faqItem['title']; ?>
            </button>
          </h2>
          <div id="collapse-<?php echo $itemId; ?>" class="accordion-collapse collapse" data-bs-parent="#faq-accordion">
            <div class="accordion-body">
              <?php echo $faqItem['content']; ?>
            </div>
          </div>
        </div>
        <?php
      }
      ?>
    </div>

    <div class="align-items-center d-flex flex-column mt-3">

      <div class="mb-3"><?php echo $gi18n['faq_help_lead'] ?></div>

      <a class="btn-tall blue px-5" href="<?php echo $gi18n['help_link'] ?>"><?php echo $gi18n['help_form'] ?><i class="bi bi-chat-heart-fill ms-3"></i></a>

    </div>

  </div>

</main>

<?php
get_footer();
