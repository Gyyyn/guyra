<?php

global $current_user_id;
global $current_user_data;

Guyra_Safeguard_File();

if ($_GET['add_course']) {

  // TODO: Make this actually check if the course exists, and maybe more robust security

  $id = $_GET['add_course'];
  $key = $_GET['key'];

  if ($key != 'guyra')
  guyra_output_json(['error' => 'wrong key'], true);

  $current_user_data['courses'][$id]['owned'] = true;

  guyra_update_user_data($current_user_id, $current_user_data, '');
  
}