<?php
/**
 * 3D Scene Viewer
 *
 * @wordpress-plugin
 * Plugin Name: 3D Scene Viewer
 * Description: Create and show 3D scenes on your site.
 * Version:     1.0.1
 * Author:      wprj
 * Author URI:  https://www.upwork.com/freelancers/~01f7aae88a686d0580
 * Text Domain: scene3d
 * Domain Path: /languages
 * License:     GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.en.html
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}
define( 'SCENE3D_BASE', trailingslashit( plugin_basename( __FILE__ ) ) );
define( 'SCENE3D_BASE_PATH', trailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'SCENE3D_BASE_URL', trailingslashit( plugin_dir_url( __FILE__ ) ) );
const SCENE3D_VERSION = '1.0.1';
require_once SCENE3D_BASE_PATH . 'autoload.php';

/**
 * Template tag
 *
 * @param int $id scene ID
 *
 * @return string
 */
function scene3d_get_output( $id ) {
	return Scene3d_Plugin::get_instance()->get_output( $id );
}
