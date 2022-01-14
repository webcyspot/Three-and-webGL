( function () {

	class LDrawUtils {

		static mergeObject( object ) {

			// Merges geometries in object by materials and returns new object. Use on not indexed geometries.
			// The object buffers reference the old object ones.
			// Special treatment is done to the conditional lines generated by LDrawLoader.
			function extractGroup( geometry, group, elementSize, isConditionalLine ) {

				// Extracts a group from a geometry as a new geometry (with attribute buffers referencing original buffers)
				const newGeometry = new THREE.BufferGeometry();
				const originalPositions = geometry.getAttribute( 'position' ).array;
				const originalNormals = elementSize === 3 ? geometry.getAttribute( 'normal' ).array : null;
				const numVertsGroup = Math.min( group.count, Math.floor( originalPositions.length / 3 ) - group.start );
				const vertStart = group.start * 3;
				const vertEnd = ( group.start + numVertsGroup ) * 3;
				const positions = originalPositions.subarray( vertStart, vertEnd );
				const normals = originalNormals !== null ? originalNormals.subarray( vertStart, vertEnd ) : null;
				newGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
				if ( normals !== null ) newGeometry.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

				if ( isConditionalLine ) {

					const controlArray0 = geometry.getAttribute( 'control0' ).array.subarray( vertStart, vertEnd );
					const controlArray1 = geometry.getAttribute( 'control1' ).array.subarray( vertStart, vertEnd );
					const directionArray = geometry.getAttribute( 'direction' ).array.subarray( vertStart, vertEnd );
					newGeometry.setAttribute( 'control0', new THREE.BufferAttribute( controlArray0, 3, false ) );
					newGeometry.setAttribute( 'control1', new THREE.BufferAttribute( controlArray1, 3, false ) );
					newGeometry.setAttribute( 'direction', new THREE.BufferAttribute( directionArray, 3, false ) );

				}

				return newGeometry;

			}

			function addGeometry( mat, geometry, geometries ) {

				const geoms = geometries[ mat.uuid ];

				if ( ! geoms ) {

					geometries[ mat.uuid ] = {
						mat: mat,
						arr: [ geometry ]
					};

				} else geoms.arr.push( geometry );

			}

			function permuteAttribute( attribute, elemSize ) {

				// Permutes first two vertices of each attribute element
				if ( ! attribute ) return;
				const verts = attribute.array;
				const numVerts = Math.floor( verts.length / 3 );
				let offset = 0;

				for ( let i = 0; i < numVerts; i ++ ) {

					const x = verts[ offset ];
					const y = verts[ offset + 1 ];
					const z = verts[ offset + 2 ];
					verts[ offset ] = verts[ offset + 3 ];
					verts[ offset + 1 ] = verts[ offset + 4 ];
					verts[ offset + 2 ] = verts[ offset + 5 ];
					verts[ offset + 3 ] = x;
					verts[ offset + 4 ] = y;
					verts[ offset + 5 ] = z;
					offset += elemSize * 3;

				}

			} // Traverse the object hierarchy collecting geometries and transforming them to world space


			const meshGeometries = {};
			const linesGeometries = {};
			const condLinesGeometries = {};
			object.updateMatrixWorld( true );
			const normalMatrix = new THREE.Matrix3();
			object.traverse( c => {

				if ( c.isMesh | c.isLineSegments ) {

					const elemSize = c.isMesh ? 3 : 2;
					const matrixIsInverted = c.matrixWorld.determinant() < 0;

					if ( matrixIsInverted ) {

						permuteAttribute( c.geometry.attributes.position, elemSize );
						permuteAttribute( c.geometry.attributes.normal, elemSize );

					}

					c.geometry.applyMatrix4( c.matrixWorld );

					if ( c.isConditionalLine ) {

						c.geometry.attributes.control0.applyMatrix4( c.matrixWorld );
						c.geometry.attributes.control1.applyMatrix4( c.matrixWorld );
						normalMatrix.getNormalMatrix( c.matrixWorld );
						c.geometry.attributes.direction.applyNormalMatrix( normalMatrix );

					}

					const geometries = c.isMesh ? meshGeometries : c.isConditionalLine ? condLinesGeometries : linesGeometries;

					if ( Array.isArray( c.material ) ) {

						for ( const groupIndex in c.geometry.groups ) {

							const group = c.geometry.groups[ groupIndex ];
							const mat = c.material[ group.materialIndex ];
							const newGeometry = extractGroup( c.geometry, group, elemSize, c.isConditionalLine );
							addGeometry( mat, newGeometry, geometries );

						}

					} else addGeometry( c.material, c.geometry, geometries );

				}

			} ); // Create object with merged geometries

			const mergedObject = new THREE.Group();
			const meshMaterialsIds = Object.keys( meshGeometries );

			for ( const i in meshMaterialsIds ) {

				const meshGeometry = meshGeometries[ meshMaterialsIds[ i ] ];
				const mergedGeometry = THREE.mergeBufferGeometries( meshGeometry.arr );
				mergedObject.add( new THREE.Mesh( mergedGeometry, meshGeometry.mat ) );

			}

			const linesMaterialsIds = Object.keys( linesGeometries );

			for ( const i in linesMaterialsIds ) {

				const lineGeometry = linesGeometries[ linesMaterialsIds[ i ] ];
				const mergedGeometry = THREE.mergeBufferGeometries( lineGeometry.arr );
				mergedObject.add( new THREE.LineSegments( mergedGeometry, lineGeometry.mat ) );

			}

			const condLinesMaterialsIds = Object.keys( condLinesGeometries );

			for ( const i in condLinesMaterialsIds ) {

				const condLineGeometry = condLinesGeometries[ condLinesMaterialsIds[ i ] ];
				const mergedGeometry = THREE.mergeBufferGeometries( condLineGeometry.arr );
				const condLines = new THREE.LineSegments( mergedGeometry, condLineGeometry.mat );
				condLines.isConditionalLine = true;
				mergedObject.add( condLines );

			}

			mergedObject.userData.constructionStep = 0;
			mergedObject.userData.numConstructionSteps = 1;
			return mergedObject;

		}

	}

	THREE.LDrawUtils = {};
	THREE.LDrawUtils.LDrawUtils = LDrawUtils;

} )();
