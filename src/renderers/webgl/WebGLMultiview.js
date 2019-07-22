/**
 * @author fernandojsg / http://fernandojsg.com
 * @author Takahiro https://github.com/takahirox
 */

import { WebGLMultiviewRenderTarget } from '../WebGLMultiviewRenderTarget.js';
import { Matrix3 } from '../../math/Matrix3.js';
import { Matrix4 } from '../../math/Matrix4.js';
import { Vector2 } from '../../math/Vector2.js';

function WebGLMultiview( renderer, requested, options ) {

	options = Object.assign( {}, { debug: false }, options );

	var DEFAULT_NUMVIEWS = 2;
	var gl = renderer.context;

	var maxNumViews = capabilities.maxMultiviewViews;

	var capabilities = renderer.capabilities;
	var properties = renderer.properties;

	var renderTarget, currentRenderTarget;
	var mat3, mat4, cameraArray, renderSize;

	function getMaxViews() {

		return capabilities.maxMultiviewViews;

	}

	function getNumViews() {

		if ( renderTarget && renderer.getRenderTarget() === renderTarget ) {

			return renderTarget.numViews;

		}

		return 0;

	}

	function getCameraArray( camera ) {

		if ( camera.isArrayCamera ) return camera.cameras;

		cameraArray[ 0 ] = camera;

		return cameraArray;

	}

	//

	function isAvailable() {

		return capabilities.multiview;

	}

	function isEnabled() {

		return requested && isAvailable();

	}

	if ( options.debug ) {

		if ( requested && ! isAvailable() ) {

			console.warn( 'WebGLRenderer: Multiview requested but not supported by the browser' );

		} else if ( requested !== false && isAvailable() ) {

			console.info( 'WebGLRenderer: Multiview enabled' );

		}

	}

	function updateCameraProjectionMatricesUniform( camera, uniforms ) {

		var cameras = getCameraArray( camera );

		for ( var i = 0; i < cameras.length; i ++ ) {

			mat4[ i ].copy( cameras[ i ].projectionMatrix );

		}

		uniforms.setValue( gl, 'projectionMatrices', mat4 );

	}

	function updateCameraViewMatricesUniform( camera, uniforms ) {

		var cameras = getCameraArray( camera );

		for ( var i = 0; i < cameras.length; i ++ ) {

			mat4[ i ].copy( cameras[ i ].matrixWorldInverse );

		}

		uniforms.setValue( gl, 'viewMatrices', mat4 );

	}

	function updateObjectMatricesUniforms( object, camera, uniforms ) {

		var cameras = getCameraArray( camera );

		for ( var i = 0; i < cameras.length; i ++ ) {

			mat4[ i ].multiplyMatrices( cameras[ i ].matrixWorldInverse, object.matrixWorld );
			mat3[ i ].getNormalMatrix( mat4[ i ] );

		}

		uniforms.setValue( gl, 'modelViewMatrices', mat4 );
		uniforms.setValue( gl, 'normalMatrices', mat3 );

	}

	function isMultiviewCompatible( camera ) {

		if ( ! camera.isArrayCamera ) return true;

		var cameras = camera.cameras;

		if ( cameras.length > maxNumViews ) return false;

		for ( var i = 1, il = cameras.length; i < il; i ++ ) {

			if ( cameras[ 0 ].bounds.z !== cameras[ i ].bounds.z ||
				cameras[ 0 ].bounds.w !== cameras[ i ].bounds.w ) return false;

		}

		return true;

	}

	function resizeRenderTarget( camera ) {

		if ( currentRenderTarget ) {

			renderSize.set( currentRenderTarget.width, currentRenderTarget.height );

		} else {

			renderer.getDrawingBufferSize( renderSize );

		}

		if ( camera.isArrayCamera ) {

			var bounds = camera.cameras[ 0 ].bounds;

			renderTarget.setSize( bounds.z * renderSize.x, bounds.w * renderSize.y );
			renderTarget.setNumViews( camera.cameras.length );

		} else {

			renderTarget.setSize( renderSize.x, renderSize.y );
			renderTarget.setNumViews( DEFAULT_NUMVIEWS );

		}

	}

	function attachRenderTarget( camera ) {

		if ( ! isMultiviewCompatible( camera ) ) return;

		currentRenderTarget = renderer.getRenderTarget();
		resizeRenderTarget( camera );
		renderer.setRenderTarget( renderTarget );

	}

	function detachRenderTarget( camera ) {

		if ( renderTarget !== renderer.getRenderTarget() ) return false;

		renderer.setRenderTarget( currentRenderTarget );
		flush( camera );

	}

	function flush( camera ) {

		var srcRenderTarget = renderTarget;
		var numViews = srcRenderTarget.numViews;

		var srcFramebuffers = properties.get( srcRenderTarget ).__webglViewFramebuffers;

		var viewWidth = srcRenderTarget.width;
		var viewHeight = srcRenderTarget.height;

		if ( camera.isArrayCamera ) {

			for ( var i = 0; i < numViews; i ++ ) {

				var bounds = camera.cameras[ i ].bounds;

				var x1 = bounds.x * renderSize.x;
				var y1 = bounds.y * renderSize.y;
				var x2 = x1 + bounds.z * renderSize.x;
				var y2 = y1 + bounds.w * renderSize.y;

				gl.bindFramebuffer( gl.READ_FRAMEBUFFER, srcFramebuffers[ i ] );
				gl.blitFramebuffer( 0, 0, viewWidth, viewHeight, x1, y1, x2, y2, gl.COLOR_BUFFER_BIT, gl.NEAREST );

			}

		} else {

			gl.bindFramebuffer( gl.READ_FRAMEBUFFER, srcFramebuffers[ 0 ] );
			gl.blitFramebuffer( 0, 0, viewWidth, viewHeight, 0, 0, renderSize.x, renderSize.y, gl.COLOR_BUFFER_BIT, gl.NEAREST );

		}

	}


	if ( isEnabled() ) {

		renderTarget = new WebGLMultiviewRenderTarget( 0, 0, DEFAULT_NUMVIEWS );

		renderSize = new Vector2();
		mat4 = [];
		mat3 = [];
		cameraArray = [];

		for ( var i = 0; i < getMaxViews(); i ++ ) {

			mat4[ i ] = new Matrix4();
			mat3[ i ] = new Matrix3();

		}

	}


	this.attachRenderTarget = attachRenderTarget;
	this.detachRenderTarget = detachRenderTarget;
	this.isAvailable = isAvailable;
	this.isEnabled = isEnabled;
	this.getNumViews = getNumViews;
	this.updateCameraProjectionMatricesUniform = updateCameraProjectionMatricesUniform;
	this.updateCameraViewMatricesUniform = updateCameraViewMatricesUniform;
	this.updateObjectMatricesUniforms = updateObjectMatricesUniforms;

}

export { WebGLMultiview };
