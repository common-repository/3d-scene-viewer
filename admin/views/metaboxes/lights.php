<?php
/**
 * Default lights metabox
 *
 * @var WP_Post       $post
 * @var Scene3d_Admin $this
 */

$settings = $this->get_fields( $post->post_content, 'settings' );
?>
<div class="acc">
	<div class="acc-head">
		<strong><?php esc_html_e( 'Ambient light', 'scene3d' ); ?></strong>
		<span class="alignright">
			<i class="ion ion-ios-arrow-up"></i>
			<i class="ion ion-ios-arrow-down"></i>
		</span>
	</div>
	<div class="acc-body">
		<p class="scene3d-notice info"><?php esc_html_e( "This light doesn't cast shadow", 'scene3d' ); ?></p>
		<p class="description"><?php esc_html_e( 'This light globally illuminates all objects in the scene equally.', 'scene3d' ); ?></p>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Color', 'scene3d' ); ?></span>
				<span class="cpicker"><input type="text" name="settings[ambientLight][color]" data-what="ambient-color" value="<?php echo esc_attr( $settings['ambientLight']['color'] ); ?>"/></span>
			</label>
		</div>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Intensity', 'scene3d' ); ?></span>
				<input type="number" name="settings[ambientLight][intensity]" value="<?php echo esc_attr( $settings['ambientLight']['intensity'] ); ?>" step="any" min="0"/>
			</label>
		</div>
	</div>

	<div class="acc-head">
		<strong><?php esc_html_e( 'Hemisphere light', 'scene3d' ); ?></strong>
		<span class="alignright">
			<i class="ion ion-ios-arrow-up"></i>
			<i class="ion ion-ios-arrow-down"></i>
		</span>
	</div>
	<div class="acc-body">
		<p class="scene3d-notice info"><?php esc_html_e( "This light doesn't cast shadow", 'scene3d' ); ?></p>
		<p class="description"><?php esc_html_e( 'A light source positioned directly above the scene, with color fading from the sky color to the ground color.', 'scene3d' ); ?></p>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Intensity', 'scene3d' ); ?></span>
				<input type="number" name="settings[hemiLight][intensity]" value="<?php echo esc_attr( $settings['hemiLight']['intensity'] ); ?>" step="any" min="0"/>
			</label>
		</div>
		<br/>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Sky color', 'scene3d' ); ?></span>
				<span class="cpicker">
			<input type="text" name="settings[hemiLight][skycolor]" data-what="hemi-skycolor" value="<?php echo esc_attr( $settings['hemiLight']['skycolor'] ); ?>"/>
		</span>
			</label>
		</div>
		<br/>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Ground color', 'scene3d' ); ?></span>
				<span class="cpicker">
			<input type="text" name="settings[hemiLight][groundcolor]" data-what="hemi-groundcolor" value="<?php echo esc_attr( $settings['hemiLight']['groundcolor'] ); ?>"/>
		</span>
			</label>
		</div>
	</div>

	<div class="acc-head">
		<strong><?php esc_html_e( 'Directional light', 'scene3d' ); ?></strong>
		<span class="alignright">
			<i class="ion ion-ios-arrow-up"></i>
			<i class="ion ion-ios-arrow-down"></i>
		</span>
	</div>
	<div class="acc-body">
		<p class="description">
			<?php
			esc_html_e(
				'A light that emits parallel rays, a small scale sun-like source. Very cheap for the GPU to generate but shadows might not look good in some setups.',
				'scene3d'
			);
			?>
		</p>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Color', 'scene3d' ); ?></span>
				<span class="cpicker">
			<input type="text" name="settings[directionLight][color]" data-what="directional-color" value="<?php echo esc_attr( $settings['directionLight']['color'] ); ?>"/>
		</span>
			</label>
		</div>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Intensity', 'scene3d' ); ?></span>
				<input type="number" name="settings[directionLight][intensity]" value="<?php echo esc_attr( $settings['directionLight']['intensity'] ); ?>" step="any" min="0"/>
			</label>
		</div>
		<br/>
		<div>
			<span class="label"><?php esc_html_e( 'Position', 'scene3d' ); ?></span>
			<div class="vector-container">
				<div>
					<label>
						<span class="vector-index">X</span>
						<input type="number" name="settings[directionLight][position][x]" class="transform" step="any" value="<?php echo esc_attr( $settings['directionLight']['position']['x'] ); ?>"/>
					</label>
				</div>
				<div>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" name="settings[directionLight][position][y]" class="transform" step="any" value="<?php echo esc_attr( $settings['directionLight']['position']['y'] ); ?>"/>
					</label>
				</div>
				<div>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" name="settings[directionLight][position][z]" class="transform" step="any" value="<?php echo esc_attr( $settings['directionLight']['position']['z'] ); ?>"/>
					</label>
				</div>
				<p class="description">
					<?php
					esc_html_e(
						'Determines, with the target ,the orientation the light emitted. The entire scene will still be illuminated regardless of the position of the source but shadows are computed for rays emitted around the source position.',
						'scene3d'
					);
					?>
				</p>
				<br>
			</div>
		</div>
		<div>
			<span class="label"><?php esc_html_e( 'Target', 'scene3d' ); ?></span>
			<div class="vector-container">
				<div>
					<label>
						<span class="vector-index">X</span>
						<input type="number" name="settings[directionLight][target][x]" class="transform" step="any" value="<?php echo esc_attr( $settings['directionLight']['target']['x'] ); ?>"/>
					</label>
				</div>
				<div>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" name="settings[directionLight][target][y]" class="transform" step="any" value="<?php echo esc_attr( $settings['directionLight']['target']['y'] ); ?>"/>
					</label>
				</div>
				<div>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" name="settings[directionLight][target][z]" class="transform" step="any" value="<?php echo esc_attr( $settings['directionLight']['target']['z'] ); ?>"/>
					</label>
				</div>
			</div>
			<p class="description">
				<?php esc_html_e( 'Determines, with the position ,the orientation the light emitted', 'scene3d' ); ?>
			</p>
			<br>
		</div>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Enable shadow', 'scene3d' ); ?></span>
				<select name="settings[directionLight][shadow]">
					<option value="" <?php selected( $settings['directionLight']['shadow'] === '' ); ?>><?php esc_html_e( 'Disabled', 'scene3d' ); ?></option>
					<option value="enabled" <?php selected( $settings['directionLight']['shadow'] === 'enabled' ); ?>><?php esc_html_e( 'Enabled', 'scene3d' ); ?></option>
				</select>
			</label>
			<p class="description">
				<span class="scene3d-warning"><?php esc_html_e( 'Shadows need to be enabled in the scene settings', 'scene3d' ); ?></span>
			</p>
		</div>
		<div>
			<label>
				<span class="label"><?php esc_html_e( 'Shadow camera size', 'scene3d' ); ?></span>
				<input type="number" name="settings[directionLight][camera]" min="5" step="1" value="<?php echo esc_attr( $settings['directionLight']['camera'] ); ?>"/>
			</label>
			<p class="description"><?php esc_html_e( 'Size of the plane around the position for which light rays generate shadows. You might need to increase this value for scenes that spread across large surface', 'scene3d' ); ?></p>
		</div>
	</div>
</div>
