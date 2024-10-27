<?php
/**
 * Scene elements list metabox.
 *
 * @var WP_Post       $post
 * @var Scene3d_Admin $this
 */

$elements     = $this->get_fields( $post->post_content, 'elements' );
$descriptions = [
	''           => __( 'Select one type of element', 'scene3d' ),
	'glb'        => __( 'glTF v2.0 file (.glb or .gltf format)', 'scene3d' ),
	'fbx'        => __( 'FBX file version 6400 or newer. Binary format only', 'scene3d', ),
	'spotlight'  => __( 'This light gets emitted from a single point in one direction, along a cone that increases in size the further from the light it gets. This light can cast shadows', 'scene3d' ),
	'pointlight' => __( 'A light that gets emitted from a single point in all directions. This light can cast shadows', 'scene3d' ),
	'floor'      => __( 'A simple plane geometry to serve as a floor on the scene', 'scene3d' ),
];
?>
<div>
	<input type="hidden" id="elements-postdata" value="<?php echo esc_attr( Scene3d_Plugin::encode( $elements ) ); ?>"/>
	<div>
		<p>
			<label for="new-element">
				<span class="label"><?php esc_html_e( 'Add element to the scene', 'scene3d' ); ?></span>
			</label>
		</p>
		<select id="new-element" class="dynamic-description">
			<option value="">--<?php esc_html_e( 'Select an element', 'scene3d' ); ?>--</option>
			<option value="glb"><?php esc_html_e( 'GLTF/GLB file', 'scene3d' ); ?></option>
			<option value="fbx"><?php esc_html_e( 'FBX file', 'scene3d' ); ?></option>
			<option value="spotlight"><?php esc_html_e( 'Spot light', 'scene3d' ); ?></option>
			<option value="pointlight"><?php esc_html_e( 'Point light', 'scene3d' ); ?></option>
			<option value="floor"><?php esc_html_e( 'Floor', 'scene3d' ); ?></option>
		</select>
		<button class="button" id="add-element"><?php esc_html_e( 'Add element', 'scene3d' ); ?></button>
		<p class="description dynamic" data-descriptions="<?php echo esc_attr( rawurlencode( json_encode( $descriptions ) ) ); ?>"></p>
		<input type="hidden" id="attachment-url" value=""/>
		<input type="hidden" id="attachment-type" value=""/>
		<input type="hidden" id="attachment-filename" value=""/>
		<p id="attachment-error" class="error-message"></p>
	</div>
</div>
<hr/>
<div id="elements-list"></div>
