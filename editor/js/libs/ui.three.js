/**
 * @author mrdoob / http://mrdoob.com/
 */

import {
	CanvasTexture,
	RGBFormat,
	RGBAFormat,
 	Texture,
	Vector2,
	Vector3
} from '../../../build/three.module.js';

import { TGALoader } from '../../../examples/jsm/loaders/TGALoader.js';

import { UIElement, UISpan, UIDiv, UIRow, UIButton, UICheckbox, UIText, UINumber } from './ui.js';
import { MoveObjectCommand } from '../commands/MoveObjectCommand.js';

var UITexture = function ( mapping ) {

	UIElement.call( this );

	var scope = this;

	var dom = document.createElement( 'span' );

	var form = document.createElement( 'form' );

	var input = document.createElement( 'input' );
	input.type = 'file';
	input.addEventListener( 'change', function ( event ) {

		loadFile( event.target.files[ 0 ] );

	} );
	form.appendChild( input );

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = 16;
	canvas.style.cursor = 'pointer';
	canvas.style.marginRight = '5px';
	canvas.style.border = '1px solid #888';
	canvas.addEventListener( 'click', function () {

		input.click();

	}, false );
	canvas.addEventListener( 'drop', function ( event ) {

		event.preventDefault();
		event.stopPropagation();
		loadFile( event.dataTransfer.files[ 0 ] );

	}, false );
	dom.appendChild( canvas );

	var name = document.createElement( 'input' );
	name.disabled = true;
	name.style.width = '64px';
	name.style.border = '1px solid #ccc';
	dom.appendChild( name );

	function loadFile( file ) {

		if ( file.type.match( 'image.*' ) ) {

			var reader = new FileReader();

			if ( file.type === 'image/targa' ) {

				reader.addEventListener( 'load', function ( event ) {

					var canvas = new TGALoader().parse( event.target.result );

					var texture = new CanvasTexture( canvas, mapping );
					texture.sourceFile = file.name;

					scope.setValue( texture );

					if ( scope.onChangeCallback ) scope.onChangeCallback( texture );

				}, false );

				reader.readAsArrayBuffer( file );

			} else {

				reader.addEventListener( 'load', function ( event ) {

					var image = document.createElement( 'img' );
					image.addEventListener( 'load', function () {

						var texture = new Texture( this, mapping );
						texture.sourceFile = file.name;
						texture.format = file.type === 'image/jpeg' ? RGBFormat : RGBAFormat;
						texture.needsUpdate = true;

						scope.setValue( texture );

						if ( scope.onChangeCallback ) scope.onChangeCallback( texture );

					}, false );

					image.src = event.target.result;

				}, false );

				reader.readAsDataURL( file );

			}

		}

		form.reset();

	}

	this.dom = dom;
	this.texture = null;
	this.onChangeCallback = null;

	return this;

};

UITexture.prototype = Object.create( UIElement.prototype );
UITexture.prototype.constructor = UITexture;

UITexture.prototype.getValue = function () {

	return this.texture;

};

UITexture.prototype.setValue = function ( texture ) {

	var canvas = this.dom.children[ 0 ];
	var name = this.dom.children[ 1 ];
	var context = canvas.getContext( '2d' );

	if ( texture !== null ) {

		var image = texture.image;

		if ( image !== undefined && image.width > 0 ) {

			name.value = texture.sourceFile;

			var scale = canvas.width / image.width;
			context.drawImage( image, 0, 0, image.width * scale, image.height * scale );

		} else {

			name.value = texture.sourceFile + ' (error)';
			context.clearRect( 0, 0, canvas.width, canvas.height );

		}

	} else {

		name.value = '';

		if ( context !== null ) {

			// Seems like context can be null if the canvas is not visible

			context.clearRect( 0, 0, canvas.width, canvas.height );

		}

	}

	this.texture = texture;

};

UITexture.prototype.setEncoding = function ( encoding ) {

	var texture = this.getValue();
	if ( texture !== null ) {

		texture.encoding = encoding;

	}

	return this;

};

UITexture.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};

// UIOutliner

var UIOutliner = function ( editor ) {

	UIElement.call( this );

	var scope = this;

	var dom = document.createElement( 'div' );
	dom.className = 'Outliner';
	dom.tabIndex = 0;	// keyup event is ignored without setting tabIndex

	// hack
	this.scene = editor.scene;
	this.editor = editor;

	// Prevent native scroll behavior
	dom.addEventListener( 'keydown', function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 40: // down
				event.preventDefault();
				event.stopPropagation();
				break;

		}

	}, false );

	// Keybindings to support arrow navigation
	dom.addEventListener( 'keyup', function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
				scope.selectIndex( scope.selectedIndex - 1 );
				break;
			case 40: // down
				scope.selectIndex( scope.selectedIndex + 1 );
				break;

		}

	}, false );

	this.dom = dom;

	this.options = [];
	this.selectedIndex = - 1;
	this.selectedValue = null;

	return this;

};

UIOutliner.prototype = Object.create( UIElement.prototype );
UIOutliner.prototype.constructor = UIOutliner;

UIOutliner.prototype.selectIndex = function ( index ) {

	if ( index >= 0 && index < this.options.length ) {

		this.setValue( this.options[ index ].value );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );
		this.dom.dispatchEvent( changeEvent );

	}

};

UIOutliner.prototype.setOptions = function ( options ) {

	var scope = this;

	while ( scope.dom.children.length > 0 ) {

		scope.dom.removeChild( scope.dom.firstChild );

	}

	function onClick() {

		scope.setValue( this.value );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );
		scope.dom.dispatchEvent( changeEvent );

	}

	// Drag

	var currentDrag;

	function onDrag() {

		currentDrag = this;

	}

	function onDragStart( event ) {

		event.dataTransfer.setData( 'text', 'foo' );

	}

	function onDragOver( event ) {

		if ( this === currentDrag ) return;

		var area = event.offsetY / this.clientHeight;

		if ( area < 0.25 ) {

			this.className = 'option dragTop';

		} else if ( area > 0.75 ) {

			this.className = 'option dragBottom';

		} else {

			this.className = 'option drag';

		}

	}

	function onDragLeave() {

		if ( this === currentDrag ) return;

		this.className = 'option';

	}

	function onDrop( event ) {

		if ( this === currentDrag ) return;

		this.className = 'option';

		var scene = scope.scene;
		var object = scene.getObjectById( currentDrag.value );

		var area = event.offsetY / this.clientHeight;

		if ( area < 0.25 ) {

			var nextObject = scene.getObjectById( this.value );
			moveObject( object, nextObject.parent, nextObject );

		} else if ( area > 0.75 ) {

			var nextObject = scene.getObjectById( this.nextSibling.value );
			moveObject( object, nextObject.parent, nextObject );

		} else {

			var parentObject = scene.getObjectById( this.value );
			moveObject( object, parentObject );

		}

	}

	function moveObject( object, newParent, nextObject ) {

		if ( nextObject === null ) nextObject = undefined;

		var newParentIsChild = false;

		object.traverse( function ( child ) {

			if ( child === newParent ) newParentIsChild = true;

		} );

		if ( newParentIsChild ) return;

		scope.editor.execute( new MoveObjectCommand( scope.editor, object, newParent, nextObject ) );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );
		scope.dom.dispatchEvent( changeEvent );

	}

	//

	scope.options = [];

	for ( var i = 0; i < options.length; i ++ ) {

		var div = options[ i ];
		div.className = 'option';
		scope.dom.appendChild( div );

		scope.options.push( div );

		div.addEventListener( 'click', onClick, false );

		if ( div.draggable === true ) {

			div.addEventListener( 'drag', onDrag, false );
			div.addEventListener( 'dragstart', onDragStart, false ); // Firefox needs this

			div.addEventListener( 'dragover', onDragOver, false );
			div.addEventListener( 'dragleave', onDragLeave, false );
			div.addEventListener( 'drop', onDrop, false );

		}


	}

	return scope;

};

UIOutliner.prototype.getValue = function () {

	return this.selectedValue;

};

UIOutliner.prototype.setValue = function ( value ) {

	for ( var i = 0; i < this.options.length; i ++ ) {

		var UIElement = this.options[ i ];

		if ( UIElement.value === value ) {

			UIElement.classList.add( 'active' );

			// scroll into view

			var y = UIElement.offsetTop - this.dom.offsetTop;
			var bottomY = y + UIElement.offsetHeight;
			var minScroll = bottomY - this.dom.offsetHeight;

			if ( this.dom.scrollTop > y ) {

				this.dom.scrollTop = y;

			} else if ( this.dom.scrollTop < minScroll ) {

				this.dom.scrollTop = minScroll;

			}

			this.selectedIndex = i;

		} else {

			UIElement.classList.remove( 'active' );

		}

	}

	this.selectedValue = value;

	return this;

};

var UIPoints = function ( onAddClicked ) {

	UIElement.call( this );

	var span = new UISpan().setDisplay( 'inline-block' );

	this.pointsList = new UIDiv();
	span.add( this.pointsList );

	var row = new UIRow();
	span.add( row );

	var addPointButton = new UIButton( '+' ).onClick( onAddClicked );
	row.add( addPointButton );

	this.update = function () {

		if ( this.onChangeCallback !== null ) {

			this.onChangeCallback();

		}

	}.bind( this );

	this.dom = span.dom;
	this.pointsUI = [];
	this.lastPointIdx = 0;
	this.onChangeCallback = null;
	return this;

};

UIPoints.prototype = Object.create( UIElement.prototype );
UIPoints.prototype.constructor = UIPoints;

UIPoints.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};

UIPoints.prototype.clear = function () {

	for ( var i = 0; i < this.pointslength; ++ i ) {

		if ( this.pointsUI[ i ] ) {

			this.deletePointRow( i, true );

		}

	}

	this.lastPointIdx = 0;

};

UIPoints.prototype.deletePointRow = function ( idx, dontUpdate ) {

	if ( ! this.pointsUI[ idx ] ) return;

	this.pointsList.remove( this.pointsUI[ idx ].row );
	this.pointsUI[ idx ] = null;

	if ( dontUpdate !== true ) {

		this.update();

	}

};

var UIPoints2 = function () {

	UIPoints.call( this, UIPoints2.addRow.bind( this ) );

	return this;

};

UIPoints2.prototype = Object.create( UIPoints.prototype );
UIPoints2.prototype.constructor = UIPoints2;

UIPoints2.addRow = function () {

	if ( this.pointslength === 0 ) {

		this.pointsList.add( this.createPointRow( 0, 0 ) );

	} else {

		var point = this.pointsUI[ this.pointslength - 1 ];

		this.pointsList.add( this.createPointRow( point.x.getValue(), point.y.getValue() ) );

	}

	this.update();

};

UIPoints2.prototype.getValue = function () {

	var points = [];

	for ( var i = 0; i < this.pointslength; i ++ ) {

		var pointUI = this.pointsUI[ i ];

		if ( ! pointUI ) continue;

		points.push( new Vector2( pointUI.x.getValue(), pointUI.y.getValue() ) );

	}

	return points;

};

UIPoints2.prototype.setValue = function ( points ) {

	this.clear();

	for ( var i = 0; i < points.length; i ++ ) {

		var point = points[ i ];
		this.pointsList.add( this.createPointRow( point.x, point.y ) );

	}

	this.update();
	return this;

};

UIPoints2.prototype.createPointRow = function ( x, y ) {

	var pointRow = new UIDiv();
	var lbl = new UIText( this.lastPointIdx + 1 ).setWidth( '20px' );
	var txtX = new UINumber( x ).setWidth( '30px' ).onChange( this.update );
	var txtY = new UINumber( y ).setWidth( '30px' ).onChange( this.update );

	var idx = this.lastPointIdx;
	var scope = this;
	var btn = new UIButton( '-' ).onClick( function () {

		if ( scope.isEditing ) return;
		scope.deletePointRow( idx );

	} );

	this.pointspush( { row: pointRow, lbl: lbl, x: txtX, y: txtY } );
	++ this.lastPointIdx;
	pointRow.add( lbl, txtX, txtY, btn );

	return pointRow;

};

var UIPoints3 = function () {

	UIPoints.call( this, UIPoints3.addRow.bind( this ) );

	return this;

};

UIPoints3.prototype = Object.create( UIPoints.prototype );
UIPoints3.prototype.constructor = UIPoints3;

UIPoints3.addRow = function () {

	if ( this.pointslength === 0 ) {

		this.pointsList.add( this.createPointRow( 0, 0, 0 ) );

	} else {

		var point = this.pointsUI[ this.pointslength - 1 ];

		this.pointsList.add( this.createPointRow( point.x.getValue(), point.y.getValue(), point.z.getValue() ) );

	}

	this.update();

};

UIPoints3.prototype.getValue = function () {

	var points = [];

	for ( var i = 0; i < this.pointslength; i ++ ) {

		var pointUI = this.pointsUI[ i ];

		if ( ! pointUI ) continue;

		points.push( new Vector3( pointUI.x.getValue(), pointUI.y.getValue(), pointUI.z.getValue() ) );

	}

	return points;

};

UIPoints3.prototype.setValue = function ( points ) {

	this.clear();

	for ( var i = 0; i < points.length; i ++ ) {

		var point = points[ i ];
		this.pointsList.add( this.createPointRow( point.x, point.y, point.z ) );

	}

	this.update();
	return this;

};

UIPoints3.prototype.createPointRow = function ( x, y, z ) {

	var pointRow = new UIDiv();
	var lbl = new UIText( this.lastPointIdx + 1 ).setWidth( '20px' );
	var txtX = new UINumber( x ).setWidth( '30px' ).onChange( this.update );
	var txtY = new UINumber( y ).setWidth( '30px' ).onChange( this.update );
	var txtZ = new UINumber( z ).setWidth( '30px' ).onChange( this.update );

	var idx = this.lastPointIdx;
	var scope = this;
	var btn = new UIButton( '-' ).onClick( function () {

		if ( scope.isEditing ) return;
		scope.deletePointRow( idx );

	} );

	this.pointspush( { row: pointRow, lbl: lbl, x: txtX, y: txtY, z: txtZ } );
	++ this.lastPointIdx;
	pointRow.add( lbl, txtX, txtY, txtZ, btn );

	return pointRow;

};

var UIBoolean = function ( boolean, text ) {

	UISpan.call( this );

	this.setMarginRight( '10px' );

	this.checkbox = new UICheckbox( boolean );
	this.text = new UIText( text ).setMarginLeft( '3px' );

	this.add( this.checkbox );
	this.add( this.text );

};

UIBoolean.prototype = Object.create( UISpan.prototype );
UIBoolean.prototype.constructor = UIBoolean;

UIBoolean.prototype.getValue = function () {

	return this.checkbox.getValue();

};

UIBoolean.prototype.setValue = function ( value ) {

	return this.checkbox.setValue( value );

};

export { UITexture, UIOutliner, UIPoints, UIPoints2, UIPoints3, UIBoolean };
