<?php

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
  // file_put_contents(get_template_directory() . '/log.txt', $object, FILE_APPEND);
}

function GetStandardDate() {
  return date('d-m-Y H:i:s');
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
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) CHARACTER SET %s", DB_CHARSET),

      sprintf("CREATE TABLE IF NOT EXISTS guyra_users (
      user_id BIGINT UNSIGNED PRIMARY KEY,
      user_login VARCHAR(100),
      type VARCHAR(255),
      flags LONGTEXT) CHARACTER SET %s", DB_CHARSET)
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
 * @return array The values found or false on not found.
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
  $meta_value = $db->real_escape_string($meta_value);

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

      if ($data_key[$key] === null) {
        unset($user_data[$key]);
      } else {
        $user_data[$key] = $data_key[$key];
      }

    }

  } else {

    $user_data[$data_key] = $data;

  }

  guyra_update_user_meta($user_id, 'userdata', json_encode($user_data, JSON_UNESCAPED_UNICODE));

  return $user_data;
}

function guyra_get_user_data($user_id) {

  global $site_api_url;

  $user_data = guyra_get_user_meta($user_id, 'userdata', true)['meta_value'];

  if ($user_data) {
  	$user_data = json_decode($user_data, true);

    if ($user_data['profile_picture_url'] == '') {
      $theHash = $user_data['first_name'] . $user_data['last_name'];
      $user_data['profile_picture_url'] = $site_api_url . '?get_identicon=1&hash=' . $theHash;
    }

  }

  return $user_data;

}

function guyra_get_user_game_data($user_id=1) {

  $user_data = guyra_get_user_meta($user_id, 'gamedata', true)['meta_value'];

  if ($user_data) {
  	$user_data = json_decode($user_data, true);
  }

  return $user_data;

}

// WARNING: do not migrate this function outside of wordpress.
function check_for_user_migration($user_id) {

  $wp_user = get_user_by('id', $user_id);

  if ($wp_user != false) {

    $flags = [
      'wp_migrated_user' => true,
      'force_user_id' => $user_id
    ];
    $user_type = 'user';
    $user_data = guyra_update_user_data($user_id, ['user_email' => null]);

    if ($user_data['role'] === 'teacher') {
      $user_type = 'admin';
    }

    $migrated_user = guyra_create_user($wp_user->user_email, $user_type, $flags);

    if ($migrated_user != false) {
      return guyra_get_user_object($migrated_user);
    } else {
      return $migrated_user;
    }

  } else {
    return false;
  }

}

function guyra_get_user_object($user_id, $user_email=null) {

  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    // This function will never output to the api, so no need to json the error.
    guyra_log_to_file('connection error' . $db->connect_error, true);

  } else {

    $sql_select = "SELECT user_id, user_login, type, flags FROM guyra_users WHERE";
    $sql_userid_statement = sprintf(" user_id='%d'", $user_id);
    $sql_useremail_statement = sprintf(" user_login='%s'", $user_email);

    $sql = $sql_select;

    if ($user_id !== null) {
      $sql .= $sql_userid_statement;
      $sql_useremail_statement = " AND" . $sql_useremail_statement;
    }

    if ($user_email !== null) {
      $sql .= $sql_useremail_statement;
    }

    $result = $db->query($sql);
    $output = false;

    // Check if the user exists
    if ($result->num_rows > 0) {

      while ($row = $result->fetch_assoc()) {
          $output[] = $row;
      }

      // Truncate the result
      if ($result->num_rows === 1) {
        $output = $output[0];
      }

    }

    return $output;

  }

  $db->close();
  guyra_log_to_file($sql);

}

function build_user_object($user_id) {

  $user = guyra_get_user_object($user_id);

  if ($user === false) {
    $user_migrate = check_for_user_migration($user_id);

    if ($user_migrate != false) {
      $output = $user_migrate;
    } else {
      $output = false;
    }
  } else {

    $user['flags'] = json_decode($user['flags'], true);

    $output = $user;

  }

  return $output;

}

// This generates a random unused 16 length number
function guyra_generate_user_id() {
  $random = random_int(0, 9999999999999999);
  $this_user_exists = guyra_get_user_object($random);

  if ($this_user_exists != false) {

    while ($this_user_exists != false) {
      $random = random_int(0, 9999999999999999);
      $this_user_exists = guyra_get_user_object($random);
    }

  }

  return $random;


}

function guyra_create_user($login, $type='user', $flags=[]) {

  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    // This function will never output to the api, so no need to json the error.
    guyra_log_to_file('connection error' . $db->connect_error, true);

    return false;

  }

  $user_id = guyra_generate_user_id();

  // TODO: Remove this bit once we migrate out of WP
  if ($flags['force_user_id']) {
    $user_id = $flags['force_user_id'];
    unset($flags['force_user_id']);
  }

  $sql = sprintf("INSERT INTO guyra_users (user_id, user_login, type, flags)
  VALUES (%d, '%s', '%s', '%s')", $user_id, $login, $type, json_encode($flags, JSON_UNESCAPED_UNICODE));

  $result = $db->query($sql);

  return $user_id;

}

function guyra_update_user($user_id, array $values) {

  $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

  if ($db->connect_error) {

    return false;

  }

  $user_values = guyra_get_user_object($user_id);
  $data_keys = array_keys($values);

  foreach ($data_keys as $key) {

    if ($key == 'flags' && is_array($values[$key])) {
      $values[$key] = json_encode($values[$key], JSON_UNESCAPED_UNICODE);
    }

    $user_values[$key] = $values[$key];

  }

  $string_replacements = [
    $user_values['user_login'],
    $user_values['type'],
    $user_values['flags'],
    $user_id
  ];

  $sql = vsprintf("UPDATE guyra_users
  SET
    user_login = '%s',
    type = '%s',
    flags = '%s'
  WHERE user_id = %d", $string_replacements);

  $result = $db->query($sql);

}
