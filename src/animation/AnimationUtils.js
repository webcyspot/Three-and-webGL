/**
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

 THREE.AnimationUtils = {

 	getEqualsFunc: function( exemplarValue ) {

		if( exemplarValue.equals ) {
			return function equals_object( a, b ) {
				return a.equals( b );
			}
		}

		return function equals_primitive( a, b ) {
			return ( a === b );	
		};

	},

 	clone: function( exemplarValue ) {

 		var typeName = typeof exemplarValue;
		if( typeName === "object" ) {
			if( exemplarValue.clone ) {
				return exemplarValue.clone();
			}
			console.error( "can not figure out how to copy exemplarValue", exemplarValue );
		}

		return exemplarValue;

	},

 	lerp: function( a, b, alpha, interTrack ) {

		var lerpFunc = THREE.AnimationUtils.getLerpFunc( a, interTrack );

		return lerpFunc( a, b, alpha );

	},

	// NOTE: this is an accumulator function that modifies the first argument (e.g. a).  This is to minimize memory alocations.
	getLerpFunc: function( exemplarValue, interTrack ) {

		if( exemplarValue === undefined || exemplarValue === null ) throw new Error( "examplarValue is null" );

		var typeName = typeof exemplarValue;
		switch( typeName ) {
		 	case "object": {

				if( exemplarValue.lerp ) {

					return function lerp_object( a, b, alpha ) {
						return a.lerp( b, alpha );
					}

				}
				if( exemplarValue.slerp ) {

					return function slerp_object( a, b, alpha ) {
						return a.slerp( b, alpha );
					}

				}
				break;
			}
		 	case "number": {
				return function lerp_number( a, b, alpha ) {
					return a * ( 1 - alpha ) + b * alpha;
				}
		 	}	
		 	case "boolean": {
		 		if( interTrack ) {
					return function lerp_boolean( a, b, alpha ) {
			 			return ( alpha < 0.5 ) ? a : b;
			 		}
		 		}
		 		else {
					return function lerp_boolean_immediate( a, b, alpha ) {
			 			return a;
			 		}
		 		}
		 	}
		 	case "string": {
		 		if( interTrack ) {
					return function lerp_string( a, b, alpha ) {
			 			return ( alpha < 0.5 ) ? a : b;
			 		}
		 		}
		 		else {
					return function lerp_string_immediate( a, b, alpha ) {
				 		return a;		 		
				 	}
			 	}
		 	}
		};

	}
	
};