uniform vec3 ambientLightColor;


#if MAX_DIR_LIGHTS > 0

	struct DirectionalLight {
	  vec3 direction;
	  vec3 color;
	};

	uniform DirectionalLight directionalLights[ MAX_DIR_LIGHTS ];

	IncidentLight getDirectionalDirectLight( const in DirectionalLight directionalLight, const in GeometricContext geometry ) { 

		IncidentLight directLight;
	
		directLight.color = directionalLight.color;
		directLight.direction = directionalLight.direction; 

		return directLight;
	}

#endif


#if MAX_POINT_LIGHTS > 0

	struct PointLight {
	  vec3 position;
	  vec3 color;
	  float distance;
	  float decay;
	};

	uniform PointLight pointLights[ MAX_POINT_LIGHTS ];

	IncidentLight getPointDirectLight( const in PointLight pointLight, const in GeometricContext geometry ) { 
	
		IncidentLight directLight;

		vec3 lightPosition = pointLight.position; 
	
		vec3 lVector = lightPosition - geometry.position; 
		directLight.direction = normalize( lVector ); 
	
		directLight.color = pointLight.color; 
		directLight.color *= calcLightAttenuation( length( lVector ), pointLight.distance, pointLight.decay ); 
	
		return directLight;
	}

#endif


#if MAX_SPOT_LIGHTS > 0

	struct SpotLight {
	  vec3 position;
	  vec3 direction;
	  vec3 color;
	  float distance;
	  float decay;
	  float angleCos;
	  float exponent;
	};

	uniform SpotLight spotLights[ MAX_SPOT_LIGHTS ];

	IncidentLight getSpotDirectLight( const in SpotLight spotLight, const in GeometricContext geometry ) {
	
		IncidentLight directLight;

		vec3 lightPosition = spotLight.position;
	
		vec3 lVector = lightPosition - geometry.position;
		directLight.direction = normalize( lVector );
	
		float spotEffect = dot( spotLight.direction, directLight.direction );
		spotEffect = saturate( pow( saturate( spotEffect ), spotLight.exponent ) );
	
		directLight.color = spotLight.color;
		directLight.color *= ( spotEffect * calcLightAttenuation( length( lVector ), spotLight.distance, spotLight.decay ) );

		return directLight;
	}

#endif


#if MAX_HEMI_LIGHTS > 0

	struct HemisphereLight {
	  vec3 direction;
	  vec3 skyColor;
	  vec3 groundColor;
	};

	uniform HemisphereLight hemisphereLights[ MAX_HEMI_LIGHTS ];

	IncidentLight getHemisphereIndirectLight( const in HemisphereLight hemiLight, const in GeometricContext geometry ) { 
	
		IncidentLight indirectLight;

		float dotNL = dot( geometry.normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

		indirectLight.color = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		indirectLight.direction = geometry.normal;

		return indirectLight;
	}

#endif


#ifdef USE_ENVMAP

	struct SpecularLightProbe {
		samplerCube	map;
		float intensity;
	};

	IncidentLight getSpecularLightProbeIndirectLight( const in SpecularLightProbe specularLightProbe, const in GeometricContext geometry, const in float lodLevel ) { 
	
		#ifdef ENVMAP_MODE_REFLECTION

			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );

		#else

			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );

		#endif

		#ifdef DOUBLE_SIDED

			float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );

		#else

			float flipNormal = 1.0;

		#endif

		reflectVec = normalize( transformDirection( reflectVec, viewMatrix ) );

		#ifdef ENVMAP_TYPE_CUBE

			#if defined( TEXTURE_CUBE_LOD_EXT )

				float bias = pow( lodLevel, 0.5 ) * 7.0; // from bhouston - there are other models for this calculation (roughness; not roughnesFactor)

				vec4 envMapColor = textureCubeLodEXT( specularLightProbe.map, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ), bias );

			#else

				vec4 envMapColor = textureCube( specularLightProbe.map, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );

			#endif

		#elif defined( ENVMAP_TYPE_EQUIREC )

			vec2 sampleUV;
			sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
			sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;
			vec4 envMapColor = texture2D( specularLightProbe.map, sampleUV );

		#elif defined( ENVMAP_TYPE_SPHERE )

			vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));
			vec4 envMapColor = texture2D( specularLightProbe.map, reflectView.xy * 0.5 + 0.5 );

		#endif

		envMapColor.rgb = inputToLinear( envMapColor.rgb );

		IncidentLight indirectLight;
		indirectLight.color = envMapColor.rgb * specularLightProbe.intensity;
		indirectLight.direction = geometry.normal;

		return indirectLight;

	}

#endif

