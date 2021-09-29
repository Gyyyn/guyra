<?php
/**
 * Classroom page. Currently handles in-site zoom meeting.
 *
 * @package guyra
 */

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
  "course1": "PLWrcGwXhLQXy4MNJrK0iGMzvdRgs4zaUg",
  "course2": "PLWrcGwXhLQXw1ohPUq78xlZZdM2Vfcr_X"
}';

$coursesArray = json_decode($coursesJson, true);
$coursesObj = [];

foreach ($coursesArray as $currentId) {
  $coursesObj[] = json_decode(file_get_contents(createYoutubeApiPlaylistLink($currentId)), true);
}

get_header();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>
