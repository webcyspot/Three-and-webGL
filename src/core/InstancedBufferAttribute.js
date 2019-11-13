import { BufferAttribute } from './BufferAttribute.js';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

function InstancedBufferAttribute( array, itemSize, normalized, meshPerAttribute ) {

	if ( typeof ( normalized ) === 'number' ) {

		meshPerAttribute = normalized;

		normalized = false;

		console.error( 'THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.' );

	}

	BufferAttribute.call( this, array, itemSize, normalized );

	this._meshPerAttribute = meshPerAttribute || 1;

	this.versionVAO = 0;

}

InstancedBufferAttribute.prototype = Object.assign( Object.create( BufferAttribute.prototype ), {

	constructor: InstancedBufferAttribute,

	isInstancedBufferAttribute: true,

	copy: function ( source ) {

		BufferAttribute.prototype.copy.call( this, source );

		this.meshPerAttribute = source.meshPerAttribute;

		return this;

	},

	toJSON: function ()	{

		var data = BufferAttribute.prototype.toJSON.call( this );

		data.meshPerAttribute = this.meshPerAttribute;

		data.isInstancedBufferAttribute = true;

		return data;

	}

} );

Object.defineProperties( InstancedBufferAttribute.prototype, {

	meshPerAttribute: {

		get: function () {

			return this._meshPerAttribute;

		},

		set: function ( value ) {

			this._meshPerAttribute = value;
			this.versionVAO ++;

		}

	}

} );

export { InstancedBufferAttribute };
