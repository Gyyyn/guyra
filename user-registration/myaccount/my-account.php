<?php
/**
 * My Account page
 *
 * This template can be overridden by copying it to yourtheme/user-registration/myaccount/my-account.php.
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
} ?>

<div class="rounded-box-padded">
	<?php
		do_action( 'user_registration_account_navigation' );
		ur_print_notices();
		do_action( 'user_registration_account_content' );
	?>
</div>
