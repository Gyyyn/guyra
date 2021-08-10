<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

get_header();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

<main id="intro-content" class="site-main squeeze">

  <div class="page-squeeze" data-aos="fade-up" data-aos-once="true"><div>

    <div class="list-group study-menu list-group-horizontal container-fluid overflow-hidden">

      <a class="list-group-item" data-bs-toggle="collapse" href="#irregulars-container" role="button" aria-expanded="false" aria-controls="irregulars-container">
        <span class="menu-icon"><img src="<?php echo $gi18n['template_link'] . '/assets/icons/bookmark.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_irregulars']; ?></span>
      </a>

      <a class="list-group-item" data-bs-toggle="collapse" href="#grammar-container" role="button" aria-expanded="false" aria-controls="grammar-container">
        <span class="menu-icon"><img src="<?php echo $gi18n['template_link'] . '/assets/icons/layers.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference_grammar']; ?></span>
      </a>
    </div>

    <div class="collapse hide" id="irregulars-container">
      <?php include 'html/irregular-verbs.html'; ?>
    </div>

    <div class="collapse hide" id="grammar-container">
      <?php include 'html/grammar-reference.html'; ?>
    </div>

  </div>

</main>
<?php
get_footer();
