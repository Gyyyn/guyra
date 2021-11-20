<?php
/**
 * Classroom page. Currently handles in-site zoom meeting.
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;
global $gi18n;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

$zoomver = '5.8.0';
$zoomApiKey = 'lbChqgLrSyacejvGUHA6bg';
$zoomApiSecret = 'QKxq0QKONOUdnh8DRbl0wtBdtIRDTOsgdaLS';
$zoomIMChatHistoryToken = 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhbFlqSkM3ZVJvU19CSDQ1Q0hMVGNRIn0.xtd0fARJ19U5WYcHK3NiQnjY2y6QpNA6WB7sYoE3DG4';

get_header(null, ['zoom' => true, 'zoomver' => $zoomver]);
?>

<!-- import ZoomMtg dependencies -->
  <script src="https://source.zoom.us/<?php echo $zoomver; ?>/lib/vendor/react.min.js"></script>
  <script src="https://source.zoom.us/<?php echo $zoomver; ?>/lib/vendor/react-dom.min.js"></script>
  <script src="https://source.zoom.us/<?php echo $zoomver; ?>/lib/vendor/redux.min.js"></script>
  <script src="https://source.zoom.us/<?php echo $zoomver; ?>/lib/vendor/redux-thunk.min.js"></script>
  <script src="https://source.zoom.us/<?php echo $zoomver; ?>/lib/vendor/lodash.min.js"></script>

  <!-- import ZoomMtg -->
  <script src="https://source.zoom.us/zoom-meeting-<?php echo $zoomver; ?>.min.js"></script>

  <!-- import local .js file -->
  <script src="js/index.js"></script>

<main id="intro-content" class="site-main page schools bg-white">

  <div class="squeeze pt-3">

    <?php include 'Guyra_classroom.php'; ?>

  </div>

</main>
<?php
get_footer();
