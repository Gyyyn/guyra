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
include get_template_directory() . '/Guyra_database.php';

// Get users
$users = get_users();
$thisUserId = get_current_user_id();
$site_url = get_site_url();

get_header();

?>

<main class="page squeeze" id="admin"><div class="page-squeeze rounded-box">

<div class="admin-section">

  <h1 class="mb-3">Welcome,</h1>
  <h2 class="mb-3">to the admin panel.</h2>

</div>

<div class="admin-section">

  <h4 class="mt-5">Param debug:</h4>
  <div class="admin-forms border rounded p-3 m-0">
    <pre>
    <?php print_r('here may be a var'); ?>
    </pre>
  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Extras:</h4>
  <div class="admin-forms border rounded p-3 m-0">

  <a href="<?php echo $gi18n['admin_link'] ?>" class="btn btn-sm btn-success">Wordpress admin</a>
  <a href="<?php echo $site_url . '?user=' . $thisUserId . '&create_db=create_log_db' ?>" class="btn btn-sm btn-success">Create Log DB</a>
  <a href="<?php echo $site_url . '?user=' . $thisUserId . '&create_db=create_meta_db' ?>" class="btn btn-sm btn-success">Create Meta DB</a>
  <a href="<?php echo $site_url . '?user=' . $thisUserId . '&create_db=create_error_db' ?>" class="btn btn-sm btn-success">Create Error DB</a>
  <a href="<?php echo $site_url . '?user=' . $thisUserId . '&create_page=all' ?>" class="btn btn-sm btn-success">Create Site Pages</a>
  <a href="<?php echo $site_url . '?user=' . $thisUserId . '&get_user_meta=1' ?>" class="btn btn-sm btn-success">Read own meta</a>

  <hr class="mt-3" />

  <h5>Change a site option:</h5>

  <div class="mb-4 alert alert-info" role="alert">
    <p>Currently working options are:</p>
    <ul>
      <li>landing_open - site has landing page or just login.</li>
    </ul>
  </div>

  <form action="<?php echo $site_url; ?>" method="GET">
      Option: <input type="text" name="change_option">
      Value: <input type="text" name="value">
      <input type="hidden" name="user" value="1" class="user-id">
      <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
      <input type="submit" value="Go">
  </form>

  <hr />

  <h5>Set own elo:</h5>
  <form action="<?php echo $site_url; ?>" method="GET">
      Value: <input type="text" name="value">
      <input type="hidden" name="update_elo" value="1">
      <input type="hidden" name="user" value="1" class="user-id">
      <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
      <input type="submit" value="Go">
  </form>

  </div>
</div>

<div class="admin-section">

  <h4 class="mt-4">Schools:</h4>

  <div class="admin-forms border rounded p-3 m-0">

    <h5>Assign to teacher:</h5>
    <form action="<?php echo $site_url; ?>" method="GET">
        User ID: <input type="text" name="user" class="user-id">
        Teacher ID: <input type="text" name="assigntoteacher">
        <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
        <input type="submit" value="Go">
    </form>

    <hr />

    <h5>Assign to group:</h5>
    <form action="<?php echo $site_url; ?>" method="GET">
        User ID: <input type="text" name="user" class="user-id">
        Group tag: <input type="text" name="assigntogroup">
        <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
        <input type="submit" value="Go" />
    </form>

  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Premium:</h4>

  <div class="admin-forms border rounded p-3 m-0">

    <h5>Give premium:</h5>
    <form action="<?php echo $site_url; ?>" method="GET">
        User ID: <input type="text" name="user" class="user-id">
        dd-mm-yyyy formatted date: <input type="text" name="premiumtill">
        <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
        <input type="submit" value="Go">
    </form>

    <hr />

    <h5>Give lite:</h5>
    <form action="<?php echo $site_url; ?>" method="GET">
        User ID: <input type="text" name="user" class="user-id">
        dd-mm-yyyy formatted date: <input type="text" name="litetill">
        <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
        <input type="submit" value="Go">
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

    <form action="<?php echo $site_url; ?>" method="GET">
        User ID: <input type="text" name="user" class="user-id">
        Role: <input type="text" name="giverole">
        <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
        <input type="submit" value="Go">
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
      $page_link = $site_url . '/' . sha1($userdata['studygroup'][0]);
    } else {
      $page_link = $site_url . '/' . sha1($x->ID);
    } ?>

    <ul class="list-group mb-1 list-group-horizontal">

    <li class="list-group-item col-1">
      <span class="text-muted me-1">ID:</span><a href="#form" class="id-selector badge bg-primary text-white"><?php echo $x->ID; ?></a>
    </li>

    <a class="list-group-item col" href="<?php echo $page_link; ?>">
        <?php echo $userdata['first_name'][0]; ?>
        <?php echo $userdata['last_name'][0]; ?>
        <?php echo $x->user_email; ?>
      <span class="badge bg-secondary ms-1"><?php echo $userdata['role'][0]; ?></span>
      <span class="badge bg-secondary ms-1"><?php echo $userdata['subscription'][0]; ?></span>
    </a>

    <li class="list-group-item col-2">
      <span class="text-muted text-end">
        Teacher ID: <span class="badge bg-primary"><?php echo $userdata['teacherid'][0]; ?></span>
      </span>
    </li>

    <li class="list-group-item col-2">
      <span class="text-muted text-end">
        Group: <span class="badge bg-secondary"><?php echo $userdata['studygroup'][0]; ?></span>
      </span>
    </li>

    <li class="list-group-item col-2">
      <a href="<?php echo $site_url; ?>/?cleargroup=1&user='<?php echo $x->ID; ?>">Clear Group</a>
    </li>

    </ul>

  <?php } ?>
  </ul>

</div>

</main></div>

<script>
let btn = document.querySelectorAll('.id-selector')
let targetform = document.querySelectorAll('.user-id')
btn.forEach((item, i) => {
  item.addEventListener('click', function (e) {
    targetform.forEach((item) => {
      item.value = this.innerHTML
    });
  })
});

</script>

<?php
get_footer();
