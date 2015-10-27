/**
 * @author mrdoob / http://mrdoob.com/
 */

Object.defineProperties( THREE.Box2.prototype, {
	isIntersectionBox: {
		value: function ( box ) {
			console.warn( 'THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox().' );
			return this.intersectsBox( box );
		}
	}
} );

Object.defineProperties( THREE.Box3.prototype, {
	isIntersectionBox: {
		value: function ( box ) {
			console.warn( 'THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox().' );
			return this.intersectsBox( box );
		}
	},
	isIntersectionSphere: {
		value: function ( sphere ) {
			console.warn( 'THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere().' );
			return this.intersectsSphere( sphere );
		}
	}
} );

//

Object.defineProperties( THREE.Matrix3.prototype, {
	multiplyVector3: {
		value: function ( vector ) {
			console.warn( 'THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
			return vector.applyMatrix3( this );
		}
	},
	multiplyVector3Array: {
		value: function ( a ) {
			console.warn( 'THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
			return this.applyToVector3Array( a );
		}
	}
} );

Object.defineProperties( THREE.Matrix4.prototype, {
	extractPosition: {
		value: function ( m ) {
			console.warn( 'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
			return this.copyPosition( m );
		}
	},
	setRotationFromQuaternion: {
		value: function ( q ) {
			console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );
			return this.makeRotationFromQuaternion( q );
		}
	},
	multiplyVector3: {
		value: function ( vector ) {
			console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
			return vector.applyProjection( this );
		}
	},
	multiplyVector4: {
		value: function ( vector ) {
			console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
			return vector.applyMatrix4( this );
		}
	},
	multiplyVector3Array: {
		value: function ( a ) {
			console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
			return this.applyToVector3Array( a );
		}
	},
	rotateAxis: {
		value: function ( v ) {
			console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );
			v.transformDirection( this );
		}
	},
	crossVector: {
		value: function ( vector ) {
			console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
			return vector.applyMatrix4( this );
		}
	},
	translate: {
		value: function ( v ) {
			console.error( 'THREE.Matrix4: .translate() has been removed.' );
		}
	},
	rotateX: {
		value: function ( angle ) {
			console.error( 'THREE.Matrix4: .rotateX() has been removed.' );
		}
	},
	rotateY: {
		value: function ( angle ) {
			console.error( 'THREE.Matrix4: .rotateY() has been removed.' );
		}
	},
	rotateZ: {
		value: function ( angle ) {
			console.error( 'THREE.Matrix4: .rotateZ() has been removed.' );
		}
	},
	rotateByAxis: {
		value: function ( axis, angle ) {
			console.error( 'THREE.Matrix4: .rotateByAxis() has been removed.' );
		}
	}	
} );

//

Object.defineProperties( THREE.Vector3.prototype, {
	setEulerFromRotationMatrix: {
		value: function () {
			console.error( 'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );
		}
	},
	setEulerFromQuaternion: {
		value: function () {
			console.error( 'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );
		}
	},
	getPositionFromMatrix: {
		value: function ( m ) {
			console.warn( 'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );
			return this.setFromMatrixPosition( m );
		}
	},
	getScaleFromMatrix: {
		value: function ( m ) {
			console.warn( 'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );
			return this.setFromMatrixScale( m );
		}
	},
	getColumnFromMatrix: {
		value: function ( index, matrix ) {
			console.warn( 'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );
			return this.setFromMatrixColumn( index, matrix );
		}
	}
} );

//

Object.defineProperties( THREE.Light.prototype, {
	onlyShadow: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .onlyShadow has been removed.' );
		}
	},
	shadowCameraFov: {
		set: function ( value ) {
			this.shadow.camera.fov = value;
		}
	},
	shadowCameraLeft: {
		set: function ( value ) {
			this.shadow.camera.left = value;
		}
	},
	shadowCameraRight: {
		set: function ( value ) {
			this.shadow.camera.right = value;
		}
	},
	shadowCameraTop: {
		set: function ( value ) {
			this.shadow.camera.top = value;
		}
	},
	shadowCameraBottom: {
		set: function ( value ) {
			this.shadow.camera.bottom = value;
		}
	},
	shadowCameraNear: {
		set: function ( value ) {
			this.shadow.camera.near = value;
		}
	},
	shadowCameraFar: {
		set: function ( value ) {
			this.shadow.camera.far = value;
		}
	},
	shadowCameraVisible: {
		set: function ( value ) {
			console.warn( 'THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow ) instead.' );
		}
	},
	shadowBias: {
		set: function ( value ) {
			this.shadow.bias = value;
		}
	},
	shadowDarkness: {
		set: function ( value ) {
			this.shadow.darkness = value;
		}
	},
	shadowMapWidth: {
		set: function ( value ) {
			this.shadow.mapSize.width = value;
		}
	},
	shadowMapHeight: {
		set: function ( value ) {
			this.shadow.mapSize.height = value;
		}
	}
} );

//

Object.defineProperties( THREE.ShaderMaterial.prototype, {
	derivatives: {
		set: function ( value ) {
			console.warn( 'THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives.' );
			this.extensions.derivatives = value;
		}
	}
} );

//

Object.defineProperties( THREE.WebGLRenderer.prototype, {
	supportsFloatTextures: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( \'OES_texture_float\' ).' );
			return this.extensions.get( 'OES_texture_float' );
		}
	},
	supportsHalfFloatTextures: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( \'OES_texture_half_float\' ).' );
			return this.extensions.get( 'OES_texture_half_float' );
		}
	},
	supportsStandardDerivatives: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( \'OES_standard_derivatives\' ).' );
			return this.extensions.get( 'OES_standard_derivatives' );
		}
	},
	supportsCompressedTextureS3TC: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( \'WEBGL_compressed_texture_s3tc\' ).' );
			return this.extensions.get( 'WEBGL_compressed_texture_s3tc' );
		}
	},
	supportsCompressedTexturePVRTC: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( \'WEBGL_compressed_texture_pvrtc\' ).' );
			return this.extensions.get( 'WEBGL_compressed_texture_pvrtc' );
		}
	},
	supportsBlendMinMax: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( \'EXT_blend_minmax\' ).' );
			return this.extensions.get( 'EXT_blend_minmax' );
		}
	},
	supportsVertexTextures: {
		value: function () {
			return this.capabilities.vertexTextures;
		}
	},
	supportsInstancedArrays: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( \'ANGLE_instanced_arrays\' ).' );
			return this.extensions.get( 'ANGLE_instanced_arrays' );
		}
	},
	initMaterial: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .initMaterial() has been removed.' );
		}
	},
	addPrePlugin: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .addPrePlugin() has been removed.' );
		}
	},
	addPostPlugin: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .addPostPlugin() has been removed.' );
		}
	},
	updateShadowMap: {
		value: function () {
			console.warn( 'THREE.WebGLRenderer: .updateShadowMap() has been removed.' );
		}
	},
	shadowMapEnabled: {
		get: function () {
			return this.shadowMap.enabled;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled.' );
			this.shadowMap.enabled = value;
		}
	},
	shadowMapType: {
		get: function () {
			return this.shadowMap.type;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type.' );
			this.shadowMap.type = value;
		}
	},
	shadowMapCullFace: {
		get: function () {
			return this.shadowMap.cullFace;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapCullFace is now .shadowMap.cullFace.' );
			this.shadowMap.cullFace = value;
		}
	},
	shadowMapDebug: {
		get: function () {
			return this.shadowMap.debug;
		},
		set: function ( value ) {
			console.warn( 'THREE.WebGLRenderer: .shadowMapDebug is now .shadowMap.debug.' );
			this.shadowMap.debug = value;
		}
	}
} );

//

THREE.GeometryUtils = {

	merge: function ( geometry1, geometry2, materialIndexOffset ) {

		console.warn( 'THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.' );

		var matrix;

		if ( geometry2 instanceof THREE.Mesh ) {

			geometry2.matrixAutoUpdate && geometry2.updateMatrix();

			matrix = geometry2.matrix;
			geometry2 = geometry2.geometry;

		}

		geometry1.merge( geometry2, matrix, materialIndexOffset );

	},

	center: function ( geometry ) {

		console.warn( 'THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.' );
		return geometry.center();

	}

};

THREE.ImageUtils = {

	crossOrigin: undefined,

	loadTexture: function ( url, mapping, onLoad, onError ) {

		console.warn( 'THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.' );

		var loader = new THREE.TextureLoader();
		loader.setCrossOrigin( this.crossOrigin );

		var texture = loader.load( url, onLoad, undefined, onError );

		if ( mapping ) texture.mapping = mapping;

		return texture;

	},

	loadTextureCube: function ( urls, mapping, onLoad, onError ) {

		console.warn( 'THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.' );

		var loader = new THREE.CubeTextureLoader();
		loader.setCrossOrigin( this.crossOrigin );

		var texture = loader.load( urls, onLoad, undefined, onError );

		if ( mapping ) texture.mapping = mapping;

		return texture;

	},

	loadCompressedTexture: function () {

		console.error( 'THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.' )

	},

	loadCompressedTextureCube: function () {

		console.error( 'THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.' )

	}

};

//

THREE.Projector = function () {

	console.error( 'THREE.Projector has been moved to /examples/js/renderers/Projector.js.' );

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

};

//

THREE.CanvasRenderer = function () {

	console.error( 'THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js' );

	this.domElement = document.createElement( 'canvas' );
	this.clear = function () {};
	this.render = function () {};
	this.setClearColor = function () {};
	this.setSize = function () {};

};
