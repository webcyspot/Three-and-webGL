/**
 * @author simonThiele / https://github.com/simonThiele
 */

module( "Camera" );

test( "lookAt", function() {
	var cam = new THREE.Camera();
	cam.lookAt(new THREE.Vector3(0, 1, -1));

	ok( cam.rotation.x * (180 / Math.PI) === 45 , "x is equal" );
});

test( "clone", function() {
	var cam = new THREE.Camera();
	cam.lookAt(new THREE.Vector3(1, 2, 3));

	var clonedCam = cam.clone();

	ok( cam.matrixWorldInverse.equals(clonedCam.matrixWorldInverse) , "matrixWorldInverse is equal" );
	ok( cam.projectionMatrix.equals(clonedCam.projectionMatrix) , "projectionMatrix is equal" );
});
