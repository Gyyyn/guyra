<?php

function RenderNotificationsDropdown($args=[]) {

  global $current_user_notifications;
  global $gi18n;

  if (!$args['buttonClass']) {
    $args['buttonClass'] = 'btn-tall btn-sm';
  }

  if (!$args['offset']) {
    $args['offset'] = '0,0';
  }

  $notifications_amount = count($current_user_notifications);

  ?>
  <div class="dropstart m-0 d-inline">
    <button type="button" data-bs-offset="<?php echo $args['offset']; ?>" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" name="notifications" class="<?php echo $args['buttonClass'] ?> <?php if ($current_user_notifications): ?> green <?php endif; ?>">
      <i class="bi bi-bell-fill"></i>
      <?php if ($current_user_notifications): ?>
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-red">
        <?php echo $notifications_amount ?>
      </span>
      <?php endif; ?>
    </button>
    <div class="dropdown-menu notifications pop-animation animate fast p-3">
      <h2 class="mb-3"><?php echo $gi18n['notifications']; ?></h2>
      <?php if ($notifications_amount < 1): ?>
        <span class="text-muted"><?php echo $gi18n['no_notifications'] ?></span>
      <?php else: ?>
        <div class="p-3 position-absolute top-0 end-0">
          <button type="button" name="button" id="clear-notification-button" class="btn-tall btn-sm"><?php echo $gi18n['clear'] ?></button>
        </div>
        <?php $x = 0; ?>
        <?php foreach ($current_user_notifications as $item): ?>
          <div class="notifications notification-item dialog-box d-flex flex-column position-relative">
            <span class="position-absolute top-0 end-0">
              <button type="button" name="button" class="btn delete-notification-button" data-index="<?php echo $x ?>"><i class="bi bi-x-lg"></i></button>
            </span>
            <h3><?php echo $item['title'] ?></h3>
            <span class="fw-normal text-n"><?php echo $item['contents'] ?></span>
          </div>
          <?php $x += 1; ?>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </div>
  <?php

}

function RenderAccountDropdown($args=[]) {

  global $current_user_data;
  global $gi18n;

  $nameButtonClass = 'btn-tall btn-sm text-small text-primary me-2';

  if ($args['name_button'] === false) {
    $nameButtonClass = 'd-none';
  }

  ?>
  <div class="dropstart m-0 d-inline">
    <button class="btn d-flex flex-row p-0" role="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-offset="<?php echo $args['offset']; ?>">
      <span class="<?php echo $nameButtonClass ?>"><?php echo $current_user_data['first_name']; ?></span>
      <?php echo ($args['profile_picture']) ? $args['profile_picture'] : null; ?>
    </button>
    <ul class="dropdown-menu account-controls pop-animation animate fast">
      <li>
        <a class="dropdown-item" href="<?php echo $gi18n['account_link']; ?>">
          <img class="page-icon tiny me-1" alt="sair" src="<?php echo GetImageCache('icons/profile.png', 64); ?>">
          <?php echo $gi18n['button_myaccount'] ?>
        </a>
      </li>
      <li>
        <a class="dropdown-item" href="<?php echo $gi18n['profile_link']; ?>">
          <img class="page-icon tiny me-1" alt="sair" src="<?php echo GetImageCache('icons/sliders.png', 64); ?>">
          <?php echo $gi18n['profile'] ?>
        </a>
      </li>
      <li>
        <a id="logout-button" data-confirm="<?php echo $gi18n['logout_confirm'] ?>" class="dropdown-item" href="<?php echo $gi18n['logout_link']; ?>">
          <img class="page-icon tiny me-1" alt="sair" src="<?php echo GetImageCache('icons/logout.png', 64); ?>">
          <?php echo $gi18n['logout'] ?>
        </a>
      </li>
    </ul>
  </div>
  <?php

}
