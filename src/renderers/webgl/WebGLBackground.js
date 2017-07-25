/**
 * @author mrdoob / http://mrdoob.com/
 */

import { BackSide } from '../../constants';
import { OrthographicCamera } from '../../cameras/OrthographicCamera';
import { PerspectiveCamera } from '../../cameras/PerspectiveCamera';
import { BoxBufferGeometry } from '../../geometries/BoxGeometry';
import { PlaneBufferGeometry } from '../../geometries/PlaneGeometry';
import { MeshBasicMaterial } from '../../materials/MeshBasicMaterial';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Color } from '../../math/Color';
import { Mesh } from '../../objects/Mesh';
import { ShaderLib } from '../shaders/ShaderLib';

function WebGLBackground( renderer, state, geometries, premultipliedAlpha ) {

	var clearColor = new Color( 0x000000 );
	var clearAlpha = 0;

	var planeCamera, planeMesh;
	var boxMesh;

	function render( scene, camera, forceClear ) {

		var background = scene.background;

		if ( background === null ) {

			setClear( clearColor, clearAlpha );

		} else if ( background && background.isColor ) {

			setClear( background, 1 );
			forceClear = true;

		}

		if ( renderer.autoClear || forceClear ) {

			renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

		}

		if ( background && background.isCubeTexture ) {

			if ( boxMesh === undefined ) {

				boxMesh = new Mesh(
					new BoxBufferGeometry( 5, 5, 5 ),
					new ShaderMaterial( {
						uniforms: ShaderLib.cube.uniforms,
						vertexShader: ShaderLib.cube.vertexShader,
						fragmentShader: ShaderLib.cube.fragmentShader,
						side: BackSide,
						depthTest: false,
						depthWrite: false,
						fog: false
					} )
				);

			}

			boxMesh.material.uniforms[ "tCube" ].value = background;
			boxMesh.modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, boxMesh.matrixWorld );
			boxMesh.normalMatrix.getNormalMatrix( boxMesh.modelViewMatrix );

			geometries.update( boxMesh.geometry );

			renderer.renderBufferDirect( camera, null, boxMesh.geometry, boxMesh.material, boxMesh, null );

		} else if ( background && background.isTexture ) {

			if ( planeCamera === undefined ) {

				planeCamera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

				planeMesh = new Mesh(
					new PlaneBufferGeometry( 2, 2 ),
					new MeshBasicMaterial( { depthTest: false, depthWrite: false, fog: false } )
				);

			}

			planeMesh.material.map = background;

			geometries.update( planeMesh.geometry );

			renderer.renderBufferDirect( planeCamera, null, planeMesh.geometry, planeMesh.material, planeMesh, null );

		}

	}

	function setClear( color, alpha ) {

		state.buffers.color.setClear( color.r, color.g, color.b, alpha, premultipliedAlpha );

	}

	return {

		getClearColor: function () {

			return clearColor;

		},
		setClearColor: function ( color, alpha ) {

			clearColor.set( color );
			clearAlpha = alpha !== undefined ? alpha : 1;
			setClear( clearColor, clearAlpha );

		},
		getClearAlpha: function () {

			return clearAlpha;

		},
		setClearAlpha: function ( alpha ) {

			clearAlpha = alpha;
			setClear( clearColor, clearAlpha );

		},
		render: render

	};

}


export { WebGLBackground };
