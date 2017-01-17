import { BufferGeometry } from '../core/BufferGeometry';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { Geometry } from '../core/Geometry';
import { _Math } from '../math/Math';

/**
 * @author WestLangley / http://github.com/WestLangley
 * @author Mugen87 / https://github.com/Mugen87
 */

function EdgesGeometry( geometry, thresholdAngle ) {

	BufferGeometry.call( this );

	this.type = 'EdgesGeometry';

	this.parameters = {
		thresholdAngle: thresholdAngle
	};

	thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;

	// buffer

	var vertices = [];

	// helper variables

	var thresholdDot = Math.cos( _Math.DEG2RAD * thresholdAngle );
	var edge = [ 0, 0 ], hash = {};
	var key, keys = [ 'a', 'b', 'c' ];

	// prepare source geometry

	var geometry2;

	if ( geometry.isBufferGeometry ) {

		geometry2 = new Geometry();
		geometry2.fromBufferGeometry( geometry );

	} else {

		geometry2 = geometry.clone();

	}

	geometry2.mergeVertices();
	geometry2.computeFaceNormals();

	var sourceVertices = geometry2.vertices;
	var faces = geometry2.faces;

	// now create a data structure (hash) where each entry represents an edge with its adjoining faces

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		var face = faces[ i ];

		for ( var j = 0; j < 3; j ++ ) {

			edge[ 0 ] = face[ keys[ j ] ];
			edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
			edge.sort( sortFunction );

			key = edge.toString();

			if ( hash[ key ] === undefined ) {

				hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };

			} else {

				hash[ key ].face2 = i;

			}

		}

	}

	// generate vertices

	for ( key in hash ) {

		var h = hash[ key ];

		// an edge is only rendered if the angle (in degrees) between the face normals of the adjoining faces exceeds this value. default = 1 degree.

		if ( h.face2 === undefined || faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {

			var vertex = sourceVertices[ h.vert1 ];
			vertices.push( vertex.x, vertex.y, vertex.z );

			vertex = sourceVertices[ h.vert2 ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

	}

	// build geometry

	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );

	// custom array sort function

	function sortFunction( a, b ) {

		return a - b;

	}

}

EdgesGeometry.prototype = Object.create( BufferGeometry.prototype );
EdgesGeometry.prototype.constructor = EdgesGeometry;


export { EdgesGeometry };
