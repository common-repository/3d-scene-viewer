<?php
/**
 * WooCommerce integration
 */

add_action( 'plugins_loaded', function() {
	if ( class_exists( 'WooCommerce', false ) ) {
		new Scene3d_Woo();
	}
} );

class Scene3d_Woo {

	/**
	 * Scene post meta name
	 *
	 * @var string
	 */
	static $meta_key = 'scene_3d';

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'add_meta_boxes', [ $this, 'add_meta_box' ], 10, 2 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ], 10, 1 );
		add_action( 'save_post', [ $this, 'save_post' ], 10, 3 );

		add_filter( 'wc_get_template', [ $this, 'wc_get_template' ], 10, 2 );
	}

	/**
	 * Replace the product image template if a 3D scene is set to replace it.
	 *
	 * @param string $template default template.
	 * @param string $name     template name.
	 *
	 * @return mixed|string
	 */
	public function wc_get_template( $template, $name ) {
		if ( $name !== 'single-product/product-image.php' ) {
			return $template;
		}

		global $product;
		$meta = get_post_meta( $product->get_id(), self::$meta_key, true );

		if ( ! $meta ) {
			// If there is no scene set, abort.
			return $template;
		}

		return SCENE3D_BASE_PATH . 'includes/woocommerce/product-image.php';
	}

	/**
	 * Update post meta om product save
	 *
	 * @param int     $id     product ID.
	 * @param WP_Post $post   product object.
	 * @param bool    $update whether the product is being updated.
	 *
	 * @return void
	 */
	public function save_post( $id, $post, $update ) {
		if ( $post->post_type !== 'product' || ! $update ) {
			return;
		}

		$post_vars = wp_unslash( $_POST );
		if ( sanitize_key( $post_vars['scene3d-id'] ) === '' ) {
			delete_post_meta( $post->ID, self::$meta_key );
		} else {
			update_post_meta( $post->ID, self::$meta_key, [ 'id' => (int) ( sanitize_key( $post_vars['scene3d-id'] ) ) ] );
		}
	}

	/**
	 * Enqueue scripts on the product edit page
	 *
	 * @param string $hook current page hook.
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ], true ) || get_post_type() !== 'product' ) {
			return;
		}
		wp_enqueue_style(
			'scene3d/woo',
			SCENE3D_BASE_URL . 'includes/woocommerce/style.css',
			[],
			SCENE3D_VERSION
		);
		wp_enqueue_script(
			'scene3d/woo',
			SCENE3D_BASE_URL . 'includes/woocommerce/script.js',
			[ 'jquery' ],
			SCENE3D_VERSION,
			true
		);
	}

	/**
	 * Add the meta box on the product page
	 *
	 * @param string  $post_type the current post type.
	 * @param WP_Post $post      the current post.
	 *
	 * @return void
	 */
	public function add_meta_box( $post_type, $post ) {
		if ( $post_type !== 'product' ) {
			return;
		}
		add_meta_box(
			'scene3d_product_scene',
			__( 'Product 3D scene', 'scene3d' ),
			[ $this, 'render_meta_box' ],
			null,
			'side',
			'default',
			$post
		);
	}

	/**
	 * Prints the meta box content
	 *
	 * @param WP_Post $post current post.
	 *
	 * @return void
	 */
	public function render_meta_box( $post ) {
		require_once SCENE3D_BASE_PATH . 'includes/woocommerce/meta-box.php';
	}
}
