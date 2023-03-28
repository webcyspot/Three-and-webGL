import { div } from '../../math/OperatorNode.js';
import { EPSILON } from '../../math/MathNode.js';
import { ShaderNode } from '../../shadernode/ShaderNode.js';

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
const V_GGX_SmithCorrelated = new ShaderNode( ( inputs ) => {

	const { alpha, dotNL, dotNV } = inputs;

	const a2 = alpha.pow2();

	const gv = dotNL.mul( a2.add( a2.oneMinus().mul( dotNV.pow2() ) ).sqrt() );
	const gl = dotNV.mul( a2.add( a2.oneMinus().mul( dotNL.pow2() ) ).sqrt() );

	return div( 0.5, gv.add( gl ).max( EPSILON ) );

} ); // validated

export default V_GGX_SmithCorrelated;
