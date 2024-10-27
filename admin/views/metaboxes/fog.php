<?php
/**
 * Fog metabox.
 *
 * @var WP_Post       $post
 * @var Scene3d_Admin $this
 */

$fog = $this->get_fields( $post->post_content, 'fog' );
?>
<div>
	<label>
		<span class="label"><?php esc_html_e( 'Enable', 'scene3d' ); ?></span>
		<input type="checkbox" name="fog[enabled]" value="1" <?php checked( $fog['enabled'] ) ?>/>
	</label>
	<p class="description">
		<?php esc_html_e( 'Enable fog in the scene.', 'scene3d' ); ?>
		<span class="scene3d-warning"><?php esc_html_e( 'Requires saving the scene to have effect', 'scene3d' ); ?></span>
	</p>
</div>
<div>
	<label>
		<span class="label"><?php esc_html_e( 'Color', 'scene3d' ); ?></span>
		<span class="cpicker">
			<input type="text" name="fog[color]" data-what="fog" value="<?php echo esc_attr( $fog['color'] ); ?>"/>
		</span>
	</label>
	<p class="description"><?php esc_html_e( 'Fog color', 'scene3d' ); ?></p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Near', 'scene3d' ); ?></span>
		<input type="number" step="any" min="1" name="fog[near]" value="<?php echo esc_attr( $fog['near'] ); ?>"/>
	</label>
	<p class="description"><?php esc_html_e( "The minimum distance to start applying fog. Objects that are less than 'near' units from the active camera won't be affected by fog", 'scene3d' ); ?></p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Far', 'scene3d' ); ?></span>
		<input type="number" step="any" name="fog[far]" value="<?php echo esc_attr( $fog['far'] ); ?>"/>
	</label>
	<p class="description">
		<?php
		esc_html_e(
			"The maximum distance at which fog stops being calculated and applied. Objects that are more than 'far' units away from the active camera won't be affected by fog.",
			'scene3d'
		);
		?>
	</p>
</div>
