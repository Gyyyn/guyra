<?php
/**
 * The admin panel
 *
 * @package guyra
 */

if ( ! defined( 'ABSPATH' ) ) {
 exit; // Exit if accessed directly
}

if (!current_user_can('manage_options')) {
  exit;
}

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

// Get users
$users = get_users();

get_header();

?>

<main class="page squeeze" id="admin"><div class="page-squeeze rounded-box">

<div class="admin-section">

  <h1 class="mb-3">Welcome,</h1>
  <h2 class="mb-3">to the admin panel.</h2>

  <hr />

  <h3 class="mt-4">Warning:</h3>
  <div class="mb-4 alert alert-info" role="alert">
    <p>Everything in this panel is pretty basic and easy to break to make sure to follow instructions exactly!</p>

    <p>To add an user to a group get the ID of the user listed below and type the tag of the group.
    Users with the same tag will see the same homework page.</p>
  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Extras:</h4>

  <a href="<?php echo $gi18n['admin_link'] ?>" class="btn btn-lg btn-primary">Wordpress admin</a>

  <a href="<?php echo get_site_url() . '?user=' . get_current_user_id() . '&create_db=create_log_db' ?>" class="btn btn-lg btn-primary">Create Log DB</a>

  <a href="<?php echo get_site_url() . '?user=' . get_current_user_id() . '&create_db=create_meta_db' ?>" class="btn btn-lg btn-primary">Create Meta DB</a>

  <a href="<?php echo get_site_url() . '?user=' . get_current_user_id() . '&create_page=all' ?>" class="btn btn-lg btn-primary">Create Site Pages</a>

</div>

<div class="admin-section">

  <h4 class="mt-4">Schools:</h4>

  <div class="admin-forms border rounded p-3 m-0">

    <h5>Assign to teacher:</h5>
    <form action="<?php echo get_site_url(); ?>" method="GET">
        User ID: <input type="text" name="user">
        Teacher ID: <input type="text" name="assigntoteacher">
        <input type="submit" value="Go" />
    </form>

    <hr />

    <h5>Assign to group:</h5>
    <form action="<?php echo get_site_url(); ?>" method="GET">
        User ID: <input type="text" name="user">
        Group tag: <input type="text" name="assigntogroup">
        <input type="submit" value="Go" />
    </form>

  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Premium:</h4>

  <div class="admin-forms border rounded p-3 m-0">

    <h5>Give premium:</h5>
    <form action="<?php echo get_site_url(); ?>" method="GET">
        User ID: <input type="text" name="user">
        dd-mm-yyyy formatted date: <input type="text" name="premiumtill">
        <input type="submit" value="Go" />
    </form>

    <h5>Give lite:</h5>
    <form action="<?php echo get_site_url(); ?>" method="GET">
        User ID: <input type="text" name="user">
        dd-mm-yyyy formatted date: <input type="text" name="litetill">
        <input type="submit" value="Go" />
    </form>

  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Roles:</h4>

  <div class="admin-forms border rounded p-3 m-0">

    <h5>Give user role:</h5>
    <div class="mb-4 alert alert-info" role="alert">
      <p>Currently working roles are:</p>
      <ul>
        <li>teacher - has access to the student admin panel and can be assigned students by site admins.</li>
      </ul>
    </div>
    <form action="<?php echo get_site_url(); ?>" method="GET">
        User ID: <input type="text" name="user">
        Role: <input type="text" name="giverole">
        <input type="submit" value="Go" />
    </form>

  </div>

</div>

<div class="admin-section">

  <?php
  echo '<h4 class="mt-4">Registered Users:</h4>';
  echo '<ul class="list-group m-0">';
  foreach ($users as $x) {
    // Lord have mercy on those who will maintain this shit
    $userdata = get_user_meta($x->ID);

    if($userdata['studygroup'][0] != "") {
      $page_link = get_site_url() . '/' . sha1($userdata['studygroup'][0]);
    } else {
      $page_link = get_site_url() . '/' . sha1($x->ID);
    }

    echo '<ul class="list-group list-group-horizontal">' .

    '<li class="list-group-item col-1">' .
      '<span class="text-muted me-1">ID:</span><a href="#form" class="id-selector badge bg-secondary">' . $x->ID . '</a>' .
    '</li>' .

    '<a class="list-group-item col" href="' . $page_link . '">' .
        $userdata['first_name'][0] . ' ' .
        $userdata['last_name'][0] .
        $x->user_email .
      '<span class="badge bg-secondary ms-1">' . $userdata['role'][0] . '</span> ' .
    '</a>' .

    '<li class="list-group-item col-2">' .
      '<span class="text-muted text-end">' .
        'Teacher ID: <span class="badge bg-secondary">' . $userdata['teacherid'][0] . '</span>' .
      '</span> ' .
    '</li>' .

    '<li class="list-group-item col-2">' .
      '<span class="text-muted text-end">' .
        'Group: <span class="badge bg-secondary">' . $userdata['studygroup'][0] . '</span>' .
      '</span> ' .
    '</li>' .

    '<li class="list-group-item col-2">' .
      '<a href="' . get_site_url() . '/?short_load=1&cleargroup=1&user=' . $x->ID . '">Clear Group</a>' .
    '</li>' .

    '</ul>';

  } ?>
  </ul>

  <hr />

</div>

</main></div>
