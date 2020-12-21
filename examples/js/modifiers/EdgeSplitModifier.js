THREE.EdgeSplitModifier = function () {

	var A = new THREE.Vector3();
	var B = new THREE.Vector3();
	var C = new THREE.Vector3();

	var positions, normals;
	var indexes;
	var pointToIndexMap, splitIndexes;


	function computeNormals() {

		normals = new Float32Array( indexes.length * 3 );

		for ( var i = 0; i < indexes.length; i += 3 ) {

			var index = indexes[ i ];

			A.set(
				positions[ 3 * index ],
				positions[ 3 * index + 1 ],
				positions[ 3 * index + 2 ] );

			index = indexes[ i + 1 ];
			B.set(
				positions[ 3 * index ],
				positions[ 3 * index + 1 ],
				positions[ 3 * index + 2 ] );

			index = indexes[ i + 2 ];
			C.set(
				positions[ 3 * index ],
				positions[ 3 * index + 1 ],
				positions[ 3 * index + 2 ] );

			C.sub( B );
			A.sub( B );

			var normal = C.cross( A ).normalize();

			for ( var j = 0; j < 3; j ++ ) {

				normals[ 3 * ( i + j ) ] = normal.x;
				normals[ 3 * ( i + j ) + 1 ] = normal.y;
				normals[ 3 * ( i + j ) + 2 ] = normal.z;

			}

		}

	}


	function mapPositionsToIndexes() {

		pointToIndexMap = Array( positions.length / 3 );

		for ( var i = 0; i < indexes.length; i ++ ) {

			var index = indexes[ i ];

			if ( pointToIndexMap[ index ] == null ) {

				pointToIndexMap[ index ] = [];

			}

			pointToIndexMap[ index ].push( i );

		}

	}


	function edgeSplitToGroups( indexes, cutOff, firstIndex ) {

		A.set( normals[ 3 * firstIndex ], normals[ 3 * firstIndex + 1 ], normals[ 3 * firstIndex + 2 ] ).normalize();

		var result = {
			splitGroup: [],
			currentGroup: [ firstIndex ]
		};

		for ( var j of indexes ) {

			if ( j !== firstIndex ) {

				B.set( normals[ 3 * j ], normals[ 3 * j + 1 ], normals[ 3 * j + 2 ] ).normalize();

				if ( B.dot( A ) < cutOff ) {

					result.splitGroup.push( j );

				} else {

					result.currentGroup.push( j );

				}

			}

		}

		return result;

	}


	function edgeSplit( indexes, cutOff, original = null ) {

		if ( indexes.length === 0 ) return;

		var groupResults = [];

		for ( var index of indexes ) {

			groupResults.push( edgeSplitToGroups( indexes, cutOff, index ) );

		}

		var result = groupResults[ 0 ];

		for ( var groupResult of groupResults ) {

			if ( groupResult.currentGroup.length > result.currentGroup.length ) {

				result = groupResult;

			}

		}


		if ( original != null ) {

			splitIndexes.push( {
				original: original,
				indexes: result.currentGroup
			} );

		}

		if ( result.splitGroup.length ) {

			edgeSplit( result.splitGroup, cutOff, original || result.currentGroup[ 0 ] );

		}

	}


	this.modify = function ( geometry, cutOffAngle ) {

		const wasNotBufferGeometry = geometry.isBufferGeometry === undefined;
		if ( ! geometry.isBufferGeometry ) {

			geometry = new THREE.BufferGeometry().fromGeometry( geometry );

		}


		let hadNormals = false;
		if ( geometry.attributes.normal ) {

			hadNormals = true;

			if ( wasNotBufferGeometry === false )
				geometry = geometry.clone();

			geometry.deleteAttribute( 'normal' );

		}


		if ( geometry.index == null ) {

			if ( THREE.BufferGeometryUtils === undefined ) {

			 	throw 'THREE.EdgeSplitModifier relies on THREE.BufferGeometryUtils';

			}

			geometry = THREE.BufferGeometryUtils.mergeVertices( geometry );

		}

		indexes = geometry.index.array;
		positions = geometry.getAttribute( 'position' ).array;

		computeNormals();
		mapPositionsToIndexes();

		splitIndexes = [];

		for ( var vertexIndexes of pointToIndexMap ) {

			edgeSplit( vertexIndexes, Math.cos( cutOffAngle ) - 0.001 );

		}

		const newAttributes = {};
		for ( const name of Object.keys( geometry.attributes ) ) {

			const oldAttribute = geometry.attributes[ name ];
			const newArray = new oldAttribute.array.constructor( ( indexes.length + splitIndexes.length ) * oldAttribute.itemSize );
			newArray.set( oldAttribute.array );
			newAttributes[ name ] = new THREE.BufferAttribute( newArray, oldAttribute.itemSize, oldAttribute.normalized );

		}

		var newIndexes = new Uint32Array( indexes.length );
		newIndexes.set( indexes );

		for ( var i = 0; i < splitIndexes.length; i ++ ) {

			var split = splitIndexes[ i ];
			var index = indexes[ split.original ];

			for ( const attribute of Object.values( newAttributes ) ) {

				for ( let j = 0; j < attribute.itemSize; j ++ ) {

					attribute.array[ ( indexes.length + i ) * attribute.itemSize + j ] =
						attribute.array[ index * attribute.itemSize + j ];

				}

			}

			for ( var j of split.indexes ) {

				newIndexes[ j ] = indexes.length + i;

			}

		}

		geometry = new THREE.BufferGeometry();
		geometry.setIndex( new THREE.BufferAttribute( newIndexes, 1 ) );

		for ( const name of Object.keys( newAttributes ) ) {

			geometry.setAttribute( name, newAttributes[ name ] );

		}

		if ( hadNormals ) {

			geometry.computeVertexNormals();

		}

		return geometry;

	};

};
