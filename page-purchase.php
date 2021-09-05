<?php
/**
 * Payment details page
 *
 * @package guyra
 */

// Sanity check, unlogged users shouldn't be here
if (!is_user_logged_in()) {
 wp_redirect(get_site_url());
}

get_header();

/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

<main class="page squeeze"><div class="page-squeeze rounded-box">

  <div class="row g-5">

    <div class="col-md-5 col-lg-4 order-md-last">
      <h3 class="mb-3">
        <span class="text-primary"><?php echo $gi18n['plans'] ?></span>
      </h3>
      <ul class="list-group more-rounded mb-3">
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0"><?php echo $gi18n['pricesfeature_titlelite'] ?></h6>
            <small class="text-muted"><?php echo $gi18n['pricesfeature_subtitlelite'] ?></small>
          </div>
          <span class="text-muted"><?php echo $gi18n['pricesfeature_pricelite'] ?></span>
        </li>
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0"><?php echo $gi18n['pricesfeature_titlepro'] ?></h6>
            <small class="text-muted"><?php echo $gi18n['pricesfeature_subtitlepro'] ?></small>
          </div>
          <span class="text-muted"><?php echo $gi18n['pricesfeature_pricepro'] ?></span>
        </li>
        <li class="list-group-item d-flex justify-content-between lh-sm">
          <div>
            <h6 class="my-0"><?php echo $gi18n['pricesfeature_titlebusiness'] ?></h6>
            <small class="text-muted"><?php echo $gi18n['pricesfeature_subtitlebusiness'] ?></small>
          </div>
          <span class="text-muted"><?php echo $gi18n['pricesfeature_pricebusiness'] ?></span>
        </li>
      </ul>
      <div class="card d-flex flex-row justify-content-between p-3">
        <span><?php echo $gi18n['total'] ?></span>
        <strong>$0</strong>
      </div>
    </div>

    <div class="col-md-7 col-lg-8">
      <h4 class="mb-3"><?php echo $gi18n['address'] ?></h4>
      <form class="needs-validation" novalidate="">
        <div class="row g-3">
          <div class="col-sm-6">
            <label for="firstName" class="form-label"><?php echo $gi18n['firstname'] ?></label>
            <input type="text" class="form-control" id="firstName" placeholder="" value="" required="">
            <div class="invalid-feedback">
              Valid first name is required.
            </div>
          </div>

          <div class="col-sm-6">
            <label for="lastName" class="form-label"><?php echo $gi18n['lastname'] ?></label>
            <input type="text" class="form-control" id="lastName" placeholder="" value="" required="">
            <div class="invalid-feedback">
              Valid last name is required.
            </div>
          </div>

          <div class="col-12">
            <label for="address" class="form-label"><?php echo $gi18n['address'] ?></label>
            <input type="text" class="form-control" id="address" placeholder="Avenida Paulista, 1234" required="">
            <div class="invalid-feedback">
              Please enter your shipping address.
            </div>
          </div>

          <div class="col-9">
            <label for="address2" class="form-label"><?php echo $gi18n['address2'] ?><span class="text-muted"> (<?php echo $gi18n['optional'] ?>)</span></label>
            <input type="text" class="form-control" id="address2" placeholder="Apartamento 10">
          </div>

          <div class="col-md-3">
            <label for="zip" class="form-label"><?php echo $gi18n['zip'] ?></label>
            <input type="text" class="form-control" id="zip" placeholder="12345-678" required="">
            <div class="invalid-feedback">
              Zip code required.
            </div>
          </div>
        </div>

        <hr class="my-5" />

        <h4 class="mb-3"><?php echo $gi18n['payment'] ?></h4>

        <div class="my-3">
          <div class="form-check">
            <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked="" required="">
            <label class="form-check-label" for="credit"><?php echo $gi18n['pix'] ?></label>
          </div>
          <div class="form-check">
            <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required="">
            <label class="form-check-label" for="debit"><?php echo $gi18n['thirdparty_processor'] ?></label>
          </div>
        </div>

        <div class="row gy-3">
          <div class="col-md-6">
            <label for="cc-name" class="form-label">Name on card</label>
            <input type="text" class="form-control" id="cc-name" placeholder="" required="">
            <small class="text-muted">Full name as displayed on card</small>
            <div class="invalid-feedback">
              Name on card is required
            </div>
          </div>

          <div class="col-md-6">
            <label for="cc-number" class="form-label">Credit card number</label>
            <input type="text" class="form-control" id="cc-number" placeholder="" required="">
            <div class="invalid-feedback">
              Credit card number is required
            </div>
          </div>

          <div class="col-md-3">
            <label for="cc-expiration" class="form-label">Expiration</label>
            <input type="text" class="form-control" id="cc-expiration" placeholder="" required="">
            <div class="invalid-feedback">
              Expiration date required
            </div>
          </div>

          <div class="col-md-3">
            <label for="cc-cvv" class="form-label">CVV</label>
            <input type="text" class="form-control" id="cc-cvv" placeholder="" required="">
            <div class="invalid-feedback">
              Security code required
            </div>
          </div>
        </div>

        <hr class="my-4">

        <button class="w-100 btn-tall" type="submit">Continue to checkout</button>
      </form>
    </div>
  </div>

</main>

<?php
get_footer();
