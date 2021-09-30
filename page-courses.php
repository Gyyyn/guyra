<?php
/**
 * Classroom page. Currently handles in-site zoom meeting.
 *
 * @package guyra
 */

include get_template_directory() . '/Guyra_misc.php';

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

$coursesJson = '{
  "course1": {
    "link": "PLWrcGwXhLQXy4MNJrK0iGMzvdRgs4zaUg",
    "title": "Interchange: Gramática",
    "desc": "temp 1",
    "id": "interchange"
  },
  "course2": {
    "link": "PLWrcGwXhLQXw1ohPUq78xlZZdM2Vfcr_X",
    "title": "Gramática Rápida",
    "desc": "temp 2",
    "id": "quicktips"
  }
}';

$coursesArray = json_decode($coursesJson, true);

foreach ($coursesArray as &$current) {
  $current['contents'] = file_get_contents(createYoutubeApiPlaylistLink($current['link']));
  $current['image'] = GuyraGetIcon('courses/' . $current['id'] . '.png');
}

unset($current);

get_header();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

<main id="intro-content" class="site-main page squeeze">
  <div class="page-squeeze rounded-box p-0 position-relative">

    <div id="courses-container"></div>

  </div>

</main>
<script> var coursesJson = <?php echo json_encode($coursesArray); ?></script>
<?php
get_footer();
