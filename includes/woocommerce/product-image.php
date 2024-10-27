<?php
/**
 * Single Product Scene
 */

defined( 'ABSPATH' ) || exit;

global $product;
$meta              = get_post_meta( $product->get_id(), Scene3d_Woo::$meta_key, true );
$columns           = apply_filters( 'woocommerce_product_thumbnails_columns', 4 );
$post_thumbnail_id = $product->get_image_id();
$wrapper_classes   = apply_filters(
	'woocommerce_single_product_image_gallery_classes',
	array(
		'woocommerce-product-gallery',
		'woocommerce-product-gallery--' . ( $post_thumbnail_id ? 'with-images' : 'without-images' ),
		'woocommerce-product-gallery--columns-' . absint( $columns ),
		'images',
	)
);
?>
<div class="<?php echo esc_attr( implode( ' ', array_map( 'sanitize_html_class', $wrapper_classes ) ) ); ?>" data-columns="<?php echo esc_attr( $columns ); ?>" style="opacity: 0; transition: opacity .25s ease-in-out;">
	<?php
	echo wp_kses(
		Scene3d_Plugin::get_instance()->get_output( $meta['id'] ),
		Scene3d_Plugin::allowed_tags()
	);
	?>
</div>
