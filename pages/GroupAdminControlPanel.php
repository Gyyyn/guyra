<?php

global $template_dir;
global $template_url;
global $current_user_id;
global $site_url;
global $site_api_url;
global $is_logged_in;
global $gi18n;

include_once $template_dir . '/functions/Hash.php';
include_once $template_dir . '/components/StudyPage.php';
include_once $template_dir . '/components/ProfilePicture.php';

$users = guyra_get_users();
$userTeacherCode = Guyra_hash($current_user_id);

$loaded_at = $gi18n['home_link'];

get_header(null, ['css' => 'schools.css']);

?>

<main id="intro-content" class="site-main page">

  <div class="page-squeeze">
    <?php guyra_render_topbar(); ?>
  </div>

  <div class="squeeze-big schools rounded-box pt-3">

    <?php

    if ($_GET['comment_history'] == 1) { ?>

      <div class="page-squeeze squeeze py-5"><div class="study-answers">
      <div class="replies-control my-3 d-flex">
        <a href="<?php echo $loaded_at; ?>" class="btn-tall blue"><?php echo $gi18n['back']; ?></a>
      </div>

      <?php

      $redirect = $loaded_at . '?comment_history=1&user=' . $_GET['user'];

      GetUserStudyPage_comments($_GET['user'], false, true, '1 years ago', $redirect); ?>

      </div></div>

      <?php

    } else { ?>

      <div class="icon-title mb-5 d-flex justify-content-between align-items-center">
        <div class="mt-3">
          <h1 class="mb-3 text-blue">Welcome, <?php echo $current_user_data['first_name']; ?></h1>
          <h2 class="mb-3 text-purple">to your student panel.</h2>
        </div>
        <span class="page-icon"><img alt="<?php echo $gi18n['schools']; ?>" src="<?php echo GetImageCache('icons/textbook.png', 128); ?>"></span>
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

      foreach ($users as $theUser) {

        $user = $theUser['id'];
        $userInGroup = false;
        $userProfile = Guyra_get_profile_picture($theUser['userdata'], ['page-icon', 'tiny']);
        $userStudentPageObject = GetUserStudyPage($user, true);
        $userStudentPageObjectEditLink = get_edit_post_link($userStudentPageObject->ID);

        if ($theUser['userdata']['teacherid'] == $current_user_id) {

          $user_sha1d = sha1($user);
          $userGroup = $theUser['userdata']['studygroup'];

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
            $groupsData[$userGroup]['usersNames'][] = $theUser['userdata']['first_name'];
            $groupsData[$userGroup]['usersMeta'][$theUser['userdata']['first_name']] = $theUser['userdata'];
            $groupsData[$userGroup]['usersData'][$theUser['userdata']['first_name']] = $theUser;
          }
          ?>

          <?php if (!$userInGroup): ?>

          <ul id="user-<?php echo $user; ?>" class="user-list list-group list-group-horizontal">

            <li class="list-group-item col">

              <span class="me-3">
                <?php echo $userProfile; ?>
              </span>

              <span class="me-1 text-primary text-bold"><strong>
              <?php echo $theUser['userdata']['first_name']; ?>
              <?php echo $theUser['userdata']['last_name']; ?>
              </strong></span>

              <span class="badge bg-primary ms-1"><?php echo $theUser['userdata']['role'] ?></span>

            </li>

            <li class="list-group-item col p-1 d-flex justify-content-around">
              <a class="btn-tall btn-sm blue me-1 diary-opener" data-diarytype="user" <?php if($userGroup != ""): ?> data-diaryoptions='{"onlyPayments": true}' <?php endif; ?> data-userid="<?php echo $user; ?>" data-username="<?php echo $theUser['userdata']['first_name']; ?>">
                <i class="bi bi-card-list"></i>
                <span class="d-none d-lg-inline"><?php echo $gi18n['diary']; ?></span>
              </a>

              <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#page-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
                <i class="bi bi-journal-richtext"></i>
                <span class="d-none d-lg-inline"><?php echo $gi18n['homework']; ?></span>
              </a>

              <a class="btn-tall btn-sm blue ms-1" href="<?php echo $loaded_at . '?comment_history=1&user=' . $user ?>">
                <i class="bi bi-list-ul"></i>
                <span class="d-none d-lg-inline"><?php echo $gi18n['replies']; ?></span>
              </a>
              <a class="btn-tall btn-sm blue ms-1" data-bs-toggle="collapse" href="#controls-<?php echo $user_sha1d; ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $user_sha1d; ?>">
                <i class="bi bi-toggles"></i>
                <span class="d-none d-lg-inline"><?php echo $gi18n['controls']; ?></span>
              </a>

            </li>

          </ul>

          <?php endif; ?>

          <div class="collapse" id="controls-<?php echo $user_sha1d; ?>">

            <div id="form-<?php echo $user_sha1d; ?>" class="admin-forms dialog-box mb-3">

              <h4><?php echo $gi18n['group'] ?></h4>
              <div class="d-flex justify-content-between">

                <form class="d-flex w-100" action="<?php echo $site_api_url; ?>" method="GET">

                    <input class="flex-grow-1 me-3" placeholder="<?php echo $gi18n['group_tag'] ?>" type="text" name="assigntogroup">
                    <label>
                      <a class="btn-tall green" title="<?php echo $gi18n['add'] ?>" type="button" name="button"><i class="bi bi-plus-lg"></i></a>
                      <input class="d-none" type="submit" />
                    </label>
                    <input type="hidden" value="<?php echo $user ?>" name="user">
                    <input type="hidden" value="<?php echo $loaded_at ?>" name="redirect">

                </form>

              </div>

              <h4 class="mt-3"><?php echo $gi18n['meeting_link'] ?></h4>
              <div class="d-flex flex-column justify-content-between">

                <form class="d-flex w-100" action="<?php echo $site_api_url; ?>" method="GET">

                    <input class="flex-grow-1 me-3" placeholder="https://us04web.zoom.us..." type="text" name="meetinglink">
                    <label>
                      <a class="btn-tall green" title="<?php echo $gi18n['add'] ?>" type="button" name="button"><i class="bi bi-check-lg"></i></a>
                      <input class="d-none" type="submit" />
                    </label>
                    <input type="hidden" value="<?php echo $user ?>" name="user">
                    <input type="hidden" value="<?php echo $loaded_at ?>" name="redirect">

                </form>

                <p class="text-small mt-3"><?php echo $gi18n['current_link'] . ': '; ?> <a href="<?php echo $theUser['userdata']['user_meetinglink']; ?>"><?php echo $theUser['userdata']['user_meetinglink']; ?></a></p>

              </div>

              <h4 class="mt-3"><?php echo $gi18n['archive_student']; ?></h4>
              <div class="d-flex flex-column justify-content-between">

                <?php echo $gi18n['archive_student_explain']; ?>

                <a class="btn-tall blue align-self-baseline" href="<?php echo $site_api_url; ?>/?clearteacher=1&user=<?php echo $user; ?>&redirect=<?php echo $loaded_at; ?>"><?php echo $gi18n['archive_student']; ?></a>

              </div>

            </div>

          </div>

          <div class="collapse" id="page-<?php echo $user_sha1d; ?>"><div class="study-answers">

            <div class="dialog-box">

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
              <?php GetUserStudyPage_comments($user, false, true, '1 weeks ago', $loaded_at); ?>
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

            <span class="text-blue fw-bold">
              <?php echo implode(', ', $group['usersNames']); ?>
            </span>

            <span class="badge bg-primary ms-2">
              <?php echo $gi18n['group'] . ':'; ?>
              <span class="ms-1 text-white">
                <strong><?php echo $group['name']; ?></strong>
              </span>
            </span>

          </li>

          <li class="list-group-item col p-1 d-flex justify-content-around">
            <a class="btn-tall btn-sm blue me-1 diary-opener" data-diarytype="group" data-userid="<?php echo $current_user_id; ?>" data-grouptag="<?php echo $group['name']; ?>">
              <i class="bi bi-card-list"></i>
              <span class="d-none d-lg-inline"><?php echo $gi18n['diary']; ?></span>
            </a>
            <a class="btn-tall btn-sm blue" data-bs-toggle="collapse" href="#page-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
              <i class="bi bi-journal-richtext"></i>
              <span class="d-none d-lg-inline"><?php echo $gi18n['homework']; ?></span>
            </a>
            <a class="btn-tall btn-sm blue ms-1" href="<?php echo $loaded_at . '?comment_history=1&user=' . $group['users'][0] ?>">
              <i class="bi bi-list-ul"></i>
              <span class="d-none d-lg-inline"><?php echo $gi18n['replies']; ?></span>
            </a>
            <a class="btn-tall btn-sm blue ms-1" data-bs-toggle="collapse" href="#controls-<?php echo $group['name'] ?>" role="button" aria-expanded="false" aria-controls="collapse-<?php echo $group['name'] ?>">
              <i class="bi bi-toggles"></i>
              <span class="d-none d-lg-inline"><?php echo $gi18n['controls']; ?></span>
            </a>
          </li>

        </ul>


        <div class="collapse" id="controls-<?php echo $group['name']; ?>">

          <div id="form-<?php echo $group['name']; ?>" class="admin-forms dialog-box my-3">

            <h4><?php echo $gi18n['meeting_link'] ?></h4>
            <div class="d-flex justify-content-between">
              <form class="d-flex w-100" action="<?php echo $site_api_url; ?>" method="GET">

                  <input class="flex-grow-1 me-3" placeholder="https://us04web.zoom.us..." type="text" name="meetinglink">
                  <label>
                    <a class="btn-tall green" title="<?php echo $gi18n['add'] ?>" type="button" name="button"><i class="bi bi-check-lg"></i></a>
                    <input class="d-none" type="submit" />
                  </label>
                  <input type="hidden" value="<?php echo json_encode($group['users']) ?>" name="user">
                  <input type="hidden" value="<?php echo $loaded_at ?>" name="redirect">

              </form>
            </div>

            <?php $group_link = $group['usersMeta'][$group['usersNames'][0]]['user_meetinglink']; ?>

            <p class="text-small mt-3"><?php echo $gi18n['current_link'] . ': '; ?> <a href="<?php echo $group_link; ?>"><?php echo $group_link; ?></a></p>

            <h4><?php echo $gi18n['remove_from_group'] ?></h4>

            <div class="d-flex my-3">
              <?php foreach ($group['usersNames'] as $user) {
              $user_id = $group['usersData'][$user]->ID;
              ?>
              <form action="<?php echo $site_api_url; ?>" method="GET">

                  <label>
                    <a class="btn-tall btn-sm red me-3" title="<?php echo $gi18n['remove_from_group'] ?>" type="button" name="button">
                      <i class="bi bi-dash-lg me-1"></i>
                      <span><?php echo $user ?></span>
                    </a>
                    <input class="d-none" type="submit" />
                  </label>
                  <input type="hidden" value="<?php echo $loaded_at ?>" name="redirect">
                  <input type="hidden" value="<?php echo $user_id; ?>" name="user">
                  <input type="hidden" value="1" name="cleargroup">

              </form>
              <?php } ?>
            </div>

            <h4><?php echo $gi18n['payments'] ?></h4>

            <div class="d-flex my-3">
              <?php foreach ($group['usersNames'] as $user) {
              $user_id = $group['usersData'][$user]->ID;
              ?>
              <a class="btn-tall btn-sm blue me-3 diary-opener" data-diarytype="user" data-diaryoptions='{"onlyPayments": true}' data-userid="<?php echo $user_id; ?>" data-username="<?php echo $user; ?>">
                <i class="bi bi-card-list"></i>
                <span><?php echo $gi18n['diary'] . ' ' . $user; ?></span>
              </a>
              <?php } ?>
            </div>

          </div>

        </div>

        <div class="collapse" id="page-<?php echo $group['name']; ?>"><div class="study-answers">

          <div class="dialog-box">

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
            <?php GetUserStudyPage_comments($group['users'][0], false, true, '1 weeks ago', $loaded_at); ?>
          </div></div>

        </div>

      </div>

      <?php } // end group foreach loop ?>

      <div class="dialog-box mt-3">
        <h3><?php echo $gi18n['your_code']; ?>:</h3>

        <span class="d-flex my-3">
          <input id="your-code" type="number" readonly value="<?php echo $userTeacherCode; ?>" class="text-black border-0 bg-transparent no-focus" />
          <button id="copy-code" class="btn-tall btn-sm green" type="button" name="button"><i class="bi bi-clipboard"></i></button>
        </span>

        <p><?php echo $gi18n['your_code_explain']; ?></p>
      </div>

      <p class="text-center text-grey-darker text-small py-5 m-0"><?php echo $gi18n['guyra_thanks_you']; ?></p>

      <?php }

    ?>

  </div>

</main>
<?php
get_footer(null, ['react' => true, 'js' => 'schools.js']);
