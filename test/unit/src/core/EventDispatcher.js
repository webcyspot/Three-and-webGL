/**
 * @author simonThiele / https://github.com/simonThiele
 */

QUnit.module( "EventDispatcher" );

QUnit.test( "addEventListener" , function( assert ) {
	var eventDispatcher = new THREE.EventDispatcher();

	var listener = {};
	eventDispatcher.addEventListener( 'anyType', listener );

	assert.ok( eventDispatcher._listeners.anyType.length === 1, "listener with unknown type was added" );
	assert.ok( eventDispatcher._listeners.anyType[0] === listener, "listener with unknown type was added" );

	eventDispatcher.addEventListener( 'anyType', listener );

	assert.ok( eventDispatcher._listeners.anyType.length === 1, "can't add one listener twice to same type" );
	assert.ok( eventDispatcher._listeners.anyType[0] === listener, "listener is still there" );
});

QUnit.test( "hasEventListener" , function( assert ) {
	var eventDispatcher = new THREE.EventDispatcher();

	var listener = {};
	eventDispatcher.addEventListener( 'anyType', listener );

	assert.ok( eventDispatcher.hasEventListener( 'anyType', listener ), "listener was found" );
	assert.ok( !eventDispatcher.hasEventListener( 'anotherType', listener ), "listener was not found which is good" );
});

QUnit.test( "removeEventListener" , function( assert ) {
	var eventDispatcher = new THREE.EventDispatcher();

	var listener = {};

	assert.ok( eventDispatcher._listeners === undefined, "there are no listeners by default" );

	eventDispatcher.addEventListener( 'anyType', listener );
	assert.ok( Object.keys( eventDispatcher._listeners ).length === 1 &&
		eventDispatcher._listeners.anyType.length === 1, "if a listener was added, there is a new key" );

	eventDispatcher.removeEventListener( 'anyType', listener );
	assert.ok( eventDispatcher._listeners.anyType.length === 0, "listener was deleted" );

	eventDispatcher.removeEventListener( 'unknownType', listener );
	assert.ok( eventDispatcher._listeners.unknownType === undefined, "unknown types will be ignored" );

	eventDispatcher.removeEventListener( 'anyType', undefined );
	assert.ok( eventDispatcher._listeners.anyType.length === 0, "undefined listeners are ignored" );
});

QUnit.test( "dispatchEvent" , function( assert ) {
	var eventDispatcher = new THREE.EventDispatcher();

	var callCount = 0;
	var listener = function() { callCount++; };

	eventDispatcher.addEventListener( 'anyType', listener );
	assert.ok( callCount === 0, "no event, no call" );

	eventDispatcher.dispatchEvent( { type: 'anyType' } );
	assert.ok( callCount === 1, "one event, one call" );

	eventDispatcher.dispatchEvent( { type: 'anyType' } );
	assert.ok( callCount === 2, "two events, two calls" );
});








//
