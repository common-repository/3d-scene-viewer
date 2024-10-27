<?php

/**
 * Gutenberg integration
 */
class Scene3d_Gutenberg {
	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', [ $this, 'init' ] );
	}

	/**
	 * Tasks on `init`
	 *
	 *
	 * @return void
	 */
	public function init() {
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		register_block_type(
			'scene3d/scene',
			[
				'api_version'     => 2,
				'attributes'      => [
					'id' => [
						'type'    => 'string',
						'default' => '',
					],
				],
				'render_callback' => [ $this, 'render' ],
			]
		);
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Block editor assets
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$all_scenes      = Scene3d_Plugin::get_all_scenes();
		$all_scenes_data = [];
		foreach ( $all_scenes as $scene ) {
			$content                       = maybe_unserialize( $scene->post_content );
			$ar_array                      = explode( ':', $content['settings']['ar'] );
			$all_scenes_data[ $scene->ID ] = [
				'name'    => $scene->post_title,
				'post_id' => $scene->ID,
				'ar'      => 100 * (float) $ar_array[1] / (float) $ar_array[0],
			];
		}
		$data = [
			'i18n'     => [
				'select'  => __( 'Select a 3D scene', 'scene3d' ),
				'title'   => __( '3D scene', 'scene3d' ),
				'replace' => __( 'Replace', 'scene3d' ),
				'edit'    => __( 'Edit', 'scene3d' ),
			],
			'scenes'   => $all_scenes_data,
			'adminUrl' => admin_url(),
		];
		wp_register_script(
			'scene3d/block',
			SCENE3D_BASE_URL . 'includes/gutenberg/block.js',
			[
				'wp-element',
				'wp-components',
				'wp-block-editor',
			],
			true,
			SCENE3D_VERSION
		);
		wp_add_inline_script(
			'scene3d/block',
			"window.scene3dBlockData = " . json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . ";",
			'before'
		);
		wp_enqueue_script( 'scene3d/block' );
	}

	/**
	 * Server side rendering
	 */
	public function render( $attributes ) {
		$id = (int) $attributes['id'];
		if ( ! $id ) {
			return '';
		}

		return Scene3d_Plugin::get_instance()->get_output( $id );
	}
}

new Scene3d_Gutenberg();
