<?php
/**
 * Front end output
 *
 * @var WP_Post $post the scene post object.
 */

$scene = new Scene3d_Scene( $post );
?>
<div class="scene3d-scene" data-scene="<?php echo esc_attr( $scene->id ); ?>" data-id="<?php echo esc_attr( wp_generate_password( 10, false ) ); ?>">
	<div class="scene3d-renderer-wrap" style="padding-bottom: <?php echo (int) ( 100 * $scene->ar[1] / $scene->ar[0] ); ?>%;" <?php echo $scene->htmlid ? ' id="' . esc_attr( $scene->htmlid ) . '"' : ''; ?>>
		<div class="loading-overlay">
			<div class="loading-inner">
				<img src="<?php echo esc_url( SCENE3D_BASE_URL . 'includes/images/spin.png' ); ?>" alt="" class="scene3d-spinner"/>
			</div>
		</div>
		<?php if ( $scene->fullscreen ) : ?>
			<i class="dashicons dashicons-editor-expand fs-button" title="<?php esc_attr_e( 'Enter fullscreen', 'scene3d' ); ?>"></i>
		<?php endif; ?>
	</div>
	<script type="text/html"><?php echo esc_html( rawurlencode( $scene->get_json_data() ) ); ?></script>
</div>
