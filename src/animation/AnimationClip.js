/**
 *
 * Reusable set of Tracks that represent an animation.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.AnimationClip = function ( name, duration, tracks ) {

	this.name = name;
	this.tracks = tracks;
	this.duration = ( duration !== undefined ) ? duration : -1;

	// this means it should figure out its duration by scanning the tracks
	if( this.duration < 0 ) {
		for( var i = 0; i < this.tracks.length; i ++ ) {
			var track = this.tracks[i];
			this.duration = Math.max( track.times[ track.times.length - 1 ] );
		}
	}

	// maybe only do these on demand, as doing them here could potentially slow down loading
	// but leaving these here during development as this ensures a lot of testing of these functions
	this.trim();
	this.optimize();

};

THREE.AnimationClip.prototype = {

	constructor: THREE.AnimationClip,

	trim: function() {

		for( var i = 0; i < this.tracks.length; i ++ ) {

			this.tracks[ i ].trim( 0, this.duration );

		}

		return this;

	},

	optimize: function() {

		for( var i = 0; i < this.tracks.length; i ++ ) {

			this.tracks[ i ].optimize();

		}

		return this;

	}

};

// parse the standard JSON format for clips
THREE.AnimationClip.parse = function( json ) {

	var tracks = [],
		jsonTracks = json[ 'tracks' ],
		frameTime = 1.0 / ( json[ 'fps' ] || 1.0 );

	for( var i = 0, n = jsonTracks.length; i !== n; ++ i ) {

		tracks.push( THREE.KeyframeTrack.parse( jsonTracks[ i ] ).scale( frameTime ) );

	}

	return new THREE.AnimationClip( json[ 'name' ], json[ 'duration' ], tracks );

};


THREE.AnimationClip.toJSON = function( clip ) {

	var tracks = [],
		clipTracks = clip.tracks;

	var json = {

		'name': clip.name,
		'duration': clip.duration,
		'tracks': tracks

	};

	for ( var i = 0, n = clipTracks.length; i !== n; ++ i ) {

		tracks.push( THREE.KeyframeTrack.toJSON( clipTracks[ i ] ) );

	}

	return json;

}


THREE.AnimationClip.CreateFromMorphTargetSequence = function( name, morphTargetSequence, fps ) {

	var numMorphTargets = morphTargetSequence.length;
	var tracks = [];

	for( var i = 0; i < numMorphTargets; i ++ ) {

		var times = [];
		var values = [];

		times.push(
				( i + numMorphTargets - 1 ) % numMorphTargets,
				i,
				( i + 1 ) % numMorphTargets );

		values.push( 0, 1, 0 );

		var order = THREE.AnimationUtils.getKeyframeOrder( times );
		times = THREE.AnimationUtils.sortedArray( times, 1, order );
		values = THREE.AnimationUtils.sortedArray( values, 1, order );

		// if there is a key at the first frame, duplicate it as the last frame as well for perfect loop.
		if( times[ 0 ] === 0 ) {

			times.push( numMorphTargets );
			values.push( values[ 0 ] );

		}

		tracks.push( new THREE.NumberKeyframeTrack( '.morphTargetInfluences[' + morphTargetSequence[ i ].name + ']', times, values ).scale( 1.0 / fps ) );
	}

	return new THREE.AnimationClip( name, -1, tracks );

};

THREE.AnimationClip.findByName = function( clipArray, name ) {

	for( var i = 0; i < clipArray.length; i ++ ) {

		if( clipArray[ i ].name === name ) {

			return clipArray[ i ];

		}
	}

	return null;

};

THREE.AnimationClip.CreateClipsFromMorphTargetSequences = function( morphTargets, fps ) {

	var animationToMorphTargets = {};

	// tested with https://regex101.com/ on trick sequences such flamingo_flyA_003, flamingo_run1_003, crdeath0059
	var pattern = /^([\w-]*?)([\d]+)$/;

	// sort morph target names into animation groups based patterns like Walk_001, Walk_002, Run_001, Run_002
	for ( var i = 0, il = morphTargets.length; i < il; i ++ ) {

		var morphTarget = morphTargets[ i ];
		var parts = morphTarget.name.match( pattern );

		if ( parts && parts.length > 1 ) {

			var name = parts[ 1 ];

			var animationMorphTargets = animationToMorphTargets[ name ];
			if( ! animationMorphTargets ) {
				animationToMorphTargets[ name ] = animationMorphTargets = [];
			}

			animationMorphTargets.push( morphTarget );

		}

	}

	var clips = [];

	for( var name in animationToMorphTargets ) {

		clips.push( THREE.AnimationClip.CreateFromMorphTargetSequence( name, animationToMorphTargets[ name ], fps ) );
	}

	return clips;

};

// parse the animation.hierarchy format
THREE.AnimationClip.parseAnimation = function( animation, bones ) {

	if( ! animation ) {
		console.error( "  no animation in JSONLoader data" );
		return null;
	}

	var convertTrack = function( trackName, animationKeys, propertyName, trackType ) {

		// only return track if there are actually keys.
		if ( animationKeys.length === 0 ) return null;

		var times = [];
		var values = [];

		THREE.AnimationUtils.flattenJSON( animationKeys, times, values, propertyName );

		return new trackType( trackName, times, values );

	};

	var tracks = [];

	var clipName = animation.name || 'default';
	var duration = animation.length || -1; // automatic length determination in AnimationClip.
	var fps = animation.fps || 30;

	var hierarchyTracks = animation.hierarchy || [];

	for ( var h = 0; h < hierarchyTracks.length; h ++ ) {

		var animationKeys = hierarchyTracks[ h ].keys;

		// skip empty tracks
		if( ! animationKeys || animationKeys.length == 0 ) {
			continue;
		}

		// process morph targets in a way exactly compatible with AnimationHandler.init( animation )
		if( animationKeys[0].morphTargets ) {

			// figure out all morph targets used in this track
			var morphTargetNames = {};
			for( var k = 0; k < animationKeys.length; k ++ ) {

				if( animationKeys[k].morphTargets ) {
					for( var m = 0; m < animationKeys[k].morphTargets.length; m ++ ) {

						morphTargetNames[ animationKeys[k].morphTargets[m] ] = -1;
					}
				}

			}

			// create a track for each morph target with all zero morphTargetInfluences except for the keys in which the morphTarget is named.
			for( var morphTargetName in morphTargetNames ) {

				var times = [];
				var values = [];

				for( var m = 0; m < animationKeys[k].morphTargets.length; m ++ ) {

					var animationKey = animationKeys[k];

					times.push( animationKey.time );
					values.push( ( animationKey.morphTarget === morphTargetName ) ? 1 : 0 )

				}

				tracks.push( new THREE.NumberKeyframeTrack( '.morphTargetInfluence[' + morphTargetName + ']', keys ) );

			}

			duration = morphTargetNames.length * ( fps || 1.0 );

		} else {

			var boneName = '.bones[' + bones[ h ].name + ']';

			// track contains positions...
			var positionTrack = convertTrack( boneName + '.position', animationKeys, 'pos', THREE.VectorKeyframeTrack );
			if( positionTrack ) tracks.push( positionTrack );

			// track contains quaternions...
			var quaternionTrack = convertTrack( boneName + '.quaternion', animationKeys, 'rot', THREE.QuaternionKeyframeTrack );
			if( quaternionTrack ) tracks.push( quaternionTrack );

			// track contains quaternions...
			var scaleTrack = convertTrack( boneName + '.scale', animationKeys, 'scl', THREE.VectorKeyframeTrack );
			if( scaleTrack ) tracks.push( scaleTrack );

		}
	}

	if( tracks.length === 0 ) {

		return null;

	}

	var clip = new THREE.AnimationClip( clipName, duration, tracks );

	return clip;

};
