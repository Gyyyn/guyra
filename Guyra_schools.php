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
$thisUser = get_user_meta(get_current_user_id());
$users = get_users();

// Sorts the list into date registered
function cmp($a, $b) {
  if ($a->ID == $b->ID) {
      return 0;
  }
  return ($a->ID < $b->ID) ? -1 : 1;
}

usort($users, "cmp");

if ($thisUser['role'][0] == "teacher" || current_user_can('manage_options')) :

  echo '<div data-aos="fade-right">
  <h1 class="mb-3 text-blue">Welcome, ' . $thisUser['first_name'][0] . '</h1>
  <h2 class="mb-3 text-purple">to your student panel.</h2>

  <hr />

  <div class="dialog info mb-5">

    <p>Esse painel mostra as principais funções que você precisa para administrar seus alunos e grupos de alunos.</p>

    <p>Para acessar a página de <i>homework</i> de algum aluno clique na segunda coluna da lista. Se o aluno estiver atualmente em algum grupo você será levado a página daquele grupo.</p>

  </div>
  </div>'; ?>

  <div data-aos="fade-right" data-aos-delay="100">

    <h3>Ações</h3>

    <div id="form" class="admin-forms dialog mb-5">

      <h4>Assign to group:</h4>
      <form action="<?php echo get_site_url(); ?>" method="GET">

        <div class="d-flex justify-content-between">

          <span>ID do Aluno: <input class="user-id" type="text" name="user"></span>
          <span>Nome do grupo: <input type="text" name="assigntogroup"></span>
          <span><input type="submit" value="Go" /></span>
          <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">

        </div>

      </form>

    </div>

    <div id="form" class="admin-forms dialog mb-5">

      <h4>Clear group:</h4>
      <form action="<?php echo get_site_url(); ?>" method="GET">

        <div class="d-flex justify-content-between">

          <span>ID do Aluno: <input class="user-id" type="text" name="user"></span>
          <span><input type="submit" value="Go" /></span>
          <input type="hidden" value="<?php echo $gi18n['schools_link'] ?>" name="redirect">
          <input type="hidden" value="1" name="cleargroup">

        </div>

      </form>

    </div>

  </div>

  <div data-aos="fade-right" data-aos-delay="200">

  <h3>Seus alunos</h3>

  <?php
  foreach ($users as $x) {

    $user = $x->ID;
    $userdata = get_user_meta($user);
    $user_sha1d = sha1($user);

    if($userdata['studygroup'][0] != "") {
      $page_link = get_site_url() . '/' . sha1($userdata['studygroup'][0]);
    } else {
      $page_link = get_site_url() . '/' . $user_sha1d;
    }

    if ($userdata['teacherid'][0] == get_current_user_id()) {
      echo '<ul id="user-' . $user .'" class="user-list list-group list-group-horizontal mb-1">' .

      '<li class="list-group-item col-1">' .
        '<span class="text-muted me-1 d-none d-md-block">ID:</span><a href="#form" class="id-selector btn btn-sm btn-primary">' . $user . '</a>' .
      '</li>' .

      '<a class="list-group-item col" href="' . $page_link . '">' .
          '<i class="me-1">' .
            $userdata['first_name'][0] . ' ' .
            $userdata['last_name'][0] .
          '</i>' .
          '<span class="text-muted text-end">' .
            $x->user_email .
          '</span> ' .
        '<span class="badge bg-secondary ms-1">' . $userdata['role'][0] . '</span> ' .
      '</a>' .

      '<li class="list-group-item col d-none d-md-block">' .
        '<span class="text-muted text-end">' .
          'Group: <span class="badge bg-secondary">' . $userdata['studygroup'][0] . '</span>' .
        '</span> ' .
      '</li>' .

      '<li class="list-group-item col">' .
        '<a class="btn btn-sm btn-primary" data-bs-toggle="collapse" href="#collapse-' . $user_sha1d . '" role="button" aria-expanded="false" aria-controls="collapse-' . $user_sha1d . '">Student\'s Page</a>' .
      '</li>' .

      '</ul>';

      ?>
      <div class="collapse page-squeeze" id="collapse-<?php echo $user_sha1d; ?>"><div class="study-answers">

        <div class="dialog">
          <?php GetUserStudyPage($user); ?>
        </div>

        <?php GetUserStudyPage_comments($user, false); ?>

      </div></div>
      <?php
    }
  }

  echo '</div>';

  echo '<hr />';
  echo '<p class="text-center text-muted text-small mb-0">Obrigado por escolher a Guyrá ❤️</p>';

  ?>
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

else : // wp_redirect ain't working here ?>
<script>setTimeout(function(){ window.location.href = "<?php echo $gi18n['schools_footer_link']; ?>"; }, 0);</script>
<?php endif;
