/* global QUnit */

import { WebGL3DRenderTarget } from '../../../../src/renderers/WebGL3DRenderTarget.js';

import { WebGLRenderTarget } from '../../../../src/renderers/WebGLRenderTarget.js';

export default QUnit.module( 'Renderers', () => {

	QUnit.module( 'WebGL3DRenderTarget', () => {

		// INHERITANCE
		QUnit.test( 'Extending', ( assert ) => {

			var object = new WebGL3DRenderTarget();

			assert.strictEqual( object instanceof WebGLRenderTarget, true, 'WebGL3DRenderTarget extends from WebGLRenderTarget' );

		} );

		// INSTANCING
		QUnit.todo( 'Instancing', ( assert ) => {

			assert.ok( false, 'everything\'s gonna be alright' );

		} );

		// PROPERTIES
		QUnit.todo( 'depth', ( assert ) => {

			assert.ok( false, 'everything\'s gonna be alright' );

		} );

		QUnit.todo( 'texture', ( assert ) => {

			// must be Data3DTexture
			assert.ok( false, 'everything\'s gonna be alright' );

		} );

		// PUBLIC
		QUnit.todo( 'isWebGL3DRenderTarget', ( assert ) => {

			assert.ok( false, 'everything\'s gonna be alright' );

		} );

	} );

} );
