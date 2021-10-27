<?php
/**
 * Grammar reference page
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

get_header(null, ['css' => 'schools.css']);

?>

<main id="intro-content" class="site-main page schools bg-white">

  <div class="squeeze-big pt-3">

    <?php

    if ($_GET['comment_history'] == 1) {
      include $template_dir . '/i18n.php';
      include $template_dir . '/Guyra_misc.php';

      ?>

      <div class="page-squeeze squeeze py-5"><div class="study-answers">
      <div class="replies-control my-3 d-flex">
        <a href="<?php echo $gi18n['schools_link']; ?>" class="btn-tall blue"><?php echo $gi18n['back']; ?></a>
      </div>

      <?php

      $redirect = $gi18n['schools_link'] . '?comment_history=1&user=' . $_GET['user'];

      GetUserStudyPage_comments($_GET['user'], false, true, '1 years ago', $redirect); ?>

      </div></div>

      <?php

    } else {
      include $template_dir . '/Guyra_schools.php';
    }

    ?>

  </div>

</main>
<?php
get_footer(null, ['react' => true, 'js' => 'schools.js']);
