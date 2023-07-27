<?php

global $gi18n;

GetComponent('Header'); ?>

<body>

    <div class="col-lg-8 mx-auto p-4 py-md-5">

        <header class="d-flex align-items-center">
            <object style="max-width: 20vw; margin: auto;" type="image/svg+xml" data="<?php echo $gi18n['assets_link'] . 'img/guyra-title-logo.svg'?>" class="logo"></object>
        </header>

        <main>
            <h1 class="text-body-emphasis">Sistemas de empreendimento.</h1>
            <p class="fs-5 col-md-8">Construimos sistemas de gerenciamento para pequenos empreendedores e profissionais autonomos.</p>
        
            <div class="p-5 mb-4 bg-body-tertiary rounded-3">
                <div class="container-fluid py-5">
                    <h1 class="display-5 fw-bold">Dually</h1>
                    <p class="col-md-8 fs-4">Sistema de ensino de linguas, com ferramentas para professores autonomos. Ofereca para seus alunos atividades dinamicas gerenciadas por IA alem de organizar suas licoes e agendas direto no app.</p>
                    <button class="btn-tall btn-lg blue" type="button">Conhecer</button>
                </div>
            </div>

            <div class="row align-items-md-stretch">
                <div class="col-md-6">
                    <div class="h-100 p-5 text-bg-dark rounded-3">
                    <h2>Agenda Digital by Guyrá</h2>
                    <p>Permita que seus clientes visualizem sua agenda e marquem horarios pelo app e economize tempo.</p>
                    <button class="btn btn-lg btn-outline-light" type="button">Entre em contato</button>
                    </div>
                </div>
            </div>
        
        </main>

        <footer class="pt-5 my-5 text-body-secondary border-top">
            With ❤️ by Guyrá &middot; &copy; 2023
        </footer>

    </div>

</body>

<?php GetComponent('Footer');