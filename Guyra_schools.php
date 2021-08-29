<?php
/**
 * Teacher's admin panel
 *
 * @package guyra
 */


/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

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
  <h1 class="mb-3 text-blue">Welcome,' . $thisUser['first_name'][0] . '</h1>
  <h2 class="mb-3 text-purple">to the admin panel.</h2>

  <hr />

  <div class="dialog info mb-5">

    <p>Esse painel mostra as principais funções que você precisa para administrar seus alunos e grupos de alunos.</p>

    <p>Para acessar a página de <i>homework</i> de algum aluno clique na segunda coluna da lista. Se o aluno estiver atualmente em algum grupo você será levado a página daquele grupo.</p>

  </div>
  </div>'; ?>

  <div data-aos="fade-right" data-aos-delay="100">

    <h3>Ações</h3>

    <div class="admin-forms dialog mb-5">

      <h4>Assign to group:</h4>
      <form action="<?php echo get_site_url(); ?>" method="GET">

        <div class="d-flex justify-content-between">

          <span>User ID: <input type="text" name="user"></span>
          <span>Group tag: <input type="text" name="assigntogroup"></span>
          <span><input type="submit" value="Go" /></span>

        </div>

      </form>

    </div>

  </div>

  <div data-aos="fade-right" data-aos-delay="200">

  <h3>Seus alunos</h3>

  <?php
  foreach ($users as $x) {

    $userdata = get_user_meta($x->ID);

    if ($userdata['teacherid'][0] == get_current_user_id()) {
      echo '<ul class="list-group list-group-horizontal mb-1">' .

      '<li class="list-group-item col-1">' .
        '<span class="text-muted">ID: </span>' . $x->ID .
      '</li>' .

      '<a class="list-group-item col" href="' . $page_link . '">' .
          $userdata['first_name'][0] . ' ' .
          $userdata['last_name'][0] .
          $x->user_email .
        '<span class="badge bg-secondary ms-1">' . $userdata['role'][0] . '</span> ' .
      '</a>' .

      '<li class="list-group-item col">' .
        '<span class="text-muted text-end">' .
          'Group: <span class="badge bg-secondary">' . $userdata['studygroup'][0] . '</span>' .
        '</span> ' .
      '</li>' .

      '<li class="list-group-item col">' .
        '<a href="' . get_site_url() . '/?short_load=1&cleargroup=1&user=' . $x->ID . '">Clear Group</a>' .
      '</li>' .

      '</ul>';
    }
  }

  echo '</div>';

  echo '<hr />';
  echo '<p class="text-center text-muted text-small">Obrigado por escolher a Guyrá ❤️</p>';

else : // wp_redirect ain't working here ?>
<script>setTimeout(function(){ window.location.href = "<?php echo $gi18n['schools_footer_link']; ?>"; }, 0);</script>
<?php endif;
