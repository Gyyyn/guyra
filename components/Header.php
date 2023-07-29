<?php

global $template_dir;
global $template_url;
global $site_api_url;
global $current_user_id;
global $current_user_data;
global $current_user_subscription_valid;
global $current_user_notifications;
global $is_logged_in;
global $gi18n;
global $args;
global $route;
global $nests;

include_once $template_dir . '/functions/Assets.php';

if (!$route[0])
$route[0] = 'home';

?>
<!-- Hello :) -->
<!doctype html><html lang="pt-BR"><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="<?php echo $gi18n['meta_desc'] ?>">
<meta name="theme-color" content="#ffffff"/>
<meta name="viewport" content="width=device-width, viewport-fit=cover, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
<title><?php echo $gi18n['company_name']; ?></title>
<link rel="icon" href="<?php echo GetImageCache('img/maskable_icon.png', 32, 'png'); ?>" type="image/x-icon">
<link href="<?php echo GetMinifiedAsset('css', 'bootstrap.css'); ?>" rel="stylesheet">
<link href="<?php echo GetMinifiedAsset('css', 'bootstrap-icons.css'); ?>" rel="stylesheet">
<link rel="manifest" href="/GuyraManifest.json">
<link rel="apple-touch-icon" href="<?php echo $template_url; ?>/assets/img/apple-icon.png">
<link href="<?php echo GetMinifiedAsset('css', 'main.css'); ?>" rel="stylesheet">
<link href="<?php echo GetMinifiedAsset('css', 'input.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'account.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'courses.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'schools.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'shop.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'reference.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'exercises.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'editor.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'animations.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<link href="<?php echo GetMinifiedAsset('css', 'misc.css'); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<?php if ($args['css']): ?>
<link href="<?php echo GetMinifiedAsset('css', $args['css']); ?>" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">
<?php endif; ?>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7198773595231701" crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DCFLSY9LC7"></script>
<script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-DCFLSY9LC7');</script>
<noscript><style media="screen">body>div,body>header,body>main{display:none!important;}</style></noscript>
</head>
<body class="guyra" data-route="<?php echo $route[0]; ?>" data-nests="<?php echo implode('/', $nests); ?>">
<noscript><?php echo $gi18n['noscript']; ?></noscript>