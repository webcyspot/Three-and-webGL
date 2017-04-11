import { ShaderMaterial } from './ShaderMaterial';
import { ShaderChunk } from '../renderers/shaders/ShaderChunk';
import { UniformsLib } from '../renderers/shaders/UniformsLib';
import { UniformsUtils } from '../renderers/shaders/UniformsUtils';

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>
 * }
 */

function ShadowMaterial( parameters ) {

	ShaderMaterial.call( this, {
		uniforms: UniformsUtils.merge( [
			UniformsLib.lights,
			{
				opacity: { value: 1.0 }
			}
		] ),
		vertexShader: ShaderChunk[ 'shadow_vert' ],
		fragmentShader: ShaderChunk[ 'shadow_frag' ]
	} );

	Object.defineProperties( this, {
		opacity: {
			enumerable: true,
			get: function () {
				return this.uniforms.opacity.value;
			},
			set: function ( value ) {
				this.uniforms.opacity.value = value;
			}
		}
	} );

	this.setValues( parameters );

	this.lights = true;
	this.transparent = true;

}

ShadowMaterial.prototype = Object.create( ShaderMaterial.prototype );
ShadowMaterial.prototype.constructor = ShadowMaterial;

ShadowMaterial.prototype.isShadowMaterial = true;


export { ShadowMaterial };
