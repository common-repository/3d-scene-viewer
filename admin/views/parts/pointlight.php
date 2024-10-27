<script type="text/html" id="tmpl-scene3d-pointlight">
	<div data-elemid="__elem-id__" class="scene3d-element">
		<div class="element-head">
			<span class="element-title"><?php esc_html_e( 'Point light', 'scene3d' ); ?></span>
			<span class="alignright icons">
				<i class="ion ion-ios-trash remove-element"></i>
				<i class="ion ion-ios-arrow-up"></i>
				<i class="ion ion-ios-arrow-down"></i>
			</span>
		</div>
		<div class="element-details">
			<input type="hidden" name="elements[__elem-id__][type]" value="pointlight"/>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Color', 'scene3d' ); ?></span>
				<span class="cpicker">
					<input type="text" name="elements[__elem-id__][color]" value="{{data.color}}"/>
				</span>
			</label>
			<br>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Intensity', 'scene3d' ); ?></span>
				<input type="number" class="pointlight-intensity" step="any" min="0" name="elements[__elem-id__][intensity]" value="{{data.intensity}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Luminous intensity of the light measured in candela (cd)', 'scene3d' ); ?></p>
			<div class="vector-container">
				<span class="label"><?php esc_html_e( 'Position', 'scene3d' ); ?></span>
				<div class="vector">
					<label>
						<span class="vector-index">X</span>
						<input type="number" step="any" class="pointlight-position" name="elements[__elem-id__][position][x]" value="{{data.position.x}}"/>
					</label>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" step="any" class="pointlight-position" name="elements[__elem-id__][position][y]" value="{{data.position.y}}"/>
					</label>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" step="any" class="pointlight-position" name="elements[__elem-id__][position][z]" value="{{data.position.z}}"/>
					</label>
				</div>
			</div>
			<p class="description"></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Distance', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" class="pointlight-distance" name="elements[__elem-id__][distance]" value="{{data.distance}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Maximum range of the light. 0 for no limit', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Decay', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" class="pointlight-decay" name="elements[__elem-id__][decay]" value="{{data.decay}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'The amount the light dims along the distance of the light. 2 leads to physically realistic light falloff', 'scene3d' ); ?></p>
		</div>
	</div>
</script>
