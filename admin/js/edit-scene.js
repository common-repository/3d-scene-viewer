( function ( $ ) {
	'use strict';

	/**
	 * Provide suggestions on a text input in a dropdown list
	 *
	 * @param {Element} wrapper
	 */
	const dropdownInput = function ( wrapper ) {
		this.wrapper = $( wrapper );
		this.list    = this.wrapper.find( '.dropdown-list' );
		this.input   = this.wrapper.find( 'input' );
		this.init();
	};

	dropdownInput.prototype = {
		constructor: dropdownInput,

		/**
		 * Event listener binding
		 */
		init: function () {
			this.resize();
			const self     = this;
			const observer = new ResizeObserver( function () {
				self.resize();
			} );
			observer.observe( this.input[0] );
			$( 'body' ).on( 'click', function () {
				self.bodyClick.apply( self );
			} );
			this.input.on( 'click', function ( ev ) {
				ev.stopPropagation();
				self.inputClick.apply( self, [ev] );
			} );
			this.list.find( '> div' ).on( 'click', function ( ev ) {
				self.listClick.apply( self, [ev] );
			} );
		},

		/**
		 * Click on one list element
		 *
		 * @param {Event} ev
		 */
		listClick( ev ) {
			this.input.val( $( ev.target ).attr( 'data-val' ) );
			this.input[0].dispatchEvent( new Event( 'change' ) );
		},

		/**
		 * Clickon the text input
		 *
		 * @param {Event} ev
		 */
		inputClick( ev ) {
			if ( this.list.is( ':visible' ) ) {
				return;
			}
			this.list.css( 'display', 'inline-block' );
		},

		/**
		 * Hide the list on click anywhere else
		 */
		bodyClick: function () {
			if ( ! this.list.is( ':visible' ) ) {
				return;
			}
			this.list.css( 'display', 'none' );
		},

		resize: function () {
			const topMargin = this.input.parent().hasClass( 'dropdown-input' ) ? this.input.height() : this.input.parent().height;
			this.list.css( 'top', ( topMargin + 2 ) + 'px' ).css( 'min-width', this.input.width() + 'px' );
		}
	};

	/**
	 * Show a description for each option of a select input
	 *
	 * @param select
	 */
	const dynamicDesc = function ( select ) {
		this.input    = select;
		this.p        = select.siblings( '.description.dynamic' );
		this.descData = JSON.parse( decodeURIComponent( this.p.data( 'descriptions' ) ) );
		const self    = this;
		select.on( 'change', function () {
			self.change();
		} );
	};

	dynamicDesc.prototype = {
		constructor: dynamicDesc,
		change:      function () {
			const value = this.input.val();
			this.p.text( typeof this.descData[value] !== 'undefined' ? this.descData[value] : '' );
		}
	};

	/**
	 * Copy text into the clipboard
	 */
	$( document ).on( 'click', '#usage .copy', function () {
		const el = jQuery( this );
		navigator.clipboard.writeText( el.siblings( 'input' ).val() );
		const toggleClass = function ( el ) {
			el.toggleClass( 'dashicons-admin-page' );
			el.toggleClass( 'dashicons-saved' );
		};

		toggleClass( el );

		setTimeout( function () {
			toggleClass( el );
		}, 1000 );
	} );

	/**
	 * Show an error message at the top of the page
	 *
	 * @param {string} message
	 */
	window.scene3dShowError = function ( message ) {
		console.log( message );
		$( '#async-errors p' ).html( message );
		$( '#async-errors' ).fadeIn();
	};

	$( document ).on( 'keydown', '.postbox input', function ( ev ) {
		if ( ev.key.toLowerCase() === 'enter' ) {
			ev.preventDefault();
		}
	} );

	// DOM ready
	$( function () {
		$( '.postbox .acc' ).accordion( {
			header:      '.acc-head',
			active:      0,
			collapsible: true,
			heightStyle: 'content'
		} );

		$( '.inside .dynamic-description' ).each( function () {
			new dynamicDesc( $( this ) ).change();
		} );

		$( '.inside .dropdown-input' ).each( function () {
			new dropdownInput( this );
		} );

	} );

} )( window.jQuery );
