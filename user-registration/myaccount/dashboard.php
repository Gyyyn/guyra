<?php
/**
 * My Account Dashboard
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

include get_template_directory() . '/Guyra_misc.php';

$user_id = get_current_user_id();
$user_info = get_userdata($user_id);
$user_rank = GetUserRanking($user_id);

$user_subscription = get_user_meta($user_id, 'subscription', true);
$user_subscription_activesince = get_user_meta($user_id, 'subscription-active-since', true);

$first_name = get_user_meta( $user_id, 'first_name', true );
$last_name = get_user_meta( $user_id, 'last_name', true );
if (empty($first_name)) {
	$first_name = $user_info->name;
}

$gravatar_image = get_avatar_url( $user_id, $args = null );
$profile_picture_url = get_user_meta( $user_id, 'user_registration_profile_pic_url', true );
$image = ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : $gravatar_image;

?>

<div class="profile position-relative">

	<div class="icon-title mb-3 d-flex justify-content-between align-items-center">

		<div>
			<h2 class="text-blue"><?php echo "Welcome, ", $first_name, "!";?></h2>
			<p><?php echo $gi18n['accountpage_registeredsince'] . ' ' . date_format(date_create($user_info->user_registered),"d/m/Y"); ?>
			<?php if($user_subscription == 'premium') {?><span><?php echo $gi18n['accountpage_subscriptionsince'] . ' ' . date_format(date_create($user_subscription_activesince),"d/m/Y"); ?>!</span><?php } ?>
			</p>
			<?php if($user_subscription == '') { ?>
				<p><?php /* echo $gi18n['no_subscription_found']  */?></p>
				<?php /* <a class="btn-tall blue mb-3" href="<?php echo $gi18n['purchase_link']?>"><?php echo $gi18n['subscribe'];?></a> */?>
			<?php } //no subscription ?>

			<div class="buttons my-5">

				<a href="<?php echo $gi18n['home_link']?>" class="btn-tall blue"><?php echo $gi18n['button_studypage']; ?></a>
				<a href="<?php echo $gi18n['courses_link']?>" class="btn-tall"><?php echo $gi18n['button_coursespage']; ?></a>
				<a href="<?php echo $gi18n['practice_link']?>" class="btn-tall"><?php echo $gi18n['practice']; ?></a>

			</div>

		</div>

		<span class="page-icon"><img alt="learning" src="<?php echo get_template_directory_uri(); ?>/assets/icons/profile.png"></span>

	</div>

	<div class="row my-3">

		<div class="col-md card py-5 mx-0 mb-5 flex-column align-items-center">
			<?php if( 'no' === get_option( 'user_registration_disable_profile_picture', 'no' ) ) { ?>
					<img class="avatar page-icon medium border-outline mb-5" alt="Foto de perfil" src="<?php echo $image; ?>">
			<?php } ?>
			<h3 class="text-white"><?php echo $first_name . ' ' . $last_name; ?></h3>
			<?php if($user_subscription == 'premium') {?><span class="premium-badge bg-secondary text-white text-small text-uppercase rounded mt-1">🎉✨<?php echo $gi18n['pricesfeature_titlepro'];?>✨🌟</span><?php } ?>
		</div>

		<div class="col-md">

			<div class="mb-5">
				<h3 class="text-blue"><?php echo $gi18n['payment_method'] ?></h3>
				<div class="row bg-grey more-rounded p-3 mx-0 mb-3">

					<div class="col-4">
						<img class="page-icon" alt="QR Code" src="<?php echo $gi18n['template_link'] ?>/assets/img/qrcode.jpg">
					</div>

					<div class="col">
						<p><?php echo $gi18n['payment_message'] ?></p>
						<p class="badge text-normal bg-primary text-white"><?php echo $gi18n['company_cnpj'] ?></p>
					</div>

				</div>
				<?php /* <a href="<?php echo $gi18n['purchase_link']?>" class="btn-tall mt-3"><?php echo $gi18n['change_payment_method']; ?></a> */ ?>
			</div>

			<div class="mb-5 text-small">

				<h3 class="text-blue"><?php echo $gi18n['teacher_code'] ?></h3>
				<p><?php echo $gi18n['teacher_code_explain'] ?></p>
				<form class="form-control" action="<?php echo $site_url; ?>" method="GET">

						<div class="d-flex flex-row">
							<input type="text" class="flex-grow-1 me-3" name="teacher_code">
							<input type="submit" class="btn-tall green w-25" value="<?php echo $gi18n['apply']; ?>">
						</div>

						<input type="hidden" value="<?php echo $gi18n['account_link']; ?>" name="redirect">
						<input type="hidden" value="<?php echo $user_id; ?>" name="user">

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
