<?php

Guyra_Safeguard_File();

function Guyra_Redirect($location, $exit=true) {

  header("Location: $location", true);

  if ($exit) {
    exit;
  }

}

// Blocks guest user access
function Guyra_Safeguard_Access($args=[]) {

  global $site_url;
  global $gi18n;
  global $is_logged_in;
  global $current_user_subscription_valid;

  if (!$is_logged_in)
  Guyra_Redirect($site_url);

  if ($args['paid_users'] && !$current_user_subscription_valid)
  Guyra_Redirect($gi18n['purchase_link']);

}

function Guyra_Safeguard_File() {

  if (!defined('GUYRA_VERSION')) {
    exit;
  }

}

// Handles a variety of errors.
function HandleServerError($err, $res_code=500) {

	http_response_code($res_code);

  $message = "Something went wrong.";

	if ($err['message'])
	$message = $err['message'];

  GuyraDisplayErrorPage($res_code, $message);

	exit;

}

// Captures the current requested URL.
function CaptureRequest($handleRequest) {

	$scriptName = 'index.php';
	$requestURI = $_SERVER['REQUEST_URI'];
	$requestBaseURL = explode($scriptName, $_SERVER['PHP_SELF']);

	if (!is_array($requestBaseURL) && ($requestBaseURL[1] !== $scriptName)) {
		HandleServerError([
			'message' => 'The server is badly configured.'
		]);
	}

	$requestBaseURL = $requestBaseURL[0];

	$request = explode($requestBaseURL, $requestURI);

	if (!is_array($request) && ($request[0] !== $requestBaseURL)) {
		HandleServerError([
			'message' => 'This route is invalid'
		], 404);
	}

	$request = $request[1];

 	return $handleRequest($request);

}
