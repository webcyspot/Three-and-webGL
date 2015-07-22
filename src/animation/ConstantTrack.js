/**
 *
 * A Track that returns a constant value.
 * 
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.ConstantTrack = function ( name, value ) {

	this.value = value || null;

	THREE.Track.call( this, name );

};

THREE.ConstantTrack.prototype = {

	constructor: THREE.ConstantTrack,

	getAt: function( time ) {

		return this.value;

	}

};