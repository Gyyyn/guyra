<?php
/**
 * Database functions
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly
}

global $template_dir;
global $template_url;
global $current_user_id;

function guyra_output_json($message, $exit=false) {

  header("Content-Type: application/json");
  echo json_encode([$message]);
  if ($exit) {
    exit;
  }

}

function guyra_log_to_file($object='something happened') {
  $object = date('d-m-Y H:i:s') . ': ' . $object . '\r\n';
  //file_put_contents(get_template_directory() . '/log.txt', $object, FILE_APPEND);
}

function guyra_database_create_db() {

  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error: ' . $db->connect_error, true);

  } else {

    $tables = [
      sprintf("CREATE TABLE IF NOT EXISTS guyra_user_history (
      log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED,
      object LONGTEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) CHARACTER SET %s", DB_CHARSET),

      sprintf("CREATE TABLE IF NOT EXISTS guyra_user_meta (
      meta_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT UNSIGNED,
      meta_key VARCHAR(255),
      meta_value LONGTEXT) CHARACTER SET %s", DB_CHARSET),

      sprintf("CREATE TABLE IF NOT EXISTS guyra_error_history (
      log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      object LONGTEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) CHARACTER SET %s", DB_CHARSET)
    ];

    foreach ($tables as $table => $sql) {
      if (!$sql) {
        guyra_output_json('empty query, check input vars', true);
      }

      if ($db->query($sql) === TRUE) {

        guyra_output_json('query successful');

      } else {
        guyra_output_json('query error: ' . $db->error, true);
      }
    }

  }

  $db->close();

  guyra_log_to_file($sql);

}

/**
 * Get a meta field from a user.
 *
 * @param int $user The user ID,
 * @param string $meta_key The key for the meta.
 * @param boolean $return If the value should be output or returned, false for return a json output.
 *
 */
function guyra_get_user_meta($user, $meta_key=false, $return=false) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    $sql = sprintf("SELECT user_id, meta_key, meta_value
      FROM guyra_user_meta
      WHERE user_id='%d'", $user);
      $result = $db->query($sql);
      $output = false;

      // Check if the user exists
      if ($result->num_rows > 0) {

        if (!$meta_key) {

          while ($row = $result->fetch_assoc()) {
              $output[] = $row;
          }

        } else {

          foreach ($result as $row) {

            if ($row['meta_key'] == $meta_key) {
              $output = $row;
            }

          }

        }

        if ($return === 'exists' && $output != false) {

          $output = true;

        }

      }

      if (!$return) {
        guyra_output_json($output, true);
      } else {
        return $output;
      }

  }

  $db->close();
  guyra_log_to_file($sql);

}

function guyra_update_user_meta($user, $meta_key, $meta_value, $return=false) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    if (guyra_get_user_meta($user, $meta_key, 'exists')) {

      $sql = sprintf("UPDATE guyra_user_meta
      SET meta_value = '%s'
      WHERE user_id = %d AND meta_key = '%s'", $meta_value, $user, $meta_key);

    } else {

      $sql = sprintf("INSERT INTO guyra_user_meta (user_id, meta_key, meta_value)
      VALUES (%d, '%s', '%s')", $user, $meta_key, $meta_value);

    }

    if ($db->query($sql) === TRUE) {

      if ($return) {

        guyra_output_json('query successful');

      }

    } else {

      guyra_output_json('query error', true);

    }

  }

  $db->close();
  guyra_log_to_file($sql);

}

function guyra_log_to_db($user, $object) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    $sql = sprintf("INSERT INTO guyra_user_history (user_id, object)
    VALUES (%d, '%s')", $user, $object);

    if ($db->query($sql) === TRUE) {

      guyra_output_json('query successful');

    } else {

      guyra_output_json('query error', true);

    }

  }

  $db->close();
  guyra_log_to_file($sql);

}

function guyra_get_logdb_items($amount=10, $return=false) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    $sql = sprintf("SELECT * FROM (
       SELECT * FROM guyra_user_history LIMIT %u
    )Var1", $amount);

      $result = $db->query($sql);
      $output = false;

      while ($row = $result->fetch_assoc()) {
          $output[] = $row;
      }

      if (!$return) {
        guyra_output_json($output, true);
      } else {
        return $output;
      }

  }

  $db->close();
  guyra_log_to_file($sql);

}

function guyra_log_error_todb($object) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    $sql = sprintf("INSERT INTO guyra_error_history (object)
    VALUES ('%s')", $object);

    $db->query($sql);

  }

  $db->close();
  guyra_log_to_file($sql);

}

function guyra_log_error($dump, $type='general') {

  global $wp;

  $object = [
    'log_ver' => '0.0.1',
    'type' => $type,
    'location' => $wp->request,
    'dump' => print_r($dump, true)
  ];

  guyra_log_error_todb(json_encode($object));

}

function guyra_database($action, $value='', $user=0) {

  switch ($action):

    case 'update_elo':
      guyra_update_user_meta($user, 'elo', $value);
    break;

    case 'update_level':
      guyra_update_user_meta($user, 'level', $value);
    break;

    case 'get_user_meta':
      guyra_output_json(guyra_get_user_meta($user, $value));
    break;

    default:
      guyra_output_json('action not found', true);
    break;

  endswitch;

}

function guyra_get_user_data($user_id) {

  $current_user_data = guyra_get_user_meta($user_id, 'userdata', true)['meta_value'];

  if ($current_user_data) {
  	$current_user_data = json_decode($current_user_data, true);
  } else {
  	$wp_user_data = get_userdata($user_id);

  	guyra_update_user_meta($user_id, 'userdata', json_encode([
  		'user_email' => $wp_user_data->user_email,
  		'profile_picture_url' => Guyra_get_profile_picture($user_id, null, true),
  		'first_name' => $current_user_meta['first_name'][0],
  		'last_name' => $current_user_meta['last_name'][0],
  		'user_registered' => $wp_user_data->user_registered,
  		'user_payment_method' => guyra_get_user_meta($user_id, 'payment_method', true)['meta_value'],
  		'user_subscription' => '',
  		'user_subscription_since' => '',
  		'user_subscription_expires' => '',
  		'teacherid' => $current_user_meta['teacherid'][0],
  		'user_meetinglink' => guyra_get_user_meta($user_id, 'meetinglink', true)['meta_value']
  	]));

  	unset($wp_user_data);
  }

  return $current_user_data;
  
}
