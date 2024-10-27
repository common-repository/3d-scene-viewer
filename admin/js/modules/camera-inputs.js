'use strict';

/**
 * Update camera on input change
 */
export class CameraInputs {
	/**
	 * List of all inputs
	 *
	 * @type {{}}
	 */
	inputs = {};

	/**
	 * The scene
	 *
	 * @type {Scene}
	 */
	scene;

	/**
	 * Constructor
	 *
	 * @param {{}} inputs input lists
	 * @param {Scene} scene the scene
	 * @param {string} cssClass common CSS class to the inputs
	 */
	constructor( inputs, scene, cssClass ) {
		const self  = this;
		this.inputs = {};
		this.scene  = scene;

		for ( const i in inputs ) {
			this.inputs[i] = {
				'name': inputs[i]
			};
			const input    = document.querySelector( '[name="' + inputs[i] + '"]' );
			if ( input.min ) {
				this.inputs[i].min = parseFloat( input.min );
			}
			if ( input.max ) {
				this.inputs[i].max = parseFloat( input.max );
			}
		}

		document.querySelectorAll( '.' + cssClass ).forEach( function ( input ) {
			input.addEventListener( 'change', function ( ev ) {
				ev.stopPropagation();
				self.inputChanged.apply( self, [input] );
			} );
		} );

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
	 * Input `change` event handler
	 *
	 * @param {Element} input
	 */
	inputChanged( input ) {
		const name = input.getAttribute( 'name' );

		if ( name === 'camera[controls]' ) {
			return;
		}

		const index                       = name.substring( 7, name.length - 1 );
		const value                       = this.getValue( index );
		input.value                       = value;
		const props                       = {
			'controls':    'enabled',
			'pan':         'enablePan',
			'maxAzimuth':  'maxAzimuthAngle',
			'minAzimuth':  'minAzimuthAngle',
			'maxPolar':    'maxPolarAngle',
			'minPolar':    'minPolarAngle',
			'maxDistance': 'maxDistance',
			'minDistance': 'minDistance'
		};
		this.scene.controls[props[index]] = props[index].indexOf( 'Angle' ) !== - 1 ? this.degToRad( value ) : value;
	}

	/**
	 * Get the input value and return something recognized by the orbit controls
	 *
	 * @param {string} field input identifier
	 * @returns {number|boolean|null}
	 */
	getValue( field ) {
		if ( typeof this.inputs[field] === 'undefined' ) {
			return null;
		}

		if ( field === 'controls' ) {
			return document.querySelector( '[name="' + this.inputs.controls.name + '"]' ).checked;
		}

		if ( field === 'pan' ) {
			return document.querySelector( '[name="' + this.inputs.pan.name + '"]' ).checked;
		}

		const input = document.querySelector( '[name="' + this.inputs[field].name + '"]' );
		const value = parseFloat( input.value );

		if ( ['camera[maxDistance]', 'camera[maxAzimuth]', 'camera[minAzimuth]'].indexOf( input.name ) !== - 1 ) {
			return isNaN( value ) || value === Infinity ? Infinity : this.applyLimits( field, parseFloat( input.value ) );
		}

		return this.applyLimits( field, parseFloat( input.value ) );
	}

	/**
	 * Enforce the "min" an "max" values of the inputs
	 *
	 * @param {string} field filed iD
	 * @param {number} value the field value
	 * @returns {number}
	 */
	applyLimits( field, value ) {
		if ( typeof this.inputs[field].min !== 'undefined' ) {
			value = Math.max( value, this.inputs[field].min );
		}
		if ( typeof this.inputs[field].max !== 'undefined' ) {
			value = Math.min( value, this.inputs[field].max );
		}
		return value;
	}
}
