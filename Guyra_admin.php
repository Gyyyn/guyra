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

global $template_dir;
global $template_url;
global $current_user_id;

/* Set up translations independent of Wordpress */
include $template_dir . '/i18n.php';

// Get users
$users = get_users();
$site_url = get_site_url();

get_header();

?>

<main class="page squeeze" id="admin"><div class="page-squeeze rounded-box">

<div class="admin-section">

  <h1 class="mb-3">Welcome,</h1>
  <h2 class="mb-3">to the admin panel.</h2>

</div>

<div class="admin-section d-none">

  <h4 class="mt-5">Param debug:</h4>
  <div class="admin-forms border rounded p-3 m-0">
    <pre>
    <?php print_r('here may be a var'); ?>
    </pre>
  </div>

</div>

<?php if($_GET['exercise_log']):

$theLog = guyra_get_logdb_items($_GET['exercise_log'], true);

?>

<div class="admin-section">

  <?php

  foreach ($theLog as $logItem) {

    $theObject = json_decode($logItem['object']);

    ?>

    <div class="entry my-3">
      User: <?php echo $logItem['user_id']; ?> | Date: <?php echo $logItem['date']; ?> | <span class="text-muted">Log ID: <?php echo $logItem['log_id']; ?></span>

      <div class="d-flex flex-wrap">
          <?php foreach ($theObject->answers as $object): ?>

            <div class="border rounded p-3 m-1">
              <div class="">Q: <?php echo $object[0]; ?></div>
              <div class="">Correct: <?php echo $object[1]; ?></div>
              <div class="">User Answer (<span class="<?php echo ($object[3] == 'correct') ? 'text-green' : 'text-red'; ?>"><?php echo $object[3]; ?></span>): <?php echo $object[2]; ?></div>
            </div>

          <?php endforeach; ?>
      </div>
    </div>

  <?php }

  ?>

</div>

<?php endif; ?>

<div class="admin-section">

  <h4 class="mt-5">Site:</h4>
  <div class="admin-forms border rounded p-3 m-0">

    <a class="btn btn-primary" data-bs-toggle="collapse" href="#new-post-collapse">New Blog Post</a>
    <a class="btn btn-primary" href="<?php echo $gi18n['guyra_admin_link']; ?>&exercise_log=10">See LogDB</a>

    <div class="mt-3 collapse" id="new-post-collapse">
      <iframe id="new-post" class="editor-inline" src="<?php echo $gi18n['admin_link'] . 'post-new.php'; ?>" /></iframe>
    </div>

    <hr />

    <select name="page-dropdown"
     onchange='document.location.href=this.options[this.selectedIndex].value;'>
     <option value="">
    <?php echo esc_attr( __( 'Select page' ) ); ?></option>
     <?php
      $pages = get_pages();
      foreach ( $pages as $page ) {
        $option = '<option value="' . get_edit_post_link($page->ID) . '">Edit: ';
        $option .= $page->post_title;
        $option .= '</option>';
        echo $option;
      }
     ?>
    </select>

  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Registered Users:</h4>
  <ul class="list-group m-0">
  <?php

  $teacher_info = [];

  foreach ($users as $x) {

    $userdata = get_user_meta($x->ID);
    $teacherid = $userdata['teacherid'][0];
    $grouptag = $userdata['studygroup'][0];
    $user_subscription = guyra_get_user_meta($x->ID, 'subscription', true)['meta_value'];

    if (!array_key_exists($teacherid, $teacher_info)) {
      $teacher_info[$teacherid] = get_user_meta($teacherid);
    }

    ?>

    <ul class="list-group list-group-horizontal mb-3">

    <li class="list-group-item col d-flex align-items-center">
      <span class="fw-bold"><?php echo $userdata['first_name'][0]; ?>&nbsp;<?php echo $userdata['last_name'][0]; ?></span>
      <span class="badge bg-dark ms-1"><?php echo $userdata['role'][0]; ?></span>
      <span class="badge bg-dark ms-1"><?php echo $user_subscription; ?></span>
      <span class="fst-italic text-grey-darker ms-1"><?php echo $x->user_email; ?></span>
    </li>

    <?php if($teacherid): ?>

    <li class="list-group-item col-4 d-flex align-items-center">

      <?php if($grouptag): ?>

      <span class="text-grey-darker me-3">
        <?php echo $gi18n['group']; ?>: <span class="badge bg-dark"><?php echo $grouptag; ?></span>
      </span>

      <?php endif; ?>

      <span class="text-grey-darker">
        Teacher: <span class="badge bg-dark"><?php echo $teacher_info[$teacherid]['first_name'][0]; ?></span>
      </span>

    </li>

    <?php endif; ?>

    <li class="list-group-item col-2 d-flex align-items-center">
      <a class="btn btn-primary btn-sm" data-bs-toggle="collapse" href="#controls-<?php echo $x->ID; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $x->ID; ?>">
        <i class="bi bi-toggles"></i>
        <span class="d-none d-md-inline"><?php echo $gi18n['controls']; ?></span>
      </a>
    </li>

    </ul>

    <div class="collapse" id="controls-<?php echo $x->ID; ?>">

      <div class="row my-3">

        <div class="admin-section col-md">

          <h4 class="mt-4"><?php echo $gi18n['schools']; ?>:</h4>

          <div class="admin-forms border rounded p-3 m-0">

            <h5>Assign to teacher:</h5>
            <form action="<?php echo $site_url; ?>" method="GET">
                Teacher ID: <input type="number" name="assigntoteacher">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="<?php echo $x->ID; ?>" name="user">
                <input type="submit" value="Go">
            </form>

            <hr />

            <a class="btn btn-primary" href="<?php echo $site_url; ?>/?clearteacher=1&user=<?php echo $x->ID; ?>&redirect=<?php echo $gi18n['guyra_admin_link']; ?>">Clear Teacher</a>

            <hr />

            <h5>Assign to group:</h5>
            <form action="<?php echo $site_url; ?>" method="GET">
                Group tag: <input type="text" name="assigntogroup">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="<?php echo $x->ID; ?>" name="user">
                <input type="submit" value="Go" />
            </form>

            <hr />

            <a class="btn btn-primary" href="<?php echo $x->ID; ?>/?cleargroup=1&user='<?php echo $x->ID; ?>">Clear Group</a>

          </div>

        </div>

        <div class="admin-section col-md">

          <h4 class="mt-4">Site:</h4>
          <div class="admin-forms border rounded p-3 m-0">

            <h5>Give premium:</h5>
            <form action="<?php echo $site_url; ?>" method="GET">
                <?php echo $gi18n['date']; ?>: <input type="date" name="till">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="premium" name="subscription">
                <input type="hidden" value="<?php echo $x->ID; ?>" name="user">
                <input type="submit" value="Go">
            </form>

            <hr />

            <h5>Give lite:</h5>
            <form action="<?php echo $site_url; ?>" method="GET">
                <?php echo $gi18n['date']; ?>: <input type="date" name="till">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="lite" name="subscription">
                <input type="hidden" value="<?php echo $x->ID; ?>" name="user">
                <input type="submit" value="Go">
            </form>

            <hr />

            <h5>Give user role:</h5>
            <div class="mb-4 alert alert-info" role="alert">
              <p>Currently working roles are:</p>
              <ul>
                <li>teacher - has access to the student admin panel and can be assigned students by site admins.</li>
              </ul>
            </div>

            <form action="<?php echo $site_url; ?>" method="GET">
                Role: <input type="text" name="giverole">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="<?php echo $x->ID; ?>" name="user">
                <input type="submit" value="Go">
            </form>

          </div>

        </div>

      </div>

    </div>

  <?php } ?>
  </ul>

</div>

<div class="admin-section">

  <h4 class="mt-4">Extras:</h4>
  <div class="admin-forms border rounded p-3 m-0">

  <a href="<?php echo $gi18n['admin_link'] ?>" class="btn btn-sm btn-primary">Wordpress admin</a>
  <a href="<?php echo $site_url . '?user=' . $current_user_id . '&create_db=create_log_db' ?>" class="btn btn-sm btn-primary">Create Log DB</a>
  <a href="<?php echo $site_url . '?user=' . $current_user_id . '&create_db=create_meta_db' ?>" class="btn btn-sm btn-primary">Create Meta DB</a>
  <a href="<?php echo $site_url . '?user=' . $current_user_id . '&create_db=create_error_db' ?>" class="btn btn-sm btn-primary">Create Error DB</a>
  <a href="<?php echo $site_url . '?user=' . $current_user_id . '&create_page=all' ?>" class="btn btn-sm btn-primary">Create Site Pages</a>

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

  </div>

</div>

</main></div>

<?php
get_footer();
