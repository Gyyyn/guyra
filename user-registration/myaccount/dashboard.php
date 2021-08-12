<?php
/**
 * My Account Dashboard
 *
 * Shows the first intro screen on the account dashboard.
 *
 * This template can be overridden by copying it to yourtheme/user-registration/myaccount/dashboard.php.
 *
 * HOWEVER, on occasion UserRegistration will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.wpeverest.com/user-registration/template-structure/
 * @author  WPEverest
 * @package UserRegistration/Templates
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

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

<div class="user-registration-profile-header position-relative">

	<span class="page-icon position-absolute end-0" style="top: -5rem;"><img src="<?php echo get_template_directory_uri(); ?>/assets/icons/profile.png"></span>

	<div class="d-flex flex-column align-items-center">
		<?php if( 'no' === get_option( 'user_registration_disable_profile_picture', 'no' ) ) { ?>
				<img class="ur-profile-picture me-3" alt="profile-picture" src="<?php echo $image; ?>">
		<?php } ?>

		<div class="py-3">

			<h2 class="ur-profile-welcome m-0 d-flex">

				<?php echo "Welcome, ", $first_name, "!";
				if($user_subscription == 'premium') {?><span class="premium-badge bg-secondary text-white text-uppercase ms-3"><?php echo $gi18n['pricesfeature_titlepro'];?></span><?php } ?>

			</h2>

			<p><?php echo $gi18n['accountpage_registeredsince'] . ' ' . date_format(date_create($user_info->user_registered),"d/m/Y"); ?>
			<?php if($user_subscription == 'premium') {?><span><?php echo $gi18n['accountpage_subscriptionsince'] . ' ' . date_format(date_create($user_subscription_activesince),"d/m/Y"); ?>!</span><?php } ?>
			</p>

		</div>

	</div>

	<div class="d-flex align-items-center">

		<div class="px-3">

		</div>

		<div class="px-3">

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
