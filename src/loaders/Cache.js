/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Cache = {

	files: {},

	add: function ( key, file ) {

		// THREE.log( 'THREE.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	},

	get: function ( key ) {

		// THREE.log( 'THREE.Cache', 'Checking key:', key );

		return this.files[ key ];

	},

	remove: function ( key ) {

		delete this.files[ key ];

	},

	clear: function () {

		this.files = {}

	}

};
