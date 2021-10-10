<?php
/**
 * Action page, passes actions to the handler.
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $current_user_id;

if ($_GET['json']) {
  require $template_dir . '/Guyra_json.php';
}

require $template_dir . '/Guyra_actions.php';
