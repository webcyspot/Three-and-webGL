import terser from '@rollup/plugin-terser';

function addons() {

	return {

		transform( code, id ) {

			if ( /\/examples\/jsm\//.test( id ) === false ) return;

			code = code.replace( 'build/three.module.js', 'src/Three.js' );

			return {
				code: code,
				map: null
			};

		}

	};

}

export function glsl() {

	return {

		transform( code, id ) {

			if ( /\.glsl.js$/.test( id ) === false ) return;

			code = code.replace( /\/\* glsl \*\/\`(.*?)\`/sg, function ( match, p1 ) {

				return JSON.stringify(
					p1
						.trim()
						.replace( /\r/g, '' )
						.replace( /[ \t]*\/\/.*\n/g, '' ) // remove //
						.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) // remove /* */
						.replace( /\n{2,}/g, '\n' ) // # \n+ to \n
				);

			} );

			return {
				code: code,
				map: null
			};

		}

	};

}

function header() {

	return {

		renderChunk( code ) {

			return `/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
${ code }`;

		}

	};

}

function deprecationWarning() {

	return {

		renderChunk( code ) {

			return `console.warn( 'Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+, and will be removed with r160. Please use ES Modules or alternatives: https://threejs.org/docs/index.html#manual/en/introduction/Installation' );
${ code }`;

		}

	};

}

const builds = [
	{
		input: 'src/Three.js',
		plugins: [
			addons(),
			glsl(),
			header()
		],
		output: [
			{
				format: 'esm',
				file: 'build/three.module.js'
			}
		]
	},
	{
		input: 'src/Three.js',
		plugins: [
			addons(),
			glsl(),
			terser(),
			header()
		],
		output: [
			{
				format: 'esm',
				file: 'build/three.module.min.js'
			}
		]
	},
	{
		input: 'src/Three.js',
		plugins: [
			addons(),
			glsl(),
			header()
		],
		output: [
			{
				format: 'cjs',
				name: 'THREE',
				file: 'build/three.cjs',
				indent: '\t'
			}
		]
	},

	{ // @deprecated, r150
		input: 'src/Three.js',
		plugins: [
			addons(),
			glsl(),
			header(),
			deprecationWarning()
		],
		output: [
			{
				format: 'umd',
				name: 'THREE',
				file: 'build/three.js',
				indent: '\t'
			}
		]
	},
	{ // @deprecated, r150
		input: 'src/Three.js',
		plugins: [
			addons(),
			glsl(),
			terser(),
			header(),
			deprecationWarning()
		],
		output: [
			{
				format: 'umd',
				name: 'THREE',
				file: 'build/three.min.js'
			}
		]
	}
];

export default ( args ) => args.configOnlyModule ? builds[ 0 ] : builds;
