<?php
/**
 * Camera settings metabox.
 *
 * @var WP_Post       $post
 * @var Scene3d_Admin $this
 */

$camera = $this->get_fields( $post->post_content, 'camera' );

?>
<input type="hidden" id="camera-postdata" value="<?php echo esc_attr( Scene3d_Plugin::encode( $camera ) ); ?>"/>
<div class="camera-inputs acc">
	<div class="acc-head" data-set="current">
		<strong><?php esc_html_e( 'Current position', 'scene3d' ); ?></strong>
		<span class="alignright">
		<i class="ion ion-ios-arrow-up"></i>
		<i class="ion ion-ios-arrow-down"></i>
	</span>
	</div>
	<div class="vector-container acc-body">
		<div>
			<label class="label">
				<span class="vector-index">X</span>
				<input type="number" id="camera-position-x" class="transform" step="any" value="<?php echo esc_attr( $camera['position']['x'] ); ?>"/>
			</label>
		</div>
		<div>
			<label class="label">
				<span class="vector-index">Y</span>
				<input type="number" id="camera-position-y" class="transform" step="any" value="<?php echo esc_attr( $camera['position']['y'] ); ?>"/>
			</label>
		</div>
		<div>
			<label class="label">
				<span class="vector-index">Z</span>
				<input type="number" id="camera-position-z" class="transform" step="any" value="<?php echo esc_attr( $camera['position']['z'] ); ?>"/>
			</label>
		</div>

		<p class="alignright">
			<button class="button set-camera" data-as="starting"><?php esc_html_e( 'Set as start position', 'scene3d' ); ?></button>
		</p>
		<p class="description alignclear"><?php esc_html_e( 'The current camera location', 'scene3d' ); ?></p>
	</div>
	<div class="acc-head" data-set="starting">
		<strong><?php esc_html_e( 'Start position', 'scene3d' ); ?></strong>
		<span class="alignright">
			<i class="ion ion-ios-arrow-up"></i>
			<i class="ion ion-ios-arrow-down"></i>
		</span>
	</div>
	<div class="vector-container acc-body">
		<div>
			<label class="label">
				<span class="vector-index">X</span>
				<input type="number" name="camera[position][x]" class="transform" step="any" value="<?php echo esc_attr( $camera['position']['x'] ); ?>"/>
			</label>
		</div>
		<div>
			<label class="label">
				<span class="vector-index">Y</span>
				<input type="number" name="camera[position][y]" class="transform" step="any" value="<?php echo esc_attr( $camera['position']['y'] ); ?>"/>
			</label>
		</div>
		<div>
			<label class="label">
				<span class="vector-index">Z</span>
				<input type="number" name="camera[position][z]" class="transform" step="any" value="<?php echo esc_attr( $camera['position']['z'] ); ?>"/>
			</label>
		</div>

		<p class="alignright">
			<button class="button set-camera" data-as="current"><?php esc_html_e( 'Set as current position', 'scene3d' ); ?></button>
		</p>
		<p class="description alignclear"><?php esc_html_e( 'The camera location right after loading the scene on the frontend', 'scene3d' ); ?></p>

	</div>
	<div class="acc-head">
		<strong><?php esc_html_e( 'Target', 'scene3d' ); ?></strong>
		<span class="alignright">
		<i class="ion ion-ios-arrow-up"></i>
		<i class="ion ion-ios-arrow-down"></i>
	</span>
	</div>
	<div class="vector-container acc-body">
		<div>
			<label class="label">
				<span class="vector-index">X</span>
				<input type="number" name="camera[target][x]" class="transform" step="any" value="<?php echo esc_attr( $camera['target']['x'] ); ?>"/>
			</label>
		</div>
		<div>
			<label class="label">
				<span class="vector-index">Y</span>
				<input type="number" name="camera[target][y]" class="transform" step="any" value="<?php echo esc_attr( $camera['target']['y'] ); ?>"/>
			</label>
		</div>
		<div>
			<label class="label">
				<span class="vector-index">Z</span>
				<input type="number" name="camera[target][z]" class="transform" step="any" value="<?php echo esc_attr( $camera['target']['z'] ); ?>"/>
			</label>
		</div>
		<p class="description"><?php esc_html_e( 'The point the camera is pointing to', 'scene3d' ); ?></p>
	</div>
	<div class="acc-head">
		<strong><?php esc_html_e( 'Clipping and FOV', 'scene3d' ); ?></strong>
		<span class="alignright">
		<i class="ion ion-ios-arrow-up"></i>
		<i class="ion ion-ios-arrow-down"></i>
	</div>
	<div class="vector-container acc-body">
		<label class="label">
			<span class="label"><?php esc_html_e( 'Field of view', 'scene3d' ); ?></span>
			<input type="number" class="camera-clipping" step="any" name="camera[fov]" value="<?php echo esc_attr( $camera['fov'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'Camera frustum vertical field of view, from bottom to top of view, in degrees', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Near', 'scene3d' ); ?></span>
			<input type="number" class="camera-clipping" step="any" name="camera[near]" value="<?php echo esc_attr( $camera['near'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'Distance to camera frustum near plane', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Far', 'scene3d' ); ?></span>
			<input type="number" class="camera-clipping" step="any" name="camera[far]" value="<?php echo esc_attr( $camera['far'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'Distance to camera frustum far plane', 'scene3d' ); ?></p>
	</div>
	<div class="acc-head">
		<strong><?php esc_html_e( 'Controls', 'scene3d' ); ?></strong>
		<span class="alignright">
		<i class="ion ion-ios-arrow-up"></i>
		<i class="ion ion-ios-arrow-down"></i>
	</div>
	<div class="vector-container acc-body">
		<label class="label">
			<span class="label"><?php esc_html_e( 'Enable camera controls', 'scene3d' ); ?></span>
			<input type="checkbox" name="camera[controls]" class="camera-input" value="1" <?php checked( $camera['controls'] ); ?>/>
		</label>
		<p class="description"><?php esc_html_e( 'Whether to enable camera controls on the frontend', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Enable panning', 'scene3d' ); ?></span>
			<input type="checkbox" class="camera-input" name="camera[pan]" value="1" <?php checked( $camera['pan'] ); ?>/>
		</label>
		<p class="description"><?php esc_html_e( 'Enable camera panning (right click) on the front end', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Max. azimuth angle', 'scene3d' ); ?></span>
			<input type="text" min="-360" max="360" pattern="(-?[123]?\d?\d)|Infinity" class="camera-input" name="camera[maxAzimuth]" value="<?php echo esc_attr( $camera['maxAzimuth'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'How far you can orbit horizontally, upper limit in degrees. Can be infinite', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Min. azimuth angle', 'scene3d' ); ?></span>
			<input type="text" min="-360" max="360" pattern="(-?[123]?\d?\d)|Infinity" class="camera-input" name="camera[minAzimuth]" value="<?php echo esc_attr( $camera['minAzimuth'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'How far you can orbit horizontally, lower limit in degrees. Can be infinite', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Max. polar angle', 'scene3d' ); ?></span>
			<input type="number" step="any" min="0" max="180" class="camera-input" name="camera[maxPolar]" value="<?php echo esc_attr( $camera['maxPolar'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'How far you can orbit vertically, upper limit in degrees', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Min. polar angle', 'scene3d' ); ?></span>
			<input type="number" step="any" min="0" max="180" class="camera-input" name="camera[minPolar]" value="<?php echo esc_attr( $camera['minPolar'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'How far you can orbit vertically, lower limit in degrees', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Max. distance', 'scene3d' ); ?></span>
			<input type="text" pattern="([0-9]+\.?[0-9]*)|Infinity" class="camera-input" name="camera[maxDistance]" value="<?php echo esc_attr( $camera['maxDistance'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'How far you zoom out. Can be infinite', 'scene3d' ); ?></p>
		<label class="label">
			<span class="label"><?php esc_html_e( 'Min. distance', 'scene3d' ); ?></span>
			<input type="number" step="any" min="0" class="camera-input" name="camera[minDistance]" value="<?php echo esc_attr( $camera['minDistance'] ); ?>"/>
		</label>
		<p class="description"><?php esc_html_e( 'How far you zoom in', 'scene3d' ); ?></p>
	</div>
</div>
