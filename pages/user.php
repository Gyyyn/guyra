<?php

global $nests;
global $gi18n;
global $current_user_id;

// Nests is the directories in the URL. Here, 2 is where our user ID should be.
$user = $nests[2];
$user_id = $user;

// If no ID is given, treat this URL as a synonym of /account.
if (!$user)
Guyra_Redirect($gi18n['account_link']);

$user = guyra_get_user_data($user);

// For privacy reasons, only teachers have a public profile for now.
if (!$user || $user['role'] != 'teacher')
Guyra_Redirect($gi18n['account_link']);

$user['user_diary'] = guyra_get_user_data($user_id, 'diary');
$user['id'] = $user_id;

if ($user_id == $current_user_id)
$user['is_self'] = true;

GetComponent('Header', ['css' => 'account.css']); ?>

<div id="user-container"></div>

<script>
    const theUser = JSON.parse('<?php echo addslashes(json_encode($user)); ?>');
</script>

<?php GetComponent('Footer', ['js' => 'user.js']);