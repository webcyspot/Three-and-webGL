/**
 * @author sunag / http://www.sunag.com.br/
 */

THREE.TimerNode = function ( value, scale ) {

	THREE.FloatNode.call( this, value );

	this.scale = scale !== undefined ? scale : 1;

};

THREE.TimerNode.prototype = Object.create( THREE.FloatNode.prototype );
THREE.TimerNode.prototype.constructor = THREE.TimerNode;
THREE.TimerNode.prototype.nodeType = "Timer";

THREE.TimerNode.prototype.updateFrame = function ( delta ) {

	this.number += delta * this.scale;

};

THREE.TimerNode.prototype.toJSON = function ( meta ) {

	var data = this.getJSONNode( meta );

	if ( ! data ) {

		data = this.createJSONNode( meta );

		data.scale = this.scale;

	}

	return data;

};
