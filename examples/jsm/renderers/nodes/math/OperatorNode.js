import TempNode from '../core/TempNode.js';

class OperatorNode extends TempNode {

	constructor( op, a, b ) {

		super();

		this.op = op;

		this.a = a;
		this.b = b;

	}

	getType( builder ) {

		const typeA = this.a.getType( builder );
		const typeB = this.b.getType( builder );

		if ( builder.isMatrix( typeA ) && builder.isVector( typeB ) ) {

			// matrix x vector

			return typeB;

		} else if ( builder.isVector( typeA ) && builder.isMatrix( typeB ) ) {

			// vector x matrix

			return typeA;

		} else if ( builder.getTypeLength( typeB ) > builder.getTypeLength( typeA ) ) {

			// anytype x anytype: use the greater length vector

			return typeB;

		}

		return typeA;

	}

	generate( builder, output ) {

		let typeA = this.a.getType( builder );
		let typeB = this.b.getType( builder );

		let type = this.getType( builder );

		if ( builder.isMatrix( typeA ) && builder.isVector( typeB ) ) {

			// matrix x vector

			type = typeB = builder.getVectorFromMatrix( typeA );

		} else if ( builder.isVector( typeA ) && builder.isMatrix( typeB ) ) {

			// vector x matrix

			type = typeB = builder.getVectorFromMatrix( typeB );

		} else {

			// anytype x anytype

			typeA = typeB = type;

		}

		const a = this.a.build( builder, typeA );
		const b = this.b.build( builder, typeB );

		return builder.format( `( ${a} ${this.op} ${b} )`, type, output );

	}

}

export default OperatorNode;
