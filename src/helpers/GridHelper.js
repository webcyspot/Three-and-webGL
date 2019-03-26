/**
 * @author mrdoob / http://mrdoob.com/
 */

import { LineSegments } from '../objects/LineSegments.js';
import { VertexColors } from '../constants.js';
import { LineBasicMaterial } from '../materials/LineBasicMaterial.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Color } from '../math/Color.js';

function GridHelper( size, divisions, color1, color2 ) {

	this.parameters = {
		size: size,
		divisions: divisions,
		color1: color1,
		color2: color2
	};

	size = size || 10;
	divisions = divisions || 10;
	color1 = new Color( color1 !== undefined ? color1 : 0x444444 );
	color2 = new Color( color2 !== undefined ? color2 : 0x888888 );

	var center = divisions / 2;
	var step = size / divisions;
	var halfSize = size / 2;

	var vertices = [], colors = [];

	for ( var i = 0, j = 0, k = - halfSize; i <= divisions; i ++, k += step ) {

		vertices.push( - halfSize, 0, k, halfSize, 0, k );
		vertices.push( k, 0, - halfSize, k, 0, halfSize );

		var color = i === center ? color1 : color2;

		color.toArray( colors, j ); j += 3;
		color.toArray( colors, j ); j += 3;
		color.toArray( colors, j ); j += 3;
		color.toArray( colors, j ); j += 3;

	}

	var geometry = new BufferGeometry();
	geometry.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

	var material = new LineBasicMaterial( { vertexColors: VertexColors } );

	LineSegments.call( this, geometry, material );

}

GridHelper.prototype = Object.assign( Object.create( LineSegments.prototype ), {

	constructor: GridHelper,

	copy( source ) {

		LineSegments.prototype.copy.call( this, source );

		Object.assign( this.parameters, source.parameters );

		return this;

	},

	clone() {

		var parameters = this.parameters;

		return new this.constructor( parameters.size, parameters.divisions, parameters.color1, parameters.color2 );

	}

} );

export { GridHelper };
