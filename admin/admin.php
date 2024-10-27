<?php

/**
 * Dashboard class
 */
class Scene3d_Admin {
	/**
	 * Set default post data fields
	 *
	 * @var array
	 */
	private $default_fields;

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'add_meta_boxes', [ $this, 'add_metabox' ], 10, 2 );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_action( 'admin_footer', [ $this, 'admin_footer' ] );
		add_action( 'save_post', [ $this, 'save_post' ], 10, 3 );

		add_filter( 'upload_mimes', [ $this, 'upload_mimes' ] );
		add_filter( 'wp_check_filetype_and_ext', [ $this, 'check_file_type' ], 10, 3 );
		add_filter( 'manage_' . Scene3d_Plugin::CPT . '_posts_columns', [ $this, 'column_head' ] );
		add_filter( 'manage_' . Scene3d_Plugin::CPT . '_posts_custom_column', [ $this, 'columns_content' ], 10, 2 );
		$this->set_default_fields();
	}

	/**
	 * Add custom columns post list title
	 *
	 * @param array $columns existing columns name.
	 *
	 * @return array
	 */
	public function column_head( $columns ) {
		$new_columns = [];
		if ( is_array( $columns ) ) {
			foreach ( $columns as $key => $value ) {
				$new_columns[ $key ] = $value;
				if ( 'title' === $key ) {
					$new_columns['shortcode']    = __( 'Shortcode', 'scene3d' );
					$new_columns['template_tag'] = __( 'Template tag', 'scene3d' );
				}
			}
		} else {
			$new_columns['shortcode']    = __( 'Shortcode', 'scene3d' );
			$new_columns['template_tag'] = __( 'Template tag', 'scene3d' );
		}

		return $new_columns;
	}

	/**
	 * Add custom columns post list content
	 *
	 * @param string $name current column name.
	 * @param int    $id   current post ID.
	 *
	 * @return void
	 */
	public function columns_content( $name, $id ) {
		if ( in_array( $name, [ 'shortcode', 'template_tag' ], true ) ) {
			include SCENE3D_BASE_PATH . '/admin/views/parts/columns.php';
		}
	}

	/**
	 * Set default post data fields
	 *
	 * @return void
	 */
	private function set_default_fields() {
		$this->default_fields = [
			'elements'        => [],
			'fog'             => [
				'enabled' => false,
				'color'   => 'a0a0a0',
				'near'    => 10,
				'far'     => 100,
			],
			'camera'          => [
				'position'    => [
					'x' => 0,
					'y' => 3,
					'z' => 6,
				],
				'target'      => [
					'x' => 0,
					'y' => 0,
					'z' => 0,
				],
				'controls'    => true,
				'pan'         => true,
				'near'        => .1,
				'far'         => 1000,
				'fov'         => 50,
				'maxAzimuth'  => 'Infinity',
				'minAzimuth'  => 'Infinity',
				'maxPolar'    => 180,
				'minPolar'    => 0,
				'maxDistance' => 'Infinity',
				'minDistance' => 0,
			],
			'settings'        => [
				'ar'             => '16:9',
				'color'          => '#ececec',
				'shadow'         => 'disabled',
				'shadowMapSize'  => '512',
				'htmlid'         => '',
				'fs'             => true,
				'ambientLight'   => [
					'color'     => '#ffffff',
					'intensity' => 1.5,
				],
				'directionLight' => [
					'color'     => '#ffffff',
					'intensity' => 1.5,
					'position'  => [
						'x' => 0,
						'y' => 10,
						'z' => 10,
					],
					'target'    => [
						'x' => 0,
						'y' => 0,
						'z' => 0,
					],
					'shadow'    => '',
					'camera'    => 5,
				],
				'hemiLight'      => [
					'intensity'   => 0,
					'skycolor'    => '#ffffbb',
					'groundcolor' => '#080820',
				],
			],
			'previewSettings' => [
				'fps'  => true,
				'axes' => true,
			],
		];
	}

	/**
	 * Get a post data field
	 *
	 * @param string $post_content the post content string.
	 * @param string $name         the field to retrieve.
	 *
	 * @return mixed
	 */
	public function get_fields( $post_content, $name ) {
		$content = maybe_unserialize( $post_content );
		if ( isset( $content[ $name ] ) ) {
			if ( $name === 'directionLight' ) {
				die;
			}

			return wp_parse_args( $content[ $name ], $this->default_fields[ $name ] );
		}

		return $this->default_fields[ $name ];
	}

	/**
	 * When a post is being saved
	 *
	 * @param int     $id     post ID.
	 * @param WP_Post $post   the post.
	 * @param bool    $update whether  the post is being updated.
	 *
	 * @return void
	 */
	public function save_post( $id, $post, $update ) {
		if ( $post->post_type !== Scene3d_Plugin::CPT || ! $update ) {
			return;
		}

		$post_vars = wp_unslash( $_POST );

		if ( isset( $_GET['action'] ) && in_array( sanitize_key( $_GET['action'] ), [ 'trash', 'untrash' ] ) ) {
			return;
		}

		$fields = [];

		foreach ( $this->default_fields as $key => $value ) {
			if ( $key === 'previewSettings' && isset( $post_vars[ $key ] ) ) {
				foreach ( $this->default_fields[ $key ] as $i => $j ) {
					if ( isset( $post_vars[ $key ][ $i ] ) ) {
						$fields[ $key ][ $i ] = true;
					} else {
						$fields[ $key ][ $i ] = false;
					}
				}
				continue;
			}
			$fields[ $key ] = isset( $post_vars[ $key ] ) ? $post_vars[ $key ] : $value;
		}

		$fields['camera']['pan']      = isset( $post_vars['camera']['pan'] );
		$fields['camera']['controls'] = isset( $post_vars['camera']['controls'] );

		if ( ! isset( $post_vars['previewSettings'] ) ) {
			$fields['previewSettings'] = [
				'fps'  => false,
				'axes' => false,
			];
		}
		$fields['settings']['fs'] = isset( $post_vars['settings']['fs'] );
		$fields['fog']['enabled'] = isset( $post_vars['fog']['enabled'] );

		remove_action( 'save_post', [ $this, 'save_post' ], 10, 3 );
		wp_update_post(
			[
				'ID'           => $id,
				'post_content' => serialize( $fields ),
			]
		);
	}

	/**
	 * Print markup on page footer
	 *
	 * @return void
	 */
	public function admin_footer() {
		$screen = get_current_screen();
		if ( $screen && $screen->id !== Scene3d_Plugin::CPT ) {
			return;
		}
		require_once SCENE3D_BASE_PATH . 'admin/views/parts/gltf-fbx.php';
		require_once SCENE3D_BASE_PATH . 'admin/views/parts/spotlight.php';
		require_once SCENE3D_BASE_PATH . 'admin/views/parts/pointlight.php';
		require_once SCENE3D_BASE_PATH . 'admin/views/parts/floor.php';
		require_once SCENE3D_BASE_PATH . 'admin/views/parts/async-errors.php';
	}

	/**
	 * Allow upload of .glb .gltf and .fbx files
	 *
	 * @param array $types
	 *
	 * @return array
	 */
	public function upload_mimes( $types ) {
		$types['glb']  = 'model/gltf-binary';
		$types['gltf'] = 'model/gltf-binary';
		$types['fbx']  = 'model/fbx-binary';

		return $types;
	}

	/**
	 * Adjust mime type for .glb .gltf and .fbx
	 *
	 * @param array  $checked_type_ext Values for the extension, mime type, and corrected filename.
	 * @param string $file             Full path to the file.
	 * @param string $name             The name of the file (may differ from $file due to $file being in a tmp directory).
	 *
	 * @return array
	 * @link https://developer.wordpress.org/reference/hooks/wp_check_filetype_and_ext/
	 */
	public function check_file_type( $checked_type_ext, $file, $name ) {
		$exploded = explode( '.', $name );

		if ( 2 > count( $exploded ) ) {
			return $checked_type_ext;
		}

		if ( in_array( $exploded[1], [ 'glb', 'gltf' ], true ) ) {
			return [
				'ext'             => $exploded[1],
				'type'            => 'model/gltf-binary',
				'proper_filename' => '',
			];
		}

		if ( $exploded[1] === 'fbx' ) {
			return [
				'ext'             => $exploded[1],
				'type'            => 'model/fbx-binary',
				'proper_filename' => '',
			];
		}

		return $checked_type_ext;
	}

	/**
	 * Enqueue dashboard JS and CSS
	 *
	 * @param string $hook current page hook
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		if ( get_post_type() !== Scene3d_Plugin::CPT ) {
			return;
		}

		if ( $hook === 'edit.php' ) {
			wp_enqueue_script(
				'scene3d/sceneList',
				SCENE3D_BASE_URL . '/admin/js/edit.php.js',
				[ 'jquery' ],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_style(
				'scene3d/sceneList',
				SCENE3D_BASE_URL . '/admin/css/edit.php.css',
			);
		}

		if ( in_array( $hook, [ 'post-new.php', 'post.php' ], true ) ) {
			wp_enqueue_media();

			wp_enqueue_style( 'wp-color-picker' );

			wp_enqueue_style(
				'scene3d/dropdown',
				SCENE3D_BASE_URL . 'admin/css/dropdown.css',
				[],
				SCENE3D_VERSION
			);

			wp_enqueue_script(
				'scene3d/media',
				SCENE3D_BASE_URL . 'admin/js/media.js',
				[ 'jquery' ],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_script(
				'scene3d/edit-scene.js',
				SCENE3D_BASE_URL . 'admin/js/edit-scene.js',
				[ 'jquery' ],
				SCENE3D_VERSION,
				true
			);

			$media_locale = [
				'button'          => esc_html__( 'Select', 'scene3d' ),
				'invalidFileType' => esc_html__( 'Invalid file type', 'scene3d' ),
				'selectMedia'     => esc_html__( 'Select a file', 'scene3d' ),
				'selectMedias'    => esc_html__( 'Select files', 'scene3d' ),
			];

			wp_add_inline_script( 'scene3d/media', 'const scene3dMediaFrameLocale = ' . wp_json_encode( $media_locale ) . ';', 'before' );

			wp_enqueue_script(
				'scene3d/spotlight',
				SCENE3D_BASE_URL . 'admin/js/spotlight.js',
				[ 'jquery', 'wp-util', 'wp-color-picker' ],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_script(
				'scene3d/pointlight',
				SCENE3D_BASE_URL . 'admin/js/pointlight.js',
				[ 'jquery', 'wp-util', 'wp-color-picker' ],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_script(
				'scene3d/floor',
				SCENE3D_BASE_URL . 'admin/js/floor.js',
				[ 'jquery', 'wp-util', 'wp-color-picker' ],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_script(
				'scene3d/post.php',
				SCENE3D_BASE_URL . 'admin/js/post.php.js',
				[ 'jquery', 'scene3d/media', 'wp-util', 'jquery-ui-accordion', 'wp-color-picker' ],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_script(
				'scene3dModule/scene',
				SCENE3D_BASE_URL . 'admin/js/modules/scene.js',
				[],
				SCENE3D_VERSION,
				true
			);

			wp_enqueue_style(
				'scene3d/ionicons',
				SCENE3D_BASE_URL . 'admin/css/ionicons/ionicons.min.css',
				[],
				SCENE3D_VERSION
			);

			wp_enqueue_script(
				'scene3dModule/loader',
				SCENE3D_BASE_URL . 'admin/js/modules/loader.js',
				[ 'jquery' ],
				SCENE3D_VERSION
			);

			wp_enqueue_style(
				'scene3d/post.php',
				SCENE3D_BASE_URL . 'admin/css/post.php.css',
				[],
				SCENE3D_VERSION
			);

			wp_enqueue_style(
				'scene3d/toggle',
				SCENE3D_BASE_URL . 'admin/css/toggle.css',
				[],
				SCENE3D_VERSION
			);
		}
	}

	/**
	 * Add metaboxes
	 *
	 * @param string  $post_type current post type.
	 * @param WP_Post $post      current post.
	 *
	 * @return void
	 */
	public function add_metabox( $post_type, $post ) {
		if ( Scene3d_Plugin::CPT !== $post_type ) {
			return;
		}

		add_meta_box(
			'usage',
			esc_html__( 'Usage', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/usage.php';
			},
			null,
			'normal',
			'high',
			$post
		);

		add_meta_box(
			'preview',
			esc_html__( 'Preview', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/preview.php';
			},
			null,
			'advanced',
			'default',
			$post
		);

		add_meta_box(
			'elements',
			esc_html__( 'Scene elements', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/elements.php';
			},
			null,
			'advanced',
			'default',
			$post
		);

		add_meta_box(
			'fog',
			esc_html__( 'Fog', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/fog.php';
			},
			null,
			'advanced',
			'default',
			$post
		);

		add_meta_box(
			'settings',
			esc_html__( 'Scene settings', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/settings.php';
			},
			null,
			'advanced',
			'default',
			$post
		);

		add_meta_box(
			'camera',
			esc_html__( 'Camera settings', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/camera.php';
			},
			null,
			'side',
			'default',
			$post
		);

		add_meta_box(
			'lights',
			esc_html__( 'Default lights', 'scene3d' ),
			function( $post ) {
				require_once SCENE3D_BASE_PATH . 'admin/views/metaboxes/lights.php';
			},
			null,
			'side',
			'default',
			$post
		);
	}
}
