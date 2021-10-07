<?php
/**
 * Teacher's admin panel
 *
 * @package guyra
 */

$template_dir = get_template_directory();

/* Set up translations independent of Wordpress */
include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_misc.php';

// fetch user data

$thisUserId = get_current_user_id();
$thisUser = get_user_meta($thisUserId);
$users = get_users();
$site_url = get_site_url();
$userTeacherCode = Guyra_hash($thisUserId);

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
    $userProfile = Guyra_get_profile_picture($user, ['page-icon', 'tiny']);
    $userMeetingLink = guyra_get_user_meta($user, 'meetinglink', true)['meta_value'];
    $userStudentPageObject = GetUserStudyPage($user, true);
    $userStudentPageObjectEditLink = get_edit_post_link($userStudentPageObject->ID);

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

        <li class="list-group-item col">

          <span class="me-3">
            <?php echo $userProfile; ?>
          </span>

          <span class="me-1 text-primary text-bold"><strong>
          <?php echo $userdata['first_name'][0]; ?>
          <?php echo $userdata['last_name'][0]; ?>
          </strong></span>

          <i class="text-grey-darkest text-end d-none d-md-inline">
            <?php echo $x->user_email; ?>
          </i>

          <span class="badge bg-primary ms-1"><?php echo $userdata['role'][0] ?></span>

        </li>

        <?php if($userGroup != ""): ?>

        <li class="list-group-item col-2 d-none d-md-flex align-items-center">
          <span class="text-grey-darkest text-end">
            <?php echo $gi18n['group']; ?>: <span class="badge bg-primary"><?php echo $userdata['studygroup'][0]; ?></span>
          </span>
        </li>

        <?php endif; ?>

        <li class="list-group-item col-4 d-flex justify-content-around">
          <?php if (!$userInGroup): ?>
          <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#page-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
            <i class="bi bi-journal-richtext"></i>
            <span class="d-none d-md-inline"><?php echo $gi18n['homework']; ?></span>
          </a>
          <?php endif; ?>
          <a class="btn-tall btn-sm blue ms-1" data-bs-toggle="collapse" href="#controls-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
            <i class="bi bi-toggles"></i>
            <span class="d-none d-md-inline"><?php echo $gi18n['controls']; ?></span>
          </a>
        </li>

      </ul>

      <div class="collapse" id="controls-<?php echo $user_sha1d; ?>">

        <div id="form-<?php echo $user_sha1d; ?>" class="admin-forms dialog mb-3">

          <h4><?php echo $gi18n['group'] ?></h4>
          <div class="d-flex justify-content-between">

            <form class="d-flex w-100" action="<?php echo $site_url; ?>" method="GET">

                <input class="flex-grow-1 me-3" placeholder="<?php echo $gi18n['group_tag'] ?>" type="text" name="assigntogroup">
                <label>
                  <a class="btn-tall green me-3" title="<?php echo $gi18n['add'] ?>" type="button" name="button"><i class="bi bi-plus-lg"></i></a>
                  <input class="d-none" type="submit" />
                </label>
                <input type="hidden" value="<?php echo $user ?>" name="user">
                <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">

            </form>

            <form action="<?php echo $site_url; ?>" method="GET">

                <label>
                  <a class="btn-tall red" title="<?php echo $gi18n['clear_group'] ?>" type="button" name="button"><i class="bi bi-x-lg"></i></a>
                  <input class="d-none" type="submit" />
                </label>
                <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">
                <input type="hidden" value="<?php echo $user ?>" name="user">
                <input type="hidden" value="1" name="cleargroup">

            </form>

          </div>

          <h4 class="mt-3"><?php echo $gi18n['meeting_link'] ?></h4>
          <div class="d-flex flex-column justify-content-between">

            <form class="d-flex w-100" action="<?php echo $site_url; ?>" method="GET">

                <input class="flex-grow-1 me-3" placeholder="https://us04web.zoom.us..." type="text" name="meetinglink">
                <label>
                  <a class="btn-tall green" title="<?php echo $gi18n['add'] ?>" type="button" name="button"><i class="bi bi-check-lg"></i></a>
                  <input class="d-none" type="submit" />
                </label>
                <input type="hidden" value="<?php echo $user ?>" name="user">
                <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">

            </form>

            <p class="text-small mt-3">Link atual: <a href="<?php echo $userMeetingLink; ?>"><?php echo $userMeetingLink; ?></a></p>

          </div>

        </div>

      </div>

      <div class="collapse" id="page-<?php echo $user_sha1d; ?>"><div class="study-answers">

        <div class="dialog">

          <div class="d-flex">
            <a class="btn-tall blue edit-homework-button" data-target="<?php echo $user_sha1d; ?>" data-link="<?php echo $userStudentPageObjectEditLink; ?>">
              <?php echo $gi18n['edit'] ?>
            </a>
          </div>

          <hr />

          <div id="inner-<?php echo $user_sha1d; ?>">
            <?php echo apply_filters('the_content', $userStudentPageObject->post_content); ?>
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

      <li class="list-group-item col">
        <span class="badge bg-primary">
          <?php echo $gi18n['group'] . ':'; ?>
          <span class="ms-1 text-white">
            <strong><?php echo $group['name']; ?></strong>
          </span>
        </span>
        <i class="ms-1 text-grey-darkest">
          <?php echo implode(', ', $group['usersNames']); ?>
        </i>
      </li>

      <li class="list-group-item col-4 d-flex justify-content-around">
        <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#page-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
          <i class="bi bi-journal-richtext"></i>
          <span class="d-none d-md-inline"><?php echo $gi18n['homework']; ?></span>
        </a>
        <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#controls-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
          <i class="bi bi-toggles"></i>
          <span class="d-none d-md-inline"><?php echo $gi18n['controls']; ?></span>
        </a>
      </li>

    </ul>


    <div class="collapse" id="controls-<?php echo $group['name']; ?>">

      <div id="form-<?php echo $group['name']; ?>" class="admin-forms dialog">

        <h4><?php echo $gi18n['meeting_link'] ?></h4>
        <div class="d-flex justify-content-between">
          <form class="d-flex w-100" action="<?php echo $site_url; ?>" method="GET">

              <input class="flex-grow-1 me-3" placeholder="https://us04web.zoom.us..." type="text" name="meetinglink">
              <label>
                <a class="btn-tall green" title="<?php echo $gi18n['add'] ?>" type="button" name="button"><i class="bi bi-check-lg"></i></a>
                <input class="d-none" type="submit" />
              </label>
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

  <div class="dialog mt-3">
    <h3><?php echo $gi18n['your_code']; ?>:</h3>

    <span class="d-flex my-3">
      <input id="your-code" type="text" value="<?php echo $userTeacherCode; ?>" class="text-black border-0 bg-transparent no-focus" />
      <button id="copy-code" class="btn-tall btn-sm green" type="button" name="button"><i class="bi bi-clipboard"></i></button>
    </span>

    <p><?php echo $gi18n['your_code_explain']; ?></p>
  </div>

  <p class="text-center text-grey-darker text-small py-5 m-0"><?php echo $gi18n['guyra_thanks_you']; ?></p>

  <?php

else : // wp_redirect ain't working here ?>
<script>setTimeout(function(){ window.location.href = "<?php echo $gi18n['schools_footer_link']; ?>"; }, 0);</script>
<?php endif;
