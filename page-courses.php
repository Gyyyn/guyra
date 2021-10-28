<?php
/**
 * Courses page. Interprets some data on the courses.json file and passes it to the React frontend.
 *
 * @package guyra
 */

global $template_dir;
global $site_url;
global $is_logged_in;

if (!$is_logged_in) { wp_redirect($site_url); exit; }

include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_misc.php';

function createYoutubeApiPlaylistLink($key) {

  $youtubeApi = [
    'Key' => 'AIzaSyDDX9Zk9C-0KelHpqBOA7inVpZJnrFrDbA',
    'Link' => 'https://www.googleapis.com/youtube/v3/'
  ];

  $r = sprintf(
      $youtubeApi['Link'] . 'playlistItems?part=snippet&maxResults=50&playlistId=%s&key=' . $youtubeApi['Key'],
      $key
    );

  return $r;
}

$coursesArray = json_decode(file_get_contents($template_dir . '/assets/json/courses.json'), true);

foreach ($coursesArray as &$current) {
  $current['contents'] = file_get_contents(createYoutubeApiPlaylistLink($current['link']));
  $current['image'] = GuyraGetIcon('courses/' . $current['id'] . '.png');
}

unset($current);

get_header();
?>

<main id="intro-content" class="site-main page squeeze">

  <div class="page-squeeze">

    <?php guyra_render_topbar(); ?>

  </div>

  <div class="page-squeeze rounded-box p-0 position-relative">

    <div id="courses-container"></div>

  </div>

</main>
<script> var coursesJson = <?php echo json_encode($coursesArray); ?></script>
<?php
get_footer(null, ['js' => 'courses.js', 'react' => true]);
