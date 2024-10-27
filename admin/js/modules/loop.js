import {Clock} from '../../../includes/js/3js/src/Three.js';

'use strict';

/**
 * The animation loop
 */
export class Loop {
	/**
	 * Constructor
	 *
	 * @param {WebGLRenderer} renderer the render
	 * @param {Scene} scene the preview scene
	 * @param {PerspectiveCamera} camera the camera
	 * @returns {Loop}
	 */
	constructor( renderer, scene, camera ) {
		this.renderer    = renderer;
		this.scene       = scene;
		this.camera      = camera;
		this.actions     = {};
		this.actionQueue = [];
		this.animations  = {};
		this.mixer       = null;

		this.clock = new Clock();
		this.clock.start();

		this.fpsData = {
			frames: 0,
			time:   []
		};
		this.fpsDiv  = {};
		this.init();
		return this;
	}

	/**
	 * Set up FPS counter
	 */
	init() {
		const self = this;
		setInterval( function () {
			const sum                  = self.fpsData.time.reduce( function ( sum, t ) {
				return sum + t;
			}, 0 );
			const avg                  = parseInt( ( sum / self.fpsData.time.length ) * 10000 ) / 10;
			self.fpsDiv.fps.innerText  = self.fpsData.frames * 2;
			self.fpsDiv.time.innerText = avg;
			self.fpsData               = {
				frames: 0,
				time:   []
			};
		}, 500 );
	}

	/**
	 * Register an FPS counter markup
	 *
	 * @param {Element} fps the FPS element
	 * @param {Element} time the frame time element
	 * @returns {Loop}
	 */
	setFpsDiv( fps, time ) {
		this.fpsDiv = {
			fps:  fps,
			time: time
		};
		return this;
	}

	/**
	 * Update frame count
	 *
	 * @param {float} delta
	 */
	updateFps( delta ) {
		this.fpsData.frames ++;
		this.fpsData.time.push( delta );
	}

	/**
	 * Register the orbit controls
	 *
	 * @param {OrbitControls} controls
	 * @returns {Loop}
	 */
	addControls( controls ) {
		this.controls = controls;
		return this;
	}

	/**
	 * The animate loop function
	 */
	animate() {
		const self = this;
		requestAnimationFrame( function () {
			self.animate();
		} );

		const delta = this.clock.getDelta();
		this.updateFps( delta );

		if ( this.mixer ) {
			this.mixer.update( delta );
		}

		if ( this.actionQueue.length ) {
			for ( const action of this.actionQueue ) {
				if ( typeof action.fn === 'function' ) {
					action.fn.apply( null, [action.args] );
				}
			}
			this.actionQueue = [];
		}

		if ( typeof this.controls !== 'undefined' ) {
			this.controls.update();
		}
		this.renderer.render( this.scene, this.camera );
	}
}
