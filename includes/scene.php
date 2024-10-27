<?php

/**
 * Front end Scene class
 */
class Scene3d_Scene {
	/**
	 * Post ID
	 *
	 * @var int
	 */
	public $id;

	/**
	 * HTML id attribute for the wrapping div
	 *
	 * @var string
	 */
	public $htmlid;

	/**
	 * Scene aspect ratio
	 *
	 * @var array
	 */
	public $ar;

	/**
	 * Allow fullscreen
	 *
	 * @var bool
	 */
	public $fullscreen;

	/**
	 * Scene elements
	 *
	 * @var array
	 */
	private $elements;

	/**
	 * Camera properties
	 *
	 * @var array
	 */
	private $camera;

	/**
	 * Ambient light properties
	 *
	 * @var array
	 */
	private $ambient_light;

	/**
	 * Directional light properties
	 *
	 * @var array
	 */
	private $directional_light;

	/**
	 * Scene settings
	 *
	 * @var array
	 */
	private $settings;

	/**
	 * Fog properties
	 *
	 * @var array
	 */
	private $fog;

	/**
	 * Constructor
	 *
	 * @param WP_Post $post
	 */
	public function __construct( $post ) {
		$this->load_from_post_content( $post );
	}

	/**
	 * Set all properties from post content
	 *
	 * @param WP_Post $post
	 *
	 * @return void
	 */
	public function load_from_post_content( $post ) {
		$post_data = unserialize( $post->post_content );
		$this->id         = $post->ID;
		$this->htmlid     = $post_data['settings']['htmlid'];
		$this->fullscreen = $post_data['settings']['fs'];
		$this->ar         = array_map(
			function( $a ) {
				return (float) $a;
			},
			explode( ':', $post_data['settings']['ar'] )
		);

		$settings = $post_data['settings'];

		if ( $settings['ambientLight']['intensity'] !== '0' && $settings['ambientLight']['color'] !== '#000000' ) {
			$this->ambient_light = self::to_float_deep( $settings['ambientLight'] );
		}

		if ( $settings['directionLight']['intensity'] !== '0' && $settings['directionLight']['color'] !== '#000000' ) {
			$this->directional_light = self::to_float_deep( $settings['directionLight'] );
		}

		unset( $settings['ambientLight'] );
		unset( $settings['directionLight'] );

		$this->settings = self::to_float_deep( $settings );
		$this->camera   = self::to_float_deep( $post_data['camera'] );
		$this->elements = self::to_float_deep( $post_data['elements'] );

		if ( $post_data['fog']['enabled'] ) {
			$this->fog = self::to_float_deep( $post_data['fog'] );
		}
	}

	/**
	 * Get scene data as JSON string
	 *
	 * @return string
	 */
	public function get_json_data() {
		return json_encode(
			[
				'id'                => $this->id,
				'htmlid'            => $this->htmlid,
				'ar'                => $this->ar,
				'fullscreen'        => $this->fullscreen,
				'elements'          => $this->elements,
				'camera'            => $this->camera,
				'ambient_light'     => $this->ambient_light,
				'directional_light' => $this->directional_light,
				'settings'          => $this->settings,
				'fog'               => $this->fog,
			],
			JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
		);
	}

	/**
	 * Recursive float casting of array values
	 *
	 * @param array $arr
	 *
	 * @return array
	 */
	static function to_float_deep( $arr ) {
		$results = [];
		foreach ( $arr as $key => $value ) {
			if ( ! is_array( $value ) ) {
				$results[ $key ] = is_numeric( $value ) ? (float) $value : $value;
			} else {
				$results[ $key ] = self::to_float_deep( $value );
			}
		}

		return $results;
	}
}
