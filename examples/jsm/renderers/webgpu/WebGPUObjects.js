class WebGPUObjects {

	constructor( geometries, info ) {

		this.geometries = geometries;
		this.info = info;

		this.updateMap = new WeakMap();

	}

	update( object ) {

		const geometry = object.geometry;
		const updateMap = this.updateMap;
		const frame = this.info.render.frame;

		if ( this.geometries.has( geometry ) === false || updateMap.get( geometry ) !== frame ) {

			const material = object.material;

			this.geometries.update( geometry, material.wireframe === true );

			updateMap.set( geometry, frame );

		}

	}

	dispose() {

		this.updateMap = new WeakMap();

	}

}

export default WebGPUObjects;
