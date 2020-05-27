console.warn( "THREE.ColorConverter: As part of the transition to ES6 Modules, the files in 'examples/js' were deprecated in May 2020 (r117) and will be deleted in December 2020 (r124). You can find more information about developing using ES6 Modules in https://threejs.org/docs/index.html#manual/en/introduction/Import-via-modules." );
/**
 * @author bhouston / http://exocortex.com/
 * @author zz85 / http://github.com/zz85
 */

THREE.ColorConverter = {

	setHSV: function ( color, h, s, v ) {

		// https://gist.github.com/xpansive/1337890#file-index-js

		h = THREE.MathUtils.euclideanModulo( h, 1 );
		s = THREE.MathUtils.clamp( s, 0, 1 );
		v = THREE.MathUtils.clamp( v, 0, 1 );

		return color.setHSL( h, ( s * v ) / ( ( h = ( 2 - s ) * v ) < 1 ? h : ( 2 - h ) ), h * 0.5 );

	},

	getHSV: function () {

		var hsl = {};

		return function getHSV( color, target ) {

			if ( target === undefined ) {

				console.warn( 'THREE.ColorConverter: .getHSV() target is now required' );
				target = { h: 0, s: 0, l: 0 };

			}

			color.getHSL( hsl );

			// based on https://gist.github.com/xpansive/1337890#file-index-js
			hsl.s *= ( hsl.l < 0.5 ) ? hsl.l : ( 1 - hsl.l );

			target.h = hsl.h;
			target.s = 2 * hsl.s / ( hsl.l + hsl.s );
			target.v = hsl.l + hsl.s;

			return target;

		};

	}(),

	// where c, m, y, k is between 0 and 1

	setCMYK: function ( color, c, m, y, k ) {

		var r = ( 1 - c ) * ( 1 - k );
		var g = ( 1 - m ) * ( 1 - k );
		var b = ( 1 - y ) * ( 1 - k );

		return color.setRGB( r, g, b );

	},

	getCMYK: function ( color, target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.ColorConverter: .getCMYK() target is now required' );
			target = { c: 0, m: 0, y: 0, k: 0 };

		}

		var r = color.r;
		var g = color.g;
		var b = color.b;

		var k = 1 - Math.max( r, g, b );
		var c = ( 1 - r - k ) / ( 1 - k );
		var m = ( 1 - g - k ) / ( 1 - k );
		var y = ( 1 - b - k ) / ( 1 - k );

		target.c = c;
		target.m = m;
		target.y = y;
		target.k = k;

		return target;

	}


};
