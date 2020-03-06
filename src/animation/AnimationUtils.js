/**
 * @author tschw
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

import { Quaternion } from '../math/Quaternion.js';

var AnimationUtils = {

	// same as Array.prototype.slice, but also works on typed arrays
	arraySlice: function ( array, from, to ) {

		if ( AnimationUtils.isTypedArray( array ) ) {

			// in ios9 array.subarray(from, undefined) will return empty array
			// but array.subarray(from) or array.subarray(from, len) is correct
			return new array.constructor( array.subarray( from, to !== undefined ? to : array.length ) );

		}

		return array.slice( from, to );

	},

	// converts an array to a specific type
	convertArray: function ( array, type, forceClone ) {

		if ( ! array || // let 'undefined' and 'null' pass
			! forceClone && array.constructor === type ) return array;

		if ( typeof type.BYTES_PER_ELEMENT === 'number' ) {

			return new type( array ); // create typed array

		}

		return Array.prototype.slice.call( array ); // create Array

	},

	isTypedArray: function ( object ) {

		return ArrayBuffer.isView( object ) &&
			! ( object instanceof DataView );

	},

	// returns an array by which times and values can be sorted
	getKeyframeOrder: function ( times ) {

		function compareTime( i, j ) {

			return times[ i ] - times[ j ];

		}

		var n = times.length;
		var result = new Array( n );
		for ( var i = 0; i !== n; ++ i ) result[ i ] = i;

		result.sort( compareTime );

		return result;

	},

	// uses the array previously returned by 'getKeyframeOrder' to sort data
	sortedArray: function ( values, stride, order ) {

		var nValues = values.length;
		var result = new values.constructor( nValues );

		for ( var i = 0, dstOffset = 0; dstOffset !== nValues; ++ i ) {

			var srcOffset = order[ i ] * stride;

			for ( var j = 0; j !== stride; ++ j ) {

				result[ dstOffset ++ ] = values[ srcOffset + j ];

			}

		}

		return result;

	},

	// function for parsing AOS keyframe formats
	flattenJSON: function ( jsonKeys, times, values, valuePropertyName ) {

		var i = 1, key = jsonKeys[ 0 ];

		while ( key !== undefined && key[ valuePropertyName ] === undefined ) {

			key = jsonKeys[ i ++ ];

		}

		if ( key === undefined ) return; // no data

		var value = key[ valuePropertyName ];
		if ( value === undefined ) return; // no data

		if ( Array.isArray( value ) ) {

			do {

				value = key[ valuePropertyName ];

				if ( value !== undefined ) {

					times.push( key.time );
					values.push.apply( values, value ); // push all elements

				}

				key = jsonKeys[ i ++ ];

			} while ( key !== undefined );

		} else if ( value.toArray !== undefined ) {

			// ...assume THREE.Math-ish

			do {

				value = key[ valuePropertyName ];

				if ( value !== undefined ) {

					times.push( key.time );
					value.toArray( values, values.length );

				}

				key = jsonKeys[ i ++ ];

			} while ( key !== undefined );

		} else {

			// otherwise push as-is

			do {

				value = key[ valuePropertyName ];

				if ( value !== undefined ) {

					times.push( key.time );
					values.push( value );

				}

				key = jsonKeys[ i ++ ];

			} while ( key !== undefined );

		}

	},

	subclip: function ( sourceClip, name, startFrame, endFrame, fps ) {

		fps = fps || 30;

		var clip = sourceClip.clone();

		clip.name = name;

		var tracks = [];

		for ( var i = 0; i < clip.tracks.length; ++ i ) {

			var track = clip.tracks[ i ];
			var valueSize = track.getValueSize();

			var times = [];
			var values = [];

			for ( var j = 0; j < track.times.length; ++ j ) {

				var frame = track.times[ j ] * fps;

				if ( frame < startFrame || frame >= endFrame ) continue;

				times.push( track.times[ j ] );

				for ( var k = 0; k < valueSize; ++ k ) {

					values.push( track.values[ j * valueSize + k ] );

				}

			}

			if ( times.length === 0 ) continue;

			track.times = AnimationUtils.convertArray( times, track.times.constructor );
			track.values = AnimationUtils.convertArray( values, track.values.constructor );

			tracks.push( track );

		}

		clip.tracks = tracks;

		// find minimum .times value across all tracks in the trimmed clip

		var minStartTime = Infinity;

		for ( var i = 0; i < clip.tracks.length; ++ i ) {

			if ( minStartTime > clip.tracks[ i ].times[ 0 ] ) {

				minStartTime = clip.tracks[ i ].times[ 0 ];

			}

		}

		// shift all tracks such that clip begins at t=0

		for ( var i = 0; i < clip.tracks.length; ++ i ) {

			clip.tracks[ i ].shift( - 1 * minStartTime );

		}

		clip.resetDuration();

		return clip;

	},

	makeClipAdditive: function ( sourceClip, referenceFrame = 0, cloneOriginal = false, clonedName, fps = 30 ) {

		let clip = sourceClip;
		if ( cloneOriginal ) {

			clip = sourceClip.clone();
			clip.name = clonedName || clip.name;

		}
		const numTracks = clip.tracks.length;

		fps = fps || 30;
		const referenceTime = referenceFrame / fps;

		// Make each track's values relative to the values at the reference frame
		for ( let i = 0; i !== numTracks; ++ i ) {

			const track = clip.tracks[ i ];
			const trackType = track.ValueTypeName;

			// Skip this track if it's non-numeric
			if ( trackType === 'bool' || trackType === 'string' ) continue;

			const valueSize = track.getValueSize();
			const lastIndex = track.times.length - 1;
			const numTimes = track.times.length;
			let referenceValue;

			// Find the value to subtract out of the track
			if ( referenceTime <= track.times[ 0 ] ) {

				// Reference frame is earlier than the first keyframe, so just use the first keyframe
				referenceValue = AnimationUtils.arraySlice( track.values, 0, track.valueSize );

			} else if ( referenceTime >= track.times[ lastIndex ] ) {

				// Reference frame is after the last keyframe, so just use the last keyframe
				const startIndex = lastIndex * valueSize;
				referenceValue = AnimationUtils.arraySlice( track.values, startIndex );

			} else {

				// Interpolate to the reference value
				const interpolant = track.createInterpolant();
				interpolant.evaluate( referenceTime );
				referenceValue = interpolant.resultBuffer;

			}

			// Conjugate the quaternion
			if ( trackType === 'quaternion' ) {

				const referenceQuat = new Quaternion(
					referenceValue[ 0 ],
					referenceValue[ 1 ],
					referenceValue[ 2 ],
					referenceValue[ 3 ]
				).normalize().conjugate();
				referenceQuat.toArray( referenceValue );

			}

			// Subtract the reference value from all of the track values

			for ( let j = 0; j !== numTimes; ++ j ) {

				const valueStart = j * valueSize;

				if ( trackType === 'quaternion' ) {

					// Multiply the conjugate for quaternion track types
					Quaternion.multiplyQuaternionsFlat(
						track.values,
						valueStart,
						referenceValue,
						0,
						track.values,
						valueStart
					);

				} else {

					// Subtract each value for all other numeric track types
					for ( let k = 0; k !== valueSize; ++ k ) {

						track.values[ valueStart + k ] -= referenceValue[ k ];

					}

				}

			}

		}

		return clip;

	}

};

export { AnimationUtils };
