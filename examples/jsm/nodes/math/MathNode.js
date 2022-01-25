import { TempNode } from '../core/TempNode.js';

class MathNode extends TempNode {

	constructor( a, bOrMethod, cOrMethod, method ) {

		super();

		this.a = a;
		typeof bOrMethod !== 'string' ? this.b = bOrMethod : method = bOrMethod;
		typeof cOrMethod !== 'string' ? this.c = cOrMethod : method = cOrMethod;

		this.method = method;

	}

	getNumInputs( /*builder*/ ) {

		switch ( this.method ) {

			// variable

			case MathNode.ARCTAN:

				return this.b ? 2 : 1;

				// 3

			case MathNode.MIX:
			case MathNode.CLAMP:
			case MathNode.REFRACT:
			case MathNode.SMOOTHSTEP:
			case MathNode.FACEFORWARD:

				return 3;

				// 2

			case MathNode.MIN:
			case MathNode.MAX:
			case MathNode.MOD:
			case MathNode.STEP:
			case MathNode.REFLECT:
			case MathNode.DISTANCE:
			case MathNode.DOT:
			case MathNode.CROSS:
			case MathNode.POW:

				return 2;

				// 1

			default:

				return 1;

		}

	}

	getInputType( builder ) {

		const a = builder.getTypeLength( this.a.getType( builder ) );
		const b = this.b ? builder.getTypeLength( this.b.getType( builder ) ) : 0;
		const c = this.c ? builder.getTypeLength( this.c.getType( builder ) ) : 0;

		if ( a > b && a > c ) {

			return this.a.getType( builder );

		} else if ( b > c ) {

			return this.b.getType( builder );

		}

		return this.c.getType( builder );

	}

	getType( builder ) {

		switch ( this.method ) {

			case MathNode.LENGTH:
			case MathNode.DISTANCE:
			case MathNode.DOT:

				return 'f';

			case MathNode.CROSS:

				return 'v3';

		}

		return this.getInputType( builder );

	}

	generate( builder, output ) {

		let a, b, c;
		const al = this.a ? builder.getTypeLength( this.a.getType( builder ) ) : 0,
			bl = this.b ? builder.getTypeLength( this.b.getType( builder ) ) : 0,
			cl = this.c ? builder.getTypeLength( this.c.getType( builder ) ) : 0,
			inputType = this.getInputType( builder ),
			nodeType = this.getType( builder );

		switch ( this.method ) {

			// 1 input

			case MathNode.NEGATE:

				return builder.format( '( -' + this.a.build( builder, inputType ) + ' )', inputType, output );

			case MathNode.INVERT:

				return builder.format( '( 1.0 - ' + this.a.build( builder, inputType ) + ' )', inputType, output );

				// 2 inputs

			case MathNode.CROSS:

				a = this.a.build( builder, 'v3' );
				b = this.b.build( builder, 'v3' );

				break;

			case MathNode.STEP:

				a = this.a.build( builder, al === 1 ? 'f' : inputType );
				b = this.b.build( builder, inputType );

				break;

			case MathNode.MIN:
			case MathNode.MAX:
			case MathNode.MOD:

				a = this.a.build( builder, inputType );
				b = this.b.build( builder, bl === 1 ? 'f' : inputType );

				break;

				// 3 inputs

			case MathNode.REFRACT:

				a = this.a.build( builder, inputType );
				b = this.b.build( builder, inputType );
				c = this.c.build( builder, 'f' );

				break;

			case MathNode.MIX:

				a = this.a.build( builder, inputType );
				b = this.b.build( builder, inputType );
				c = this.c.build( builder, cl === 1 ? 'f' : inputType );

				break;

				// default

			default:

				a = this.a.build( builder, inputType );
				if ( this.b ) b = this.b.build( builder, inputType );
				if ( this.c ) c = this.c.build( builder, inputType );

				break;

		}

		// build function call

		const params = [];
		params.push( a );
		if ( b ) params.push( b );
		if ( c ) params.push( c );

		const numInputs = this.getNumInputs( builder );

		if ( params.length !== numInputs ) {

			throw Error( `Arguments not match used in "${this.method}". Require ${numInputs}, currently ${params.length}.` );

		}

		return builder.format( this.method + '( ' + params.join( ', ' ) + ' )', nodeType, output );

	}

	copy( source ) {

		super.copy( source );

		this.a = source.a;
		this.b = source.b;
		this.c = source.c;
		this.method = source.method;

		return this;

	}

	toJSON( meta ) {

		let data = this.getJSONNode( meta );

		if ( ! data ) {

			data = this.createJSONNode( meta );

			data.a = this.a.toJSON( meta ).uuid;
			if ( this.b ) data.b = this.b.toJSON( meta ).uuid;
			if ( this.c ) data.c = this.c.toJSON( meta ).uuid;

			data.method = this.method;

		}

		return data;

	}

}

// 1 input

MathNode.RAD = 'radians';
MathNode.DEG = 'degrees';
MathNode.EXP = 'exp';
MathNode.EXP2 = 'exp2';
MathNode.LOG = 'log';
MathNode.LOG2 = 'log2';
MathNode.SQRT = 'sqrt';
MathNode.INV_SQRT = 'inversesqrt';
MathNode.FLOOR = 'floor';
MathNode.CEIL = 'ceil';
MathNode.NORMALIZE = 'normalize';
MathNode.FRACT = 'fract';
MathNode.SATURATE = 'saturate';
MathNode.SIN = 'sin';
MathNode.COS = 'cos';
MathNode.TAN = 'tan';
MathNode.ASIN = 'asin';
MathNode.ACOS = 'acos';
MathNode.ARCTAN = 'atan';
MathNode.ABS = 'abs';
MathNode.SIGN = 'sign';
MathNode.LENGTH = 'length';
MathNode.NEGATE = 'negate';
MathNode.INVERT = 'invert';

// 2 inputs

MathNode.MIN = 'min';
MathNode.MAX = 'max';
MathNode.MOD = 'mod';
MathNode.STEP = 'step';
MathNode.REFLECT = 'reflect';
MathNode.DISTANCE = 'distance';
MathNode.DOT = 'dot';
MathNode.CROSS = 'cross';
MathNode.POW = 'pow';

// 3 inputs

MathNode.MIX = 'mix';
MathNode.CLAMP = 'clamp';
MathNode.REFRACT = 'refract';
MathNode.SMOOTHSTEP = 'smoothstep';
MathNode.FACEFORWARD = 'faceforward';

MathNode.prototype.nodeType = 'Math';
MathNode.prototype.hashProperties = [ 'method' ];

export { MathNode };
