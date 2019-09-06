export default /* glsl */`
#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;
		varying float skipLogDepth;

	#else

		uniform float logDepthBufFC;

	#endif

#endif
`;
