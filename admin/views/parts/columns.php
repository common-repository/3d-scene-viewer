<?php
/**
 * Post list custom columns
 *
 * @var string $name column name
 * @var int    $id   post ID
 */

if ( $name === 'shortcode' ) {
	?>
	<code>[scene3d id="<?php echo esc_attr( $id ) ?>"]</code>
	<i class="dashicons dashicons-admin-page copy-code" data-code="<?php echo esc_attr( base64_encode( '[scene3d id="' . $id . '"]' ) ); ?>" title="<?php esc_attr_e( 'Copy', 'scene3d' ); ?>"></i>
	<?php
}

if ( $name === 'template_tag' ) {
	?>
	<code>&lt;?php scene3d_get_output(<?php echo esc_attr( $id ); ?>); ?&gt;</code>
	<i class="dashicons dashicons-admin-page copy-code" data-code="<?php echo esc_attr( base64_encode( '<?php scene3d_get_output(' . $id . '); ?>' ) ); ?>" title="<?php esc_attr_e( 'Copy', 'scene3d' ); ?>"></i>
	<?php
}

