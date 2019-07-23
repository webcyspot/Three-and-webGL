export default /* glsl */`
#if defined( RE_IndirectDiffuse )

	#ifdef USE_LIGHTMAP

		vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;

		#ifndef PHYSICALLY_CORRECT_LIGHTS

			lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage

		#endif

		irradiance += lightMapIrradiance;

	#endif

	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )

		irradiance += getLightProbeIndirectIrradiance( /*lightProbe,*/ geometry, maxMipLevel );

	#endif

#endif

#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )

  radiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry.viewDir, geometry.normal, Material_BlinnShininessExponent( material ), maxMipLevel );

	#ifndef STANDARD
		#ifdef USE_CLEARCOAT_NORMALMAP
			clearCoatRadiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry.viewDir, geometry.clearCoatNormal, Material_ClearCoat_BlinnShininessExponent( material ), maxMipLevel );
		#else
			clearCoatRadiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry.viewDir, geometry.normal, Material_ClearCoat_BlinnShininessExponent( material ), maxMipLevel );
		#endif
	#endif
#endif
`;
