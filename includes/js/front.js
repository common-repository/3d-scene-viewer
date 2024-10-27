import {Scene3d} from './scene.js';

'use strict';

const sceneWrappers = {}, scenes = {};

// Build scenes as they enter the viewport
document.addEventListener( 'scroll', function () {
	buildScenes();
} );

// WPBakery front end editor
document.addEventListener( 'scene3dVCChart', function () {
	document.querySelectorAll( '.scene3d-scene' ).forEach( function ( node ) {
		const id = node.dataset.id;
		if ( typeof sceneWrappers[id] !== 'undefined' ) {
			return;
		}
		window.scene3dBuildScene( node );
	} );
} );

// Build scenes that are visible right away
window.addEventListener( 'DOMContentLoaded', function () {
	document.querySelectorAll( '.scene3d-scene' ).forEach( function ( node ) {
		sceneWrappers[node.dataset.id] = node;
	} );
	buildScenes();
} );

/**
 * Check if an element is within the viewport
 *
 * @param {Element} node
 */
function isVisible( node ) {
	return node.getBoundingClientRect().y < window.innerHeight;
}

/**
 * Build scene asynchronously (page builders)
 *
 * @param {Element} node scene wrapper div
 */
window.scene3dBuildScene = function ( node ) {
	const id = node.dataset.scene;
	if ( ! id ) {
		return;
	}
	sceneWrappers[parseInt( id )] = node;
	buildScenes();
};

/**
 * Build a scene
 */
function buildScenes() {
	if ( Object.keys( sceneWrappers ).length === 0 ) {
		return;
	}
	for ( const i in sceneWrappers ) {
		if ( ! isVisible( sceneWrappers[i] ) ) {
			continue;
		}
		scenes[i] = new Scene3d( sceneWrappers[i] );
		delete ( sceneWrappers[i] );
	}
}
