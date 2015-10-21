#if defined( PHYSICAL ) || defined( USE_ENVMAP )
	uniform float reflectivity;
#endif

#ifdef USE_ENVMAP

	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	uniform float flipEnvMap;

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )

		uniform float refractionRatio;

	#else

		varying vec3 vReflect;

	#endif

#endif
