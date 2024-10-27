( function ( wp ) {
	'use strict';
	const el = wp.element.createElement, data = window.scene3dBlockData;

	// Plugin icon
	const svg = el(
		'svg',
		{
			width:   '24px',
			height:  '24px',
			viewBox: '0 0 600 600',
			xmlns:   'http://www.w3.org/2000/svg',
			x:       '0px',
			y:       '0px'
		},
		el(
			'g',
			{},
			el(
				'path',
				{
					fill: '#404040',
					d:    'M169.1,336.4c-17.8-39.6-16-107.1,33.7-154.3c50.4-47.9,128.3-52.2,183-10.5c57.5,44,66.6,115.2,46.6,163.7  c-34.9-40-78.8-61.5-131.9-61.3C247.3,274.3,203.6,296.1,169.1,336.4z'
				}
			),
			el(
				'path',
				{
					fill: '#fe6600',
					d:    'M298.1,297.5c22.3,0.3,41.2,4.3,59.3,12.1c19.1,8.3,34.9,20.9,48.9,36.1c2.9,3.2,5.3,6.8,8,10.2  c1.5,1.9,1.5,3.8,0.8,6.2c-5.3,19.2-14.2,36.7-25.8,52.8c-7.4,10.3-16.1,19.4-25.7,27.8c-11.5,10-24.2,18.3-37.9,24.9  c-7.5,3.6-15.3,6.7-23.4,9c-1.9,0.5-3.4,0.3-5-0.3c-29.7-9.6-54.9-25.9-75.6-49.3c-16.3-18.5-28-39.6-35.2-63.3  c-1.2-4-0.4-6.9,1.9-9.8c12.3-15.4,26.5-28.7,43.8-38.4c14.7-8.3,30.5-13.5,47.1-16.3C286.4,298.1,293.6,297.3,298.1,297.5z'
				}
			)
		)
	);

	// Register the block
	wp.blocks.registerBlockType(
		'scene3d/scene',
		{
			apiVersion: 2,

			title: data.i18n.title,

			icon: svg,

			category: 'common',

			attributes: {
				id: {
					type:    'string',
					default: ''
				}
			},

			save: function () {
				return null;
			},

			edit: function ( props ) {
				if ( props.attributes.id === '' ) {
					const onChange = function ( ev ) {
						props.setAttributes(
							{
								id: ev.target.querySelector( 'option:checked' ).value
							}
						);
					};

					const select = [
						'select',
						{
							onChange: onChange
						}
					];

					const options = [
						el(
							'option',
							{
								value: ''
							},
							data.i18n.select
						)
					];

					for ( const i in data.scenes ) {
						options.push( el(
							'option',
							{
								value: data.scenes[i].post_id
							},
							data.scenes[i].name
						) );
					}

					select.push( options );

					const selectInput = el(
						'form',
						{
							style: {
								padding: '1em .5em',
								border:  '1px solid'
							}
						},
						el(
							'label',
							{},
							el(
								'span',
								{
									style: {
										display:      'block',
										marginBottom: '10px'
									}
								},
								data.i18n.title
							),
							el.apply( null, select )
						)
					);

					return el(
						'p',
						wp.blockEditor.useBlockProps(),
						el( 'blockControls' ),
						selectInput
					);
				}

				return el(
					'div',
					wp.blockEditor.useBlockProps(),
					el(
						'div',
						{
							style: {
								position:      'relative',
								paddingBottom: data.scenes[parseInt( props.attributes.id )].ar + '%',
								width:         '100%'
							}
						},
						el(
							'div',
							{
								style: {
									position: 'absolute',
									inset:    0,
									border:   '1px solid #e0e0e0'
								}
							},

							el(
								'div',
								{
									style: {
										display:         'flex',
										alignItems:      'center',
										height:          '100%',
										justifyContent:  'center',
										backgroundColor: '#fbfbfb',
										fontSize:        '24px'
									}
								},
								el(
									'span',
									{},
									'[' + data.i18n.title + ']: ' + data.scenes[props.attributes.id].name
								)
							)
						)
					)
				);
			}
		}
	);

	// Add toolbar buttons
	const toolbarButtons = wp.compose.createHigherOrderComponent( function ( BlockEdit ) {
		return function ( props ) {
			if ( props.name !== 'scene3d/scene' || props.attributes.id === '' ) {
				return el( BlockEdit, props );
			}
			return el(
				wp.element.Fragment,
				{},
				el( BlockEdit, props ),
				el(
					wp.blockEditor.BlockControls,
					{},
					el(
						wp.components.ToolbarGroup,
						null,
						el(
							wp.components.ToolbarButton,
							{
								text:    data.i18n.replace,
								label:   data.i18n.replace,
								onClick: function () {
									props.setAttributes( {id: ''} );
								}
							}
						),
						el(
							wp.components.ToolbarButton,
							{
								icon:   'external',
								label:  data.i18n.edit,
								href:   data.adminUrl + 'post.php?post=' + props.attributes.id + '&action=edit',
								target: '_blank'
							}
						)
					)
				)
			);
		};
	}, 'toolbarButtons' );

	wp.hooks.addFilter( 'editor.BlockEdit', 'scene3d/scene', toolbarButtons );

} )( window.wp );
