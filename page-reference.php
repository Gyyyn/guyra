<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;
global $gi18n;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

get_header(null, ['css' => 'reference.css']);
?>

<main id="intro-content" class="site-main study squeeze">

  <div class="page-squeeze"><div>

    <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden"  role="tablist">

      <a class="list-group-item" href="<?php echo $gi18n['home_link']; ?>">
        <span class="menu-icon"><img class="page-icon tiny" src="<?php echo $gi18n['template_link'] . '/assets/img/back.png'; ?>"></span>
      </a>

      <a class="list-group-item active" data-bs-toggle="pill" href="#dictionary-container" role="tab" aria-expanded="true" aria-controls="dictionary-container">
        <span class="menu-icon"><img class="page-icon tiny" src="<?php echo $gi18n['template_link'] . '/assets/icons/dictionary.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['dictionary']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="pill" href="#irregulars-container" role="tab" aria-expanded="false" aria-controls="irregulars-container">
        <span class="menu-icon"><img class="page-icon tiny" src="<?php echo $gi18n['template_link'] . '/assets/icons/bookmark.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_irregulars']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="pill" href="#grammar-container" role="tab" aria-expanded="false" aria-controls="grammar-container">
        <span class="menu-icon"><img class="page-icon tiny" src="<?php echo $gi18n['template_link'] . '/assets/icons/layers.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_grammar']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="pill" href="#phrasals-container" role="tab" aria-expanded="false" aria-controls="phrasals-container">
        <span class="menu-icon"><img class="page-icon tiny" src="<?php echo $gi18n['template_link'] . '/assets/icons/document.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_phrasals']; ?></span>
      </a>

    </div>

    <div class="tab-content" id="myTabContent">

    <div class="tab-pane fade fade-animation animate show active rounded-box" id="dictionary-container" role="tabpanel">
      <?php include 'templates/dictionary.php'; ?>
    </div>

    <div class="tab-pane fade fade-animation animate rounded-box" id="irregulars-container" role="tabpanel">
      <?php include 'templates/irregular-verbs.html'; ?>
    </div>

    <div class="tab-pane fade fade-animation animate rounded-box" id="grammar-container" role="tabpanel">
      <?php include 'templates/grammar-reference.html'; ?>
    </div>

    <div class="tab-pane fade fade-animation animate rounded-box" id="phrasals-container" role="tabpanel">
      <?php include 'templates/phrasal-verbs.html'; ?>
    </div>

    </div>

  </div></div>

</main>
<?php
get_footer(null, ['js' => 'reference.js']);
