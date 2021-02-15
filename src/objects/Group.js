import { Object3D } from '../core/Object3D.js';

class Group extends Object3D {

	constructor() {

		super();
		this.type = 'Group';
		this.isGroup = true;

	}

}


export { Group };
