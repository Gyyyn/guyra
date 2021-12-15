<?php

if ($_GET['log_wrong_answer']) {
  $current_data = guyra_get_user_meta(1, 'reported_answers', true);
  $current_data = json_decode($current_data['meta_value'], true);
  $data = json_decode(file_get_contents('php://input'), true);

  $current_data[time()] = $data;

  guyra_update_user_meta(1, 'reported_answers', json_encode($current_data, JSON_UNESCAPED_UNICODE));
}
