<script type="text/html" id="tmpl-scene3d-floor">
	<div data-elemid="floor" class="scene3d-element">
		<input type="hidden" name="elements[floor][type]" value="floor"/>
		<div class="element-head">
			<span class="elemet-title"><?php esc_html_e( 'Floor', 'scene3d' ); ?></span>
			<span class="alignright icons">
				<i class="ion ion-ios-trash remove-element"></i>
				<i class="ion ion-ios-arrow-up"></i>
				<i class="ion ion-ios-arrow-down"></i>
			</span>
		</div>
		<div class="element-details">
			<p class="scene3d-notice info"><?php esc_html_e( 'Change to the floor requires saving the scene to take effect', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Size', 'scene3d' ); ?></span>
				<input type="number" min="5" step="any" name="elements[floor][size]" value="{{data.size}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Length of the side of the square', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Color', 'scene3d' ); ?></span>
				<span class="cpicker">
					<input type="text" name="elements[floor][color]" value="{{data.color}}"/>
				</span>
			</label>
			<p class="description"><?php esc_html_e( 'Floor color', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Grid', 'scene3d' ); ?></span>
				<select name="elements[floor][grid]">
					<!-- @formatter:off -->
					<option value=""<# print( data.grid !== 'enabled' ? ' selected' : '' ); #>><?php esc_html_e( 'disabled', 'scene3d' ); ?></option>
					<option value="enabled"<# print( data.grid === 'enabled' ? ' selected' : '' ); #>><?php esc_html_e( 'enabled', 'scene3d' ); ?></option>
					<!-- @formatter:on -->
				</select>
			</label>
			<p class="description"><?php esc_html_e( 'Fills the floor with a grid', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Grid division', 'scene3d' ); ?></span>
				<input type="number" step="1" min="2" name="elements[floor][gridDivisions]" value="{{data.gridDivisions}}"/>
			</label>
			<p class="description"><?php esc_html_e( 'Amount of division per side', 'scene3d' ); ?></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Grid color', 'scene3d' ); ?></span>
				<span class="cpicker">
					<input type="text" name="elements[floor][gridColor]" value="{{data.gridColor}}"/>
				</span>
			</label>
			<p class="description"></p>
			<label class="label">
				<span class="label"><?php esc_html_e( 'Grid opacity', 'scene3d' ); ?></span>
				<input type="number" step="any" min="0" max="1" name="elements[floor][gridOpacity]" value="{{data.gridOpacity}}"/>
			</label>
			<p class="description"></p>
		</div>
	</div>
</script>
