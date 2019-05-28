import { Shape } from './../extras/core/Shape';
import { UVGenerator } from './ExtrudeGeometry';
import {
	PolyhedronGeometry,
	PolyhedronBufferGeometry,
} from './PolyhedronGeometry';

export class IcosahedronBufferGeometry extends PolyhedronBufferGeometry {

	constructor( radius?: number, detail?: number );

}

export class IcosahedronGeometry extends PolyhedronGeometry {

	constructor( radius?: number, detail?: number );

}
