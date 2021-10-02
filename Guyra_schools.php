<?php
/**
 * Teacher's admin panel
 *
 * @package guyra
 */


/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
include get_template_directory() . '/Guyra_misc.php';

// fetch user data

$thisUserId = get_current_user_id();
$thisUser = get_user_meta($thisUserId);
$users = get_users();
$site_url = get_site_url();

// Sorts the list into date registered
function cmp($a, $b) {
  if ($a->ID == $b->ID) {
      return 0;
  }
  return ($a->ID < $b->ID) ? -1 : 1;
}

usort($users, "cmp");

if ($thisUser['role'][0] == "teacher" || current_user_can('manage_options')):?>

  <div class="my-5" data-aos="fade-right" data-aos-once="true">
    <h1 class="mb-3 text-blue">Welcome, <?php echo $thisUser['first_name'][0]; ?></h1>
    <h2 class="mb-3 text-purple">to your student panel.</h2>
  </div>

  <div data-aos="fade-right" data-aos-delay="200" data-aos-once="true">

  <?php

  $groups = [];
  $groupsData = [];

  echo '<h4>' . $gi18n['your_students'] . '</h4>';

  foreach ($users as $x) {

    $user = $x->ID;
    $userdata = get_user_meta($user);
    $userTeacher = $userdata['teacherid'][0];
    $userInGroup = false;

    if ($userTeacher == $thisUserId) {

      $user_sha1d = sha1($user);
      $userGroup = $userdata['studygroup'][0];

      if($userGroup != "") {
        $page_link = $site_url . '/' . sha1($userGroup . $userTeacher);
        $userInGroup = true;

        if (!in_array($userGroup, $groups)) {

          $data = [
            'name' => $userGroup,
            'link' => $page_link
          ];

          $groups[] = $userGroup;
          $groupsData[$userGroup] = $data;

          unset($data);
        }

        $groupsData[$userGroup]['users'][] = $user;
        $groupsData[$userGroup]['usersNames'][] = $userdata['first_name'][0];

      } else {
        $page_link = $site_url . '/' . $user_sha1d;
      }
      ?>

      <ul id="user-<?php echo $user; ?>" class="user-list list-group list-group-horizontal mb-1">

        <li class="list-group-item col-6">
          <span class="me-1 text-primary text-bold"><strong>
          <?php echo $userdata['first_name'][0]; ?>
          <?php echo $userdata['last_name'][0]; ?>
          </strong></span>
          <i class="text-grey-darker text-end d-none d-md-block">
            <?php echo $x->user_email; ?>
          </i>
          <span class="badge bg-secondary ms-1"><?php echo $userdata['role'][0] ?></span>
        </li>

        <li class="list-group-item col-2 d-none d-md-block">
          <span class="text-grey-darker text-end">
            <?php echo $gi18n['group']; ?>: <span class="badge bg-secondary"><?php echo $userdata['studygroup'][0]; ?></span>
          </span>
        </li>

        <li class="list-group-item col d-flex justify-content-around">
          <?php if (!$userInGroup): ?>
          <a class="btn btn-sm btn-primary" data-bs-toggle="collapse" href="#page-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
            <?php echo $gi18n['homework']; ?>
          </a>
          <?php endif; ?>
          <a class="btn btn-sm btn-primary ms-1" data-bs-toggle="collapse" href="#controls-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
            <?php echo $gi18n['controls']; ?>
          </a>
        </li>

      </ul>

      <div class="collapse" id="controls-<?php echo $user_sha1d; ?>">

        <div id="form" class="admin-forms dialog mb-3">

          <h4><?php echo $gi18n['group'] ?></h4>
          <div class="d-flex justify-content-between">
            <form action="<?php echo $site_url; ?>" method="GET">

                <span><input placeholder="<?php echo $gi18n['group_tag'] ?>" type="text" name="assigntogroup"></span>
                <span><input class="btn-tall green" type="submit" value="<?php echo $gi18n['add'] ?>" /></span>
                <input type="hidden" value="<?php echo $user ?>" name="user">
                <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">

            </form>

            <form action="<?php echo $site_url; ?>" method="GET">

                <span><input class="btn-tall red" type="submit" value="<?php echo $gi18n['clear_group'] ?>" /></span>
                <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">
                <input type="hidden" value="<?php echo $user ?>" name="user">
                <input type="hidden" value="1" name="cleargroup">

            </form>
          </div>

        </div>

        <div id="form" class="admin-forms dialog">

          <h4><?php echo $gi18n['meeting_link'] ?></h4>
          <div class="d-flex justify-content-between">
            <form action="<?php echo $site_url; ?>" method="GET">

                <span><input placeholder="https://us04web.zoom.us..." type="text" name="meetinglink"></span>
                <span><input class="btn-tall green" type="submit" value="<?php echo $gi18n['add'] ?>" /></span>
                <input type="hidden" value="<?php echo $user ?>" name="user">
                <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">

            </form>
          </div>

        </div>

      </div>

      <div class="collapse" id="page-<?php echo $user_sha1d; ?>"><div class="study-answers">

        <div class="dialog">

          <div class="d-flex">
            <a class="btn-tall blue edit-homework-button" data-target="<?php echo $user_sha1d; ?>" data-link="<?php echo $page_link; ?>">
              <?php echo $gi18n['edit'] ?>
            </a>
          </div>

          <hr />

          <div id="inner-<?php echo $user_sha1d; ?>">
            <?php GetUserStudyPage($user); ?>
          </div>

        </div>

        <div class="page-squeeze m-0"><div class="study-answers">
          <?php GetUserStudyPage_comments($user, false); ?>
        </div></div>

      </div></div>

      <?php
    } // end if user is assigned to this teacher

  } // end foreach loop

  if (!empty($groups)) {
    echo '<h4 class="mt-3">' . $gi18n['groups'] . '</h4>';
  }

  foreach ($groups as $current_group) {

    $group = $groupsData[$current_group];

    ?>

    <ul id="group-<?php echo $group['name'] ?>" class="user-list list-group list-group-horizontal mb-1">

      <li class="list-group-item col-6">
        <span class="badge bg-secondary">
          <?php echo $gi18n['group']; ?>
          <span class="ms-1 text-primary">
            <strong><?php echo $group['name']; ?></strong>
          </span>
        </span>
        <i class="ms-1 text-grey-darker">
          <?php echo implode(', ', $group['usersNames']); ?>
        </i>
      </li>

      <li class="list-group-item col d-flex justify-content-around">
        <a class="btn btn-sm btn-primary" data-bs-toggle="collapse" href="#page-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
          <?php echo $gi18n['homework']; ?>
        </a>
        <a class="btn btn-sm btn-primary" data-bs-toggle="collapse" href="#controls-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
          <?php echo $gi18n['controls']; ?>
        </a>
      </li>

    </ul>


    <div class="collapse" id="controls-<?php echo $group['name']; ?>">

      <div id="form" class="admin-forms dialog">

        <h4><?php echo $gi18n['meeting_link'] ?></h4>
        <div class="d-flex justify-content-between">
          <form action="<?php echo $site_url; ?>" method="GET">

              <span><input placeholder="https://us04web.zoom.us..." type="text" name="meetinglink"></span>
              <span><input class="btn-tall green" type="submit" value="<?php echo $gi18n['add'] ?>" /></span>
              <input type="hidden" value="<?php echo json_encode($group['users']) ?>" name="user">
              <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">

          </form>
        </div>

      </div>

    </div>

    <div class="collapse" id="page-<?php echo $group['name']; ?>"><div class="study-answers">

      <div class="dialog">

        <div class="d-flex">
          <a class="btn-tall blue edit-homework-button" data-target="<?php echo $group['name']; ?>" data-link="<?php echo $group['link']; ?>">
            <?php echo $gi18n['edit'] ?>
          </a>
        </div>

        <hr />

        <div id="inner-<?php echo $group['name']; ?>">
          <?php
          // Note: here we get a random user's page because it doesn't matter.
          // All users in a group get the same page anyway
          GetUserStudyPage($group['users'][0]);
          ?>
        </div>

      </div>

      <div class="page-squeeze m-0"><div class="study-answers">
        <?php GetUserStudyPage_comments($group['users'][0], false); ?>
      </div></div>

    </div>

  </div>

  <?php } // end group foreach loop ?>

  <div class="dialog info mt-3">
    <h3><?php echo $gi18n['your_code']; ?>: <span class="badge bg-secondary"><?php echo Guyra_hash($thisUserId); ?></span></h3>
    <p><?php echo $gi18n['your_code_explain']; ?></p>
  </div>

  <p class="text-center text-grey-darker text-small py-5 m-0"><?php echo $gi18n['guyra_thanks_you']; ?></p>

  <script>

  editHomeworkButtons = document.querySelectorAll('.edit-homework-button');

  editHomeworkButtons.forEach((button) => {
    targetId = button.dataset.target;
    var target = document.getElementById('inner-'.concat(targetId));
    var previousState = false;
    var buttonPreviousInner = button.innerHTML;
    var pageLink = button.dataset.link;

    button.onclick = editTrigger;

    function editTrigger(e) {

      var frameId = 'frame-'.concat(targetId);

      if (!previousState) {

        button.innerHTML = '<i class="bi bi-check-lg"></i>'
        previousState = target.innerHTML;
        target.innerHTML = '<iframe id="'.concat(frameId).concat('" class="editor-inline" src="').concat(pageLink).concat('"/>');

      } else {

        var frame = document.getElementById(frameId).contentDocument;
        frame.querySelector('.editor-post-publish-button').click();
        button.innerHTML = '<i class="bi bi-three-dots"></i>';

        setTimeout(function(){
          target.innerHTML = previousState;
          previousState = false;

          document.location.reload();
        }, 2000);

      }

      button.classList.toggle('blue');
      button.classList.toggle('green');

    }
  });


  </script>

  <?php

else : // wp_redirect ain't working here ?>
<script>setTimeout(function(){ window.location.href = "<?php echo $gi18n['schools_footer_link']; ?>"; }, 0);</script>
<?php endif;
