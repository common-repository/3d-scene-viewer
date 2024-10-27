( function ( $ ) {
	'use strict';

	// Default floor data
	const defaultValues = {
		type:          'floor',
		size:          1500,
		color:         '#ffffff',
		grid:          '',
		gridDivisions: 15,
		gridColor:     '#1c1c1c',
		gridOpacity:   .2
	};

	$( document ).on( 'scene3d-new-element', function ( ev ) {
		if ( ev.detail !== 'floor' ) {
			return;
		}
		window.scene3dEditUI.appendElement( 'scene3d-floor', defaultValues, 'floor' );
	} );

	/**
	 * Create scene element data from inline data
	 *
	 * @param {object} postData data from  post content
	 * @returns {{size: number, color, grid, gridColor: string, gridOpacity: number, gridDivisions: number, type: string}}
	 */
	window.scene3dFormatFloorData = function ( postData ) {
		return {
			type:          'floor',
			size:          parseFloat( postData.size ),
			color:         postData.color,
			grid:          postData.grid,
			gridColor:     postData.gridColor,
			gridDivisions: parseFloat( postData.gridDivisions ),
			gridOpacity:   parseFloat( postData.gridOpacity )
		};
	};

} )( window.jQuery );
