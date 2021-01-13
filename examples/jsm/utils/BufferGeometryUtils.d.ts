import { BufferAttribute, BufferGeometry, InterleavedBufferAttribute, TrianglesDrawModes, Object3D } from '../../../src/Three';

export namespace BufferGeometryUtils {
	export function mergeBufferGeometries( geometries: BufferGeometry[], useGroups?: boolean ): BufferGeometry;
	export function mergeBufferAttributes( attributes: BufferAttribute[] ): BufferAttribute;
	export function interleaveAttributes( attributes: BufferAttribute[] ): InterleavedBufferAttribute;
	export function estimateBytesUsed( geometry: BufferGeometry ): number;
	export function mergeVertices( geometry: BufferGeometry, tolerance?: number ): BufferGeometry;
	export function toTrianglesDrawMode( geometry: BufferGeometry, drawMode: TrianglesDrawModes ): BufferGeometry;
	export function computeMorphedBufferGeometry( object: Object3D ): Object;
}
