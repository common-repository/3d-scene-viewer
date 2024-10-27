<?php
/**
 * Usage metabox
 *
 * @var WP_Post       $post
 * @var Scene3d_Admin $this
 */

?>
<div id="usage-inner">
	<div>
		<label>
			<span><?php esc_html_e( 'Shortcode', 'scene3d' ); ?></span>
			<input type="text" readonly value="<?php echo esc_attr( "[scene3d id=\"{$post->ID}\"]" ); ?>"/>
			<i class="dashicons dashicons-admin-page copy" title="<?php esc_attr_e( 'copy', 'scene3d' ); ?>	"></i>
		</label>
	</div>
	<div>
		<label>
			<span><?php esc_html_e( 'Template tag', 'scene3d' ); ?></span>
			<input type="text" readonly value="<?php echo esc_attr( "<?php scene3d_get_output({$post->ID}); ?>" ); ?>"/>
			<i class="dashicons dashicons-admin-page copy" title="<?php esc_attr_e( 'copy', 'scene3d' ); ?>	"></i>
		</label>
	</div>
</div>
