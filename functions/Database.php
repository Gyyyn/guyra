<?php

global $template_dir;
global $template_url;
global $current_user_id;

Guyra_Safeguard_File();

// For SQLite, define the path to the database file.
// This should be moved to a central config file.
if (!defined('DB_FILE')) {
  define('DB_FILE', __DIR__ . '/../data/guyra.sqlite');
}
// Create data directory if it doesn't exist
$dataDir = dirname(DB_FILE);
if (!is_dir($dataDir)) {
  mkdir($dataDir, 0755, true);
}

function guyra_output_json($message, $exit=false) {

  header("Content-Type: application/json");

  echo json_encode($message);

  if ($exit)
  exit;

}

function GetStandardDate($timestamp=false) {

  if(!$timestamp)
  $timestamp = time();

  $date = date('d-m-Y H:i:s', $timestamp);

  return $date;
}

function guyra_log_to_file($object, $log='log.txt') {

  global $template_dir;

  if (!$object) {
    $object = 'unknown event of note: ' . json_encode(debug_backtrace());
  }
  
  $object = GetStandardDate() . ' ' . $_SERVER['SCRIPT_NAME'] . ' ( ' . $_SERVER['PHP_SELF'] . '): ' . $object . "
";

  file_put_contents($template_dir . '/' . $log, $object, FILE_APPEND);
}

function Guyra_GetDBConnection($args=[]) {

  try {
    $db = new PDO('sqlite:' . DB_FILE);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  } catch (PDOException $e) {
    HandleServerError([
      'message' => 'Database error!',
      'err' => $e->getMessage()
    ], 500);
  }

  return $db;

}

function guyra_database_create_db() {

  $db = Guyra_GetDBConnection();

  $tables = [
    "CREATE TABLE IF NOT EXISTS guyra_user_history (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    object TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP)",

    "CREATE TABLE IF NOT EXISTS guyra_user_meta (
    meta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    meta_key VARCHAR(255),
    meta_value TEXT)",

    "CREATE TABLE IF NOT EXISTS guyra_error_history (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    object TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP)",

    "CREATE TABLE IF NOT EXISTS guyra_users (
    user_id INTEGER PRIMARY KEY,
    user_login VARCHAR(100),
    type VARCHAR(255),
    flags TEXT)",

    "CREATE TABLE IF NOT EXISTS guyra_internal (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    path VARCHAR(255),
    flags TEXT,
    object TEXT)",
  ];

  foreach ($tables as $sql) {
    if (!$sql) {
      guyra_output_json('empty query, check input vars', true);
    }

    try {
      $db->exec($sql);
      guyra_output_json('query successful');
    } catch (PDOException $e) {
      guyra_output_json('query error: ' . $e->getMessage());
    }
  }

  $db = null; // Close connection

}

function guyra_handle_query_error($error='') {

  if (preg_match("/(no such table)/", $error)) { // Changed regex for SQLite

    guyra_database_create_db();

    guyra_output_json('database created', true);
    exit;

  } else {

    guyra_log_to_file(json_encode($error));
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

  global $current_user_meta;
  global $current_user_id;

  // If there is already a loaded in user meta variable we can just return that.
  if ( ($user === $current_user_id) && (isset($current_user_meta)) && (isset($current_user_meta[$meta_key])) ) {

    $theReturn = $current_user_meta[$meta_key];

    if (!$return) {
      guyra_output_json($theReturn, true);
    } else {
      return $theReturn;
    }
  }

  $db = Guyra_GetDBConnection();

  $sql = "SELECT user_id, meta_key, meta_value
  FROM guyra_user_meta
  WHERE user_id= :user_id";
  
  $params = [':user_id' => $user];

  if ($meta_key) {
      $sql .= " AND meta_key = :meta_key";
      $params[':meta_key'] = $meta_key;
  }

  try {
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

  } catch (PDOException $e) {
    
    guyra_handle_query_error($e->getMessage());

  }

  $output = false;

  if ($meta_key) {
      $output = $stmt->fetch(PDO::FETCH_ASSOC);
  } else {
      $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
  }


  if ($return === 'exists') {
      $output = ($output != false);
  }


  if (!$return) {
    guyra_output_json($output, true);
  } else {
    return $output;
  }

  $db = null; // Close connection

}

function guyra_update_user_meta($user, $meta_key, $meta_value, $return=false) {

  $db = Guyra_GetDBConnection();

  if (guyra_get_user_meta($user, $meta_key, 'exists')) {

    $sql = "UPDATE guyra_user_meta
    SET meta_value = :meta_value
    WHERE user_id = :user_id AND meta_key = :meta_key";

  } else {

    $sql = "INSERT INTO guyra_user_meta (user_id, meta_key, meta_value)
    VALUES (:user_id, :meta_key, :meta_value)";

  }

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':user_id' => $user,
        ':meta_key' => $meta_key,
        ':meta_value' => $meta_value
    ]);

    if ($return) {
      guyra_output_json('query successful');
    }

  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
  }

  $db = null;

}

function guyra_remove_user_meta($user, $meta_key, $return=false) {

  $db = Guyra_GetDBConnection();

  $sql = "DELETE FROM guyra_user_meta
  WHERE user_id = :user_id AND meta_key = :meta_key";

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':user_id' => $user,
        ':meta_key' => $meta_key
    ]);

    if ($return) {
      guyra_output_json('query successful');
    }

  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
  }

  $db = null;

}

function guyra_log_to_db($user, $object) {

  $db = Guyra_GetDBConnection();

  $sql = "INSERT INTO guyra_user_history (user_id, object)
  VALUES (:user_id, :object)";

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':user_id' => $user,
        ':object' => $object
    ]);

    guyra_output_json('query successful');

  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
  }

  $db = null;

}

function guyra_get_logdb_items($amount=10, $return=false) {

  $db = Guyra_GetDBConnection();

  $sql = "SELECT * FROM guyra_user_history ORDER BY log_id DESC LIMIT :amount";

  try {
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':amount', (int) $amount, PDO::PARAM_INT);
    $stmt->execute();
    $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
    $output = false;
  }

  if (!$return) {
    guyra_output_json($output, true);
  } else {
    return $output;
  }

  $db = null;

}

function guyra_get_internal_log($amount=10, $return=false) {

  $db = Guyra_GetDBConnection();

  $sql = "SELECT * FROM guyra_internal ORDER BY log_id DESC LIMIT :amount";

  try {
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':amount', (int) $amount, PDO::PARAM_INT);
    $stmt->execute();
    $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
    $output = false;
  }

  if (!$return) {
    guyra_output_json($output, true);
  } else {
    return $output;
  }

  $db = null;

}

function guyra_log_error_todb($object) {

  $db = Guyra_GetDBConnection();

  $sql = "INSERT INTO guyra_error_history (object)
  VALUES (:object)";

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([':object' => $object]);
  } catch (PDOException $e) {
    guyra_log_to_file("Error logging to DB: " . $e->getMessage());
  }

  $db = null;

}

function guyra_log_error($dump, $type='general') {

  $object = [
    'log_ver' => '0.0.2',
    'type' => $type,
    'location' => $_SERVER['REQUEST_URI'],
    'dump' => print_r($dump, true)
  ];

  guyra_log_error_todb(json_encode($object));
  guyra_log_to_file(json_encode($object));

}

function guyra_update_user_data($user_id, $data_key, $data='', $datatype='userdata') {

  $user_data = guyra_get_user_data($user_id, $datatype);

  if (!$user_data)
  $user_data = [];

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

  guyra_update_user_meta($user_id, $datatype, json_encode($user_data, JSON_UNESCAPED_UNICODE));

  return $user_data;
}

function guyra_get_user_data($user_id, $datatype='userdata') {

  global $site_api_url;

  $user_data = guyra_get_user_meta($user_id, $datatype, true);

  if ($user_data === false) {
    return [
      'id' => 0,
      'user_doesnt_exist' => true
    ];
  }

  $user_data = $user_data['meta_value'];

  if ($user_data) {
  	$user_data = json_decode($user_data, true);
  }

  if ($datatype == 'userdata')
  $user_data['id'] = $user_id;

  return $user_data;

}

function guyra_get_user_object($user_id, $user_email=null) {

  $db = Guyra_GetDBConnection();

  $sql = "SELECT user_id, user_login, type, flags FROM guyra_users WHERE";
  $params = [];

  if ($user_id !== null) {
    $sql .= " user_id = :user_id";
    $params[':user_id'] = $user_id;
  }

  if ($user_email !== null) {
    if ($user_id !== null) {
      $sql .= " AND";
    }
    $sql .= " user_login = :user_login";
    $params[':user_login'] = $user_email;
  }

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
    return false;
  }

  $output = false;

  if (count($result) > 0) {
    if (count($result) === 1) {
      $output = $result[0];
    } else {
      $output = $result;
    }
  }

  $db = null;

  return $output;

}

function build_user_object($user_id) {

  $user = guyra_get_user_object($user_id);
  $output = false;

  if ($user) {

    $user['flags'] = json_decode($user['flags'], true);

    $output = $user;

  }

  return $output;

}

// This generates a random unused 16 length number
function guyra_generate_user_id() {

  // Repeated for efficiency, most gens will yield a non-used id
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

  // Check if this login already exists.
  $loginCheck = guyra_get_user_object(null, $login);

  if ($loginCheck) {
    return ['error' => 'user already exists'];
  }

  unset($loginCheck);

  // Check passes, proceed as normal.
  $db = Guyra_GetDBConnection();

  $user_id = guyra_generate_user_id();

  $sql = "INSERT INTO guyra_users (user_id, user_login, type, flags)
  VALUES (:user_id, :login, :type, :flags)";

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':user_id' => $user_id,
        ':login' => $login,
        ':type' => $type,
        ':flags' => json_encode($flags, JSON_UNESCAPED_UNICODE)
    ]);
  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
    return ['error' => 'database error'];
  }

  return $user_id;

}

function guyra_update_user($user_id, array $values) {

  $db = Guyra_GetDBConnection();

  $user_values = guyra_get_user_object($user_id);
  if (!$user_values) {
      // handle user not found
      return;
  }
  
  $data_keys = array_keys($values);

  foreach ($data_keys as $key) {

    if ($key == 'flags' && is_array($values[$key])) {

      // For the flags setting we need to decode the original flags first and then merge in the new ones.
      $original_flags = json_decode($user_values['flags'], true) ?: [];
      $values[$key] = array_merge($original_flags, $values[$key]);
      $values[$key] = json_encode($values[$key], JSON_UNESCAPED_UNICODE);

    }

    $user_values[$key] = $values[$key];

  }

  $sql = "UPDATE guyra_users
  SET
    user_login = :user_login,
    type = :type,
    flags = :flags
  WHERE user_id = :user_id";

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':user_login' => $user_values['user_login'],
        ':type' => $user_values['type'],
        ':flags' => $user_values['flags'],
        ':user_id' => $user_id
    ]);
  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
  }
  
  $db = null;
}

function guyra_get_users($bounds=[], $bounded_datatype='userdata') {

  $db = Guyra_GetDBConnection();

  // This function is very inefficient and needs a rethink for a large user base.
  // For now, I will replicate the logic with PDO.
  // The original logic fetches all user meta, builds a large array, then filters.

  $sql = "SELECT user_id, meta_key, meta_value FROM guyra_user_meta";

  try {
    $stmt = $db->query($sql);
    $_output = $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
    return false;
  }

  $output = [];
  foreach ($_output as $row) {
    $jsonDecoded = json_decode($row['meta_value'], true);
    $theValue = $jsonDecoded ?: $row['meta_value'];

    $output[$row['user_id']][$row['meta_key']] = $theValue;
    $output[$row['user_id']]['id'] = $row['user_id'];
  }

  if (is_array($bounds) && count($bounds) > 0) {
    $bounded_key = array_keys($bounds)[0];
    $bounded_value = $bounds[$bounded_key];

    foreach ($output as $user_id => $user) {
      if (!isset($user[$bounded_datatype]) || !isset($user[$bounded_datatype][$bounded_key]) || $user[$bounded_datatype][$bounded_key] != $bounded_value) {
        unset($output[$user_id]);
      }
    }
  }

  $db = null;

  return $output;

}

function guyra_create_internal_log($object, $flags='debug', $path=false, $return=false) {

  global $nests;

  $db = Guyra_GetDBConnection();

  if (!$path) {
    $path = implode('/', $nests);
  }

  $sql = "INSERT INTO guyra_internal (path, flags, object)
  VALUES (:path, :flags, :object)";

  try {
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':path' => $path,
        ':flags' => $flags,
        ':object' => $object
    ]);

    if ($return) {
      guyra_output_json('query successful');
    }

  } catch (PDOException $e) {
    guyra_handle_query_error($e->getMessage());
  }

  $db = null;

}
