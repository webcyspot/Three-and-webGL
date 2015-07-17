/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Light = function ( color ) {

	THREE.Object3D.call( this );

	this.type = 'Light';

	this.color = new THREE.Color( color );

};

THREE.Light.prototype = Object.create( THREE.Object3D.prototype );
THREE.Light.prototype.constructor = THREE.Light;

THREE.Light.prototype.clone = function () {

	var light = new THREE.Light();
	return light._copyFrom( this );

};

THREE.Light.prototype._copyFrom = function ( source ) {

	THREE.Object3D.prototype._copyFrom.call( this, source );
	this.color.copy( source.color );

	return this;

};
