/**
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

import { Geometry } from '../core/Geometry';

function TorusGeometry( radius, tube, radialSegments, tubularSegments, arc ) {

	Geometry.call( this );

	this.type = 'TorusGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	this.fromBufferGeometry( new TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) );

}

TorusGeometry.prototype = Object.create( Geometry.prototype );
TorusGeometry.prototype.constructor = TorusGeometry;

/**
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Float32BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Vector3 } from '../math/Vector3';

function TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc ) {

	BufferGeometry.call( this );

	this.type = 'TorusBufferGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	radius = radius || 100;
	tube = tube || 40;
	radialSegments = Math.floor( radialSegments ) || 8;
	tubularSegments = Math.floor( tubularSegments ) || 6;
	arc = arc || Math.PI * 2;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var center = new Vector3();
	var vertex = new Vector3();
	var normal = new Vector3();

	var j, i;

	// generate vertices, normals and uvs

	for ( j = 0; j <= radialSegments; j ++ ) {

		for ( i = 0; i <= tubularSegments; i ++ ) {

			var u = i / tubularSegments * arc;
			var v = j / radialSegments * Math.PI * 2;

			// vertex

			vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
			vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
			vertex.z = tube * Math.sin( v );

			vertices.push( vertex.x, vertex.y, vertex.z );

			// normal

			center.x = radius * Math.cos( u );
			center.y = radius * Math.sin( u );
			normal.subVectors( vertex, center ).normalize();

			normals.push( normal.x, normal.y, normal.z );

			// uv

			uvs.push( i / tubularSegments );
			uvs.push( j / radialSegments );

		}

	}

	// generate indices

	for ( j = 1; j <= radialSegments; j ++ ) {

		for ( i = 1; i <= tubularSegments; i ++ ) {

			// indices

			var a = ( tubularSegments + 1 ) * j + i - 1;
			var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
			var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
			var d = ( tubularSegments + 1 ) * j + i;

			// faces

			indices.push( a, b, d );
			indices.push( b, c, d );

		}

	}

	// build geometry

	this.setIndex( new ( vertices.length > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute )( indices, 1 ) );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

}

TorusBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
TorusBufferGeometry.prototype.constructor = TorusBufferGeometry;

export { TorusGeometry, TorusBufferGeometry };
