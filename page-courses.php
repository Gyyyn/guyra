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

  <div class="page-squeeze">

    <div class="list-group study-menu list-group-horizontal container-fluid mb-5 overflow-hidden">
      <a class="list-group-item" href="<?php echo $gi18n['home_link'] ?>">
        <span class="menu-icon"><img alt="homework" src="<?php echo $gi18n['template_link'] . '/assets/icons/light.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['study']; ?></span>
      </a>

      <a class="list-group-item" href="<?php echo $gi18n['practice_link'] ?>">
        <span class="menu-icon"><img alt="practice" src="<?php echo $gi18n['template_link'] . '/assets/icons/target.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['practice']; ?></span>
      </a>

      <a href="<?php echo get_site_url() ?>/reference" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/notebook.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['reference']; ?></span>
      </a>

      <a href="<?php echo get_site_url() ?>/courses" class="list-group-item active">
        <span class="menu-icon"><img alt="courses" src="<?php echo $gi18n['template_link'] . '/assets/icons/online-learning.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['courses']; ?></span>
      </a>

      <a href="<?php echo $meeting_link ?>" class="list-group-item">
        <span class="menu-icon"><img alt="reference" src="<?php echo $gi18n['template_link'] . '/assets/icons/video-camera.png'; ?>"></span>
        <span class="menu-title"><?php echo $gi18n['meeting']; ?></span>
      </a>
    </div>

  </div>

  <div class="page-squeeze rounded-box p-0 position-relative">

    <div id="courses-container"></div>

  </div>

</main>
<script> var coursesJson = <?php echo json_encode($coursesArray); ?></script>
<?php
get_footer(null, ['courses_js' => true, 'aos' => true, 'react' => true]);
