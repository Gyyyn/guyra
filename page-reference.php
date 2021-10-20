<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

get_header(null, ['css' => 'reference.css']);

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

<main id="intro-content" class="site-main study squeeze">

  <div class="page-squeeze"><div>

    <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden">

      <a class="list-group-item" href="<?php echo $gi18n['home_link']; ?>" role="button">
        <span class="menu-icon"><img class="me-0" src="<?php echo $gi18n['template_link'] . '/assets/img/back.png'; ?>"></span>
      </a>

      <a class="list-group-item" data-bs-toggle="collapse" href="#dictionary-container" role="button" aria-expanded="true" aria-controls="dictionary-container">
        <span class="menu-icon"><img src="<?php echo $gi18n['template_link'] . '/assets/icons/dictionary.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['dictionary']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="collapse" href="#irregulars-container" role="button" aria-expanded="false" aria-controls="irregulars-container">
        <span class="menu-icon"><img src="<?php echo $gi18n['template_link'] . '/assets/icons/bookmark.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_irregulars']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="collapse" href="#grammar-container" role="button" aria-expanded="false" aria-controls="grammar-container">
        <span class="menu-icon"><img src="<?php echo $gi18n['template_link'] . '/assets/icons/layers.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_grammar']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="collapse" href="#phrasals-container" role="button" aria-expanded="false" aria-controls="phrasals-container">
        <span class="menu-icon"><img src="<?php echo $gi18n['template_link'] . '/assets/icons/document.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_phrasals']; ?></span>
      </a>

    </div>

    <div class="collapse show rounded-box" id="dictionary-container">
      <?php include 'templates/dictionary.php'; ?>
    </div>

    <div class="collapse hide rounded-box" id="irregulars-container">
      <?php include 'templates/irregular-verbs.html'; ?>
    </div>

    <div class="collapse hide rounded-box" id="grammar-container">
      <?php include 'templates/grammar-reference.html'; ?>
    </div>

    <div class="collapse hide rounded-box" id="phrasals-container">
      <?php include 'templates/phrasal-verbs.html'; ?>
    </div>

  </div></div>

</main>
<?php
get_footer(null, ['js' => 'reference.js']);
