<?php
/**
 * Payment details page
 *
 * @package guyra
 */

global $template_dir;
global $template_url;
global $current_user_id;
global $is_logged_in;

include $template_dir . '/i18n.php';

get_header();
?>

<main class="page squeeze"><div class="page-squeeze rounded-box">

  <div class="dialog-box info text-center pop-animation animate">
    <p><?php echo $gi18n['payments_notready']; ?></p>
    <p><button class="btn-tall purple" onclick="history.back()"><?php echo $gi18n['back']; ?></button></p>
  </div>

  <div class="row g-5 disabled opacity-50">

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
            <label for="cc-name" class="form-label"><?php echo $gi18n['name_on_card']; ?></label>
            <input type="text" class="form-control" id="cc-name" placeholder="" required="">
            <small class="text-muted"><?php echo $gi18n['name_on_card_explain']; ?></small>
            <div class="invalid-feedback">
              <?php echo $gi18n['name'] . $gi18n['is_required']; ?>
            </div>
          </div>

          <div class="col-md-6">
            <label for="cc-number" class="form-label"><?php echo $gi18n['card_number']; ?></label>
            <input type="text" class="form-control" id="cc-number" placeholder="" required="">
            <div class="invalid-feedback">
              <?php echo $gi18n['card_number'] . $gi18n['is_required']; ?>
            </div>
          </div>

          <div class="col-md-3">
            <label for="cc-expiration" class="form-label"><?php echo $gi18n['expiration']; ?></label>
            <input type="text" class="form-control" id="cc-expiration" placeholder="" required="">
            <div class="invalid-feedback">
              <?php echo $gi18n['expiration'] . $gi18n['is_required']; ?>
            </div>
          </div>

          <div class="col-md-3">
            <label for="cc-cvv" class="form-label"><?php echo $gi18n['cvv']; ?></label>
            <input type="text" class="form-control" id="cc-cvv" placeholder="" required="">
            <div class="invalid-feedback">
              <?php echo $gi18n['cvv'] . $gi18n['is_required']; ?>
            </div>
          </div>
        </div>

        <small class="my-5"><?php echo $gi18n['payment_processor_warning']; ?></small>

        <hr class="my-4">

        <button class="w-100 btn-tall green" type="submit"><?php echo $gi18n['checkout']; ?></button>
      </form>
    </div>
  </div>

</main>

<?php
get_footer();
