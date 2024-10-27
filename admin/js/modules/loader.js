import {FBXLoader} from '../../../includes/js/3js/loader/FBXLoader.js';
import {GLTFLoader} from '../../../includes/js/3js/loader/GLTFLoader.js';
import {Vector2} from '../../../includes/js/3js/src/math/Vector2.js';

'use strict';

/**
 * Load FBX/glTF file
 */
class Scene3dLoader {
	/**
	 * The singleton
	 *
	 * @type {null|Scene3dLoader}
	 */
	static #instance = null;

	/**
	 * Flag to ensure one instance only is created
	 *
	 * @type {boolean}
	 */
	static #flag = false;

	/**
	 * Loader for glTF files
	 *
	 * @type {GLTFLoader}
	 */
	#gltfLoader;

	/**
	 * Loader for FBX files
	 *
	 * @type {FBXLoader}
	 */
	#fbxLoader;

	/**
	 * Constructor
	 *
	 * @returns {boolean|Scene3dLoader}
	 */
	constructor() {
		if ( Scene3dLoader.#flag === false ) {
			return false;
		}
		return this;
	}

	/**
	 * Load a file
	 *
	 * @param {string} url URL to the file
	 * @param {string} mime expected mime type
	 * @param {string} id element ID
	 */
	load( url, mime, id ) {
		if ( mime === 'model/fbx-binary' ) {
			this.loadFbx( url, id );
		}
		if ( mime === 'model/gltf-binary' ) {
			this.loadGltf( url, id );
		}
	}

	/**
	 * Set up shadows on gltf models
	 *
	 * @param {{}} gltfScene the entire scene contained in the file
	 * @param {string} id element ID
	 * @param {string} shadow force te setting to a particular shadow value
	 */
	setGltfShadows( gltfScene, id, shadow ) {
		const scene    = window.scene3dScene;
		const postData = window.scene3dEditUI.getPostDataElements();
		let shadows    = postData[id] && typeof postData[id].shadows !== 'undefined' ? postData[id].shadows : 'cr';

		if ( typeof shadow !== 'undefined' ) {
			shadows = shadow;
		}

		gltfScene.traverse( function ( child ) {
			if ( child.isMesh && scene.shadows && shadows !== '' ) {
				child.castShadow    = ['c', 'cr'].indexOf( shadows ) !== - 1;
				child.receiveShadow = ['r', 'cr'].indexOf( shadows ) !== - 1;
			}
			if ( child.isSpotLight || child.isPointLight ) {
				child.intensity = child.intensity / 543.5141306588226;

				if ( scene.shadows ) {
					child.castShadow     = true;
					child.shadow.bias    = - .0001;
					child.shadow.mapSize = new Vector2( scene.shadowMapSize, scene.shadowMapSize );

					child.shadow.camera.far = 1000;
				}
			}
		} );
	}

	/**
	 * Load a glTF file
	 *
	 * @param {string} url URL to the file
	 * @param {string} id element ID
	 */
	loadGltf( url, id ) {
		if ( ! this.#gltfLoader ) {
			this.#gltfLoader = new GLTFLoader();
		}
		const self = this;
		this.#gltfLoader.load( url, function ( gltf ) {
			self.setGltfShadows( gltf.scene, id );
			self.buildParseResults( gltf, url, 'gltf', id );
		}, undefined, function ( error ) {
			document.dispatchEvent( new CustomEvent( 'modelParseResults', {detail: {error: error, url: url}} ) );
		} );
	}

	/**
	 * Load a FBX file
	 *
	 * @param {string} url URL to the file
	 * @param {string} id element ID
	 */
	loadFbx( url, id ) {
		if ( ! this.#fbxLoader ) {
			this.#fbxLoader = new FBXLoader();
		}
		const self = this;
		this.#fbxLoader.load( url, function ( fbx ) {
			fbx.traverse( function ( child ) {
				if ( child.isMesh ) {
					child.castShadow    = true;
					child.receiveShadow = true;
				}
			} );

			self.buildParseResults( fbx, url, 'fbx', id );
		}, undefined, function ( error ) {
			document.dispatchEvent( new CustomEvent( 'modelParseResults', {detail: error} ) );
		} );
	}

	/**
	 * Build element list template data from the 3D model data
	 *
	 * @param {{}} data model data
	 * @returns {{animationNames: *[], filename, type, url, position, rotation, scale, quaternion}}
	 */
	getTemplateData( data ) {
		const templateData = {
			filename:       data.filename,
			type:           data.type,
			url:            data.url,
			animationNames: []
		};

		if ( ['gltf', 'fbx'].indexOf( data.type ) !== - 1 ) {
			const postData       = window.scene3dEditUI.getPostDataElements();
			templateData.shadows = postData[data.id] && typeof postData[data.id].shadows !== 'undefined' ? postData[data.id].shadows : 'cr';
		}

		const animationClips = data.model.animations || [];

		for ( const anim of animationClips ) {
			templateData.animationNames.push( anim.name );
		}

		const object = data.type === 'gltf' ? data.model.scene : data.model;

		templateData.position   = [
			object.position.x,
			object.position.y,
			object.position.z
		];
		templateData.rotation   = [
			object.rotation._x,
			object.rotation._y,
			object.rotation._z
		];
		templateData.scale      = [
			object.scale.x,
			object.scale.y,
			object.scale.z
		];
		templateData.quaternion = [
			object.quaternion.x,
			object.quaternion.y,
			object.quaternion.z,
			object.quaternion.w
		];

		return templateData;
	}

	/**
	 * Build 3D model data then pass it through an event
	 *
	 * @param {{}} model raw parse result
	 * @param {string} url file URL
	 * @param {string} type file type
	 * @param {string} id element ID
	 */
	buildParseResults( model, url, type, id ) {
		const data = {model: model, url: url, type: type};
		if ( typeof id !== 'undefined' ) {
			data.id = id;
		}
		const filename     = url.split( '/' );
		data.filename      = filename[filename.length - 1];
		const templateData = this.getTemplateData( data );
		document.dispatchEvent( new CustomEvent( 'modelParseResults', {detail: {model: data, template: templateData}} ) );
	}

	/**
	 * Getter for the unique instance
	 *
	 * @returns {Scene3dLoader|null}
	 */
	static getLoader() {
		if ( Scene3dLoader.#instance === null ) {
			Scene3dLoader.#flag     = true;
			Scene3dLoader.#instance = new Scene3dLoader();
		}
		return Scene3dLoader.#instance;
	}
}

window.Scene3dGetLoader = Scene3dLoader.getLoader;
