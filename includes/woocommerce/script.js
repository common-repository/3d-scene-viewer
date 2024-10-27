( function ( $ ) {
	'use strict';

	const link   = $( '#product-3d-scene-link' );

	$( document ).on( 'click', '#product-3d-scene-link', function () {
		if ( link.attr( 'href' ) === '#' ) {
			return false;
		}
	} );

	$( document ).on( 'change', '#product-3d-scene', function () {
		updateLink();
	} );

	/**
	 * Update edit link on select input change
	 */
	function updateLink() {
		const value = $( '#product-3d-scene' ).val();
		link.attr( 'href', value ? link.data( 'pattern' ).replace( '%ID%', value ) : '#' );
	}

	$( function () {
		updateLink();
	} );

} )( window.jQuery );
