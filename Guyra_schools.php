<?php
/**
 * Teacher's admin panel
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $gi18n;

if ( ! function_exists( 'Guyra_hash' ) ) :
include $template_dir . '/Guyra_misc.php';
endif;

$thisUser = get_user_meta($current_user_id);
$users = get_users();
$userTeacherCode = Guyra_hash($current_user_id);

if ($thisUser['role'][0] == "teacher" || current_user_can('manage_options')):?>

  <div class="mt-5">
    <h1 class="mb-3 text-blue">Welcome, <?php echo $thisUser['first_name'][0]; ?></h1>
    <h2 class="mb-3 text-purple">to your student panel.</h2>
  </div>

  <div class="py-3">
    <div id="the-diary"></div>
  </div>

  <div class="schools-wrapper fade-animation animate">

  <?php

  $groups = [];
  $groupsData = [];

  ?>

  <h4><?php echo $gi18n['your_students']; ?></h4>
  <div class="user-list-wrapper">
  <?php

  foreach ($users as $x) {

    $user = $x->ID;
    $userdata = get_user_meta($user);
    $userTeacher = $userdata['teacherid'][0];
    $userInGroup = false;
    $userProfile = Guyra_get_profile_picture($user, ['page-icon', 'tiny']);
    $userMeetingLink = guyra_get_user_meta($user, 'meetinglink', true)['meta_value'];
    $userStudentPageObject = GetUserStudyPage($user, true);
    $userStudentPageObjectEditLink = get_edit_post_link($userStudentPageObject->ID);

    if ($userTeacher == $current_user_id) {

      $user_sha1d = sha1($user);
      $userGroup = $userdata['studygroup'][0];

      if($userGroup != "") {
        $userInGroup = true;

        if (!in_array($userGroup, $groups)) {

          $data = [
            'name' => $userGroup,
            'link' => $userStudentPageObjectEditLink
          ];

          $groups[] = $userGroup;
          $groupsData[$userGroup] = $data;

          unset($data);
        }

        $groupsData[$userGroup]['users'][] = $user;
        $groupsData[$userGroup]['usersNames'][] = $userdata['first_name'][0];

      }
      ?>

      <ul id="user-<?php echo $user; ?>" class="user-list list-group list-group-horizontal">

        <li class="list-group-item col">

          <span class="me-3">
            <?php echo $userProfile; ?>
          </span>

          <span class="me-1 text-primary text-bold" title="<?php echo $x->user_email; ?>"><strong>
          <?php echo $userdata['first_name'][0]; ?>
          <?php echo $userdata['last_name'][0]; ?>
          </strong></span>

          <span class="badge bg-primary ms-1"><?php echo $userdata['role'][0] ?></span>

        </li>

        <?php if($userGroup != ""): ?>

        <li class="list-group-item col-2 d-none d-md-flex align-items-center">
          <span class="text-grey-darkest text-end">
            <?php echo $gi18n['group']; ?>: <span class="badge bg-primary"><?php echo $userdata['studygroup'][0]; ?></span>
          </span>
        </li>

        <?php endif; ?>

        <li class="list-group-item col-5 p-1 d-flex justify-content-around">
          <a class="btn-tall btn-sm blue me-1 diary-opener" data-diarytype="user" <?php if($userGroup != ""): ?> data-diaryoptions='{"onlyPayments": true}' <?php endif; ?> data-userid="<?php echo $user; ?>" data-username="<?php echo $userdata['first_name'][0]; ?>">
            <i class="bi bi-card-list"></i>
            <span class="d-none d-lg-inline"><?php echo $gi18n['diary']; ?></span>
          </a>
          <?php if (!$userInGroup): ?>
          <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#page-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
            <i class="bi bi-journal-richtext"></i>
            <span class="d-none d-lg-inline"><?php echo $gi18n['homework']; ?></span>
          </a>
          <?php endif; ?>
          <a class="btn-tall btn-sm blue ms-1" href="<?php echo $gi18n['schools_link'] . '?comment_history=1&user=' . $user ?>">
            <i class="bi bi-list-ul"></i>
            <span class="d-none d-lg-inline"><?php echo $gi18n['replies']; ?></span>
          </a>
          <a class="btn-tall btn-sm blue ms-1" data-bs-toggle="collapse" href="#controls-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
            <i class="bi bi-toggles"></i>
            <span class="d-none d-lg-inline"><?php echo $gi18n['controls']; ?></span>
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

            <p class="text-small mt-3"><?php echo $gi18n['current_link'] . ': '; ?> <a href="<?php echo $userMeetingLink; ?>"><?php echo $userMeetingLink; ?></a></p>

          </div>

          <h4 class="mt-3"><?php echo $gi18n['archive_student']; ?></h4>
          <div class="d-flex flex-column justify-content-between">

            <?php echo $gi18n['archive_student_explain']; ?>

            <a class="btn-tall blue align-self-baseline" href="<?php echo $site_url; ?>/?clearteacher=1&user=<?php echo $x->ID; ?>&redirect=<?php echo $gi18n['schools_link']; ?>"><?php echo $gi18n['archive_student']; ?></a>

          </div>

        </div>

      </div>

      <div class="collapse" id="page-<?php echo $user_sha1d; ?>"><div class="study-answers">

        <div class="dialog">

          <div class="d-flex float-end">
            <a class="btn-tall blue edit-homework-button" data-target="<?php echo $user_sha1d; ?>" data-link="<?php echo $userStudentPageObjectEditLink; ?>">
              <?php echo $gi18n['edit'] ?>
            </a>
          </div>

          <div id="inner-<?php echo $user_sha1d; ?>">
            <?php echo apply_filters('the_content', $userStudentPageObject->post_content); ?>
          </div>

        </div>

        <div class="page-squeeze m-0"><div class="study-answers">
          <?php GetUserStudyPage_comments($user, false, true, '1 weeks ago', $gi18n['schools_link']); ?>
        </div></div>

      </div></div>

      <?php
    } // end if user is assigned to this teacher

  } // end foreach loop

  ?>

  </div>
  <?php

  if (!empty($groups)) {
    echo '<h4 class="mt-3">' . $gi18n['groups'] . '</h4>';
  }

  foreach ($groups as $current_group) {

    $group = $groupsData[$current_group];

    ?>

    <ul id="group-<?php echo $group['name'] ?>" class="user-list list-group list-group-horizontal">

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

      <li class="list-group-item col-5 p-1 d-flex justify-content-around">
        <a class="btn-tall btn-sm blue me-1 diary-opener" data-diarytype="group" data-userid="<?php echo $current_user_id; ?>" data-grouptag="<?php echo $group['name']; ?>">
          <i class="bi bi-card-list"></i>
          <span class="d-none d-lg-inline"><?php echo $gi18n['diary']; ?></span>
        </a>
        <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#page-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
          <i class="bi bi-journal-richtext"></i>
          <span class="d-none d-lg-inline"><?php echo $gi18n['homework']; ?></span>
        </a>
        <a class="btn-tall btn-sm blue ms-1" href="<?php echo $gi18n['schools_link'] . '?comment_history=1&user=' . $group['users'][0] ?>">
          <i class="bi bi-list-ul"></i>
          <span class="d-none d-lg-inline"><?php echo $gi18n['replies']; ?></span>
        </a>
        <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#controls-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
          <i class="bi bi-toggles"></i>
          <span class="d-none d-lg-inline"><?php echo $gi18n['controls']; ?></span>
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

        <div class="d-flex float-end">
          <a class="btn-tall blue edit-homework-button" data-target="<?php echo $group['name']; ?>" data-link="<?php echo $group['link']; ?>">
            <?php echo $gi18n['edit'] ?>
          </a>
        </div>

        <div id="inner-<?php echo $group['name']; ?>">
          <?php
          // Note: here we get a random user's page because it doesn't matter.
          // All users in a group get the same page anyway
          GetUserStudyPage($group['users'][0]);
          ?>
        </div>

      </div>

      <div class="page-squeeze m-0"><div class="study-answers">
        <?php GetUserStudyPage_comments($group['users'][0], false, true, '1 weeks ago', $gi18n['schools_link']); ?>
      </div></div>

    </div>

  </div>

  <?php } // end group foreach loop ?>

  <div class="dialog mt-3">
    <h3><?php echo $gi18n['your_code']; ?>:</h3>

    <span class="d-flex my-3">
      <input id="your-code" type="number" readonly value="<?php echo $userTeacherCode; ?>" class="text-black border-0 bg-transparent no-focus" />
      <button id="copy-code" class="btn-tall btn-sm green" type="button" name="button"><i class="bi bi-clipboard"></i></button>
    </span>

    <p><?php echo $gi18n['your_code_explain']; ?></p>
  </div>

  <p class="text-center text-grey-darker text-small py-5 m-0"><?php echo $gi18n['guyra_thanks_you']; ?></p>

  <?php

else : // wp_redirect ain't working here ?>
<script>setTimeout(function(){ window.location.href = "<?php echo $gi18n['schools_footer_link']; ?>"; }, 0);</script>
<?php endif;
