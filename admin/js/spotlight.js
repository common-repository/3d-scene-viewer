( function ( $ ) {
	'use strict';

	// Default spot light data
	const defaultValues = {
		type:      'spotlight',
		color:     '#ffee88',
		intensity: 1,
		distance:  0,
		angle:     60,
		penumbra:  0,
		decay:     1,
		position:  {
			x: 0,
			y: 6,
			z: 3
		},
		target:    {
			x: 0,
			y: 0,
			z: 0
		}
	};

	$( document ).on( 'scene3d-new-element', function ( ev ) {
		if ( ev.detail !== 'spotlight' ) {
			return;
		}
		window.scene3dEditUI.appendElement( 'scene3d-spotlight', defaultValues, window.scene3dScene.makeId() );
	} );

	$( document ).on( 'scene3dColorChange', function ( ev ) {
		const name = window.scene3dEditUI.splitInputName( ev.detail.name );

		if ( name[0] !== 'elements' ) {
			return;
		}

		const scene = window.scene3dScene;

		if ( typeof scene.elements[name[1]].light === 'undefined' || typeof scene.elements[name[1]].light.isSpotLight === 'undefined' ) {
			return;
		}

		scene.changeColor( ev.detail.color, 'spotlight', name[1] );

	} );

	$( document ).on( 'change', '[class^="spotlight"]', function ( ev ) {
		inputChange( ev.target );
	} );

	/**
	 * Update the in-scene light on change of it's setting input
	 *
	 * @param {Element} input
	 */
	function inputChange( input ) {
		const name  = window.scene3dEditUI.splitInputName( input.name );
		const scene = window.scene3dScene;
		const id    = name[1];

		switch ( name[2] ) {
			case 'position':
				scene.elements[id].light.position.set(
					parseFloat( $( '[name="elements\[' + id + '\]\[position\]\[x\]"]' ).val() ),
					parseFloat( $( '[name="elements\[' + id + '\]\[position\]\[y\]"]' ).val() ),
					parseFloat( $( '[name="elements\[' + id + '\]\[position\]\[z\]"]' ).val() )
				);
				break;
			case 'target':
				scene.elements[id].light.target.position.set(
					parseFloat( $( '[name="elements\[' + id + '\]\[target\]\[x\]"]' ).val() ),
					parseFloat( $( '[name="elements\[' + id + '\]\[target\]\[y\]"]' ).val() ),
					parseFloat( $( '[name="elements\[' + id + '\]\[target\]\[z\]"]' ).val() )
				);
				break;
			case 'intensity':
			case 'decay':
			case 'penumbra':
			case 'distance':
				scene.elements[id].light[name[2]] = parseFloat( input.value );
				break;
			case 'angle':
				scene.elements[id].light[name[2]] = parseFloat( scene.degToRad( input.value ) );
				scene.elements[id].update();
				break;
			default:
		}
	}

	/**
	 * Create spot light element data from post data
	 *
	 * @param {object} postData
	 * @returns {{intensity: number, penumbra: number, color, distance: number, angle: number, decay: number, position: {x: number, y: number, z: number}, type: string, target: {x: number, y: number, z: number}}}
	 */
	window.scene3dFormatSpotLightData = function ( postData ) {
		return {
			type:      'spotlight',
			color:     postData.color,
			intensity: parseFloat( postData.intensity ),
			distance:  parseFloat( postData.distance ),
			angle:     parseFloat( postData.angle ),
			penumbra:  parseFloat( postData.penumbra ),
			decay:     parseFloat( postData.decay ),
			position:  {
				x: parseFloat( postData.position.x ),
				y: parseFloat( postData.position.y ),
				z: parseFloat( postData.position.z )
			},
			target:    {
				x: parseFloat( postData.target.x ),
				y: parseFloat( postData.target.y ),
				z: parseFloat( postData.target.z )
			}
		};
	};

} )( window.jQuery );
