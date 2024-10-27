( function ( $ ) {
	'use strict';

	// Default point light data
	const defaultValues = {
		type:      'pointlight',
		color:     '#ffee88',
		intensity: 2,
		distance:  0,
		decay:     2,
		position:  {
			x: 0,
			y: 2,
			z: 3
		}
	};

	$( document ).on( 'scene3d-new-element', function ( ev ) {
		if ( ev.detail !== 'pointlight' ) {
			return;
		}
		window.scene3dEditUI.appendElement( 'scene3d-pointlight', defaultValues, window.scene3dScene.makeId() );
	} );

	$( document ).on( 'scene3dColorChange', function ( ev ) {
		const name = window.scene3dEditUI.splitInputName( ev.detail.name );

		if ( name[0] !== 'elements' ) {
			return;
		}

		const scene = window.scene3dScene;

		if ( typeof scene.elements[name[1]].light === 'undefined' || typeof scene.elements[name[1]].light.isPointLight === 'undefined' ) {
			return;
		}

		scene.changeColor( ev.detail.color, 'pointlight', name[1] );
	} );

	/**
	 * Update the in-scene point light on change of it's setting input
	 */
	$( document ).on( 'change', '[class^="pointlight"]', function ( ev ) {
		const name  = window.scene3dEditUI.splitInputName( ev.target.name );
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
			case 'intensity':
			case 'decay':
			case 'distance':
				scene.elements[id].light[name[2]] = parseFloat( ev.target.value );
				break;
			default:
		}
	} );

	/**
	 * Create scene element data from inline data
	 *
	 * @param postData
	 * @returns {{intensity: number, color, distance: number, decay: number, position: {x: number, y: number, z: number}, type: string}}
	 */
	window.scene3dFormatPointLightData = function ( postData ) {
		return {
			type:      'pointlight',
			color:     postData.color,
			intensity: parseFloat( postData.intensity ),
			distance:  parseFloat( postData.distance ),
			decay:     parseFloat( postData.decay ),
			position:  {
				x: parseFloat( postData.position.x ),
				y: parseFloat( postData.position.y ),
				z: parseFloat( postData.position.z )
			}
		};
	};

} )( window.jQuery );
