=== 3D Scene Viewer ===
Contributors: wprj
Tags: 3D, 3D model, 3D scene, 3D model viewer, threejs, woocommerce, product image, product gallery
Requires at least: 6.1
Tested up to: 6.2.2
Requires PHP: 7.4
Stable tag: 1.0.1
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.en.html

Display a 3D model or an entire scene made of multiple 3D models onto your site.

== Description ==

3D scene viewer allows you to create a 3D scene from 3D model files. You can replace a product image with an interactive 3D scene on the product page, or just display a 3D model in a post or page.

= Supported file types =

* `glTF` v2: `.gltf`/`.glb`.
* `FBX` ASCII verion 7.0 and newer, or binary version 6400 and newer.

Support animations.

= Lighting =

The plugin is powered by [three.js](https://threejs.org/). All the five light types are presents.

* Ambient light
* Hemisphere light
* Directional light
* Spotlight
* Point light

This allows the creation of all kinds of lighting conditions.

= Camera =

Camera position and movement are configurable. You can restrict the viewer from moving the camera beyond certain angles.

== Installation ==

= Uploading in WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Navigate to the 'Upload' area
3. Select `3d-scene-viewer.zip` from your computer
4. Click 'Install Now'
5. Activate 3D Scene Viewer in the Plugin dashboard

= Using FTP =

1. Download `3d-scene-viewer.zip`
2. Extract the `3d-scene-viewer` directory to your computer
3. Upload the `3d-scene-viewer` directory to the `/wp-content/plugins/` directory
4. Activate 3D Scene Viewer in the Plugin dashboard

== Frequently Asked Questions ==

= What data will be imported from a file =

All data supported by the file format (glTF or FBX) specification will be imported, except for cameras. There will be only one camera on the scene, and it's the one created by the plugin.

Multiple animated objects can be imported all at once in one single file, but this might lead to problems when there are animations with different lengths.

= I imported a FBX file but I don't see it on the preview and there is no error message =

Most of the FBX files available on the web (or at least a lot of them) need to be scaled down to a factor of 0.01 to fit the scale of three.js. After adding your FBX model to the scene, apply a scale of 0.01 on all the axes.

== Screenshots ==

1. Dashboard menu
2. Backend preview
3. Visual helper on the preview
4. Product image replacement

== Changelog ==

= 1.0.1 =

* Added WooCommerce image/gallery replacement.
* Fix a bug making FBX models never cast nor receive shadows on the frontend.

= 1.0 =

Initial release
