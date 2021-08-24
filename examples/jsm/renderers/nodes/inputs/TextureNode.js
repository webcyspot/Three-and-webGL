import InputNode from '../core/InputNode.js';
import ExpressionNode from '../core/ExpressionNode.js';
import UVNode from '../accessors/UVNode.js';
import ColorSpaceNode from '../display/ColorSpaceNode.js';

class TextureNode extends InputNode {

	constructor( value = null, uv = new UVNode(), bias = null ) {

		super( 'texture' );

		this.value = value;
		this.uv = uv;
		this.bias = bias;

	}

	generate( builder, output ) {

		if ( output === 'sampler2D' ) {

			return super.generate( builder, output );

		} else {

			const nodeData = builder.getDataFromNode( this );

			let colorSpace = nodeData.colorSpace;

			if ( colorSpace === undefined ) {

				const type = this.getType( builder );

				const textureProperty = super.generate( builder, type );

				const uvSnippet = this.uv.build( builder, 'vec2' );
				const bias = this.bias;

				let biasSnippet = null;

				if ( bias !== null ) {

					biasSnippet = bias.build( builder, 'float' );

				}

				const textureCallSnippet = builder.getTexture( textureProperty, uvSnippet, biasSnippet );

				colorSpace = new ColorSpaceNode();
				colorSpace.input = new ExpressionNode( textureCallSnippet, 'vec4' );
				colorSpace.fromDecoding( builder.getTextureEncodingFromMap( this.value ) );

				nodeData.colorSpace = colorSpace;

			}

			return colorSpace.build( builder, output );

		}

	}

}

TextureNode.prototype.isTextureNode = true;

export default TextureNode;
