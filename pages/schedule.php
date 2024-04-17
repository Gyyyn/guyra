<?php

global $site_url;
global $current_user_data;

$redirect = $site_url;

if ($current_user_data['teacherid'])
$redirect = $site_url . '/user/' . $current_user_data['teacherid'];

Guyra_Redirect($redirect);