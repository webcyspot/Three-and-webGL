/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  color: <hex>,
 *  linewidth: <float>,
 *  resolution: <Vector2>, // to be set by renderer
 * }
 */

THREE.UniformsLib.line = {

	linewidth: { value: 1 },
	resolution: { value: new THREE.Vector2( 1, 1 ) }

};

THREE.ShaderLib[ 'line' ] = {

	uniforms: THREE.UniformsUtils.merge( [
		THREE.UniformsLib.common,
		THREE.UniformsLib.fog,
		THREE.UniformsLib.line
	] ),

	vertexShader:
		`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		varying vec2 vUv;

		void main() {

			#ifdef USE_COLOR
				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;
			#endif

			float aspect = resolution.x / resolution.y;

			vUv = uv;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec2 ndcStart = clipStart.xy / clipStart.w;
			vec2 ndcEnd = clipEnd.xy / clipEnd.w;

			// direction
			vec2 dir = ndcEnd - ndcStart;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			// perpendicular to dir
			vec2 offset = vec2( dir.y, - dir.x );

			// undo aspect ratio adjustment
			dir.x /= aspect;
			offset.x /= aspect;

			// sign flip
			if ( position.x < 0.0 ) offset *= - 1.0;

			// endcaps
			if ( position.y < 0.0 ) {

				offset += - dir;

			} else if ( position.y > 1.0 ) {

				offset += dir;

			}

			// adjust for linewidth
			offset *= linewidth;

			// adjust for clip-space to screen-space conversion // maybe it should be based on viewport ...
			offset /= resolution.y;

			// select end
			vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

			// back to clip space
			offset *= clip.w;

			clip.xy += offset;

			gl_Position = clip;

			#include <logdepthbuf_vertex>

			#include <worldpos_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,

	fragmentShader:
		`
		uniform vec3 diffuse;
		uniform float opacity;

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

			varying vec2 vUv;

		void main() {

			#include <clipping_planes_fragment>

			if ( vUv.y < 0.5 || vUv.y > 0.5 ) {

				float a = vUv.x - 0.5;
				float b = vUv.y - 0.5;
				float len2 = a * a + b * b;

				if ( len2 > 0.25 ) discard;

			}

			vec4 diffuseColor = vec4( diffuse, opacity );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, diffuseColor.a );

			#include <premultiplied_alpha_fragment>
			#include <tonemapping_fragment>
			#include <encodings_fragment>
			#include <fog_fragment>

		}
		`
};

THREE.LineMaterial = function ( parameters ) {

	THREE.ShaderMaterial.call( this, {

		type: 'LineMaterial',

		side: THREE.DoubleSide, // for now. there is an issue with segments that terminate behind the camera

		uniforms: THREE.UniformsUtils.clone( THREE.ShaderLib[ 'line' ].uniforms ),

		vertexShader: THREE.ShaderLib[ 'line' ].vertexShader,
		fragmentShader: THREE.ShaderLib[ 'line' ].fragmentShader

	} );

	Object.defineProperties( this, {

		color: {

			enumerable: true,

			get: function () {

				return this.uniforms.diffuse.value;

			},

			set: function ( value ) {

				this.uniforms.diffuse.value = value;

			}

		},

		linewidth: {

			enumerable: true,

			get: function () {

				return this.uniforms.linewidth.value;

			},

			set: function ( value ) {

				this.uniforms.linewidth.value = value;

			}

		},

		resolution: {

			enumerable: true,

			get: function () {

				return this.uniforms.resolution.value;

			},

			set: function ( value ) {

				this.uniforms.resolution.value.copy( value );

			}

		}

	} );

	this.setValues( parameters );

};

THREE.LineMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.LineMaterial.prototype.constructor = THREE.LineMaterial;

THREE.LineMaterial.prototype.isLineMaterial = true;

THREE.LineMaterial.prototype.copy = function ( source ) {

	THREE.ShaderMaterial.prototype.copy.call( this, source );

	this.color.copy( source.color );

	this.linewidth = source.linewidth;

	this.resolution = source.resolution;

	// todo

	return this;

};

