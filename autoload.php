<?php
/**
 * Autoload classes
 */

$files = [
	'admin/admin.php',
	'includes/plugin.php',
	'includes/scene.php',
	'includes/gutenberg/gutenberg.php',
	'includes/woocommerce/woocommerce.php',
];

foreach ( $files as $file ) {
	require_once SCENE3D_BASE_PATH . $file;
}
