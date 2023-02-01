/* global QUnit */

import { AnimationLoader } from '../../../../src/loaders/AnimationLoader.js';

import { Loader } from '../../../../src/loaders/Loader.js';

export default QUnit.module( 'Loaders', () => {

	QUnit.module( 'AnimationLoader', () => {

		// INHERITANCE
		QUnit.test( 'Extending', ( assert ) => {

			const object = new AnimationLoader();
			assert.strictEqual(
				object instanceof Loader, true,
				'AnimationLoader extends from Loader'
			);

		} );

		// INSTANCING
		QUnit.todo( 'Instancing', ( assert ) => {

			assert.ok( false, 'everything\'s gonna be alright' );

		} );

		// PUBLIC
		QUnit.todo( 'load', ( assert ) => {

			assert.ok( false, 'everything\'s gonna be alright' );

		} );

		QUnit.todo( 'parse', ( assert ) => {

			// parse( json )
			assert.ok( false, 'everything\'s gonna be alright' );

		} );

	} );

} );
