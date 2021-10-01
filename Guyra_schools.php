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

if ($thisUser['role'][0] == "teacher" || current_user_can('manage_options')) :

  echo '<div class="my-5" data-aos="fade-right" data-aos-once="true">
  <h1 class="mb-3 text-blue">Welcome, ' . $thisUser['first_name'][0] . '</h1>
  <h2 class="mb-3 text-purple">to your student panel.</h2>
  </div>'; ?>

  <div data-aos="fade-right" data-aos-delay="200" data-aos-once="true">

  <?php

  $groups = [];
  $groupsData = [];

  echo '<h4>' . $gi18n['your_students'] . '</h4>';

  foreach ($users as $x) {

    $user = $x->ID;
    $userdata = get_user_meta($user);
    $userTeacher = $userdata['teacherid'][0];

    if ($userTeacher == $thisUserId) {

      $user_sha1d = sha1($user);
      $userGroup = $userdata['studygroup'][0];

      if($userGroup != "") {
        $page_link = $site_url . '/' . sha1($userGroup . $userTeacher);

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

      } else {
        $page_link = $site_url . '/' . $user_sha1d;
      }

      echo '<ul id="user-' . $user .'" class="user-list list-group list-group-horizontal mb-1">' .

      '<a class="list-group-item col-6" href="' . $page_link . '">' .
          '<span class="me-1 text-primary text-bold"><strong>' .
            $userdata['first_name'][0] . ' ' .
            $userdata['last_name'][0] .
          '</strong></span>' .
          '<i class="text-muted text-end d-none d-md-block">' .
            $x->user_email .
          '</i> ' .
        '<span class="badge bg-secondary ms-1">' . $userdata['role'][0] . '</span> ' .
      '</a>' .

      '<li class="list-group-item col-2 d-none d-md-block">' .
        '<span class="text-muted text-end">' .
          $gi18n['group'] . ': <span class="badge bg-secondary">' . $userdata['studygroup'][0] . '</span>' .
        '</span> ' .
      '</li>' .

      '<li class="list-group-item col d-flex justify-content-around">' .
        '<a class="btn btn-sm btn-primary" data-bs-toggle="collapse" href="#page-' . $user_sha1d . '" role="button" aria-expanded="false" aria-controls="collapse-' . $user_sha1d . '">Homework</a>' .
        '<a class="btn btn-sm btn-primary ms-1" data-bs-toggle="collapse" href="#controls-' . $user_sha1d . '" role="button" aria-expanded="false" aria-controls="collapse-' . $user_sha1d . '">Controles</a>' .
      '</li>' .

      '</ul>';

      ?>

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
          <?php GetUserStudyPage($user); ?>
        </div>

        <div class="page-squeeze m-0"><div class="study-answers">
          <?php GetUserStudyPage_comments($user, false); ?>
        </div></div>

      </div></div>
      <?php
    } // end if user is assigned to this teacher

  } // end foreach loop

  echo '<h4 class="mt-3">' . $gi18n['groups'] . '</h4>';

  foreach ($groups as $current_group) {

    $group = $groupsData[$current_group];

    echo '<ul id="group-' . $group['name'] .'" class="user-list list-group list-group-horizontal mb-1">' .

    '<a class="list-group-item col-6" href="' . $group['link'] . '">' .
      $gi18n['group'] . ':' .
      '<span class="ms-1 text-primary text-bold"><strong>' .
        $group['name'] .
      '</strong></span>' .
    '</a>' .

    '<li class="list-group-item col d-flex justify-content-around">' .
      '<a class="btn btn-sm btn-primary" data-bs-toggle="collapse" href="#controls-' . $group['name'] . '" role="button" aria-expanded="false" aria-controls="collapse-' . $group['name'] . '">Controles</a>' .
    '</li>' .

    '</ul>';

    ?>

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

    <?php

  }

  echo '</div>';

  echo '<div class="dialog info my-5">' . $gi18n['schools_header_warning'] . '</div>';
  echo '<p class="text-center text-muted text-small mb-0">' . $gi18n['guyra_thanks_you'] . '</p>';

else : // wp_redirect ain't working here ?>
<script>setTimeout(function(){ window.location.href = "<?php echo $gi18n['schools_footer_link']; ?>"; }, 0);</script>
<?php endif;
