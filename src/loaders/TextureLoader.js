/**
 * @author mrdoob / http://mrdoob.com/
 */

import { RGBAFormat, RGBFormat } from '../constants.js';
import { ImageLoader } from './ImageLoader.js';
import { Texture } from '../textures/Texture.js';
import { Loader } from './Loader.js';

function TextureLoader( manager, imageLoader ) {

	Loader.call( this, manager );

	this.imageLoader = null;

}

TextureLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	constructor: TextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		const texture = new Texture();

		if ( !this.imageLoader ) {

			this.imageLoader = new ImageLoader( this.manager );

		}

		const loader = this.imageLoader;
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		loader.load( url, function ( image ) {

			texture.image = image;

			// JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
			const isJPEG = url.search( /\.jpe?g($|\?)/i ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;

			texture.format = isJPEG ? RGBFormat : RGBAFormat;
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;

	},

	setImageLoader: function ( imageLoader ) {

		this.imageLoader = imageLoader;
		return this;

	}

} );


export { TextureLoader };
