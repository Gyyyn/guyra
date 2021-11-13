<?php

include $template_dir . '/Guyra_misc.php';

global $current_user_meta;
global $current_user_data;
global $gi18n;

if ($is_logged_in):
$userMeta = $current_user_data;

$user_diary = guyra_get_user_meta($current_user_id, 'diary', true)['meta_value'];
$userMeta['user_rank'] = GetUserRanking($current_user_id);
$userMeta['user_diary'] = json_decode($user_diary);
$userMeta['is_logged_in'] = true;

else:
$userMeta['is_logged_in'] = false;
endif;

get_header(null, ['css' => 'account.css']);
?>

<div id="account-container"></div>

<script type="text/javascript">
  var usermeta = <?php echo json_encode($userMeta); ?>;
  var i18n = <?php echo json_encode($gi18n); ?>;
</script>

<?php
get_footer(null, ['react' => true, 'js' => 'account.js']);
