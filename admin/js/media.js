/**
 * Media library modal frame for gltf/FBX files
 */
( function ( $ ) {
	'use strict';
	const scene3dMediaFrame = function ( options ) {

		this.defaultOptions = {
			url:       null,
			alt:       null,
			mime:      ['model/gltf-binary'],
			mimeInput: null,
			notice:    null,
			size:      'thumbnail',
			id:        null,
			multiple:  false,
			onSelect:  false,
			name:      null
		};
		this.options        = $.extend( {}, this.defaultOptions, options );

		// Create an instance of wp.media for our usage
		this.wpMediaFrame = wp.media.frames.frame = wp.media( {
			title:    this.options.multiple ? scene3dMediaFrameLocale.selectMedias : scene3dMediaFrameLocale.selectMedia,
			button:   {
				text: scene3dMediaFrameLocale.button
			},
			multiple: this.options.multiple
		} );

		const self = this;

		// On media selected
		this.wpMediaFrame.on(
			'select',
			function () {
				if ( self.options.multiple || 'function' == typeof self.options.onSelect ) {
					if ( 'function' == typeof self.options.onSelect ) {
						self.options.onSelect( self.wpMediaFrame.state().get( 'selection' ).toJSON() );
					}
				} else {
					const attachment   = self.wpMediaFrame.state().get( 'selection' ).first().toJSON();
					const isValidMedia = self.options.mime.indexOf( attachment.mime ) !== - 1;
					if ( isValidMedia ) {
						if ( self.options.mimeInput ) {
							self.options.mimeInput.val( attachment.mime );
							self.options.mimeInput.trigger( 'change' );
						}
						if ( self.options.url ) {
							if ( self.options.size && 'undefined' != typeof attachment['sizes'][self.options.size] ) {
								self.options.url.val( attachment['sizes'][self.options.size]['url'] );
							} else {
								self.options.url.val( attachment.url );
							}
							self.options.url.trigger( 'change' );
						}
						if ( self.options.alt ) {
							self.options.alt.val( attachment.alt );
							self.options.alt.trigger( 'change' );
						}

						if ( self.options.name ) {
							if ( self.options.name.prop( 'tagName' ).toLowerCase() === 'input' ) {
								self.options.name.val( attachment.filename );
								self.options.name.trigger( 'change' );
							} else {
								self.options.name.text( attachment.filename );
							}
						}
						if ( self.options.notice ) {
							self.options.notice.empty();
						}
						if ( self.options.id ) {
							self.options.id.val( attachment.id );
							self.options.id.trigger( 'change' );
						}
					} else {
						// Mime type not allowed
						if ( self.options.notice ) {
							self.options.notice.text( scene3dMediaFrameLocale.invalidFileType );
						}
						if ( self.options.name && self.options.name.prop( 'tagName' ).toLowerCase() !== 'input' ) {
							self.options.name.empty();
						}
					}
				}
			} );

		this.wpMediaFrame.open();

		return this;
	};

	// Extend jQuery with this object.
	$.scene3dMediaFrame = function ( options ) {
		const wpWrap = $( '#wpwrap' );
		const data   = wpWrap.data( 'scene3dMediaFrame' );

		if ( data === undefined ) {
			wpWrap.data( 'scene3dMediaFrame', new scene3dMediaFrame( options ) );
		} else {
			data.options = $.extend( {}, data.defaultOptions, options );
			data.wpMediaFrame.open();
		}
	};

} )( window.jQuery );
