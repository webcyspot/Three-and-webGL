/**
 * @author mrdoob / http://mrdoob.com/
 */

import * as THREE from '../../build/three.module.js';

import { UIPanel } from './libs/ui.js';
import { APP } from './libs/app.js';

var Player = function ( editor ) {

	var signals = editor.signals;

	var container = new UIPanel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	//

	var player = new APP.Player( THREE );
	container.dom.appendChild( player.dom );

	window.addEventListener( 'resize', function () {

		player.setSize( container.dom.clientWidth, container.dom.clientHeight );

	} );

	signals.startPlayer.add( function () {

		container.setDisplay( '' );

		player.load( editor.toJSON() );
		player.setSize( container.dom.clientWidth, container.dom.clientHeight );
		player.play();

	} );

	signals.stopPlayer.add( function () {

		container.setDisplay( 'none' );

		player.stop();
		player.dispose();

	} );

	return container;

};

export { Player };
