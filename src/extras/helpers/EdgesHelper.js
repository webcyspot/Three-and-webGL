/**
 * @author WestLangley / http://github.com/WestLangley
 * @param object THREE.Mesh whose geometry will be used
 * @param hex line color
 * @param thresholdAngle the minimim angle (in degrees),
 * between the face normals of adjacent faces,
 * that is required to render an edge. A value of 10 means
 * an edge is only rendered if the angle is at least 10 degrees.
 */

THREE.EdgesHelper = function ( object, hex, thresholdAngle ) {

	var color = ( hex !== undefined ) ? hex : 0xffffff;

	THREE.Line.call( this, new THREE.EdgesGeometry( object.geometry, thresholdAngle ), new THREE.LineBasicMaterial( { color: color } ), THREE.LinePieces );

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

};

THREE.EdgesHelper.prototype = Object.create( THREE.Line.prototype );
THREE.EdgesHelper.prototype.constructor = THREE.EdgesHelper;
