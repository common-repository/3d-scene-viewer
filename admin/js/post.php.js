( function ( $ ) {
	'use strict';

	class scene3dEditUI {
		/**
		 * Functions to be executed when the scene is ready
		 *
		 * @type {[]}
		 */
		sceneCommandQueue = [];

		/**
		 * Constructor
		 */
		constructor() {
			this.init();
		}

		setupElementsAccordion() {
			const list = $( '#elements-list ' );
			if ( list.hasClass( 'ui-accordion' ) ) {
				list.accordion( 'refresh' );
			} else {
				list.accordion( {
					header:      '.element-head',
					active:      false,
					collapsible: true
				} );
			}
		}

		/**
		 * Event binding
		 */
		init() {
			const self = this;

			// Scene is set up
			$( document ).on( 'scene3dReady', function ( ev ) {
				self.loadElementsFromPostdata( ev.detail.scene, self.decodeData( $( '#elements-postdata' ).val() ) );
				for ( const task of self.sceneCommandQueue ) {
					ev.detail.scene[task.method].apply( ev.detail.scene, task.args );
				}
			} );

			$( '.inside .cpicker input[type="text"]' ).each( function () {
				const input = $( this );
				const what  = input.data( 'what' );
				input.wpColorPicker( {
					'change': function ( ev, ui ) {
						window.scene3dScene.changeColor( ui.color.toCSS( 'hex' ), what );
					}
				} );
			} );

			/**
			 * Default lights
			 */
			$( document ).on( 'change', '[name="settings\[ambientLight\]\[intensity\]"]', function () {
				window.scene3dScene.changeLightIntensity( $( this ).val(), 'ambient' );
			} );

			$( document ).on( 'change', '[name="settings\[hemiLight\]\[intensity\]"]', function () {
				window.scene3dScene.changeLightIntensity( $( this ).val(), 'hemi' );
			} );

			$( document ).on( 'change', '[name="settings\[directionLight\]\[intensity\]"]', function () {
				window.scene3dScene.changeLightIntensity( $( this ).val(), 'directional' );
			} );

			$( document ).on( 'change', '[name^="settings\[directionLight\]\[position\]"]', function () {
				window.scene3dScene.setDLightPosition(
					$( '[name="settings\[directionLight]\[position\]\[x\]"]' ).val(),
					$( '[name="settings\[directionLight]\[position\]\[y\]"]' ).val(),
					$( '[name="settings\[directionLight]\[position\]\[z\]"]' ).val()
				);
			} );

			$( document ).on( 'change', '[name^="settings\[directionLight\]\[target\]"]', function () {
				window.scene3dScene.setDlightTarget(
					$( '[name="settings\[directionLight]\[target\]\[x\]"]' ).val(),
					$( '[name="settings\[directionLight]\[target\]\[y\]"]' ).val(),
					$( '[name="settings\[directionLight]\[target\]\[z\]"]' ).val()
				);
			} );

			$( document ).on( 'change', '[name^="settings\[directionLight\]\[camera\]"]', function () {
				window.scene3dScene.updateDLightCamera( $( this ).val() );
			} );

			/**
			 * Dashboard preview (FPS & axes)
			 */
			$( document ).on( 'click', '[name="previewSettings\[fps\]"]', function () {
				window.scene3dScene.toggleFps( $( this ).prop( 'checked' ) );
			} );

			$( document ).on( 'click', '[name="previewSettings\[axes\]"]', function () {
				window.scene3dScene.toggleAxes( $( this ).prop( 'checked' ) );
			} );

			/**
			 * Scene elements
			 */
			$( document ).on( 'click', '#add-element', function ( ev ) {
				ev.preventDefault();
				const select = $( '#new-element' );
				const value  = select.val();
				const mime   = {
					glb: 'model/gltf-binary',
					fbx: 'model/fbx-binary'
				};

				switch ( value ) {
					case 'glb':
					case'fbx':
						$.scene3dMediaFrame( {
							url:       $( '#attachment-url' ),
							notice:    $( '#attachment-error' ),
							mime:      [mime[value]],
							mimeInput: $( '#attachment-type' ),
							size:      false,
							name:      $( '#attachment-filename' )
						} );
						break;
					default:
						document.dispatchEvent( new CustomEvent( 'scene3d-new-element', {detail: value} ) );
				}
				select.val( '' );
			} );

			$( document ).on( 'change', '#attachment-url', function () {
				const mime = $( '#attachment-type' ).val();
				if ( mime === 'model/gltf-binary' ) {
					window.Scene3dGetLoader().load( $( this ).val(), mime );
				}
				if ( mime === 'model/fbx-binary' ) {
					window.Scene3dGetLoader().load( $( this ).val(), mime );
				}
			} );

			$( document ).on( 'change', '#elements-list input.transform', function () {
				window.scene3dScene.applyTransform( self.getTransformFields( $( this ).attr( 'name' ) ), $( this ).val() );
			} );

			$( document ).on( 'keydown', 'input.transform', function ( ev ) {
				if ( ev.key !== 'Enter' ) {
					return;
				}
				ev.preventDefault();
			} );

			$( document ).on( 'change', '.play-anim', function () {
				const id = $( this ).attr( 'data-elemid' );
				window.scene3dScene.updateAnimationsState( id, self.getPlayedClips( id ) );
			} );

			$( document ).on( 'click', '#elements-list .remove-element', function () {
				const id = $( this ).closest( '.scene3d-element' ).attr( 'data-elemid' );
				$( '.scene3d-element[data-elemid="' + id + '"]' ).remove();
				window.scene3dScene.removeFromScene( id );
				if ( id === 'floor' ) {
					$( '#new-element' ).find( '[value="floor"]' ).prop( 'disabled', false );
				}
			} );

			$( document ).on( 'change', '#elements-list .shadows', function () {
				const fields = self.splitInputName( $( this ).attr( 'name' ) );
				const scene  = window.scene3dScene;
				const gltf   = scene.elements[fields[1]];

				if ( typeof gltf.traverse === 'function' ) {
					window.Scene3dGetLoader().setGltfShadows( gltf, fields[1], this.value );
				}
			} );

			/**
			 * Camera and orbit control
			 */
			$( document ).on( 'scene3dOrbitChange', function ( ev ) {
				self.updateCameraInputs( ev.detail );
			} );

			$( document ).on( 'change', '.camera-clipping', function () {
				window.scene3dScene.updateCameraClipping( $( this ).attr( 'name' ), $( this ).val() );
			} );

			$( document ).on( 'click', '.set-camera', function ( ev ) {
				ev.preventDefault();
				self.setCameraButtons( $( this ) );
			} );

			$( document ).on( 'change', '[id^="camera-"]', function () {
				self.onCameraInputsChange.apply( self, [$( this )] );
			} );

			$( document ).on( 'change', '[name^="camera\[target"]', function () {
				self.updateControlTarget();
			} );

		}

		/**
		 * Update the orbit control target location
		 */
		updateControlTarget() {
			window.scene3dScene.setControlTarget(
				parseFloat( $( '[name^="camera\[target\]\[x\]"]' ).val() ),
				parseFloat( $( '[name^="camera\[target\]\[y\]"]' ).val() ),
				parseFloat( $( '[name^="camera\[target\]\[z\]"]' ).val() )
			);
		}

		/**
		 * Camera setting changed
		 *
		 * @param {jQuery} input
		 */
		onCameraInputsChange( input ) {
			const id = input.attr( 'id' ).split( '-' ), scene = window.scene3dScene, camera = scene.camera, axes = ['x', 'y', 'z'], transforms = [];

			for ( const i of axes ) {
				transforms.push( id[2] === i ? parseFloat( $( '#camera-position-' + i ).val() ) : parseFloat( camera.position[i] ) );
			}
			scene.setCameraPosition( transforms[0], transforms[1], transforms[2] );
		}

		/**
		 * Passes location from current to starting and vice versa
		 *
		 * @param {jQuery} btn the button pressed
		 */
		setCameraButtons( btn ) {
			const scene     = window.scene3dScene;
			const openPanel = function ( index ) {
				$( '#camera .inside > div' ).accordion( 'option', 'active', index );
			};
			const position  = {
				x: $( '[name="camera\[position\]\[x\]"]' ),
				y: $( '[name="camera\[position\]\[y\]"]' ),
				z: $( '[name="camera\[position\]\[z\]"]' )
			};
			switch ( btn.data( 'as' ) ) {
				case'starting':
					position.x.val( scene.camera.position.x );
					position.y.val( scene.camera.position.y );
					position.z.val( scene.camera.position.z );
					openPanel( 1 );
					break;
				case 'current':
					$( '#camera-position-x' ).val( position.x.val() );
					$( '#camera-position-y' ).val( position.y.val() );
					$( '#camera-position-z' ).val( position.z.val() );
					scene.setCameraPosition( parseFloat( position.x.val() ), parseFloat( position.y.val() ), parseFloat( position.z.val() ) );
					openPanel( 0 );
					break;
				default:
			}
		}

		/**
		 * Update values of camera input (or orbit control update)
		 *
		 * @param {OrbitControls} controls
		 */
		updateCameraInputs( controls ) {
			$( '#camera-position-x' ).val( controls.object.position.x );
			$( '#camera-position-y' ).val( controls.object.position.y );
			$( '#camera-position-z' ).val( controls.object.position.z );
			$( '[name="camera\[target\]\[x\]"]' ).val( controls.target.x );
			$( '[name="camera\[target\]\[y\]"]' ).val( controls.target.y );
			$( '[name="camera\[target\]\[z\]"]' ).val( controls.target.z );
		}

		/**
		 * Load or create scene elements from inline data
		 *
		 * @param {Scene} scene
		 * @param {object} elements
		 */
		loadElementsFromPostdata( scene, elements ) {
			for ( const id in elements ) {
				switch ( elements[id].type ) {
					case 'gltf':
						window.Scene3dGetLoader().load( elements[id].url, 'model/gltf-binary', id );
						break;
					case 'fbx':
						window.Scene3dGetLoader().load( elements[id].url, 'model/fbx-binary', id );
						break;
					case 'spotlight':
						this.appendElement( 'scene3d-spotlight', window.scene3dFormatSpotLightData( elements[id] ), id );
						break;
					case 'pointlight':
						this.appendElement( 'scene3d-pointlight', window.scene3dFormatPointLightData( elements[id] ), id );
						break;
					case 'hemilight':
						this.appendElement( 'scene3d-hemilight', window.scene3dFormatHemiLightData( elements[id] ), id );
						break;
					case 'floor':
						this.appendElement( 'scene3d-floor', window.scene3dFormatFloorData( elements[id], id ) );
						break;
					default:
				}
			}
		}

		/**
		 * Append the UI for a scene element
		 *
		 * also create and add the element itself if no asynchronous file loading is involved
		 *
		 * @param {string} template id of the template to load
		 * @param {object} data template data
		 * @param {string} id element ID
		 */
		appendElement( template, data, id ) {
			this.adjustElemInputsFromPostData( data, id );
			const elem = $( ( wp.template( template ) )( data ).replace( /__elem-id__/g, id ) );

			$( '#elements-list' ).append( elem );

			elem.find( '.cpicker input' ).each( function () {
				const input = $( this );
				input.wpColorPicker( {
					'change': function ( ev, ui ) {
						document.dispatchEvent(
							new CustomEvent(
								'scene3dColorChange',
								{
									detail: {
										color: ui.color.toCSS( 'hex' ),
										name:  input.attr( 'name' )
									}
								}
							)
						);
					}
				} );
			} );

			const cpicker = elem.find( '.cpicker' );

			if ( cpicker.length ) {
				const observer = new ResizeObserver( function () {
					cpicker.closest( '.ui-accordion' ).accordion( 'refresh' );
				} );
				observer.observe( cpicker.closest( 'label.label' )[0] );
			}

			this.setupElementsAccordion();

			if ( ['spotlight', 'pointlight'].indexOf( data.type ) !== - 1 ) {
				if ( typeof window.scene3dScene === 'undefined' ) {
					this.sceneCommandQueue.push( {
						method: 'addSpotPointLight',
						args:   [id, data, data.type]
					} );
				} else {
					window.scene3dScene.addSpotPointLight( id, data, data.type );
				}
			}

			if ( data.type === 'floor' ) {
				const size      = parseFloat( $( '[name="elements\[floor\]\[size\]"]' ).val() ),
					  color     = $( '[name="elements\[floor\]\[color\]"]' ).val(),
					  grid      = $( '[name="elements\[floor\]\[grid\]"]' ).val(),
					  gridColor = $( '[name="elements\[floor\]\[gridColor\]"]' ).val(),
					  divisions = parseFloat( $( '[name="elements\[floor\]\[gridDivisions\]"]' ).val() ),
					  opacity   = parseFloat( $( '[name="elements\[floor\]\[gridOpacity\]"]' ).val() );

				if ( typeof window.scene3dScene === 'undefined' ) {
					this.sceneCommandQueue.push( {
						method: 'addFloor',
						args:   [size, color, grid, gridColor, divisions, opacity]
					} );
				} else {
					window.scene3dScene.addFloor( size, color, grid, gridColor, divisions, opacity );
				}
			}

			if ( ! data.animationNames || ! data.animationNames.length ) {
				return;
			}

			window.scene3dScene.updateAnimationsState( id, this.getPlayedClips( id ) );
		}

		/**
		 * Get selected (to be played) animations for a given element id
		 *
		 * @param {string} id element if
		 * @returns {[]}
		 */
		getPlayedClips( id ) {
			const clips = [];
			$( '[name="elements\[' + id + '\]\[playedAnim\]\[\]"]' ).each( function () {
				const input = $( this );
				if ( input.prop( 'checked' ) ) {
					clips.push( input.val() );
				}
			} );

			return clips;
		}

		/**
		 * Adjust transforms inputs of 3D models after they are added into the scene to match values in post content (if any)
		 *
		 * @param {object} data the current model data
		 * @param {string} id element id
		 */
		adjustElemInputsFromPostData( data, id ) {
			if ( ['gltf', 'fbx'].indexOf( data.type ) === - 1 ) {
				return;
			}

			// Get data stored in post content
			const postdata = this.getPostDataElements();

			if ( typeof postdata[id] === 'undefined' ) {
				if ( typeof data.filename !== 'undefined' ) {
					data.playedAnim = [];
				}
				return;
			}

			data.position = [postdata[id].position.x, postdata[id].position.y, postdata[id].position.z];
			data.scale    = [postdata[id].scale.x, postdata[id].scale.y, postdata[id].scale.z];

			// Rotation is the human-readable transform. Quaternion is the actual transform used in the matrix.
			data.rotation   = [postdata[id].rotation.x, postdata[id].rotation.y, postdata[id].rotation.z];
			data.quaternion = [postdata[id].quaternion.x, postdata[id].quaternion.y, postdata[id].quaternion.z, postdata[id].quaternion.w];

			data.playedAnim = typeof postdata[id]['playedAnim'] !== 'undefined' ? postdata[id]['playedAnim'] : [];

		}

		/**
		 * Get the list of scene element stored in post data
		 *
		 * @returns {[]}
		 */
		getPostDataElements() {
			return this.decodeData( $( '#elements-postdata' ).val() );
		}

		/**
		 * Get camera settings in post data
		 *
		 * @returns {[]}
		 */
		getPostDataCamera() {
			return this.decodeData( $( '#camera-postdata' ).val() );
		}

		/**
		 * Wrapper for JSON.parse( decodeURIComponent( atob() )
		 *
		 * the decodeURIComponent part is for dealing with non latin characters
		 *
		 * @param {string} string
		 * @param {*} defaultValue
		 * @returns {*}
		 */
		decodeData( string, defaultValue ) {
			try {
				return JSON.parse( decodeURIComponent( atob( string ) ) );
			} catch ( ex ) {
				return typeof defaultValue !== 'undefined' ? defaultValue : [];
			}
		}

		/**
		 * Update quaternion hidden inputs when a rotation input is changed for a 3D model element
		 *
		 * @param {string} id element id
		 * @param {[]} quatArray quaternion array ([x,y,z,w])
		 */
		updateQuaternionInputs( id, quatArray ) {
			const indices = ['x', 'y', 'z', 'w'];
			for ( const index of indices ) {
				$( '[name="elements\[' + id + '\]\[quaternion\]\[' + index + '\]"]' ).val( quatArray['_' + index] );
			}
		}

		/**
		 * Extract element id, the type of transform and the transform index from an input's name attribute
		 *
		 * @param {string} inputName the name attribute
		 *
		 * @returns {{index: string, id: string, type: string}}
		 */
		getTransformFields( inputName ) {
			const split = inputName.split( '][' );
			return {
				id:    split[0].slice( 9 ),
				type:  split[1],
				index: split[2].slice( 0, 1 )
			};
		}

		/**
		 * Get the component of a transform input name attribute
		 *
		 * @param {string} name
		 * @returns {[]}
		 */
		splitInputName( name ) {
			return name.replace( /\]/g, '' ).replace( /\[/g, '#' ).split( '#' );
		}
	}

	window.scene3dEditUI = new scene3dEditUI();

} )( window.jQuery );
