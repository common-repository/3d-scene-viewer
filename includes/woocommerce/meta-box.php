<?php
/**
 * Product 3d scene meta box
 *
 * @var WP_Post     $post the current product.
 * @var Scene3d_Woo $this Woocommerce integration class.
 */
$scenes = Scene3d_Plugin::get_all_scenes();
$meta   = get_post_meta( $post->ID, self::$meta_key, true );
$id     = $meta ? $meta['id'] : '';
if ( empty( $scenes ) ) {
	printf(
		'<p class="centered info">%s</p>',
		esc_html__( 'No 3D scene found', 'scene3d' )
	);
} else {
	?>
	<label for="product-3d-scene"><?php esc_html_e( 'Select a scene', 'scene3d' ); ?></label>
	<p>
		<select id="product-3d-scene" name="scene3d-id">
			<option value=""><?php esc_html_e( 'none', 'scene3d' ); ?></option>
			<?php foreach ( $scenes as $scene ) : ?>
				<option value="<?php echo esc_attr( $scene->ID ); ?>" <?php selected( $id === $scene->ID ); ?>><?php echo esc_html( $scene->post_title ); ?></option>
			<?php endforeach; ?>
		</select>
		<a href="#" data-pattern="<?php echo esc_url( admin_url( 'post.php?post=%ID%&action=edit' ) ); ?>" id="product-3d-scene-link" target="_blank"><i class="dashicons dashicons-external"></i></a>
	</p>
	<p class="description"><?php esc_html_e('This will replace any product image or gallery.', 'scene3d' )?></p>
	<?php
}
