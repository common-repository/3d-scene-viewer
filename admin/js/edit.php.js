/**
 * Copy code in clipboard
 */
jQuery( document ).on( 'click', '.copy-code', function () {
	'use strict';

	const el = jQuery( this );
	navigator.clipboard.writeText( atob( el.data( 'code' ) ) );

	const toggleClass = function ( el ) {
		el.toggleClass( 'dashicons-admin-page' );
		el.toggleClass( 'dashicons-saved' );
	};

	toggleClass( el );

	setTimeout( function () {
		toggleClass( el );
	}, 1000 );
} );
