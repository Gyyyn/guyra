<?php

$_users = guyra_get_users();

// Build a list of teachers.
// Run through this list to get users who need notifications.
foreach ($_users as $user) {

  if ($user['userdata']['role'] != 'teacher')
  continue;

  if (!$user['diary']['calendar'])
  continue;

  foreach ($user['diary']['calendar']['recurring'] as $appointment) {
    
    if (!$appointment['user'])
    continue;

  }

  foreach ($user['diary']['calendar'] as $appointment) {
    
    if (!$appointment['user'])
    continue;

  }

}