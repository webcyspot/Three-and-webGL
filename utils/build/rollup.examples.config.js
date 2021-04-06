import babel from '@rollup/plugin-babel';
import path from 'path';
import glob from 'glob';
import babelrc from './.babelrc.json';

function babelCleanup() {

	const doubleSpaces = / {2}/g;

	return {

		transform( code ) {

			code = code.replace( doubleSpaces, '\t' );


			// remove comments messed up by babel that break eslint
			// example:
			// 	  setSize: function ()
			//    /* width, height */
			//    {
			//             ↓
			// 	  setSize: function () {
			code = code.replace( /\(\)\n\s*\/\*([a-zA-Z0-9_, ]+)\*\/\n\s*{/g, '( ) {' );


			return {
				code: code,
				map: null
			};

		}

	};

}





function unmodularize() {

	return {


		renderChunk( code ) {

			// export { Example };
			// ↓
			// THREE.Example = Example;
			code = code.replace( /export { ([a-zA-Z0-9_, ]+) };/g, ( match, p1 ) => {

				const exps = p1.split( ', ' );
				return exps.map( exp => `THREE.${exp} = ${exp};` ).join( '\n' );

			} );

			// import { Example } from '...';
			// but excluding imports importing from the libs/ folder
			const imports = [];
			code = code.replace( /import { ([a-zA-Z0-9_, ]+) } from '((?!libs).)*';\n/g, ( match, p1 ) => {

				const imps = p1.split( ', ' );
				imps.reverse();
				imports.push( ...imps );

				return '';

			} );

			// new Example()
			// (Example)
			// [Example]
			// Example2
			// ↓
			// new THREE.Example()
			// (THREE.Example)
			// [THREE.Example]
			// Example2
			function prefixThree( word ) {

				code = code.replace( new RegExp( `([\\s([!])${word}([^a-zA-Z0-9_])`, 'g' ), ( match, p1, p2 ) => {

					return `${p1}THREE.${word}${p2}`;

				} );

			}

			imports.forEach( prefixThree );


			// Do it again for this particular example
			// new Example(Example)
			// ↓
			// new THREE.Example(THREE.Example)
			imports.forEach( prefixThree );

			// fix for BasisTextureLoader.js
			imports.forEach( imp => {

				code = code.replace( new RegExp( `\n(\\s)THREE\.${imp}:`, 'g' ), ( match, p1 ) => {

					return `\n${p1}${imp}:`;

				} );

			} );

			// import * as THREE from '...';
			code = code.replace( /import \* as THREE from '(.*)';\n/g, '' );

			// Remove library imports that are exposed as
			// global variables in the non-module world
			code = code.replace( 'import * as fflate from \'../libs/fflate.module.min.js\';\n', '' );
			code = code.replace( 'import { MMDParser } from \'../libs/mmdparser.module.js\';\n', '' );
			code = code.replace( 'import { potpack } from \'../libs/potpack.module.js\';\n', '' );
			code = code.replace( 'import { opentype } from \'../libs/opentype.module.min.js\';\n', '' );
			code = code.replace( 'import { chevrotain } from \'../libs/chevrotain.module.min.js\';\n', '' );
			code = code.replace( 'import { ZSTDDecoder } from \'../libs/zstddec.module.js\';\n', '' );

			// remove newline at the start of file
			code = code.trimStart();

			code = `( function () {\n${code}\n} )();`;

			return {
				code: code,
				map: null
			};

		}

	};

}


const jsFolder = path.resolve( __dirname, '../../examples/js' );
const jsmFolder = path.resolve( __dirname, '../../examples/jsm' );

// list of all .js file nested in the examples/jsm folder
const files = glob.sync( '**/*.js', { cwd: jsmFolder, ignore: [
	// don't convert libs
	'libs/**/*',
	'loaders/ifc/**/*',

	// no non-module library
	// https://unpkg.com/browse/@webxr-input-profiles/motion-controllers@1.0.0/dist/
	'webxr/**/*',

	// no non-module library
	// https://unpkg.com/browse/web-ifc@0.0.17/
	'loaders/IFCLoader.js',

	// no non-module library
	// https://unpkg.com/browse/ktx-parse@0.2.1/dist/
	'loaders/KTX2Loader.js',

	'renderers/webgpu/**/*',
	'renderers/nodes/**/*',
	'nodes/**/*',
	'loaders/NodeMaterialLoader.js',
	'offscreen/**/*',
] } );


// Create a rollup config for each .js file
export default files.map( file => {

	const inputPath = path.join( 'examples/jsm', file );
	const outputPath = path.resolve( jsFolder, file );


	return {

		input: inputPath,
		treeshake: false,
		external: () => true, // don't bundle anything
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			unmodularize(),
		],

		output: {

			format: 'esm',
			file: outputPath,

		}

	};

} );
