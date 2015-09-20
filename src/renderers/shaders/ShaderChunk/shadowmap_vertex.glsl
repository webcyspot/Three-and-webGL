#ifdef USE_SHADOWMAP

	for( int i = 0; i < MAX_SHADOWS; i ++ ) {

		#if defined(POINT_LIGHT_SHADOWS)

			// if shadowDarkness[ i ] < 0.0, that means we have a point light with a cube
			// shadow map
			if( shadowDarkness[ i ] < 0.0 ) {

				// When we have a point light, the @shadowMatrix uniform is used to store
				// the inverse of the view matrix, so that we can get the world-space
				// position of the light.

				vec4 lightPositionWorld = ( shadowMatrix[ i ] * vec4( pointLightPosition[ i ], 1.0 ) );
				vec4 distanceToLight = worldPosition - lightPositionWorld;
				distanceToLight.w = 1.0;

				// We also repurpose vShadowCoord to hold the distance in world space from the
				// light to the vertex. This value will be interpolated correctly in the fragment shader.

				vShadowCoord[ i ] = distanceToLight;

			} else {

				vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;

			}

		#else

			vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;

		#endif

	}

#endif