<hr class="featurette-divider">

      <div class="row prices-container row-cols-1 row-cols-md-3 mb-3 text-center" data-aos="fade-up">
        <div class="col prices lite">
          <div class="card mb-4 border-primary">
            <div class="card-header py-2 text-white bg-primary border-primary">
              <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlelite'] ?></h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title"><?php echo $gi18n['pricesfeature_pricelite'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
              <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
                <li><span>Acesso as video aulas</span> <span>✅</span></li>
                <li><span>Tire suas duvidas por WhatsApp</span> <span>✅</span></li>
                <li><span>Uma aula por semana</span> <span>❌</span></li>
                <li><span>Exercicios de conversasao</span> <span>❌</span></li>
              </ul>
              <button type="button" data-bs-toggle="modal" data-bs-target="#buy-modal-lite" class="w-100 btn btn-lg btn-primary"><?php echo $gi18n['button_want'] ?></button>
            </div>
          </div>
        </div>
        <div class="col prices primary pro">
          <div class="card mb-4 border-secondary">
            <div class="card-header py-2 text-white bg-secondary border-secondary">
              <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlepro'] ?></h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title"><?php echo $gi18n['pricesfeature_pricepro'] ?><small class="text-muted fw-light">/<?php echo $gi18n['month'] ?></small></h1>
              <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
                <li><span>Acesso as video aulas</span> <span>✅</span></li>
                <li><span>Tire suas duvidas por WhatsApp ou na aula</span> <span>✅</span></li>
                <li><span>Uma aula por semana</span> <span>✅</span></li>
                <li><span>Exercicios de conversasao</span> <span>✅</span></li>
              </ul>
              <button type="button" data-bs-toggle="modal" data-bs-target="#buy-modal-premium" class="w-100 btn btn-lg btn-primary"><?php echo $gi18n['button_want'] ?></button>
            </div>
          </div>
        </div>
        <div class="col prices business">
          <div class="card mb-4">
            <div class="card-header py-2">
              <h3 class="my-1 fw-normal"><?php echo $gi18n['pricesfeature_titlebusiness'] ?></h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title fs-3"><?php echo $gi18n['pricesfeature_pricebusiness'] ?><small class="text-muted fw-light">/<?php echo $gi18n['student'] ?></small></h1>
              <ul class="list-unstyled me-0 ms-0 mt-3 mb-4 features">
                <li><span>Todos os beneficios do plano premium</span> <span>✅</span></li>
                <li><span>Preparatorio IELTS/Cambridge/TOEFL</span> <span>✅</span></li>
                <li><span>A partir de 10 alunos</span> <span>ℹ</span></li>
              </ul>
              <button type="button" class="w-100 btn btn-lg btn-outline-primary" data-bs-toggle="modal" data-bs-target="#contact-modal"><?php echo $gi18n['button_contact'] ?></button>
            </div>
          </div>
        </div>
      </div>

      <hr class="featurette-divider">

<!-- MODALS -->
  <!-- Contact form -->
  <div class="modal fade" id="contact-modal" tabindex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="contactModalLabel"><?php echo $gi18n['button_contact'] ?></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="row g-3 mb-3 d-flex flex-row justify-content-between align-items-stretch align-items-center">
              <label for="exampleFormControlInput1" class="form-label"><?php echo $gi18n['email'] ?></label>
              <div class="col-auto flex-grow-1">
                <div class="mb-3">
                  <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
                </div>
              </div>
              <div class="col-auto flex-shrink-1" style="flex: 15em;">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                  <label class="form-check-label" for="flexCheckDefault">
                    <?php echo $gi18n['modal_checkpromoconsent'] ?>
                  </label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleFormControlTextarea1" class="form-label"><?php echo $gi18n['modal_textarealabel'] ?></label>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary"><?php echo $gi18n['button_submit'] ?></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Lite Purchase -->
  <div class="modal fade" id="buy-modal-lite" tabindex="-1" aria-labelledby="buy-modal-lite-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="buy-modal-lite-label"><?php echo $gi18n['youchose'] . $gi18n['pricesfeature_titlelite'] ?></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <?php echo $gi18n['buy_warning']; ?>
          <a mp-mode="dftl" href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380847a7b2916017a8846ebad0fb2" name="MP-payButton" class='btn btn-primary w-100'><?php echo $gi18n['payment'] ?></a>
        </div>
      </div>
    </div>
  </div>

  <!-- Premium Purchase -->
  <div class="modal fade" id="buy-modal-premium" tabindex="-1" aria-labelledby="buy-modal-premium-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="buy-modal-premium-label"><?php echo $gi18n['youchose'] . $gi18n['pricesfeature_titlepro'] ?></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <?php echo $gi18n['buy_warning']; ?>
          <a mp-mode="dftl" href="https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=2c9380847a7b2916017a8846ebad0fb2" name="MP-payButton" class='btn btn-primary w-100'><?php echo $gi18n['payment'] ?></a>
        </div>
      </div>
    </div>
  </div>