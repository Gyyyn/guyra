<?php
/**
 * Database functions
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

function guyra_output_json($message, $exit=false) {

  header("Content-Type: application/json");
  echo json_encode([$message]);
  if ($exit) {
    exit;
  }

}

function guyra_database_create_db($sql) {

  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    switch ($sql) {

      case 'log_db':

        $sql = sprintf("CREATE TABLE IF NOT EXISTS guyra_user_history (
        log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED,
        object LONGTEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
        CHARACTER SET %s
        ", DB_CHARSET);

      break;

      case 'meta_db':

        $sql = sprintf("CREATE TABLE IF NOT EXISTS guyra_user_meta (
        meta_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED,
        meta_key VARCHAR(255),
        meta_value LONGTEXT)
        CHARACTER SET %s
        ",DB_CHARSET);

      break;

    }

    if (!$sql) {
      guyra_output_json('empty query, check input vars', true);
    }

    if ($db->query($sql) === TRUE) {

      guyra_output_json('query successful');

    } else {

      guyra_output_json('query error' . $sql, true);

    }

  }

  $db->close();

}

function guyra_get_user_meta($user, $meta_key, $return=false) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    $sql = sprintf("SELECT user_id, meta_key, meta_value
      FROM guyra_user_meta
      WHERE user_id='%d'", $user);
      $result = $db->query($sql);

      if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
          $output[] = $row;
        }
        if (!$return) {
          guyra_output_json($output, true);
        } elseif ($mode = 'return') {
          return $output;
        }

      } else {
        guyra_output_json(false, true);
      }

  }

  $db->close();

}

function guyra_update_user_meta($user, $meta_key, $meta_value) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    if (guyra_get_user_meta($user, $meta_key, true)) {

      $sql = sprintf("UPDATE guyra_user_meta
      SET meta_value = %d
      WHERE user_id = %d AND meta_key = '%s'", $meta_value, $user, $meta_key);

    } else {

      $sql = sprintf("REPLACE INTO guyra_user_meta
      VALUES (%d, '%s', %d)", $user, $meta_key, $meta_value);

    }

    if ($db->query($sql) === TRUE) {

      guyra_output_json('query successful');

    } else {

      guyra_output_json('query error', true);

    }

  }

  $db->close();

}

function guyra_database($action, $value='', $user=0) {

  switch ($action):
    case 'create_log_db':
      guyra_database_create_db('log_db');
    break;

    case 'create_meta_db':
      guyra_database_create_db('meta_db');
    break;

    case 'update_elo':
      guyra_update_user_meta($user, 'elo', $value);
    break;

    case 'get_user_meta':
      guyra_output_json(guyra_get_user_meta($user, $value));
    break;

    default:
      guyra_output_json('action not found', true);
    break;

  endswitch;

}
