import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	DirectionalLight,
	DirectionalLightHelper,
	AnimationMixer,
	Color,
	AxesHelper,
	SpotLight,
	SpotLightHelper,
	PointLight,
	PointLightHelper,
	HemisphereLight,
	Vector2,
	Fog,
	Mesh,
	MeshPhongMaterial,
	GridHelper,
	PlaneGeometry,
	Group
} from '../../../includes/js/3js/src/Three.js';

import {OrbitControls} from '../../../includes/js/3js/controls/OrbitControls.js';
import {Loop} from './loop.js';
import {Throttle} from '../../../includes/js/throttle.js';
import {CameraInputs} from './camera-inputs.js';

'use strict';

class Scene3D {
	/**
	 * Scene elements
	 *
	 * @type {{}}
	 */
	elements = {};

	/**
	 * Animation mixer
	 *
	 * @type {AnimationMixer}
	 */
	mixer;

	/**
	 * List of animation clips
	 *
	 * @type {{}}
	 */
	animClips = {};

	/**
	 * Animation to be played on the next `animate()` call
	 *
	 * @type {[]}
	 */
	animStateQueue = [];

	/**
	 * Resizer throttle function
	 *
	 * @type {Throttle}
	 */
	resizer;

	/**
	 * Update camera inputs on orbit change
	 *
	 * @type {Throttle}
	 */
	orbitChangeHandler;

	/**
	 * Shadow map size for all lights
	 *
	 * @type {string}
	 */
	shadowMapSize = '512x512';

	/**
	 * Whether to enable shadow casting and receiving
	 *
	 * @type {boolean}
	 */
	shadows = false;

	/**
	 * Scene's fog
	 *
	 * @type {Fog}
	 */
	fog;

	/**
	 * Constructor
	 *
	 * @param {string} wrapper scene wrapper selector
	 */
	constructor( wrapper ) {
		const self   = this;
		this.wrapper = document.querySelector( wrapper );

		this.scene   = new Scene();
		this.arInput = document.querySelector( '[name="settings\[ar\]"]' );
		this.arInput.addEventListener( 'change', function () {
			self.resize.apply( self );
		} );

		const ar = this.getArValue();

		this.cameraInputs = new CameraInputs(
			{
				'controls':    'camera[controls]',
				'pan':         'camera[pan]',
				'maxAzimuth':  'camera[maxAzimuth]',
				'minAzimuth':  'camera[minAzimuth]',
				'maxPolar':    'camera[maxPolar]',
				'minPolar':    'camera[minPolar]',
				'maxDistance': 'camera[maxDistance]',
				'minDistance': 'camera[minDistance]'
			},
			this,
			'camera-input'
		);

		this.camera = new PerspectiveCamera(
			parseFloat( document.querySelector( '[name="camera\[fov\]"]' ).value ),
			ar[0] / ar[1],
			parseFloat( document.querySelector( '[name="camera\[near\]"]' ).value ),
			parseFloat( document.querySelector( '[name="camera\[far\]"]' ).value )
		);

		this.renderer = new WebGLRenderer();
		this.shadows  = document.querySelector( '[name="settings\[shadow\]"]' ).value === 'enabled';

		if ( this.shadows ) {
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type    = 2;
			this.shadowMapSize              = parseInt( document.querySelector( '[name="settings\[shadowMapSize\]"]' ).value );
		}

		/**
		 * Default lights
		 */
		const ambientLight     = new AmbientLight(
			new Color( document.querySelector( '[name="settings\[ambientLight\]\[color\]"]' ).value ),
			parseFloat( document.querySelector( '[name="settings\[ambientLight\]\[intensity\]"]' ).value )
		);
		const directionalLight = new DirectionalLight(
			new Color( document.querySelector( '[name="settings\[directionLight\]\[color\]"]' ).value ),
			parseFloat( document.querySelector( '[name="settings\[directionLight\]\[intensity\]"]' ).value )
		);
		const hemiLight        = new HemisphereLight(
			new Color( document.querySelector( '[name="settings\[hemiLight\]\[skycolor\]"]' ).value ),
			new Color( document.querySelector( '[name="settings\[hemiLight\]\[groundcolor\]"]' ).value ),
			parseFloat( document.querySelector( '[name="settings\[hemiLight\]\[intensity\]"]' ).value )
		);

		const cameraBoundary                  = parseInt( document.querySelector( '[name="settings\[directionLight\]\[camera\]"]' ).value );
		directionalLight.shadow.camera.top    = cameraBoundary;
		directionalLight.shadow.camera.right  = cameraBoundary;
		directionalLight.shadow.camera.bottom = - cameraBoundary;
		directionalLight.shadow.camera.left   = - cameraBoundary;
		directionalLight.shadow.mapSize       = new Vector2( this.shadowMapSize, this.shadowMapSize );
		directionalLight.shadow.bias          = - .0001;

		if ( document.querySelector( '[name="settings\[directionLight\]\[shadow\]"]' ).value === 'enabled' ) {
			directionalLight.castShadow = true;
		}

		this.scene.add( directionalLight );
		this.scene.add( directionalLight.target );

		directionalLight.position.set(
			parseInt( document.querySelector( '[name="settings\[directionLight\]\[position\]\[x\]"]' ).value ),
			parseInt( document.querySelector( '[name="settings\[directionLight\]\[position\]\[y\]"]' ).value ),
			parseInt( document.querySelector( '[name="settings\[directionLight\]\[position\]\[z\]"]' ).value )
		);

		directionalLight.target.position.set(
			parseInt( document.querySelector( '[name="settings\[directionLight\]\[target\]\[x\]"]' ).value ),
			parseInt( document.querySelector( '[name="settings\[directionLight\]\[target\]\[y\]"]' ).value ),
			parseInt( document.querySelector( '[name="settings\[directionLight\]\[target\]\[z\]"]' ).value )
		);

		const dLightHelper = new DirectionalLightHelper( directionalLight, cameraBoundary );
		this.scene.add( dLightHelper );

		this.scene.add( ambientLight );
		this.scene.add( hemiLight );

		this.lights = {
			'ambient':     ambientLight,
			'directional': directionalLight,
			'dlHelper':    dLightHelper,
			'hemi':        hemiLight
		};

		this.scene.background = new Color( document.querySelector( '[name="settings\[color\]"]' ).value );

		if ( document.querySelector( '[name="fog\[enabled\]"]' ).checked ) {
			this.fog       = new Fog(
				new Color( document.querySelector( '[name="fog\[color\]"]' ).value ),
				parseFloat( document.querySelector( '[name="fog\[near\]"]' ).value ),
				parseFloat( document.querySelector( '[name="fog\[far\]"]' ).value )
			);
			this.scene.fog = this.fog;
		}

		const wrapperWidth = this.wrapper.clientWidth;

		this.renderer.setSize( wrapperWidth, wrapperWidth * ( ar[1] / ar[0] ) );
		this.renderer.physicallyCorrectLights = true;
		this.wrapper.appendChild( this.renderer.domElement );
		this.resize();

		/**
		 * Orbit controls
		 */
		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.addEventListener( 'change', function () {
			self.orbitChange.apply( self );
		} );

		const cameraPostdata = window.scene3dEditUI.getPostDataCamera();

		this.camera.position.set( parseFloat( cameraPostdata.position.x ), parseFloat( cameraPostdata.position.y ), parseFloat( cameraPostdata.position.z ) );
		this.controls.target.set( parseFloat( cameraPostdata.target.x ), parseFloat( cameraPostdata.target.y ), parseFloat( cameraPostdata.target.z ) );

		this.loop = new Loop( this.renderer, this.scene, this.camera );

		this.controls.enablePan       = this.cameraInputs.getValue( 'pan' );
		this.controls.maxAzimuthAngle = this.cameraInputs.getValue( 'maxAzimuth' ) === 'Infinity' ? 'Infinity' : this.cameraInputs.degToRad( this.cameraInputs.getValue( 'maxAzimuth' ) );
		this.controls.minAzimuthAngle = this.cameraInputs.getValue( 'minAzimuth' ) === 'Infinity' ? 'Infinity' : this.cameraInputs.degToRad( this.cameraInputs.getValue( 'minAzimuth' ) );
		this.controls.maxPolarAngle   = this.cameraInputs.getValue( 'maxPolar' ) === 'Infinity' ? 'Infinity' : this.cameraInputs.degToRad( this.cameraInputs.getValue( 'maxPolar' ) );
		this.controls.minPolarAngle   = this.cameraInputs.getValue( 'minPolar' ) === 'Infinity' ? 'Infinity' : this.cameraInputs.degToRad( this.cameraInputs.getValue( 'minPolar' ) );
		this.controls.maxDistance     = this.cameraInputs.getValue( 'maxDistance' );
		this.controls.minDistance     = this.cameraInputs.getValue( 'minDistance' );

		this.loop.addControls( this.controls ).setFpsDiv(
			document.querySelector( '#scene3d-preview .fps' ),
			document.querySelector( '#scene3d-preview .frametime' )
		);

		this.toggleFps( document.querySelector( '[name="previewSettings\[fps\]"]' ).checked );

		const fsIcon = document.querySelector( '[name="settings\[fs\]"]' );
		this.toggleGofs( fsIcon.checked );
		fsIcon.addEventListener( 'click', function ( ev ) {
			self.toggleGofs( ev.target.checked );
		} );

		this.axesHelper = new AxesHelper( 20 );
		if ( document.querySelector( '[name="previewSettings\[axes\]"]' ).checked ) {
			this.scene.add( this.axesHelper );
		}

		this.checkCameraLock();
		this.init();
	}

	/**
	 * Event binding and tasks on scene ready
	 */
	init() {
		const self = this;

		const observer = new ResizeObserver( function () {
			self.resize();
		} );

		observer.observe( this.wrapper );

		// 3d model file loaded
		document.addEventListener( 'modelParseResults', function ( ev ) {
			self.modelLoaded( ev.detail );
		} );

		if ( this.scene.fog ) {
			document.querySelector( '[name="fog\[near\]"]' ).addEventListener( 'change', function ( ev ) {
				self.fog.near = parseFloat( ev.target.value );
			} );
			document.querySelector( '[name="fog\[far\]"]' ).addEventListener( 'change', function ( ev ) {
				self.fog.far = parseFloat( ev.target.value );
			} );
		}

		this.loop.animate();

		// adding scene elements such as 3d models is now doable
		document.dispatchEvent( new CustomEvent( 'scene3dReady', {detail: {scene: this}} ) );

		// FPS counter
		document.querySelector( '#scene3d-preview .go-fs' ).addEventListener( 'click', function () {
			if ( typeof self.renderer.domElement.requestFullscreen === 'function' ) {
				self.renderer.domElement.requestFullscreen();
				self.resizer.call();
			}
		} );

		// lock/unlock camera on the preview
		document.getElementById( 'lock-cam' ).addEventListener( 'click', function () {
			self.checkCameraLock();
		} );
		document.getElementById( 'unlock-cam' ).addEventListener( 'click', function () {
			self.checkCameraLock();
		} );

		document.querySelector( '[name="settings\[directionLight\]\[shadow\]"]' ).addEventListener( 'change', function () {
			self.updateDLightShadow( this.value );
		} );
	}

	/**
	 * Check preview camera lock state and display the appropriate icon on the preview
	 */
	checkCameraLock() {
		const locked                                          = ! this.controls.enabled;
		this.controls.enabled                                 = locked;
		document.getElementById( 'lock-cam' ).style.display   = locked ? 'none' : 'inline-block';
		document.getElementById( 'unlock-cam' ).style.display = locked ? 'inline-block' : 'none';
	}

	/**
	 * Add a flor mesh to the scene
	 *
	 * @param {int} size size of the square floor
	 * @param {string} color hex color
	 * @param {string} grid enable grid when equals `enabled`
	 * @param {string} gridColor hex color
	 * @param {int} divisions amount of division on each side of the flor
	 * @param {float} opacity floor opacity
	 */
	addFloor( size, color, grid, gridColor, divisions, opacity ) {
		const mesh = new Mesh(
			new PlaneGeometry( size, size ),
			new MeshPhongMaterial( {color: new Color( color ), depthWrite: false} )
		);

		const floor = new Group();

		if ( this.shadows ) {
			mesh.receiveShadow = true;
		}

		mesh.rotation.x = - Math.PI / 2;
		floor.add( mesh );

		if ( grid !== '' ) {
			const grid                = new GridHelper( size, divisions, new Color( gridColor ), new Color( gridColor ) );
			grid.material.opacity     = opacity;
			grid.material.transparent = true;
			floor.add( grid );
		}

		this.scene.add( floor );
		this.elements['floor'] = floor;

		document.querySelector( '#new-element [value="floor"]' ).disabled = true;
	}

	/**
	 * Toggle the fullscreen icon
	 *
	 * @param visible
	 */
	toggleGofs( visible ) {
		if ( typeof visible === 'undefined' ) {
			visible = true;
		}

		if ( typeof this.renderer.domElement.requestFullscreen !== 'function' ) {
			visible = false;
		}

		document.querySelector( '#scene3d-preview .go-fs' ).style.display = visible ? 'inline-block' : 'none';
	}

	/**
	 * Degrees to radians
	 *
	 * @param {number} deg
	 * @returns {number}
	 */
	degToRad( deg ) {
		return deg * Math.PI / 180;
	}

	/**
	 * Update camera near and far value
	 *
	 * @param {string} inputName
	 * @param {string} value
	 */
	updateCameraClipping( inputName, value ) {
		const prop        = inputName.split( '[' )[1].replace( ']', '' );
		this.camera[prop] = parseFloat( value );
		this.camera.updateProjectionMatrix();
	}

	/**
	 * Toggle visibility of FPS counter
	 *
	 * @param {boolean} visible
	 */
	toggleFps( visible ) {
		if ( typeof visible === 'undefined' ) {
			visible = true;
		}

		document.querySelector( '#scene3d-preview .fps-counter' ).style.display = visible ? 'inline-block' : 'none';
	}

	/**
	 * Toggle visibility of axes helper
	 *
	 * @param {boolean} visible
	 */
	toggleAxes( visible ) {
		if ( typeof visible === 'undefined' ) {
			visible = true;
		}
		if ( visible ) {
			this.scene.add( this.axesHelper );
		} else {
			this.scene.remove( this.axesHelper );
		}
	}

	/**
	 * Update light intensity of default lights
	 *
	 * @param {string} i intensity
	 * @param {string} what which light to update
	 */
	changeLightIntensity( i, what ) {
		switch ( what ) {
			case 'ambient':
			case 'directional':
			case 'hemi':
				this.lights[what].intensity = Math.abs( parseFloat( i ) );
				break;
			default:
		}
	}

	updateDLightShadow( value ) {
		this.lights.directional.castShadow = value === 'enabled';
	}

	/**
	 * Update the shadow camera size
	 *
	 * @param {string} number
	 */
	updateDLightCamera( number ) {
		const size                                   = parseInt( number );
		this.lights.directional.shadow.camera.top    = size;
		this.lights.directional.shadow.camera.right  = size;
		this.lights.directional.shadow.camera.bottom = - size;
		this.lights.directional.shadow.camera.left   = - size;
	}

	/**
	 * Update directional light position
	 *
	 * @param {string} x
	 * @param {string} y
	 * @param {string} z
	 */
	setDLightPosition( x, y, z ) {
		this.lights.directional.position.set( parseFloat( x ), parseFloat( y ), parseFloat( z ) );
		this.scene.updateMatrixWorld();
		this.lights.dlHelper.update();
	}

	/**
	 * Update directional light target position
	 *
	 * @param {string} x
	 * @param {string} y
	 * @param {string} z
	 */
	setDlightTarget( x, y, z ) {
		this.lights.directional.target.position.set( parseFloat( x ), parseFloat( y ), parseFloat( z ) );
		this.scene.updateMatrixWorld();
		this.lights.dlHelper.update();
	}

	/**
	 * Change a color
	 *
	 * @param {string} hexColor the color value
	 * @param {string} what which "stuff" does the color belongs to
	 * @param {string} id element id in case the color holder is a scene element
	 */
	changeColor( hexColor, what, id ) {
		switch ( what ) {
			case 'scene-bg':
				this.scene.background = new Color( hexColor );
				break;
			case 'ambient-color':
				this.lights.ambient.color = new Color( hexColor );
				break;
			case 'directional-color':
				this.lights.directional.color = new Color( hexColor );
				this.lights.dlHelper.update();
				break;
			case 'spotlight':
			case 'pointlight':
				this.elements[id].light.color = new Color( hexColor );
				this.elements[id].update();
				break;
			case 'hemi-groundcolor':
				this.lights.hemi.groundColor = new Color( hexColor );
				break;
			case 'hemi-skycolor':
				this.lights.hemi.color = new Color( hexColor );
				break;
			case 'fog':
				if ( this.fog ) {
					this.scene.fog.color = new Color( hexColor );
				}
				break;
			default:
		}
	}

	/**
	 * Get aspect ratio value
	 *
	 * @returns {number[]}
	 */
	getArValue() {
		const inputValue = this.arInput.value;
		if ( ! inputValue.match( /[0-9]+\.?[0-9]*:[0-9]+\.?[0-9]*/ ) ) {
			return [16, 9];
		}
		return inputValue.split( ':' ).map( function ( a ) {
			return parseFloat( a );
		} );
	}

	/**
	 * Update the orbit control target position
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	setControlTarget( x, y, z ) {
		this.controls.target.set( x, y, z );
	}

	/**
	 * Update camera position
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	setCameraPosition( x, y, z ) {
		this.camera.position.set( x, y, z );
		this.controls.update();
	}

	/**
	 * Orbit control `change` event listener
	 */
	orbitChange() {
		if ( this.wrapper === null ) {
			return;
		}

		if ( ! this.orbitChangeHandler ) {
			this.orbitChangeHandler = new Throttle(
				3,
				[],
				this,
				function () {
					document.dispatchEvent( new CustomEvent( 'scene3dOrbitChange', {detail: this.controls} ) );
				}
			);
		}

		this.orbitChangeHandler.call();
	}

	/**
	 * Remove an element from the scene
	 *
	 * @param {string} id the element ID
	 */
	removeFromScene( id ) {
		this.scene.remove( this.elements[id] );
		if ( typeof this.elements[id].light !== 'undefined' ) {
			this.scene.remove( this.elements[id].light );
			delete ( this.elements[id].light );
		}
		delete ( this.elements[id] );
	}

	/**
	 * Renderer `resize` event handler
	 */
	resize() {
		if ( this.wrapper === null ) {
			return;
		}

		if ( typeof this.resizer === 'undefined' ) {
			this.resizer = new Throttle(
				4,
				[],
				this,
				function () {
					const ar     = this.getArValue();
					const width  = document.fullscreenElement ? window.innerWidth : this.wrapper.clientWidth;
					const height = document.fullscreenElement ? window.innerHeight : this.wrapper.clientWidth * ( ar[1] / ar[0] );
					this.renderer.setSize( width, height );
					this.camera.aspect = width / height;
					this.camera.updateProjectionMatrix();
				}
			);
		}

		this.resizer.call();
	}

	/**
	 * Add a 3D model to the scene and the corresponding UI to the element list
	 *
	 * @param {{}} data parsed model data (containing the actual `Object3D` instance)
	 */
	modelLoaded( data ) {
		if ( data.error ) {
			let message = null;
			try {
				message = data.error.message;
			} catch ( Ex ) {
			}
			window.scene3dShowError( message );
			return;
		}
		const id = typeof data.model.id !== 'undefined' ? data.model.id : this.makeId();
		window.scene3dEditUI.appendElement( 'scene3d-gltf-fbx', data.template, id );
		this.add3dObject( data.model, id );
	}

	/**
	 * Apply 3D transform from post data to a 3D model
	 *
	 * @param {string} id element ID
	 * @param {Object3D} model 3d Model
	 */
	applyPostdataTransforms( id, model ) {
		const postdata = window.scene3dEditUI.getPostDataElements();

		if ( typeof postdata[id] === 'undefined' ) {
			return;
		}

		model.position.x   = parseFloat( postdata[id].position.x );
		model.position.y   = parseFloat( postdata[id].position.y );
		model.position.z   = parseFloat( postdata[id].position.z );
		model.scale.x      = parseFloat( postdata[id].scale.x );
		model.scale.y      = parseFloat( postdata[id].scale.y );
		model.scale.z      = parseFloat( postdata[id].scale.z );
		model.quaternion.x = parseFloat( postdata[id].quaternion.x );
		model.quaternion.y = parseFloat( postdata[id].quaternion.y );
		model.quaternion.z = parseFloat( postdata[id].quaternion.z );
		model.quaternion.w = parseFloat( postdata[id].quaternion.w );
	}

	/**
	 * Add a spot or point light ti the scene
	 *
	 * @param {string} id element ID
	 * @param {{}} data spot light data
	 * @param {string} type "spotlight"|"pointlight"
	 */
	addSpotPointLight( id, data, type ) {
		const light = type === 'spotlight'
			? new SpotLight(
				new Color( data.color ),
				data.intensity,
				data.distance,
				this.degToRad( data.angle ),
				data.penumbra,
				data.decay
			)
			: new PointLight(
				new Color( data.color ),
				data.intensity,
				data.distance,
				data.decay
			);

		if ( this.shadows ) {
			light.castShadow     = true;
			light.shadow.mapSize = new Vector2( this.shadowMapSize, this.shadowMapSize );
			light.shadow.bias    = - .0001;
		}

		light.position.set( data.position.x, data.position.y, data.position.z );

		const helper      = type === 'spotlight' ? new SpotLightHelper( light ) : new PointLightHelper( light, .5 );
		this.elements[id] = helper;
		this.scene.add( light );
		this.scene.add( helper );

		if ( type === 'spotlight' ) {
			light.target.position.set( data.target.x, data.target.y, data.target.z );
			this.scene.add( light.target );
		}
	}

	/**
	 * Add a 3D object to the scene
	 *
	 * @param {{}} modelData model data containing the `Object3D` instance
	 * @param {string} id element ID
	 */
	add3dObject( modelData, id ) {
		const object3d    = modelData.type === 'gltf' ? modelData.model.scene : modelData.model, model = modelData.model;
		this.elements[id] = object3d;

		this.applyPostdataTransforms( id, object3d );
		this.scene.add( object3d );

		if ( ! model.animations.length ) {
			return;
		}

		this.animClips[id] = {};

		if ( ! this.mixer ) {
			this.mixer      = new AnimationMixer( object3d );
			this.loop.mixer = this.mixer;
		}

		for ( const anim of model.animations ) {
			this.animClips[id][anim.name] = this.mixer.clipAction( anim, object3d );
		}

		const animFound = [];

		for ( const index in this.animStateQueue ) {
			if ( this.animStateQueue[index].id === id ) {
				animFound.push( index );
				this.updateAnimationsState( id, this.animStateQueue[index].clips );
			}
		}

		for ( const index of animFound ) {
			delete ( this.animStateQueue[index] );
		}
	}

	/**
	 * Play/stop animation
	 *
	 * @param {string} id element ID
	 * @param {AnimationClip} clips the animation data
	 */
	updateAnimationsState( id, clips ) {
		let empty = true;
		for ( const clipName in this.animClips[id] ) {
			if ( empty ) {
				empty = false;
			}
			if ( clips.indexOf( clipName ) !== - 1 ) {
				this.animClips[id][clipName].play();
			} else {
				this.animClips[id][clipName].stop();
			}
		}
		if ( ! empty ) {
			return;
		}
		this.animStateQueue.push( {id, clips} );
	}

	/**
	 * Apply transform on a 3D object on input change
	 *
	 * @param {{}} fields input data (parsed from the `name` attribute)
	 * @param {string} value input value
	 */
	applyTransform( fields, value ) {
		value      = parseFloat( value );
		const self = this;
		this.loop.actionQueue.push(
			{
				fn:   function ( args ) {
					const newValue = fields.type === 'rotation' ? self.degToRad( value ) : value;
					args[fields.type][fields.index] += newValue - args[fields.type][fields.index];
					if ( fields.type === 'rotation' ) {
						scene3dEditUI.updateQuaternionInputs( fields.id, args.quaternion );
					}
				},
				args: this.elements[fields.id]
			}
		);
	}

	/**
	 * Create unique ID
	 *
	 * @returns {string}
	 */
	makeId() {
		return Math.random().toString( 32 ).slice( 2 );
	}
}

window.addEventListener( 'DOMContentLoaded', function () {
	window.scene3dScene = new Scene3D( '#scene3d-preview' );
} );


