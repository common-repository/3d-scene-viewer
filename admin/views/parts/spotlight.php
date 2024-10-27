<script type="text/html" id="tmpl-scene3d-spotlight">
	<div data-elemid="__elem-id__" class="scene3d-element">
		<div class="element-head">
			<span class="element-title"><?php esc_html_e( 'Spot light', 'scene3d' ); ?></span>
			<span class="alignright icons">
				<i class="ion ion-ios-trash remove-element"></i>
				<i class="ion ion-ios-arrow-up"></i>
				<i class="ion ion-ios-arrow-down"></i>
			</span>
		</div>
		<div class="element-details">
			<input type="hidden" name="elements[__elem-id__][type]" value="spotlight"/>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Color', 'scene3d' ); ?></span>
				<span class="cpicker">
					<input type="text" name="elements[__elem-id__][color]" value="{{data.color}}"/>
				</span>
			</label>
			<br>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Intensity', 'scene3d' ); ?></span>
				<input type="number" class="spotlight-intensity" step="any" min="0" name="elements[__elem-id__][intensity]" value="{{data.intensity}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Luminous intensity of the light measured in candela (cd)', 'scene3d' ); ?></p>
			<div class="vector-container">
				<span class="label"><?php esc_html_e( 'Position', 'scene3d' ); ?></span>
				<div class="vector">
					<label>
						<span class="vector-index">X</span>
						<input type="number" step="any" class="spotlight-position" name="elements[__elem-id__][position][x]" value="{{data.position.x}}"/>
					</label>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" step="any" class="spotlight-position" name="elements[__elem-id__][position][y]" value="{{data.position.y}}"/>
					</label>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" step="any" class="spotlight-position" name="elements[__elem-id__][position][z]" value="{{data.position.z}}"/>
					</label>
				</div>
			</div>
			<p class="description"></p>
			<div class="vector-container">
				<span class="label"><?php esc_html_e( 'Target', 'scene3d' ); ?></span>
				<div class="vector">
					<label>
						<span class="vector-index">X</span>
						<input type="number" step="any" class="spotlight-target" name="elements[__elem-id__][target][x]" value="{{data.target.x}}"/>
					</label>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" step="any" class="spotlight-target" name="elements[__elem-id__][target][y]" value="{{data.target.y}}"/>
					</label>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" step="any" class="spotlight-target" name="elements[__elem-id__][target][z]" value="{{data.target.z}}"/>
					</label>
				</div>
			</div>
			<p class="description"><?php esc_html_e( 'Where the light is pointing at', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Distance', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" class="spotlight-distance" name="elements[__elem-id__][distance]" value="{{data.distance}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Maximum range of the light. When distance is zero, light will attenuate according to inverse-square law to infinite distance', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Angle', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" class="spotlight-angle" max="90" name="elements[__elem-id__][angle]" value="{{data.angle}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Maximum angle of light dispersion from its direction. Max: 90 degrees', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Penumbra', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" max="1" class="spotlight-penumbra" name="elements[__elem-id__][penumbra]" value="{{data.penumbra}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Percent of the spotlight cone that is attenuated due to penumbra. Takes values between 0 and 1', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Decay', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" class="spotlight-decay" name="elements[__elem-id__][decay]" value="{{data.decay}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'The amount the light dims along the distance of the light. 2 leads to physically realistic light falloff', 'scene3d' ); ?></p>
		</div>
	</div>
</script>
