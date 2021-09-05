<?php
/**
 * Lost password reset form.
 *
 * This template can be overridden by copying it to yourtheme/user-registration/myaccount/form-reset-password.php.
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

<form method="post" class="form-control" data-enable-strength-password="<?php echo $enable_strong_password; ?>" data-minimum-password-strength="<?php echo $minimum_password_strength; ?>">
		<div class="ur-form-row">
			<div class="ur-form-grid">
				<h2><?php echo $gi18n['reset_password']; ?></h2>

				<p class="user-registration-form-row user-registration-form-row--wide form-row form-row-wide hide_show_password">
					<label for="password_1"><?php echo $gi18n['new_password']; ?> <span class="required">*</span></label>
					<span class="password-input-group">
					<input type="password" name="password_1" id="password_1" />
					<?php
						if ( 'yes' === get_option( 'user_registration_login_option_hide_show_password', 'no' ) ) {
							echo '<a href="javaScript:void(0)" class="password_preview dashicons dashicons-hidden" title="' . esc_attr__( 'Show Password', 'user-registration' ) . '"></a>';
						}
					?>
					</span>
				</p>
				<p class="user-registration-form-row user-registration-form-row--wide form-row form-row-wide hide_show_password">
					<label for="password_2"><?php echo $gi18n['new_password_again']; ?> <span class="required">*</span></label>
					<span class="password-input-group">
					<input type="password" name="password_2" id="password_2" />
					<?php
						if ( 'yes' === get_option( 'user_registration_login_option_hide_show_password', 'no' ) ) {
							echo '<a href="javaScript:void(0)" class="password_preview dashicons dashicons-hidden" title="' . esc_attr__( 'Show Password', 'user-registration' ) . '"></a>';
						}
					?>
					</span>
				</p>

				<input type="hidden" name="reset_key" value="<?php echo esc_attr( $args['key'] ); ?>" />
				<input type="hidden" name="reset_login" value="<?php echo esc_attr( $args['login'] ); ?>" />

				<?php do_action( 'user_registration_resetpassword_form' ); ?>

				<p class="user-registration-form-row form-row">
					<input type="hidden" name="ur_reset_password" value="true" />
					<input type="submit" class="btn-tall blue" value="<?php echo $gi18n['save']; ?>" />
				</p>

				<?php wp_nonce_field( 'reset_password' ); ?>
			</div>
		</div>
	</form>
</div>
