/* global QUnit */

import { QuaternionLinearInterpolant } from '../../../../../src/math/interpolants/QuaternionLinearInterpolant.js';

import { Interpolant } from '../../../../../src/math/Interpolant.js';

export default QUnit.module( 'Maths', () => {

	QUnit.module( 'Interpolants', () => {

		QUnit.module( 'QuaternionLinearInterpolant', () => {

			// INHERITANCE
			QUnit.test( 'Extending', ( assert ) => {

				var object = new QuaternionLinearInterpolant( null, [ 1, 11, 2, 22, 3, 33 ], 2, [] );

				assert.strictEqual(
					object instanceof Interpolant, true,
					'QuaternionLinearInterpolant extends from Interpolant'
				);

			} );

			// INSTANCING
			QUnit.todo( 'Instancing', ( assert ) => {

				assert.ok( false, 'everything\'s gonna be alright' );

			} );

			// PRIVATE - TEMPLATE METHODS
			QUnit.todo( 'interpolate_', ( assert ) => {

				// interpolate_( i1, t0, t, t1 )
				// return equal to base class Interpolant.resultBuffer after call
				assert.ok( false, 'everything\'s gonna be alright' );

			} );

		} );

	} );

} );
