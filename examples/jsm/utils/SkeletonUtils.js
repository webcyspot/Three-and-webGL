import {
	AnimationClip,
	AnimationMixer,
	Euler,
	Matrix4,
	Quaternion,
	QuaternionKeyframeTrack,
	SkeletonHelper,
	Vector2,
	Vector3,
	VectorKeyframeTrack
} from 'three';


function retarget( target, source, options = {} ) {

	const pos = new Vector3(),
		quat = new Quaternion(),
		scale = new Vector3(),
		bindBoneMatrix = new Matrix4(),
		relativeMatrix = new Matrix4(),
		globalMatrix = new Matrix4();

	options.preserveMatrix = options.preserveMatrix !== undefined ? options.preserveMatrix : true;
	options.preservePosition = options.preservePosition !== undefined ? options.preservePosition : true;
	options.preserveHipPosition = options.preserveHipPosition !== undefined ? options.preserveHipPosition : false;
	options.useTargetMatrix = options.useTargetMatrix !== undefined ? options.useTargetMatrix : false;
	options.hip = options.hip !== undefined ? options.hip : 'hip';
	options.names = options.names || {};

	const sourceBones = source.isObject3D ? source.skeleton.bones : getBones( source ),
		bones = target.isObject3D ? target.skeleton.bones : getBones( target );

	let bindBones,
		bone, name, boneTo,
		bonesPosition;

	// reset bones

	if ( target.isObject3D ) {

		target.skeleton.pose();

	} else {

		options.useTargetMatrix = true;
		options.preserveMatrix = false;

	}

	if ( options.preservePosition ) {

		bonesPosition = [];

		for ( let i = 0; i < bones.length; i ++ ) {

			bonesPosition.push( bones[ i ].position.clone() );

		}

	}

	if ( options.preserveMatrix ) {

		// reset matrix

		target.updateMatrixWorld();

		target.matrixWorld.identity();

		// reset children matrix

		for ( let i = 0; i < target.children.length; ++ i ) {

			target.children[ i ].updateMatrixWorld( true );

		}

	}

	if ( options.offsets ) {

		bindBones = [];

		for ( let i = 0; i < bones.length; ++ i ) {

			bone = bones[ i ];
			name = options.names[ bone.name ] || bone.name;

			if ( options.offsets[ name ] ) {

				bone.matrix.multiply( options.offsets[ name ] );

				bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

				bone.updateMatrixWorld();

			}

			bindBones.push( bone.matrixWorld.clone() );

		}

	}

	for ( let i = 0; i < bones.length; ++ i ) {

		bone = bones[ i ];
		name = options.names[ bone.name ] || bone.name;

		boneTo = getBoneByName( name, sourceBones );

		globalMatrix.copy( bone.matrixWorld );

		if ( boneTo ) {

			boneTo.updateMatrixWorld();

			if ( options.useTargetMatrix ) {

				relativeMatrix.copy( boneTo.matrixWorld );

			} else {

				relativeMatrix.copy( target.matrixWorld ).invert();
				relativeMatrix.multiply( boneTo.matrixWorld );

			}

			// ignore scale to extract rotation

			scale.setFromMatrixScale( relativeMatrix );
			relativeMatrix.scale( scale.set( 1 / scale.x, 1 / scale.y, 1 / scale.z ) );

			// apply to global matrix

			globalMatrix.makeRotationFromQuaternion( quat.setFromRotationMatrix( relativeMatrix ) );

			if ( target.isObject3D ) {

				const boneIndex = bones.indexOf( bone ),
					wBindMatrix = bindBones ? bindBones[ boneIndex ] : bindBoneMatrix.copy( target.skeleton.boneInverses[ boneIndex ] ).invert();

				globalMatrix.multiply( wBindMatrix );

			}

			globalMatrix.copyPosition( relativeMatrix );

		}

		if ( bone.parent && bone.parent.isBone ) {

			bone.matrix.copy( bone.parent.matrixWorld ).invert();
			bone.matrix.multiply( globalMatrix );

		} else {

			bone.matrix.copy( globalMatrix );

		}

		if ( options.preserveHipPosition && name === options.hip ) {

			bone.matrix.setPosition( pos.set( 0, bone.position.y, 0 ) );

		}

		bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

		bone.updateMatrixWorld();

	}

	if ( options.preservePosition ) {

		for ( let i = 0; i < bones.length; ++ i ) {

			bone = bones[ i ];
			name = options.names[ bone.name ] || bone.name;

			if ( name !== options.hip ) {

				bone.position.copy( bonesPosition[ i ] );

			}

		}

	}

	if ( options.preserveMatrix ) {

		// restore matrix

		target.updateMatrixWorld( true );

	}

}

function retargetClip( target, source, clip, options = {} ) {

	options.useFirstFramePosition = options.useFirstFramePosition !== undefined ? options.useFirstFramePosition : false;
	options.fps = options.fps !== undefined ? options.fps : 30;
	options.names = options.names || [];

	if ( ! source.isObject3D ) {

		source = getHelperFromSkeleton( source );

	}

	const numFrames = Math.round( clip.duration * ( options.fps / 1000 ) * 1000 ),
		delta = 1 / options.fps,
		convertedTracks = [],
		mixer = new AnimationMixer( source ),
		bones = getBones( target.skeleton ),
		boneDatas = [];
	let positionOffset,
		bone, boneTo, boneData,
		name;

	mixer.clipAction( clip ).play();
	mixer.update( 0 );

	source.updateMatrixWorld();

	for ( let i = 0; i < numFrames; ++ i ) {

		const time = i * delta;

		retarget( target, source, options );

		for ( let j = 0; j < bones.length; ++ j ) {

			name = options.names[ bones[ j ].name ] || bones[ j ].name;

			boneTo = getBoneByName( name, source.skeleton );

			if ( boneTo ) {

				bone = bones[ j ];
				boneData = boneDatas[ j ] = boneDatas[ j ] || { bone: bone };

				if ( options.hip === name ) {

					if ( ! boneData.pos ) {

						boneData.pos = {
							times: new Float32Array( numFrames ),
							values: new Float32Array( numFrames * 3 )
						};

					}

					if ( options.useFirstFramePosition ) {

						if ( i === 0 ) {

							positionOffset = bone.position.clone();

						}

						bone.position.sub( positionOffset );

					}

					boneData.pos.times[ i ] = time;

					bone.position.toArray( boneData.pos.values, i * 3 );

				}

				if ( ! boneData.quat ) {

					boneData.quat = {
						times: new Float32Array( numFrames ),
						values: new Float32Array( numFrames * 4 )
					};

				}

				boneData.quat.times[ i ] = time;

				bone.quaternion.toArray( boneData.quat.values, i * 4 );

			}

		}

		mixer.update( delta );

		source.updateMatrixWorld();

	}

	for ( let i = 0; i < boneDatas.length; ++ i ) {

		boneData = boneDatas[ i ];

		if ( boneData ) {

			if ( boneData.pos ) {

				convertedTracks.push( new VectorKeyframeTrack(
					'.bones[' + boneData.bone.name + '].position',
					boneData.pos.times,
					boneData.pos.values
				) );

			}

			convertedTracks.push( new QuaternionKeyframeTrack(
				'.bones[' + boneData.bone.name + '].quaternion',
				boneData.quat.times,
				boneData.quat.values
			) );

		}

	}

	mixer.uncacheAction( clip );

	return new AnimationClip( clip.name, - 1, convertedTracks );

}

function getHelperFromSkeleton( skeleton ) {

	const source = new SkeletonHelper( skeleton.bones[ 0 ] );
	source.skeleton = skeleton;

	return source;

}

function getSkeletonOffsets( target, source, options = {} ) {

	const targetParentPos = new Vector3(),
		targetPos = new Vector3(),
		sourceParentPos = new Vector3(),
		sourcePos = new Vector3(),
		targetDir = new Vector2(),
		sourceDir = new Vector2();

	options.hip = options.hip !== undefined ? options.hip : 'hip';
	options.names = options.names || {};

	if ( ! source.isObject3D ) {

		source = getHelperFromSkeleton( source );

	}

	const nameKeys = Object.keys( options.names ),
		nameValues = Object.values( options.names ),
		sourceBones = source.isObject3D ? source.skeleton.bones : getBones( source ),
		bones = target.isObject3D ? target.skeleton.bones : getBones( target ),
		offsets = [];

	let bone, boneTo,
		name, i;

	target.skeleton.pose();

	for ( i = 0; i < bones.length; ++ i ) {

		bone = bones[ i ];
		name = options.names[ bone.name ] || bone.name;

		boneTo = getBoneByName( name, sourceBones );

		if ( boneTo && name !== options.hip ) {

			const boneParent = getNearestBone( bone.parent, nameKeys ),
				boneToParent = getNearestBone( boneTo.parent, nameValues );

			boneParent.updateMatrixWorld();
			boneToParent.updateMatrixWorld();

			targetParentPos.setFromMatrixPosition( boneParent.matrixWorld );
			targetPos.setFromMatrixPosition( bone.matrixWorld );

			sourceParentPos.setFromMatrixPosition( boneToParent.matrixWorld );
			sourcePos.setFromMatrixPosition( boneTo.matrixWorld );

			targetDir.subVectors(
				new Vector2( targetPos.x, targetPos.y ),
				new Vector2( targetParentPos.x, targetParentPos.y )
			).normalize();

			sourceDir.subVectors(
				new Vector2( sourcePos.x, sourcePos.y ),
				new Vector2( sourceParentPos.x, sourceParentPos.y )
			).normalize();

			const laterialAngle = targetDir.angle() - sourceDir.angle();

			const offset = new Matrix4().makeRotationFromEuler(
				new Euler(
					0,
					0,
					laterialAngle
				)
			);

			bone.matrix.multiply( offset );

			bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

			bone.updateMatrixWorld();

			offsets[ name ] = offset;

		}

	}

	return offsets;

}

function renameBones( skeleton, names ) {

	const bones = getBones( skeleton );

	for ( let i = 0; i < bones.length; ++ i ) {

		const bone = bones[ i ];

		if ( names[ bone.name ] ) {

			bone.name = names[ bone.name ];

		}

	}

	return this;

}

function getBones( skeleton ) {

	return Array.isArray( skeleton ) ? skeleton : skeleton.bones;

}

function getBoneByName( name, skeleton ) {

	for ( let i = 0, bones = getBones( skeleton ); i < bones.length; i ++ ) {

		if ( name === bones[ i ].name )

			return bones[ i ];

	}

}

function getNearestBone( bone, names ) {

	while ( bone.isBone ) {

		if ( names.indexOf( bone.name ) !== - 1 ) {

			return bone;

		}

		bone = bone.parent;

	}

}

function findBoneTrackData( name, tracks ) {

	const regexp = /\[(.*)\]\.(.*)/,
		result = { name: name };

	for ( let i = 0; i < tracks.length; ++ i ) {

		// 1 is track name
		// 2 is track type
		const trackData = regexp.exec( tracks[ i ].name );

		if ( trackData && name === trackData[ 1 ] ) {

			result[ trackData[ 2 ] ] = i;

		}

	}

	return result;

}

function getEqualsBonesNames( skeleton, targetSkeleton ) {

	const sourceBones = getBones( skeleton ),
		targetBones = getBones( targetSkeleton ),
		bones = [];

	search : for ( let i = 0; i < sourceBones.length; i ++ ) {

		const boneName = sourceBones[ i ].name;

		for ( let j = 0; j < targetBones.length; j ++ ) {

			if ( boneName === targetBones[ j ].name ) {

				bones.push( boneName );

				continue search;

			}

		}

	}

	return bones;

}

function clone( source ) {

	const sourceLookup = new Map();
	const cloneLookup = new Map();

	const clone = source.clone();

	parallelTraverse( source, clone, function ( sourceNode, clonedNode ) {

		sourceLookup.set( clonedNode, sourceNode );
		cloneLookup.set( sourceNode, clonedNode );

	} );

	clone.traverse( function ( node ) {

		if ( ! node.isSkinnedMesh ) return;

		const clonedMesh = node;
		const sourceMesh = sourceLookup.get( node );
		const sourceBones = sourceMesh.skeleton.bones;

		clonedMesh.skeleton = sourceMesh.skeleton.clone();
		clonedMesh.bindMatrix.copy( sourceMesh.bindMatrix );

		clonedMesh.skeleton.bones = sourceBones.map( function ( bone ) {

			return cloneLookup.get( bone );

		} );

		clonedMesh.bind( clonedMesh.skeleton, clonedMesh.bindMatrix );

	} );

	return clone;

}




function parallelTraverse( a, b, callback ) {

	callback( a, b );

	for ( let i = 0; i < a.children.length; i ++ ) {

		parallelTraverse( a.children[ i ], b.children[ i ], callback );

	}

}

export {
	retarget,
	retargetClip,
	getHelperFromSkeleton,
	getSkeletonOffsets,
	renameBones,
	getBones,
	getBoneByName,
	getNearestBone,
	findBoneTrackData,
	getEqualsBonesNames,
	clone,
};
