import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	AmbientLight,
	DirectionalLight,
	AnimationMixer,
	Color,
	SpotLight,
	PointLight,
	PCFSoftShadowMap,
	Vector2,
	Clock,
	Fog,
	Mesh,
	MeshPhongMaterial,
	GridHelper,
	PlaneGeometry,
	Group
} from './3js/src/Three.js';
import {OrbitControls} from './3js/controls/OrbitControls.js';
import {Throttle} from './throttle.js';
import {FBXLoader} from './3js/loader/FBXLoader.js';
import {GLTFLoader} from './3js/loader/GLTFLoader.js';

'use strict';

export class Scene3d {
	/**
	 * Renderer wrapper div
	 *
	 * Will be a child of the scene DIV wrapper
	 *
	 * @type {Element}
	 */
	wrapper;

	/**
	 * Aspect ratio
	 *
	 * @type {[]}
	 */
	ar;

	/**
	 * The scene renderer
	 *
	 * @type {WebGLRenderer}
	 */
	renderer;

	/**
	 * Scene elements from inline data
	 *
	 * @type {{}}
	 */
	elementsData;

	/**
	 * Actual scene elements
	 *
	 * @type {object}
	 */
	elements = {};

	/**
	 * Elements that need to be loaded asynchronously
	 *
	 * @type {number}
	 */
	elementsToLoad = 0;

	/**
	 * The scene
	 *
	 * @type {Scene}
	 */
	scene;

	/**
	 * The camera
	 *
	 * @type {PerspectiveCamera}
	 */
	camera;

	/**
	 * Shadow map size for all light
	 *
	 * @type {int}
	 */
	shadowMapSize;

	/**
	 * Camera acontrols
	 *
	 * @type {OrbitControls}
	 */
	controls;

	/**
	 * Resize function
	 *
	 * @type {Throttle}
	 */
	resizer;

	/**
	 * Fullscreen button
	 *
	 * @type {Element}
	 */
	fsButton;

	/**
	 * glTF file loader
	 *
	 * @type {GLTFLoader}
	 */
	gltfLoader;

	/**
	 * FBX file loader
	 *
	 * @type {FBXLoader}
	 */
	fbxLoader;

	/**
	 * Animation mixer
	 *
	 * @type {AnimationMixer}
	 */
	mixer;

	/**
	 * Three.js clock
	 *
	 * @type {Clock}
	 */
	clock;

	/**
	 * Fog
	 *
	 * @type {Fog}
	 */
	fog;

	/**
	 * Constructor
	 *
	 * @param {Element} wrapper
	 */
	constructor( wrapper ) {
		this.wrapper = wrapper.querySelector( '.scene3d-renderer-wrap' );

		const data = JSON.parse( decodeURIComponent( wrapper.querySelector( 'script' ).innerHTML.trim() ) );
		this.ar    = data.ar;

		if ( data.fullscreen ) {
			this.fsButton = this.wrapper.querySelector( '.fs-button' );
		}

		this.scene            = new Scene();
		this.scene.background = new Color( data.settings.color );

		this.camera = new PerspectiveCamera(
			data.camera.fov,
			this.ar[0] / this.ar[1],
			data.camera.near,
			data.camera.far
		);

		this.elementsData                     = data.elements;
		this.renderer                         = new WebGLRenderer();
		this.renderer.physicallyCorrectLights = true;

		if ( data.settings.shadow === 'enabled' ) {
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type    = PCFSoftShadowMap;
			this.shadowMapSize              = data.settings.shadowMapSize;
		}

		if ( data.ambient_light ) {
			this.scene.add( new AmbientLight( new Color( data.ambient_light.color ), data.ambient_light.intensity ) );
		}

		if ( data.directional_light ) {
			const dirLight         = new DirectionalLight( new Color( data.directional_light.color ), data.directional_light.intensity );
			const dirLightPosition = data.directional_light.position;
			const dirLightTarget   = data.directional_light.target;
			dirLight.position.set( dirLightPosition.x, dirLightPosition.y, dirLightPosition.z );
			dirLight.target.position.set( dirLightTarget.x, dirLightTarget.y, dirLightTarget.z );

			if ( data.settings.shadow === 'enabled' && data.directional_light.shadow === 'enabled' ) {
				dirLight.castShadow     = true;
				dirLight.shadow.mapSize = new Vector2( this.shadowMapSize, this.shadowMapSize );
				dirLight.shadow.bias    = - .0001;
			}

			this.scene.add( dirLight );
			this.scene.add( dirLight.target );
		}

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );

		this.camera.position.set( data.camera.position.x, data.camera.position.y, data.camera.position.z );
		this.controls.target.set( data.camera.target.x, data.camera.target.y, data.camera.target.z );
		this.controls.maxAzimuthAngle = data.camera.maxAzimuth === 'Infinity' ? Infinity : this.degToRad( data.camera.maxAzimuth );
		this.controls.minAzimuthAngle = data.camera.minAzimuth === 'Infinity' ? Infinity : this.degToRad( data.camera.minAzimuth );
		this.controls.maxPolarAngle   = this.degToRad( data.camera.maxPolar );
		this.controls.minPolarAngle   = this.degToRad( data.camera.minPolar );
		this.controls.maxDistance     = data.camera.maxDistance === 'Infinity' ? Infinity : data.camera.maxDistance;
		this.controls.minDistance     = data.camera.minDistance;
		this.controls.enablePan       = data.camera.pan;

		this.controls.update();

		if ( data.fog !== null ) {
			this.fog       = new Fog(
				new Color( data.fog.color ),
				data.fog.near,
				data.fog.far
			);
			this.scene.fog = this.fog;
		}

		if ( ! data.camera.controls ) {
			this.controls.enabled = false;
		}

		this.wrapper.appendChild( this.renderer.domElement );

		const wrapWidth = this.wrapper.clientWidth;
		this.renderer.setSize( wrapWidth, wrapWidth * ( this.ar[1] / this.ar[0] ) );

		this.resize();

		this.bindEvents();

		this.clock = new Clock();
		this.clock.start();

		this.animate();
		this.addElements();
		/**
		 * DEBUG
		 *
		 * @type {Scene3d}
		 */
		if ( ! window.debugscene ) {
			window.debugscene = [];
		}
		window.debugscene.push( this );
	}

	/**
	 * Bing event listeners
	 */
	bindEvents() {
		const self = this;
		if ( this.fsButton ) {
			this.fsButton.addEventListener( 'click', function () {
				self.renderer.domElement.requestFullscreen();
			} );
		}

		this.renderer.domElement.addEventListener( 'fullscreenchange', function () {
			self.resize.apply( self );
		} );

		const observer = new ResizeObserver( function () {
			self.resize.apply( self );
		} );

		observer.observe( this.wrapper );
	}

	/**
	 * Add scene elements
	 */
	addElements() {
		for ( const id in this.elementsData ) {
			const el = this.elementsData[id];
			switch ( el.type ) {
				case 'fbx':
				case 'gltf':
					this.elementsToLoad ++;
					this.loadModel( id, el );
					break;
				case 'spotlight':
				case 'pointlight':
					const light = el.type === 'spotlight'
						? new SpotLight( new Color( el.color ), el.intensity, el.distance, this.degToRad( el.angle ), el.penumbra, el.decay )
						: new PointLight( new Color( el.color ), el.intensity, el.distance, el.decay );
					light.position.set( el.position.x, el.position.y, el.position.z );

					if ( el.type === 'spotlight' ) {
						light.target.position.set( el.target.x, el.target.y, el.target.z );
					}

					this.elements[id] = light;
					if ( this.shadowMapSize ) {
						light.castShadow     = true;
						light.shadow.mapSize = new Vector2( this.shadowMapSize, this.shadowMapSize );
						light.shadow.bias    = - .0001;
					}
					this.scene.add( light );
					break;
				case 'floor':
					const mesh = new Mesh(
						new PlaneGeometry( el.size, el.size ),
						new MeshPhongMaterial( {color: new Color( el.color ), depthWrite: false} )
					);

					const floor = new Group();

					if ( this.shadowMapSize ) {
						mesh.receiveShadow = true;
					}

					mesh.rotation.x = - Math.PI / 2;
					floor.add( mesh );

					if ( el.grid !== '' ) {
						const grid                = new GridHelper( el.size, el.gridDivisions, new Color( el.gridColor ), new Color( el.gridColor ) );
						grid.material.opacity     = el.gridOpacity;
						grid.material.transparent = true;
						floor.add( grid );
					}

					this.elements['floor'] = floor;
					this.scene.add( floor );

					break;
				default:
			}
		}

		if ( ! this.elementsToLoad ) {
			const overlay = this.wrapper.querySelector( '.loading-overlay' );
			if ( overlay ) {
				overlay.parentNode.removeChild( overlay );
			}
		}
	}

	/**
	 * Load 3D model then add it to the scene
	 *
	 * @param {string} id element id
	 * @param {object} el element data
	 */
	loadModel( id, el ) {
		if ( ! this.gltfLoader ) {
			this.gltfLoader = new GLTFLoader();
		}

		if ( ! this.fbxLoader ) {
			this.fbxLoader = new FBXLoader();
		}

		const self   = this;
		const loader = el.type === 'gltf' ? this.gltfLoader : this.fbxLoader;

		loader.load(
			el.url,
			function ( model ) {
				const object3d = el.type === 'gltf' ? model.scene : model;
				object3d.traverse( function ( child ) {
					if ( child.isMesh && self.shadowMapSize && el.shadows !== '' ) {
						child.castShadow    = ['c', 'cr'].indexOf( el.shadows ) !== - 1;
						child.receiveShadow = ['r', 'cr'].indexOf( el.shadows ) !== - 1;
					}
					if ( el.type === 'gltf' && ( child.isSpotLight || child.isPointLight ) ) {
						child.intensity = child.intensity / 543.5141306588226;

						if ( self.shadowMapSize ) {
							child.castShadow     = true;
							child.shadow.bias    = - .0001;
							child.shadow.mapSize = new Vector2( self.shadowMapSize, self.shadowMapSize );
						}
					}
				} );

				self.applyModelTransforms(
					object3d,
					{
						position:   {
							x: el.position.x,
							y: el.position.y,
							z: el.position.z
						},
						scale:      {
							x: el.scale.x,
							y: el.scale.y,
							z: el.scale.z
						},
						quaternion: {
							x: el.quaternion.x,
							y: el.quaternion.y,
							z: el.quaternion.z,
							w: el.quaternion.w
						}
					}
				);

				self.elements[id] = object3d;
				self.scene.add( object3d );
				self.elementsToLoad --;
				self.setupAnimations.apply( self, [model, object3d, el] );

				if ( self.elementsToLoad === 0 ) {
					const overlay = self.wrapper.querySelector( '.loading-overlay' );
					if ( overlay ) {
						overlay.parentNode.removeChild( overlay );
					}
				}

			},
			undefined,
			function ( error ) {
				console.error( error );
			}
		);
	}

	/**
	 * Set up and model animations
	 *
	 * @param {object} model the 3D model data
	 * @param {Object3D} object3d the actual 3D object
	 * @param {object} el scene element
	 */
	setupAnimations( model, object3d, el ) {
		if ( typeof el.playedAnim === 'undefined' ) {
			return;
		}
		if ( ! this.mixer ) {
			this.mixer = new AnimationMixer( object3d );
		}
		for ( const animName of el.playedAnim ) {
			for ( const clip of model.animations ) {
				if ( clip.name === animName ) {
					this.mixer.clipAction( clip, object3d ).play();
				}
			}
		}
	}

	/**
	 * Apply 3D transform after adding 3D objects or lights to the scene
	 *
	 * @param {object}  model 3d model data
	 * @param {object}  transforms 3d transforms to be applied
	 */
	applyModelTransforms( model, transforms ) {
		if ( typeof transforms.position !== 'undefined' ) {
			model.position.set(
				transforms.position.x,
				transforms.position.y,
				transforms.position.z
			);
		}
		if ( typeof transforms.scale !== 'undefined' ) {
			model.scale.set(
				transforms.scale.x,
				transforms.scale.y,
				transforms.scale.z
			);
		}
		if ( typeof transforms.quaternion !== 'undefined' ) {
			model.quaternion.x = transforms.quaternion.x;
			model.quaternion.y = transforms.quaternion.y;
			model.quaternion.z = transforms.quaternion.z;
			model.quaternion.w = transforms.quaternion.w;
		}
	}

	/**
	 * Animation loop function
	 */
	animate() {
		const self = this;
		requestAnimationFrame( function () {
			self.animate();
		} );

		if ( this.mixer ) {
			this.mixer.update( this.clock.getDelta() );
		}

		this.controls.update();
		this.renderer.render( this.scene, this.camera );
	}

	/**
	 * Resize event handler
	 */
	resize() {
		if ( typeof this.resizer === 'undefined' ) {
			this.resizer = new Throttle(
				5,
				[],
				this,
				function () {
					const width  = document.fullscreenElement ? window.innerWidth : this.wrapper.clientWidth;
					const height = document.fullscreenElement ? window.innerHeight : this.wrapper.clientWidth * ( this.ar[1] / this.ar[0] );
					this.renderer.setSize( width, height );
					this.camera.aspect = width / height;
					this.camera.updateProjectionMatrix();
				}
			);
		}

		this.resizer.call();
	}

	/**
	 * Convert degrees to radians
	 *
	 * @param {number} deg
	 * @returns {number}
	 */
	degToRad( deg ) {
		return deg * Math.PI / 180;
	}
}
