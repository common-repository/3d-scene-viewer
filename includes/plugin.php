<?php

/**
 * Main plugin class
 */
class Scene3d_Plugin {
	/**
	 * Custom post type
	 *
	 * @var string
	 */
	const CPT = 'scene3d';

	/**
	 * AJAX nonce for getting scene markup (page builders)
	 *
	 * @var string
	 */
	private static $preview_nonce;

	/**
	 * All published scenes
	 *
	 * @var array|WP_Post[]
	 */
	private static $all_scenes;

	/**
	 * The unique instance
	 *
	 * @var Scene3d_Plugin
	 */
	private static $instance;

	/**
	 * Constructor
	 */
	private function __construct() {
		add_action( 'init', [ $this, 'init' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
		add_filter( 'script_loader_tag', [ $this, 'script_tag' ], 10, 3 );
		add_action( 'plugins_loaded', [ $this, 'plugins_loaded' ] );
		add_action( 'wp_loaded', [ $this, 'wp_loaded' ] );

		if ( is_admin() ) {
			new Scene3d_Admin();
		}
	}

	/**
	 * Tasks on `plugins_loaded`
	 *
	 * @return void
	 */
	public function plugins_loaded() {
		load_plugin_textdomain( 'scene3d', false, SCENE3D_BASE_PATH . 'languages' );
	}

	/**
	 * Tasks on `wp_loaded`
	 *
	 * @return void
	 */
	public function wp_loaded() {
		if ( get_current_user() && isset( $_GET['get_scene3d_preview'], $_POST['nonce'] ) ) {
			if ( ! wp_verify_nonce( sanitize_key( $_POST['nonce'] ), 'scene3d-preview' ) ) {
				wp_send_json_error( 'Not authorized', 401 );
			}

			$output = $this->get_output( (int) sanitize_key( $_GET['get_scene3d_preview'] ) );

			if ( empty( $output ) ) {
				wp_send_json_error( 'Not found', 404 );
			}

			wp_send_json_success( [ 'html' => $output ], 200 );
		}
	}

	/**
	 * Enqueue frontend scripts ans styles
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_style(
			'scene3d/scene',
			SCENE3D_BASE_URL . 'includes/css/scene.css',
			[],
			SCENE3D_VERSION
		);
		wp_enqueue_script(
			'scene3dModule/scene',
			SCENE3D_BASE_URL . 'includes/js/scene.js',
			[],
			SCENE3D_VERSION,
			true
		);
		wp_enqueue_script(
			'scene3dModule/front',
			SCENE3D_BASE_URL . 'includes/js/front.js',
			[],
			SCENE3D_VERSION,
			true
		);

		if ( get_current_user() && ! empty( $_GET['elementor-preview'] ) ) {
			$data = [
				'siteUrl' => site_url(),
				'nonce'   => Scene3d_Plugin::nonce(),
			];
			wp_add_inline_script(
				'jquery',
				'window.scene3dData = ' . json_encode( $data ) . ';',
			);
		}

		wp_enqueue_style( 'dashicons' );
	}

	/**
	 * Allows scrips to be loaded as modules
	 *
	 * @param string $tag    the normal `<script/>` tag.
	 * @param string $handle script handle.
	 * @param string $src    src attribute.
	 *
	 * @return mixed|string
	 */
	public function script_tag( $tag, $handle, $src ) {
		if ( strpos( $handle, 'scene3dModule' ) === false ) {
			return $tag;
		}

		return '<script id="' . $handle . '" src="' . $src . '" type="module"></script>';
	}

	/**
	 * Process the shortcode attributes
	 *
	 * @param array $atts
	 *
	 * @return false|string
	 */
	public function shortcode( $atts ) {
		$atts = wp_parse_args( $atts, [
			'id' => 0,
		] );

		return $this->get_output( $atts['id'] );
	}

	/**
	 * Get scene markup
	 *
	 * @param int $id
	 *
	 * @return string
	 */
	public function get_output( $id ) {
		$post = get_post( $id );
		if ( ! $post || $post->post_type !== self::CPT || $post->post_status !== 'publish' ) {
			return '';
		}
		ob_start();
		require SCENE3D_BASE_PATH . 'includes/views/scene-output.php';

		return ob_get_clean();
	}

	/**
	 * Tasks on `init`
	 *
	 * @return void
	 */
	public function init() {
		self::$preview_nonce = wp_create_nonce( 'scene3d-preview' );
		$this->create_post_type();
		add_shortcode( self::CPT, [ $this, 'shortcode' ] );
	}

	/**
	 * Register custom post type
	 *
	 * @return void
	 */
	public function create_post_type() {
		if ( 1 !== did_action( 'init' ) && 1 !== did_action( 'uninstall_' . SCENE3D_BASE ) ) {
			return;
		}
		if ( ! post_type_exists( self::CPT ) ) {
			$post_type_params = $this->get_post_type_params();
			register_post_type( self::CPT, $post_type_params );
		}
	}

	/**
	 * Get the custom post type parameters
	 *
	 * @return array
	 */
	private function get_post_type_params() {
		$labels = [
			'name'               => esc_html__( '3D Scenes', 'scene3d' ),
			'singular_name'      => esc_html__( '3D Scene', 'scene3d' ),
			'add_new'            => esc_html__( 'New 3D Scene', 'scene3d' ),
			'add_new_item'       => esc_html__( 'Add New 3D Scene', 'scene3d' ),
			'edit'               => esc_html__( 'Edit', 'scene3d' ),
			'edit_item'          => esc_html__( 'Edit 3D Scene', 'scene3d' ),
			'new_item'           => esc_html__( 'New 3D Scene', 'scene3d' ),
			'view'               => esc_html__( 'View', 'scene3d' ),
			'view_item'          => esc_html__( 'View the 3D Scene', 'scene3d' ),
			'search_items'       => esc_html__( 'Search 3D Scenes', 'scene3d' ),
			'not_found'          => esc_html__( 'No 3D Scenes found', 'scene3d' ),
			'not_found_in_trash' => esc_html__( 'No 3D Scenes found in Trash', 'scene3d' ),
			'parent'             => esc_html__( 'Parent 3D Scene', 'scene3d' ),
		];

		$post_type_params = [
			'labels'           => $labels,
			'public'           => false,
			'show_ui'          => true,
			'show_in_menu'     => true,
			'menu_icon'        => self::get_svg(),
			'hierarchical'     => false,
			'capabilitiy_type' => 'post',
			'has_archive'      => false,
			'query_var'        => true,
			'supports'         => [ 'title' ],
		];

		return $post_type_params;
	}

	/**
	 * Encode structures that will be use by JavaScript
	 *
	 * @param mixed $data
	 *
	 * @return string
	 */
	public static function encode( $data ) {
		return base64_encode( rawurlencode( json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) ) );
	}

	/**
	 * Allowed tags for scene markup
	 *
	 * @return array[]
	 */
	public static function allowed_tags() {
		return [
			'div'    => [
				'class'      => [],
				'id'         => [],
				'data-scene' => [],
				'data-id'    => [],
				'style'      => [],
			],
			'i'      => [
				'class' => [],
			],
			'script' => [
				'type' => [],
			],
		];
	}

	/**
	 * Base64 svg of Three.js
	 *
	 * @return string
	 */
	public static function get_svg() {
		return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxOS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA2MDAgNjAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MDAgNjAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojNDA0MDQwO30NCgkuc3Qxe2ZpbGw6I0ZFNjYwMDt9DQo8L3N0eWxlPg0KPHBhdGggY2xhc3M9InN0MCIgZD0iTTE2OS4xLDMzNi40Yy0xNy44LTM5LjYtMTYtMTA3LjEsMzMuNy0xNTQuM2M1MC40LTQ3LjksMTI4LjMtNTIuMiwxODMtMTAuNWM1Ny41LDQ0LDY2LjYsMTE1LjIsNDYuNiwxNjMuNw0KCWMtMzQuOS00MC03OC44LTYxLjUtMTMxLjktNjEuM0MyNDcuMywyNzQuMywyMDMuNiwyOTYuMSwxNjkuMSwzMzYuNHoiLz4NCjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOTguMSwyOTcuNWMyMi4zLDAuMyw0MS4yLDQuMyw1OS4zLDEyLjFjMTkuMSw4LjMsMzQuOSwyMC45LDQ4LjksMzYuMWMyLjksMy4yLDUuMyw2LjgsOCwxMC4yDQoJYzEuNSwxLjksMS41LDMuOCwwLjgsNi4yYy01LjMsMTkuMi0xNC4yLDM2LjctMjUuOCw1Mi44Yy03LjQsMTAuMy0xNi4xLDE5LjQtMjUuNywyNy44Yy0xMS41LDEwLTI0LjIsMTguMy0zNy45LDI0LjkNCgljLTcuNSwzLjYtMTUuMyw2LjctMjMuNCw5Yy0xLjksMC41LTMuNCwwLjMtNS0wLjNjLTI5LjctOS42LTU0LjktMjUuOS03NS42LTQ5LjNjLTE2LjMtMTguNS0yOC0zOS42LTM1LjItNjMuMw0KCWMtMS4yLTQtMC40LTYuOSwxLjktOS44YzEyLjMtMTUuNCwyNi41LTI4LjcsNDMuOC0zOC40YzE0LjctOC4zLDMwLjUtMTMuNSw0Ny4xLTE2LjNDMjg2LjQsMjk4LjEsMjkzLjYsMjk3LjMsMjk4LjEsMjk3LjV6Ii8+DQo8L3N2Zz4NCg==';
	}

	/**
	 * Get all displayable scenes
	 *
	 * @return array|WP_Post[]
	 */
	public static function get_all_scenes() {
		if ( self::$all_scenes === null ) {
			self::$all_scenes = get_posts( [ 'post_status' => 'publish', 'post_type' => Scene3d_Plugin::CPT, 'numberposts' => -1 ] );
		}

		return self::$all_scenes;
	}

	/**
	 * Get  the preview nonce
	 *
	 * @return string
	 */
	public static function nonce() {
		return self::$preview_nonce;
	}

	/**
	 * Get the singleton of the main class
	 *
	 * @return Scene3d_Plugin
	 */
	public static function get_instance() {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}

Scene3d_Plugin::get_instance();
