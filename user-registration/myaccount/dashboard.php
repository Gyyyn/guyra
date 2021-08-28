<?php
/**
 * My Account Dashboard
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

$user_id = get_current_user_id();
$user_info = get_userdata($user_id);

$user_subscription = get_user_meta($user_id, 'subscription', true);
$user_subscription_activesince = get_user_meta($user_id, 'subscription-active-since', true);

$first_name = get_user_meta( $user_id, 'first_name', true );
if (empty($first_name)) {
	$first_name = $user_info->name;
}

$gravatar_image = get_avatar_url( $user_id, $args = null );
$profile_picture_url = get_user_meta( $user_id, 'user_registration_profile_pic_url', true );
$image = ( ! empty( $profile_picture_url ) ) ? $profile_picture_url : $gravatar_image;

?>

<div class="text-small position-relative">

	<div class="row align-items-center mb-3">

		<div class="col">
			<h3><?php echo "Welcome, ", $first_name, "!";?></h3>
			<p><?php echo $gi18n['accountpage_registeredsince'] . ' ' . date_format(date_create($user_info->user_registered),"d/m/Y"); ?>
			<?php if($user_subscription == 'premium') {?><span><?php echo $gi18n['accountpage_subscriptionsince'] . ' ' . date_format(date_create($user_subscription_activesince),"d/m/Y"); ?>!</span><?php } ?>
			</p>
		</div>

		<div class="col d-flex flex-column align-items-center">
			<?php if( 'no' === get_option( 'user_registration_disable_profile_picture', 'no' ) ) { ?>
					<img class="avatar page-icon" alt="Foto de perfil" src="<?php echo $image; ?>">
			<?php } ?>
			<?php if($user_subscription == 'premium') {?><span class="premium-badge bg-secondary text-white text-uppercase mt-3"><?php echo $gi18n['pricesfeature_titlepro'];?></span><?php } ?>
		</div>

	</div>

	<div class="row align-items-center">

		<div class="col">
			<h2><?php echo $gi18n['level']?></h2>
			<p><?php echo $gi18n['level_explain']?></p>
			<a href="<?php echo $gi18n['practice_link']?>"><?php echo $gi18n['practice_more']?></a>
		</div>

		<div class="col">
			<h2><?php echo $gi18n['ranking']?></h2>
			<div class="text-center">
				<img class="page-icon" alt="bronze 1" src="<?php echo $gi18n['template_link'] . '/assets/icons/exercises/ranks/bronze-1.png'; ?>">
				<h3>Bronze 1</h3>
			</div>
			<p><?php echo $gi18n['ranking_explain']?></p>
		</div>

	</div>

	<?php if($user_subscription == '') {?><div class="profile-subscriptions pt-3">
			<a class="w-100 p-3 btn btn-primary gradient-button fs-2" data-bs-toggle="collapse" href="#collapse-prices" role="button" aria-expanded="false" aria-controls="collapse-prices"><?php echo $gi18n['subscribe'];?></a>
	</div>

	<div class="collapse hide" id="collapse-prices">
		<style>
			.col.prices.business {
				display: none;
			}

			.col.prices:nth-child(1) .card:hover { animation: unset; left: 0; }
			.col.prices:nth-child(3) .card:hover { animation: unset; right: 0; }

			.col.prices.primary {
				order: -1;
				margin-bottom: 3rem;
			}
		</style>
		<?php include get_template_directory() . '/Guyra_purchase.php'; ?>
	</div>

	<?php } //no subscription ?>
</div>

<?php
	/**
	 * My Account dashboard.
	 *
	 * @since 2.6.0
	 */
	do_action( 'user_registration_account_dashboard' );

/* Omit closing PHP tag at the end of PHP files to avoid "headers already sent" issues. */
