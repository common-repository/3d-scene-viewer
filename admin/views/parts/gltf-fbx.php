<script type="text/html" id="tmpl-scene3d-gltf-fbx">
	<div data-elemid="__elem-id__" class="scene3d-element">
		<input type="hidden" name="elements[__elem-id__][type]" value="{{data.type}}"/>
		<input type="hidden" name="elements[__elem-id__][filename]" value="{{data.filename}}"/>
		<input type="hidden" name="elements[__elem-id__][url]" value="{{data.url}}"/>
		<input type="hidden" name="elements[__elem-id__][quaternion][x]" value="{{data.quaternion[0]}}"/>
		<input type="hidden" name="elements[__elem-id__][quaternion][y]" value="{{data.quaternion[1]}}"/>
		<input type="hidden" name="elements[__elem-id__][quaternion][z]" value="{{data.quaternion[2]}}"/>
		<input type="hidden" name="elements[__elem-id__][quaternion][w]" value="{{data.quaternion[3]}}"/>
		<div class="element-head">
			<span class="elemet-title">{{data.filename}}</span>
			<span class="alignright icons">
				<i class="ion ion-ios-trash remove-element"></i>
				<i class="ion ion-ios-arrow-up"></i>
				<i class="ion ion-ios-arrow-down"></i>
			</span>
		</div>
		<div class="element-details">
			<div class="vector-container">
				<span class="label"><?php esc_html_e( 'Position', 'scene3d' ); ?></span>
				<div class="vector">
					<label>
						<span class="vector-index">X</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][position][x]" value="{{data.position[0]}}"/>
					</label>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][position][y]" value="{{data.position[1]}}"/>
					</label>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][position][z]" value="{{data.position[2]}}"/>
					</label>
				</div>
			</div>
			<div class="vector-container">
				<span class="label"><?php esc_html_e( 'Rotation', 'scene3d' ); ?></span>
				<div class="vector">
					<label>
						<span class="vector-index">X</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][rotation][x]" value="{{data.rotation[0]}}"/>
					</label>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][rotation][y]" value="{{data.rotation[1]}}"/>
					</label>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][rotation][z]" value="{{data.rotation[2]}}"/>
					</label>
				</div>
				<input type="hidden" name="elements[__elem-id__][rotation][order]" value="{{data.rotation[3]}}"/>
			</div>
			<div class="vector-container">
				<span class="label"><?php esc_html_e( 'Scale', 'scene3d' ); ?></span>
				<div class="vector">
					<label>
						<span class="vector-index">X</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][scale][x]" value="{{data.scale[0]}}"/>
					</label>
					<label>
						<span class="vector-index">Y</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][scale][y]" value="{{data.scale[1]}}"/>
					</label>
					<label>
						<span class="vector-index">Z</span>
						<input type="number" step="any" class="transform" name="elements[__elem-id__][scale][z]" value="{{data.scale[2]}}"/>
					</label>
				</div>
			</div>
			<div>
				<p><span class="label"><?php esc_html_e( 'Shadows', 'scene3d' ); ?></span></p>
				<!-- @formatter:off -->
				<select class="shadows" name="elements[__elem-id__][shadows]">
					<option value="" <# print( data.shadows === '' ? 'selected' : '' ) #> ><?php esc_html_e( 'Disabled', 'scene3d' ); ?></option>
					<option value="c" <# print( data.shadows === 'c' ? 'selected' : '' ) #> ><?php esc_html_e( 'Cast', 'scene3d' ); ?></option>
					<option value="r" <# print( data.shadows === 'r' ? 'selected' : '' ) #> ><?php esc_html_e( 'Receive', 'scene3d' ); ?></option>
					<option value="cr" <# print( data.shadows === 'cr' ? 'selected' : '' ) #> ><?php esc_html_e( 'Cast and receive', 'scene3d' ); ?></option>
				</select>
				<!-- @formatter:on -->
				<p class="description"><?php esc_html_e( 'Cast shadows to other elements of the scene', 'scene3d' ); ?></p>
			</div>
			<# if ( data.type === 'fbx' ) { #>
			<p class="scene3d-notice info"><?php esc_html_e( 'FBX files often need to be scaled down around 0.01 when used along side glTF ones', 'scene3d' ); ?></p>
			<# } #>
			<# if ( data.animationNames.length ) { #>
			<div class="played-animations">
				<p><span class="label"><?php esc_html_e( 'Animations', 'scene3d' ); ?></span></p>
				<# for ( const anim of data.animationNames ) { #>
				<label class="toggle">
					<input class="toggle-checkbox play-anim" data-elemid="__elem-id__" name="elements[__elem-id__][playedAnim][]"
					<# print( data.playedAnim && data.playedAnim.indexOf( anim ) !== -1 ? 'checked' : '' ); #> type="checkbox" value="{{anim}}"/>
					<span class="toggle-switch"></span>
					<span class="toggle-label">{{anim}}</span>
				</label>
				<# } #>
			</div>
			<p class="description"><?php esc_html_e( 'Animations will be played simultaneously', 'scene3d' ); ?></p>
			<# } #>
		</div>
	</div>
</script>
