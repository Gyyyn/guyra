<?php
/**
 * Lost password form
 *
 * This template can be overridden by copying it to yourtheme/user-registration/myaccount/form-lost-password.php.
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
	exit; // Exit if accessed directly.
}

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';

?>

<div class="rounded-box-padded" id="ur-frontend-form">

	<?php ur_print_notices(); ?>

	<form method="post" class="form-control">
		<div class="ur-form-row">
			<div class="ur-form-grid">
				<h2><?php echo $gi18n['forgot_password'] ?></h2>
				<p><?php echo $gi18n['forgot_password_message'] ?></p>
				<p>
					<label for="user_login"><?php echo $gi18n['email'] ?></label>
					<input type="text" name="user_login" id="user_login" />
				</p>

				<?php do_action( 'user_registration_lostpassword_form' ); ?>

				<p class="user-registration-form-row form-row">
					<input type="hidden" name="ur_reset_password" value="true" />
					<input type="submit" class="btn-tall blue" value="<?php echo $gi18n['button_send_email'] ?>" />
				</p>

				<?php wp_nonce_field( 'lost_password' ); ?>
			</div>
		</div>
	</form>
</div>
