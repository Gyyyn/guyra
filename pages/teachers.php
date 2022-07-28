<?php

global $gi18n;

Guyra_Safeguard_Access(['paid_users' => true]);

$users = guyra_get_users();

GetComponent('Header'); ?>

<main class="rounded-box squeeze">

    <h1 class="text-blue"><?php echo $gi18n['teachers'] ?></h1>

    <?php foreach ($users as $user):

    $user_data = $user['userdata'];

    if ($user_data['role'] == 'teacher'): ?>
    <div class="card text-center">
        <h2><?php echo $user_data['first_name'] ?></h2>
        <img class="avatar page-icon small mx-auto" src="<?php echo $user_data['profile_picture_url'] ?>" alt="<?php echo $user_data['first_name'] ?>">
        <a type="button" class="btn-tall blue mt-2" href="<?php echo $gi18n['home_link'] . '/user/' . $user['id'] ?>">
            <?php echo $gi18n['button_contact'] ?>
        </a>
    </div>

    <?php endif;
    endforeach; ?>

</main>

<?php GetComponent('Footer');