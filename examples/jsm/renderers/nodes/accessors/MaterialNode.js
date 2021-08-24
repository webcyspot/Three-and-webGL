import Node from '../core/Node.js';
import OperatorNode from '../math/OperatorNode.js';
import MaterialReferenceNode from './MaterialReferenceNode.js';

class MaterialNode extends Node {

	static ALPHA_TEST = 'alphaTest';
	static COLOR = 'color';
	static OPACITY = 'opacity';
	static SPECULAR = 'specular';
	static ROUGHNESS = 'roughness';
	static METALNESS = 'metalness';

	constructor( scope = MaterialNode.COLOR ) {

		super();

		this.scope = scope;

	}

	getType( builder ) {

		const scope = this.scope;
		const material = builder.getContextValue( 'material' );

		if ( scope === MaterialNode.COLOR ) {

			return material.map !== null ? 'vec4' : 'vec3';

		} else if ( scope === MaterialNode.OPACITY ) {

			return 'float';

		} else if ( scope === MaterialNode.SPECULAR ) {

			return 'vec3';

		} else if ( scope === MaterialNode.ROUGHNESS || scope === MaterialNode.METALNESS ) {

			return 'float';

		}

	}

	generate( builder, output ) {

		const material = builder.getContextValue( 'material' );
		const scope = this.scope;

		let node = null;

		if ( scope === MaterialNode.ALPHA_TEST ) {

			node = new MaterialReferenceNode( 'alphaTest', 'float' );

		} else if ( scope === MaterialNode.COLOR ) {

			const colorNode = new MaterialReferenceNode( 'color', 'color' );

			if ( material.map !== null && material.map !== undefined && material.map.isTexture === true ) {

				node = new OperatorNode( '*', colorNode, new MaterialReferenceNode( 'map', 'texture' ) );

			} else {

				node = colorNode;

			}

		} else if ( scope === MaterialNode.OPACITY ) {

			const opacityNode = new MaterialReferenceNode( 'opacity', 'float' );

			if ( material.alphaMap !== null && material.alphaMap !== undefined && material.alphaMap.isTexture === true ) {

				node = new OperatorNode( '*', opacityNode, new MaterialReferenceNode( 'alphaMap', 'texture' ) );

			} else {

				node = opacityNode;

			}

		} else if ( scope === MaterialNode.SPECULAR ) {

			const specularTintNode = new MaterialReferenceNode( 'specularTint', 'color' );

			if ( material.specularTintMap !== null && material.specularTintMap !== undefined && material.specularTintMap.isTexture === true ) {

				node = new OperatorNode( '*', specularTintNode, new MaterialReferenceNode( 'specularTintMap', 'texture' ) );

			} else {

				node = specularTintNode;

			}

		} else {

			const type = this.getType( builder );

			node = new MaterialReferenceNode( scope, type );

		}

		return node.build( builder, output );

	}

}

export default MaterialNode;
