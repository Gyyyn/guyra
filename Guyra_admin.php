<?php
echo '
  <a class="btn btn-primary position-absolute top-25 start-0 translate-middle" data-bs-toggle="collapse" href="#collapse-admin" role="button" aria-expanded="false" aria-controls="collapse-admin">
    🎁
  </a>';

echo '<div class="collapse hide" id="collapse-admin">';
// Get users
$users = get_users();
echo '
<h4 class="mt-4">User admin:</h4>
<div class="mb-4 alert alert-info" role="alert">
  <p>Everything in this panel is pretty basic and easy to break to make sure to follow instructions exactly!</p>

  <p>To add an user to a group get the ID of the user listed below and type the tag of the group.
  Users with the same tag will see the same homework page.</p>
</div>
';
?>
<a href="<?php echo $gi18n['admin_link'] ?>" class="btn btn-lg btn-primary">Wordpress admin</a>
<h5 class="mt-4">Management:</h5>
<div class="admin-forms border rounded p-5 m-0">

  <h5>Assign to group:</h5>
  <form action="<?php echo get_site_url(); ?>" method="GET">
      User ID: <input type="text" name="user">
      Group tag: <input type="text" name="assigntogroup">
      <input type="submit" value="Go" />
  </form>

  <hr />

  <h5>Assign to teacher:</h5>
  <form action="<?php echo get_site_url(); ?>" method="GET">
      User ID: <input type="text" name="user">
      Teacher ID: <input type="text" name="assigntoteacher">
      <input type="submit" value="Go" />
  </form>

  <hr />

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

  <hr />

  <?php print_r($_COOKIE); ?>

</div>
<?php
echo '<h5 class="mt-4">Info:</h5>';
echo '<ul class="list-group m-0">';
foreach ($users as $x) {
  // Lord have mercy on those who will maintain this shit
  $userdata = get_user_meta($x->ID);

  if($userdata['studygroup'][0] != "") {
    $page_link = get_site_url() . '/' . sha1($userdata['studygroup'][0]);
  } else {
    $page_link = get_site_url() . '/' . sha1($x->ID);
  }

  echo '<li class="list-group-item">' .
  '<a href="' . $page_link . '">' .
  'ID: ' . $x->ID . ' ' .
  $userdata['first_name'][0] . ' ' .
  $userdata['last_name'][0] . '</a> ' .
  $x->user_email . ' | ' .
  '<span class="text-muted text-end">' .
  'Group: <span class="badge bg-secondary">' . $userdata['studygroup'][0] . '</span>' .
  '</span> ' .
  '<a href="' . get_site_url() . '/?short_load=1&cleargroup=1&user=' . $x->ID . '" class="btn btn-outline-primary btn-sm">Clear Group</a>' .
  '</li>';

}
echo '</ul>';

echo '<hr />';
echo '</div>';
