<?php
/**
 * The main template file
 *
 * @package guyra
 */

if($_GET['json']) {
  include get_template_directory() . '/json.php';
}

// Handle admin actions
if (current_user_can('manage_options')) {

  $user = $_GET['user'];

  if($user) {

    if ($_GET['assigntogroup']) {
      update_user_meta($user, 'studygroup', $_GET['assigntogroup'] );
    }

    if ($_GET['cleargroup']) {
      delete_user_meta($user, 'studygroup' );
    }

    if ($_GET['litetill']) {
      update_user_meta($user, 'subscription', 'lite' );
      update_user_meta($user, 'subscribed-until', $_GET['litetill'] );
    }

    if ($_GET['premiumtill']) {
      update_user_meta($user, 'subscription', 'premium' );
      update_user_meta($user, 'subscribed-until', $_GET['premiumtill'] );
    }

    wp_redirect(get_site_url());
  }
}

// Allow normal wordpress to be loaded
if ($_GET['page'] == 'blog') {

  /* Try to find blog.php, freak out if nothing is found */
  if( locate_template('blog.php') ) { load_template (locate_template('blog.php') ); } else { echo "disaster! no blog.php found"; return; }

// Allow logged users to go straight to a home page
} elseif (is_user_logged_in()) {

  if( locate_template('study.php') ) { load_template( locate_template('study.php') ); } else { echo "disaster! no study.php found"; return; }

// No special pages requested, continue as normal
} else {

get_header();
/* Set up translations independent of Wordpress */
include get_template_directory() . '/i18n.php';
?>

	<main>

  <div id="myCarousel" class="carousel slide" data-bs-ride="carousel" data-interval="10000">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>

        <div class="container">
          <div class="carousel-caption text-start">
            <h1><?php echo $gi18n['header_carousel_title1'] ?></h1>
            <p><?php echo $gi18n['header_carousel_explain1'] ?></p>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>

        <div class="container">
          <div class="carousel-caption">
            <h1><?php echo $gi18n['header_carousel_title2'] ?></h1>
            <p><?php echo $gi18n['header_carousel_explain2'] ?></p>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <svg class="bd-placeholder-img" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#777"/></svg>

        <div class="container">
          <div class="carousel-caption text-end">
            <h1><?php echo $gi18n['header_carousel_title3'] ?></h1>
            <p><?php echo $gi18n['header_carousel_explain3'] ?></p>
            <p><a class="btn btn-lg btn-primary" href="#"><?php echo $gi18n['button_tryit'] ?></a></p>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <div id="jump-info" class="container marketing">

    <div class="row featurette">
      <div class="col-md-7 order-md-2">
        <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title1'] ?></h2>
        <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain1'] ?></div>
      </div>
      <div class="col-md-5 order-md-1">
        <div class="picture" data-aos="fade-left">
          <img alt="phone" src="<?php echo get_template_directory_uri(); ?>/assets/icons/phone.png">
        </div>
      </div>
    </div>

    <div class="row featurette">
      <div class="col-md-7">
        <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title2'] ?></h2>
        <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain2'] ?></div>
      </div>
      <div class="col-md-5">
        <div class="picture" data-aos="fade-right">
          <img alt="clock" src="<?php echo get_template_directory_uri(); ?>/assets/icons/digital-clock.png">
        </div>
      </div>
    </div>

    <div id="jump-prices" class="squeeze-big">

      <?php include 'purchase.php'; ?>

    </div>

    <div class="row featurette">
      <div class="col-md-7 order-md-2">
        <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title3'] ?></h2>
        <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain3'] ?></div>
      </div>
      <div class="col-md-5 order-md-1">
        <div class="picture" data-aos="fade-left">
          <img alt="diploma" src="<?php echo get_template_directory_uri(); ?>/assets/icons/certificate.png">
        </div>
      </div>
    </div>

    <div class="row featurette">
      <div class="row">
        <div class="col-md-7">
          <h2 class="featurette-heading" data-aos="fade" data-aos-delay="500"><?php echo $gi18n['index_feature_title4'] ?></h2>
          <div class="lead" data-aos="fade" data-aos-delay="1000"><?php echo $gi18n['index_feature_explain4'] ?></div>
        </div>
        <div class="col-md-5">
          <div class="picture" data-aos="fade-left">
            <img alt="laptop" src="<?php echo get_template_directory_uri(); ?>/assets/icons/laptop.png">
          </div>
        </div>
      </div>

      <div class="row bg-white text-dark p-5" data-aos="fade-up">
        <h2 class="mb-4">Interchange</h2>
        <div class="col-md-7">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
          <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
        </div>
        <div class="col-md-5">
          <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ywuKYqF0cN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

      <div class="row bg-white text-dark p-5" data-aos="fade-up">
        <h2 class="mb-4">Interchange</h2>
        <div class="col-md-7">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula facilisis ornare. Vestibulum a massa nulla. Proin sit amet magna tempus, commodo ipsum id, dictum lacus. </p>
          <p>Cras laoreet justo in justo gravida consectetur. Suspendisse vitae rhoncus orci. Cras efficitur, arcu id convallis scelerisque, purus tellus consectetur ipsum, sed vestibulum metus leo eu magna. </p>
        </div>
        <div class="col-md-5">
          <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ywuKYqF0cN4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>

    </div>

  </div><!-- /.container -->

  <footer class="squeeze">
    <hr class="featurette-divider">
    <p class="float-end"><a href="#"><?php echo $gi18n['button_return'] ?></a></p>
    <p>&copy; <?php echo date('Y') . ' ' . $gi18n['comapny_name'] . ' | ' . $gi18n['company_cnpj']; ?></p>
  </footer>
</main>

<?php
get_footer();

}
