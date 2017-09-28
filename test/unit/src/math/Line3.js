/**
 * @author bhouston / http://exocortex.com
 */

QUnit.module( "Line3" );

QUnit.test( "constructor/equals", function( assert ) {
	var a = new THREE.Line3();
	assert.ok( a.start.equals( zero3 ), "Passed!" );
	assert.ok( a.end.equals( zero3 ), "Passed!" );

	a = new THREE.Line3( two3.clone(), one3.clone() );
	assert.ok( a.start.equals( two3 ), "Passed!" );
	assert.ok( a.end.equals( one3 ), "Passed!" );
});

QUnit.test( "copy/equals", function( assert ) {
	var a = new THREE.Line3( zero3.clone(), one3.clone() );
	var b = new THREE.Line3().copy( a );
	assert.ok( b.start.equals( zero3 ), "Passed!" );
	assert.ok( b.end.equals( one3 ), "Passed!" );

	// ensure that it is a true copy
	a.start = zero3;
	a.end = one3;
	assert.ok( b.start.equals( zero3 ), "Passed!" );
	assert.ok( b.end.equals( one3 ), "Passed!" );
});

QUnit.test( "set" , function( assert ) {
	var a = new THREE.Line3();

	a.set( one3, one3 );
	assert.ok( a.start.equals( one3 ), "Passed!" );
	assert.ok( a.end.equals( one3 ), "Passed!" );
});

QUnit.test( "at" , function( assert ) {
	var a = new THREE.Line3( one3.clone(), new THREE.Vector3( 1, 1, 2 ) );

	assert.ok( a.at( -1 ).distanceTo( new THREE.Vector3( 1, 1, 0 ) ) < 0.0001, "Passed!" );
	assert.ok( a.at( 0 ).distanceTo( one3.clone() ) < 0.0001, "Passed!" );
	assert.ok( a.at( 1 ).distanceTo( new THREE.Vector3( 1, 1, 2 ) ) < 0.0001, "Passed!" );
	assert.ok( a.at( 2 ).distanceTo( new THREE.Vector3( 1, 1, 3 ) ) < 0.0001, "Passed!" );
});

QUnit.test( "closestPointToPoint/closestPointToPointParameter", function( assert ) {
	var a = new THREE.Line3( one3.clone(), new THREE.Vector3( 1, 1, 2 ) );

	// nearby the ray
	assert.ok( a.closestPointToPointParameter( zero3.clone(), true ) == 0, "Passed!" );
	var b1 = a.closestPointToPoint( zero3.clone(), true );
	assert.ok( b1.distanceTo( new THREE.Vector3( 1, 1, 1 ) ) < 0.0001, "Passed!" );

	// nearby the ray
	assert.ok( a.closestPointToPointParameter( zero3.clone(), false ) == -1, "Passed!" );
	var b2 = a.closestPointToPoint( zero3.clone(), false );
	assert.ok( b2.distanceTo( new THREE.Vector3( 1, 1, 0 ) ) < 0.0001, "Passed!" );

	// nearby the ray
	assert.ok( a.closestPointToPointParameter( new THREE.Vector3( 1, 1, 5 ), true ) == 1, "Passed!" );
	var b = a.closestPointToPoint( new THREE.Vector3( 1, 1, 5 ), true );
	assert.ok( b.distanceTo( new THREE.Vector3( 1, 1, 2 ) ) < 0.0001, "Passed!" );

	// exactly on the ray
	assert.ok( a.closestPointToPointParameter( one3.clone(), true ) == 0, "Passed!" );
	var c = a.closestPointToPoint( one3.clone(), true );
	assert.ok( c.distanceTo( one3.clone() ) < 0.0001, "Passed!" );
});

QUnit.test( "clone/equal", function ( assert ) {

	var a = new THREE.Line3();
	var b = new THREE.Line3( zero3, new THREE.Vector3( 1, 1, 1 ) );
	var c = new THREE.Line3( zero3, new THREE.Vector3( 1, 1, 0 ) );

	assert.notOk( a.equals( b ), "Check a and b aren't equal" );
	assert.notOk( a.equals( c ), "Check a and c aren't equal" );
	assert.notOk( b.equals( c ), "Check b and c aren't equal" );

	a = b.clone();
	assert.ok( a.equals( b ), "Check a and b are equal after clone()" );
	assert.notOk( a.equals( c ), "Check a and c aren't equal after clone()" );

	a.set( zero3, zero3 );
	assert.notOk( a.equals( b ), "Check a and b are not equal after modification" );

} );

QUnit.test( "distance", function ( assert ) {

	var a = new THREE.Line3( zero3, zero3 );
	var b = new THREE.Line3( zero3, one3 );
	var c = new THREE.Line3( one3.clone().negate(), one3 );
	var d = new THREE.Line3( two3.clone().multiplyScalar( - 2 ), two3.clone().negate() );

	assert.numEqual( a.distance(), 0, "Check distance for zero-length line" );
	assert.numEqual( b.distance(), Math.sqrt( 3 ), "Check distance for simple line" );
	assert.numEqual( c.distance(), Math.sqrt( 12 ), "Check distance for negative to positive endpoints" );
	assert.numEqual( d.distance(), Math.sqrt( 12 ), "Check distance for negative to negative endpoints" );

} );

QUnit.test( "applyMatrix4", function ( assert ) {

	var a = new THREE.Line3( zero3.clone(), two3.clone() );
	var b = new THREE.Vector4( two3.x, two3.y, two3.z, 1 );
	var m = new THREE.Matrix4().makeTranslation( x, y, z );
	var v = new THREE.Vector3( x, y, z );

	a.applyMatrix4( m );
	assert.ok( a.start.equals( v ), "Translation: check start" );
	assert.ok( a.end.equals( new THREE.Vector3( 2 + x, 2 + y, 2 + z ) ), "Translation: check start" );

	// reset starting conditions
	a.set( zero3.clone(), two3.clone() );
	m.makeRotationX( Math.PI );

	a.applyMatrix4( m );
	b.applyMatrix4( m );

	assert.ok( a.start.equals( zero3 ), "Rotation: check start" );
	assert.numEqual( a.end.x, b.x / b.w, "Rotation: check end.x" );
	assert.numEqual( a.end.y, b.y / b.w, "Rotation: check end.y" );
	assert.numEqual( a.end.z, b.z / b.w, "Rotation: check end.z" );

	// reset starting conditions
	a.set( zero3.clone(), two3.clone() );
	b.set( two3.x, two3.y, two3.z, 1 );
	m.setPosition( v );

	a.applyMatrix4( m );
	b.applyMatrix4( m );

	assert.ok( a.start.equals( v ), "Both: check start" );
	assert.numEqual( a.end.x, b.x / b.w, "Both: check end.x" );
	assert.numEqual( a.end.y, b.y / b.w, "Both: check end.y" );
	assert.numEqual( a.end.z, b.z / b.w, "Both: check end.z" );

} );
