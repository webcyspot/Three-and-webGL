/**
 * @author sunag / http://www.sunag.com.br/
 */

THREE.StandardNodeMaterial = function() {

	this.node = new THREE.StandardNode();

	THREE.NodeMaterial.call( this, this.node, this.node );

};

THREE.StandardNodeMaterial.prototype = Object.create( THREE.NodeMaterial.prototype );
THREE.StandardNodeMaterial.prototype.constructor = THREE.StandardNodeMaterial;

THREE.NodeMaterial.addShortcuts( THREE.StandardNodeMaterial.prototype, 'node',
[ 'color', 'alpha', 'roughness', 'metalness', 'normal', 'normalScale', 'emissive', 'ambient', 'shadow', 'ao', 'environment', 'transform' ] );
