<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $site_api_url;
global $is_admin;
global $gi18n;
global $gSettings;

if (!$is_admin)
exit;

include_once $template_dir . '/functions/Assets.php';

GetComponent('Header', ['css' => 'admin.css']); ?>

<main class="page squeeze" id="admin"><div class="page-squeeze rounded-box">

<div class="admin-section">

  <h2 onclick="document.getElementById('debug').classList.remove('d-none');">Admin panel</h2>

</div>

<div id="debug" class="admin-section d-none">

  <h4 class="mt-5">Param debug:</h4>
  <div class="admin-forms border rounded p-3 m-0">
    <pre>
    <?php print_r('nothing'); ?>
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

    <a class="btn btn-primary" href="<?php echo $gi18n['guyra_admin_link']; ?>?exercise_log=10">See LogDB</a>

    <h5>Change a site option:</h5>

    <div class="mb-4 alert alert-info" role="alert" onclick="document.getElementById('setts').classList.remove('d-none');">
      <p>Currently working options are (* indicates potentially critical functionality):</p>
      <ul>
        <li>dev_env - series of actions: 1. forces always refresh cache for js, css.</li>
        <li>google_api* - google api key used for: cloud translate, youtube api.</li>
        <li>google_cloud* - google cloud credentials json used for: cloud tts.</li>
        <li>mp_access_token* - MercadoPado Prod Access Token used for payments.</li>
        <li>mp_app_id* - MercadoPado app id used for payments.</li>
        <li>mp_lite_planid* - MercadoPado plan id for lite subscription.</li>
        <li>mp_premium_planid* - MercadoPado plan id for premium subscription.</li>
        <li>payments_open* - Allow payment processing API calls.</li>
        <li>site_closed - Disallow non-admins past the login process.</li>
        <li>mp_public_key - MercadoPago public key.</li>
        <li>mp_public_key_dev - MercadoPago public key in dev env.</li>
      </ul>
    </div>
    
    <pre id="setts" class="d-none">
      <?php var_dump($gSettings) ?>
    </pre>

    <form action="<?php echo $site_api_url . '?change_option=1'; ?>" method="POST">
        Option: <input type="text" name="change_option">
        Value: <input type="text" name="value">
        <input type="hidden" value="<?php echo $gi18n['guyra_admin_link'] ?>" name="redirect">
        <input type="submit" value="Go">
    </form>

  </div>

</div>

<div class="admin-section">

  <h4 class="mt-4">Set News:</h4>
  
  <div class="admin-forms border rounded p-3 m-0">

    <div><textarea name="setnews" id="setnews" cols="50" rows="5"></textarea></div>

    <button class="btn btn-primary" onclick="

      var newsText = document.getElementById('setnews');

      fetch('<?php echo $gi18n['api_link'] ?>?set_news=1',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({lang: 'pt', value: newsText.value})
      })

      newsText.value = 'ok';
      setTimeout(() => { newsText.value = ''; }, 1000)

    ">Set news file</button>

  </div>

</div>


<div class="admin-section">

  <h4 class="mt-4">Registered Users:</h4>

  <?php if($_GET['load_all_users']):
  $users = guyra_get_users(); ?>

  <ul class="list-group m-0">
  <?php

  foreach ($users as $user) {

    $teacherid = $user['userdata']['teacherid'];
    $grouptag = $user['userdata']['studygroup'];
    $user_subscription = $user['userdata']['subscription'];

    ?>

    <ul class="list-group list-group-horizontal mb-3">

    <li class="list-group-item col d-flex align-items-center">
      <span class="fw-bold"><?php echo $user['userdata']['first_name']; ?>&nbsp;<?php echo $user['userdata']['last_name']; ?></span>
      <span class="badge bg-dark ms-1"><?php echo $user['userdata']['role']; ?></span>
      <span class="badge bg-dark ms-1"><?php echo $user_subscription; ?></span>
    </li>

    <?php if($teacherid): ?>

    <li class="list-group-item col-4 d-flex align-items-center">

      <?php if($grouptag): ?>

      <span class="text-grey-darker me-3">
        <?php echo $gi18n['group']; ?>: <span class="badge bg-dark"><?php echo $grouptag; ?></span>
      </span>

      <?php endif; ?>

    </li>

    <?php endif; ?>

    <li class="list-group-item col-2 d-flex align-items-center">
      <a class="btn btn-primary btn-sm" data-bs-toggle="collapse" href="#controls-<?php echo $user['id']; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user['id']; ?>">
        <i class="bi bi-toggles"></i>
        <span class="d-none d-md-inline"><?php echo $gi18n['controls']; ?></span>
      </a>
    </li>

    </ul>

    <div class="collapse" id="controls-<?php echo $user['id']; ?>">

      <div class="row my-3">

        <div class="admin-section col-md">

          <h4 class="mt-4"><?php echo $gi18n['schools']; ?>:</h4>

          <div class="admin-forms border rounded p-3 m-0">

            <h5>Assign to teacher:</h5>
            <form action="<?php echo $site_api_url; ?>" method="GET">
                Teacher ID: <input type="number" name="assigntoteacher">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="<?php echo $user['id']; ?>" name="user">
                <input type="submit" value="Go">
            </form>

            <hr />

            <a class="btn btn-primary" href="<?php echo $site_api_url; ?>/?clearteacher=1&user=<?php echo $user['id']; ?>&redirect=<?php echo $gi18n['guyra_admin_link']; ?>">Clear Teacher</a>

            <hr />

            <h5>Assign to group:</h5>
            <form action="<?php echo $site_api_url; ?>" method="GET">
                Group tag: <input type="text" name="assigntogroup">
                <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
                <input type="hidden" value="<?php echo $user['id']; ?>" name="user">
                <input type="submit" value="Go" />
            </form>

            <hr />

            <a class="btn btn-primary" href="<?php echo $site_api_url; ?>/?cleargroup=1&user='<?php echo $user['id']; ?>">Clear Group</a>

          </div>

        </div>

        <div class="admin-section col-md">

          <h4 class="mt-4">Site:</h4>
          <div class="admin-forms border rounded p-3 m-0">

            <h5>Give user role:</h5>
            <div class="mb-4 alert alert-info" role="alert">
              <p>Currently working roles are:</p>
              <ul>
                <li>teacher - has access to the student admin panel and can be assigned students by site admins.</li>
                <li>tester - has free site access as a normal paying student.</li>
              </ul>
            </div>

            <form action="<?php echo $site_api_url; ?>" method="GET">
              Role: <input type="text" name="giverole">
              <input type="hidden" value="<?php echo $gi18n['guyra_admin_link']; ?>" name="redirect">
              <input type="hidden" value="<?php echo $user['id']; ?>" name="user">
              <input type="submit" value="Go">
            </form>

          </div>

        </div>

      </div>

    </div>

  <?php } ?>
  </ul>

  <?php else: ?>

  <div class="admin-forms border rounded p-3 m-0">
    <a href="<?php echo $gi18n['guyra_admin_link'] . '?load_all_users=1' ?>" class="btn btn-primary my-3">Load all users</a>
  </div>

</div>

<?php endif; ?>

<div class="admin-section">

  <h4 class="mt-4">Extras:</h4>
  <div class="admin-forms border rounded p-3 m-0">

  <a href="<?php echo $site_api_url . '?user=' . $current_user_id . '&create_db=all&redirect=' . $gi18n['guyra_admin_link']; ?>" class="btn btn-sm btn-primary me-3 mb-3">Create DBs</a>
  <a href="<?php echo $site_api_url . '?delete_cache=assets&redirect=' . $gi18n['guyra_admin_link']; ?>" class="btn btn-sm btn-primary me-3 mb-3">Delete Asset Cache</a>
  <a href="<?php echo $site_api_url . '?delete_cache=assets&limiter=js&redirect=' . $gi18n['guyra_admin_link']; ?>" class="btn btn-sm btn-primary me-3 mb-3">Delete Asset Cache (Only JS)</a>
  <a href="<?php echo $site_api_url . '?update_special_cache=1'; ?>" class="btn btn-sm btn-primary me-3 mb-3">Create Special Cache</a>
  <a href="<?php echo $site_api_url . '?delete_cache=translations&redirect=' . $gi18n['guyra_admin_link']; ?>" class="btn btn-sm btn-primary me-3 mb-3">Delete Translations Cache</a>
  <a href="<?php echo $site_api_url . '?delete_cache=audio&redirect=' . $gi18n['guyra_admin_link']; ?>" class="btn btn-sm btn-primary me-3 mb-3">Delete Audio Cache</a>
  <a href="<?php echo $site_api_url . '?action=refreshPWA&redirect=' . $gi18n['guyra_admin_link']; ?>" class="btn btn-sm btn-primary me-3 mb-3">Refresh PWA</a>

  </div>

</div>

</main></div>

<?php GetComponent('Footer');
