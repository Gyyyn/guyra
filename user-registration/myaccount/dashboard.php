<?php
/**
 * My Account Dashboard
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $template_dir;
global $template_url;
global $current_user_id;

/* Set up translations independent of Wordpress */
include $template_dir . '/i18n.php';
include $template_dir . '/Guyra_misc.php';

$user_info = get_userdata($current_user_id);
$user_rank = GetUserRanking($current_user_id);
$user_payment_method = guyra_get_user_meta($current_user_id, 'payment_method', true)['meta_value'];
$user_subscription = guyra_get_user_meta($current_user_id, 'subscription', true)['meta_value'];
$user_subscription_activesince = guyra_get_user_meta($current_user_id, 'subscribed_since', true)['meta_value'];

$first_name = get_user_meta( $current_user_id, 'first_name', true );
$last_name = get_user_meta( $current_user_id, 'last_name', true );
if (empty($first_name)) {
	$first_name = $user_info->name;
}

$gravatar_image = get_avatar_url( $current_user_id, $args = null );
$profile_picture_url = get_user_meta( $current_user_id, 'user_registration_profile_pic_url', true );
$image = ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : $gravatar_image;

$user_subscription = false;
$user_payment_method = false;

?>

<div class="profile position-relative">

	<div class="icon-title mb-3 d-flex justify-content-between align-items-center">

		<div class="welcome">

			<h2 class="text-blue"><?php echo "Welcome, ", $first_name, "!";?></h2>

			<p><?php echo $gi18n['accountpage_registeredsince'] . ' ' . date_format(date_create($user_info->user_registered),"d/m/Y"); ?>

			<?php if($user_subscription == 'premium'): ?>
			<span><?php echo $gi18n['accountpage_subscriptionsince'] . ' ' . date_format(date_create($user_subscription_activesince),"d/m/Y"); ?>!</span>
			<?php endif; ?>

			</p>

			<?php if($user_subscription === ''): ?>
				<p><?php echo $gi18n['no_subscription_found']; ?></p>
				<a class="btn-tall blue mb-3" href="<?php echo $gi18n['purchase_link']; ?>"><?php echo $gi18n['subscribe']; ?></a>
			<?php endif; ?>

		</div>

		<span class="page-icon"><img alt="learning" src="<?php echo $gi18n['template_link']; ?>/assets/icons/profile.png"></span>

	</div>

	<div class="row buttons justify-content-between my-5">

		<div class="col-sm d-flex flex-column flex-sm-row align-items-center justify-content-center">

			<a href="<?php echo $gi18n['home_link']?>" class="btn-tall blue me-2 mb-2"><?php echo $gi18n['button_studypage']; ?></a>
			<a href="<?php echo $gi18n['courses_link']?>" class="btn-tall me-2 mb-2"><?php echo $gi18n['button_coursespage']; ?></a>
			<a href="<?php echo $gi18n['practice_link']?>" class="btn-tall me-2 mb-2"><?php echo $gi18n['practice']; ?></a>
			<a href="<?php echo wp_nonce_url($gi18n['logout_link'], 'user-logout'); ?>" class="btn-tall red me-2 mb-2 d-inline d-sm-none"><?php echo $gi18n['logout'] ?></a>

		</div>

	</div>

	<div class="row my-3 overflow-x-visible">

		<div class="col-md card py-5 mx-0 mb-5 flex-column align-items-center">

			<span class="position-relative">

				<img class="avatar page-icon medium border-outline mb-5" alt="Foto de perfil" src="<?php echo $image; ?>">

				<span class="position-absolute translate-middle-y bottom-0 end-0">
					<a href="<?php echo $gi18n['profile_link']?>" class="btn-tall btn-sm purple">
						<i class="bi bi-pencil-square"></i>
					</a>
				</span>

			</span>

			<span class="position-relative">
				<h3 class="text-white"><?php echo $first_name . ' ' . $last_name; ?></h3>
			</span>

			<?php if($user_subscription == 'premium'): ?>
			<span class="premium-badge bg-secondary text-white text-small text-uppercase rounded mt-1">🎉✨<?php echo $gi18n['pricesfeature_titlepro']; ?>✨🌟</span>
			<?php endif; ?>
		</div>

		<div class="col-md d-flex flex-column align-items-center">

			<?php if($user_payment_method): ?>

			<div class="mb-5">

				<h3 class="text-blue"><?php echo $gi18n['payment_method'] ?></h3>
				<div class="row bg-grey more-rounded p-3 mx-0 mb-3">

					<div class="col-4">
						<img class="page-icon" alt="QR Code" src="<?php echo $gi18n['template_link'] ?>/assets/img/qrcode.jpg">
					</div>

					<div class="col-8 text-small d-flex flex-column align-items-start">
						<p><?php echo $gi18n['payment_message'] . ":" . $user_payment_method; ?></p>
						<p class="badge bg-primary text-white"><?php echo $gi18n['company_cnpj'] ?></p>
						<a href="<?php echo $gi18n['purchase_link']?>" class="btn-tall btn-sm blue mt-1">
							<?php echo $gi18n['change_payment_method']; ?>
						</a>
					</div>

				</div>

			</div>

		<?php endif; ?>

			<div class="mb-5 text-small w-100">

				<h3 class="text-blue"><?php echo $gi18n['teacher_code'] ?></h3>
				<p><?php echo $gi18n['teacher_code_explain'] ?></p>
				<form class="form-control" action="<?php echo $site_url; ?>" method="GET">

						<div class="d-flex flex-row">
							<input type="text" class="flex-grow-1 me-3" name="teacher_code">
							<input type="submit" class="btn-tall green w-25" value="<?php echo $gi18n['apply']; ?>">
						</div>

						<input type="hidden" value="<?php echo $gi18n['account_link']; ?>" name="redirect">
						<input type="hidden" value="<?php echo $current_user_id; ?>" name="user">

				</form>

			</div>

		</div>

	</div>

	<div class="row my-3 text-small">

	<?php if ($user_rank): ?>

		<div class="col-md">
			<h2 class="text-blue"><?php echo $gi18n['level'] ?><?php echo $user_rank[3]; ?></h2>
			<p><?php echo $gi18n['level_explain']?></p>
			<p><a href="<?php echo $gi18n['practice_link']?>"><?php echo $gi18n['practice_more']?></a> | <a href="<?php echo $gi18n['level_question_link']?>"><?php echo $gi18n['level_question']?></a></p>
		</div>

		<div class="col-md">
			<h2 class="text-blue"><?php echo $gi18n['ranking']?></h2>
			<div class="text-center">
				<img class="page-icon avatar bg-grey p-2" alt="<?php echo $user_rank[1]; ?>" src="<?php echo $gi18n['template_link'] . '/assets/icons/exercises/ranks/'. $user_rank[1] . '.png'; ?>">
				<h3 class="bg-primary text-white text-uppercase rounded mt-3"><?php echo $user_rank[2]; ?></h3>
			</div>
			<p><?php echo $gi18n['ranking_explain']?></p>
			<a href="<?php echo $gi18n['ranking_question_link']?>"><?php echo $gi18n['ranking_question']?></a>
		</div>

	<?php endif; ?>

	</div>

</div>

<?php
	/**
	 * My Account dashboard.
	 *
	 * @since 2.6.0
	 */
	do_action( 'user_registration_account_dashboard' );

/* Omit closing PHP tag at the end of PHP files to avoid "headers already sent" issues. */
