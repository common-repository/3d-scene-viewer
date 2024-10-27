<?php
/**
 * Scene settings metabox
 *
 * @var WP_Post       $post
 * @var Scene3d_Admin $this
 */

$settings = $this->get_fields( $post->post_content, 'settings' );
$preview  = $this->get_fields( $post->post_content, 'previewSettings' );
?>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'HTML id attribute', 'scene3d' ); ?></span>
		<input type="text" name="settings[htmlid]" value="<?php echo esc_attr( $settings['htmlid'] ); ?>"/>
	</label>
	<p class="description">
		<?php
		echo wp_kses(
			sprintf(
			// translators: 1: <div> tag, 2: <canvas> tag
				__( 'ID attribute of the %1$s node wrapping the %2$s in which the scene is rendered', 'scene3d' ),
				'<code>&lt;div /&gt;</code>',
				'<code>&lt;canvas /&gt;</code>'
			),
			[
				'code' => [],
			]
		);
		?>
	</p>
</div>
<div>
	<div class="dropdown-input">
		<label class="label">
			<span class="label"><?php esc_html_e( 'Aspect ratio', 'scene3d' ); ?></span>
			<input type="text" pattern="[0-9]+\.?[0-9]*:[0-9]+\.?[0-9]*" name="settings[ar]" value="<?php echo esc_attr( $settings['ar'] ); ?>"/>
		</label>
		<div class="dropdown-list">
			<div data-val="1:1">1:1</div>
			<div data-val="4:3">4:3</div>
			<div data-val="16:9">16:9</div>
			<div data-val="9:16">9:16</div>
			<div data-val="3:4">3:4</div>
		</div>
	</div>
	<p class="description"><?php esc_html_e( 'Width/height ratio of the canvas in the format "w:h"', 'scene3d' ); ?></p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Shadows', 'scene3d' ); ?></span>
		<select name="settings[shadow]">
			<option value="enabled" <?php selected( $settings['shadow'], 'enabled' ); ?>><?php esc_attr_e( 'Enabled', 'scene3d' ); ?></option>
			<option value="disabled" <?php selected( $settings['shadow'], 'disabled' ); ?>><?php esc_attr_e( 'Disabled', 'scene3d' ); ?></option>
		</select>
	</label>
	<p class="description">
		<?php esc_html_e( 'Enable casting and receiving shadows.', 'scene3d' ); ?>
		<span class="scene3d-warning"><?php esc_html_e( 'Requires saving the scene to have effect', 'scene3d' ); ?></span>
	</p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Shadows quality', 'scene3d' ); ?></span>
		<select name="settings[shadowMapSize]">
			<option value="512" <?php selected( $settings['shadowMapSize'], '512' ); ?>><?php esc_html_e( 'low', 'scene3d' ); ?></option>
			<option value="1024" <?php selected( $settings['shadowMapSize'], '1024' ); ?>><?php esc_html_e( 'medium', 'scene3d' ); ?></option>
			<option value="2048" <?php selected( $settings['shadowMapSize'], '2048' ); ?>><?php esc_html_e( 'high', 'scene3d' ); ?></option>
			<option value="4096" <?php selected( $settings['shadowMapSize'], '4096' ); ?>><?php esc_html_e( 'very high', 'scene3d' ); ?></option>
			<option value="8192" <?php selected( $settings['shadowMapSize'], '8192' ); ?>><?php esc_html_e( 'ultra', 'scene3d' ); ?></option>
		</select>
	</label>
	<p class="description">
		<?php esc_html_e( "The greater it looks, heavier will be the load on the viewer's GPU.", 'scene3d' ); ?>
		<span class="scene3d-warning"><?php esc_html_e( 'Requires saving the scene to have effect', 'scene3d' ); ?></span>
	</p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Background color', 'scene3d' ); ?></span>
		<span class="cpicker">
			<input type="text" name="settings[color]" data-what="scene-bg" value="<?php echo esc_attr( $settings['color'] ); ?>"/>
		</span>
	</label>
	<br/>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Allow fullscreen', 'scene3d' ); ?></span>
		<input type="checkbox" name="settings[fs]" value="1" <?php checked( $settings['fs'] ); ?>/>
	</label>
	<p class="description"><?php esc_html_e( 'Allow the scene to enter fullscreen', 'scene3d' ); ?></p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Show fps counter', 'scene3d' ); ?></span>
		<input type="checkbox" name="previewSettings[fps]" value="1" <?php checked( $preview['fps'] ); ?>/>
	</label>
	<p class="description"><?php esc_html_e( 'Frames per second counter (backend only)', 'scene3d' ); ?></p>
</div>
<div>
	<label class="label">
		<span class="label"><?php esc_html_e( 'Show axes helpers', 'scene3d' ); ?></span>
		<input type="checkbox" name="previewSettings[axes]" value="1" <?php checked( $preview['axes'] ); ?>/>
	</label>
	<p class="description"><?php esc_html_e( 'Show X,Y ans Z axes (backend only)', 'scene3d' ); ?></p>
</div>
