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

function guyra_handle_query_error($error='') {

  if (preg_match("/(doesn't exist)/", $error)) {
    guyra_database_create_db();
  } else {
    guyra_output_json('query error', true);
  }
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

      guyra_handle_query_error($db->error);

    }

  }

  $db->close();
  guyra_log_to_file($sql);

}

function guyra_remove_user_meta($user, $meta_key, $return=false) {
  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    guyra_output_json('connection error' . $db->connect_error, true);

  } else {

    $sql = sprintf("DELETE FROM guyra_user_meta
    WHERE user_id = %d AND meta_key = '%s'", $user, $meta_key);

    if ($db->query($sql) === TRUE) {

      if ($return) {

        guyra_output_json('query successful');

      }

    } else {

      guyra_handle_query_error($db->error);

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

      guyra_handle_query_error($db->error);

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
       SELECT * FROM guyra_user_history ORDER BY log_id DESC LIMIT %u
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

function guyra_update_user_data($user_id, $data_key, $data='') {

  $user_data = guyra_get_user_data($user_id);

  if (is_array($data_key)) {

    $data_keys = array_keys($data_key);

    foreach ($data_keys as $key) {
      $user_data[$key] = $data_key[$key];
    }

  } else {

    $user_data[$data_key] = $data;

  }

  guyra_update_user_meta($user_id, 'userdata', addslashes(json_encode($user_data)));
}

function guyra_get_user_data($user_id=1) {

  $user_data = guyra_get_user_meta($user_id, 'userdata', true)['meta_value'];

  if ($user_data) {
  	$user_data = json_decode($user_data, true);
  } else {

    // TODO: Deprecate this once all user are moved
  	$wp_user_data = get_userdata($user_id);
    $wp_user_meta = get_user_meta($user_id);

    $profile_picture_url = $wp_user_meta['user_registration_profile_pic_url'];

    $user_data = [
  		'user_email' => $wp_user_data->user_email,
      'mail_confirmed' => 'true',
  		'profile_picture_url' => ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : get_avatar_url($user_id, ['size' => 256]),
  		'first_name' => $wp_user_meta['first_name'][0],
  		'last_name' => $wp_user_meta['last_name'][0],
      'role' => $wp_user_meta['role'][0],
  		'user_registered' => $wp_user_data->user_registered,
  		'user_payment_method' => '',
  		'user_subscription' => '',
  		'user_subscription_since' => '',
  		'user_subscription_expires' => '',
  		'teacherid' => $wp_user_meta['teacherid'][0],
      'studygroup' => $wp_user_meta['studygroup'][0],
  		'user_meetinglink' => guyra_get_user_meta($user_id, 'meetinglink', true)['meta_value']
  	];

    // Clean up the DB

    delete_user_meta($user_id, 'teacherid');
    delete_user_meta($user_id, 'studygroup');
    delete_user_meta($user_id, 'first_name');
    delete_user_meta($user_id, 'last_name');
    delete_user_meta($user_id, 'nickname');
    delete_user_meta($user_id, 'role');
    delete_user_meta($user_id, 'custompage_id');
    delete_user_meta($user_id, 'ur_form_id');
    delete_user_meta($user_id, 'ur_user_status');
    delete_user_meta($user_id, 'ur_confirm_email');
    delete_user_meta($user_id, 'ur_confirm_email_token');
    delete_user_meta($user_id, 'user_registration_privacy_policy_agree');
    delete_user_meta($user_id, 'user_registration_privacy_policy_1630936971');
    delete_user_meta($user_id, 'user_registration_profile_pic_url');

    guyra_remove_user_meta($user_id, 'meetinglink', false);

  	guyra_update_user_meta($user_id, 'userdata', addslashes(json_encode($user_data)));

  }

  return $user_data;

}

function guyra_get_user_game_data($user_id=1) {

  $user_data = guyra_get_user_meta($user_id, 'gamedata', true)['meta_value'];

  if ($user_data) {
  	$user_data = json_decode($user_data, true);
  } else {

    $level = guyra_get_user_meta($user_id, 'level', true);
    $elo = guyra_get_user_meta($user_id, 'elo', true);

    $user_data = [
  		'level' => $level['meta_value'],
      'elo' => $elo['meta_value']
  	];

    guyra_remove_user_meta($user_id, $level['meta_key'], false);
    guyra_remove_user_meta($user_id, $elo['meta_key'], false);

  	guyra_update_user_data($user_id, 'gamedata', $user_data);
  }

  return $user_data;

}
