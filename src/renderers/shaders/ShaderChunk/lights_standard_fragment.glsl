PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.specularRoughness = roughnessFactor * 0.5 + 0.5; // disney's remapping of [ 0, 1 ] roughness to [ 0.5, 1 ]
material.specularColor = mix( vec3( 0.08 ) * reflectivity, diffuseColor.rgb, metalnessFactor );
