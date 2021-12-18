import {
	GammaEncoding,
	LinearEncoding,
	RGBEEncoding,
	RGBDEncoding,
	sRGBEncoding
} from '../../../../build/three.module.js';

import { TempNode } from '../core/TempNode.js';
import { FloatNode } from '../inputs/FloatNode.js';
import { FunctionNode } from '../core/FunctionNode.js';
import { ExpressionNode } from '../core/ExpressionNode.js';

class ColorSpaceNode extends TempNode {

	constructor( input, method ) {

		super( 'v4' );

		this.input = input;

		this.method = method || ColorSpaceNode.LINEAR_TO_LINEAR;

	}

	generate( builder, output ) {

		const input = this.input.build( builder, 'v4' );
		const outputType = this.getType( builder );

		const methodNode = ColorSpaceNode.Nodes[ this.method ];
		const method = builder.include( methodNode );

		if ( method === ColorSpaceNode.LINEAR_TO_LINEAR ) {

			return builder.format( input, outputType, output );

		} else {

			if ( methodNode.inputs.length === 2 ) {

				const factor = this.factor.build( builder, 'f' );

				return builder.format( method + '( ' + input + ', ' + factor + ' )', outputType, output );

			} else {

				return builder.format( method + '( ' + input + ' )', outputType, output );

			}

		}

	}

	fromEncoding( encoding ) {

		const components = ColorSpaceNode.getEncodingComponents( encoding );

		this.method = 'LinearTo' + components[ 0 ];
		this.factor = components[ 1 ];

	}

	fromDecoding( encoding ) {

		const components = ColorSpaceNode.getEncodingComponents( encoding );

		this.method = components[ 0 ] + 'ToLinear';
		this.factor = components[ 1 ];

	}

	copy( source ) {

		super.copy( source );

		this.input = source.input;
		this.method = source.method;

		return this;

	}

	toJSON( meta ) {

		let data = this.getJSONNode( meta );

		if ( ! data ) {

			data = this.createJSONNode( meta );

			data.input = this.input.toJSON( meta ).uuid;
			data.method = this.method;

		}

		return data;

	}

}

ColorSpaceNode.Nodes = ( function () {

	// For a discussion of what this is, please read this: http://lousodrome.net/blog/light/2013/05/26/gamma-correct-and-hdr-rendering-in-a-32-bits-buffer/

	const LinearToLinear = new FunctionNode( /* glsl */`
		vec4 LinearToLinear( in vec4 value ) {

			return value;

		}`
	);

	const GammaToLinear = new FunctionNode( /* glsl */`
		vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {

			return vec4( pow( value.xyz, vec3( gammaFactor ) ), value.w );

		}`
	);

	const LinearToGamma = new FunctionNode( /* glsl */`
		vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {

			return vec4( pow( value.xyz, vec3( 1.0 / gammaFactor ) ), value.w );

		}`
	);

	const sRGBToLinear = new FunctionNode( /* glsl */`
		vec4 sRGBToLinear( in vec4 value ) {

			return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );

		}`
	);

	const LinearTosRGB = new FunctionNode( /* glsl */`
		vec4 LinearTosRGB( in vec4 value ) {

			return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );

		}`
	);

	const RGBEToLinear = new FunctionNode( /* glsl */`
		vec4 RGBEToLinear( in vec4 value ) {

			return vec4( value.rgb * exp2( value.a * 255.0 - 128.0 ), 1.0 );

		}`
	);

	const LinearToRGBE = new FunctionNode( /* glsl */`
		vec4 LinearToRGBE( in vec4 value ) {

			float maxComponent = max( max( value.r, value.g ), value.b );
			float fExp = clamp( ceil( log2( maxComponent ) ), -128.0, 127.0 );
			return vec4( value.rgb / exp2( fExp ), ( fExp + 128.0 ) / 255.0 );

		}`
	);

	// reference: http://iwasbeingirony.blogspot.ca/2010/06/difference-between-rgbm-and-rgbd.html

	const RGBDToLinear = new FunctionNode( /* glsl */`
		vec3 RGBDToLinear( in vec4 value, in float maxRange ) {

			return vec4( value.rgb * ( ( maxRange / 255.0 ) / value.a ), 1.0 );

		}`
	);

	const LinearToRGBD = new FunctionNode( /* glsl */`
		vec3 LinearToRGBD( in vec4 value, in float maxRange ) {

			float maxRGB = max( value.x, max( value.g, value.b ) );
			float D      = max( maxRange / maxRGB, 1.0 );
			D            = clamp( floor( D ) / 255.0, 0.0, 1.0 );
			return vec4( value.rgb * ( D * ( 255.0 / maxRange ) ), D );

		}`
	);

	return {
		LinearToLinear: LinearToLinear,
		GammaToLinear: GammaToLinear,
		LinearToGamma: LinearToGamma,
		sRGBToLinear: sRGBToLinear,
		LinearTosRGB: LinearTosRGB,
		RGBEToLinear: RGBEToLinear,
		LinearToRGBE: LinearToRGBE,
		RGBDToLinear: RGBDToLinear,
		LinearToRGBD: LinearToRGBD
	};

} )();

ColorSpaceNode.LINEAR_TO_LINEAR = 'LinearToLinear';

ColorSpaceNode.GAMMA_TO_LINEAR = 'GammaToLinear';
ColorSpaceNode.LINEAR_TO_GAMMA = 'LinearToGamma';

ColorSpaceNode.SRGB_TO_LINEAR = 'sRGBToLinear';
ColorSpaceNode.LINEAR_TO_SRGB = 'LinearTosRGB';

ColorSpaceNode.RGBE_TO_LINEAR = 'RGBEToLinear';
ColorSpaceNode.LINEAR_TO_RGBE = 'LinearToRGBE';


ColorSpaceNode.RGBD_TO_LINEAR = 'RGBDToLinear';
ColorSpaceNode.LINEAR_TO_RGBD = 'LinearToRGBD';

ColorSpaceNode.getEncodingComponents = function ( encoding ) {

	switch ( encoding ) {

		case LinearEncoding:
			return [ 'Linear' ];
		case sRGBEncoding:
			return [ 'sRGB' ];
		case RGBEEncoding:
			return [ 'RGBE' ];
		case RGBDEncoding:
			return [ 'RGBD', new FloatNode( 256.0 ).setReadonly( true ) ];
		case GammaEncoding:
			return [ 'Gamma', new ExpressionNode( 'float( GAMMA_FACTOR )', 'f' ) ];

	}

};

ColorSpaceNode.prototype.nodeType = 'ColorSpace';
ColorSpaceNode.prototype.hashProperties = [ 'method' ];

export { ColorSpaceNode };
