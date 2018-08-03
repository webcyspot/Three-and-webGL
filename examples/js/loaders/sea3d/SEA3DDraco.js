/**
 * 	SEA3D - Google Draco
 * 	@author Sunag / http://www.sunag.com.br/
 */

'use strict';

//
//	Lossy Compression
//

SEA3D.GeometryDraco = function ( name, data, sea3d ) {

	this.name = name;
	this.data = data;
	this.sea3d = sea3d;

	var attrib = data.readUShort(),
		i;

	this.isBig = ( attrib & 1 ) !== 0;

	data.readVInt = this.isBig ? data.readUInt : data.readUShort;

	this.groups = [];

	if ( attrib & 32 ) {

		this.uv = [];
		this.uv.length = data.readUByte();

	}

	if ( attrib & 1024 ) {

		var numGroups = data.readUByte(),
			groupOffset = 0;

		for ( i = 0; i < numGroups; i ++ )		{

			var groupLength = data.readVInt() * 3;

			this.groups.push( {
				start: groupOffset,
				count: groupLength,
			} );

			groupOffset += groupLength;

		}

	}

	var module = SEA3D.GeometryDraco.getModule(),
		dracoData = new Int8Array( data.concat( data.position, data.bytesAvailable ).buffer );

	var decoder = new module.Decoder();

	var buffer = new module.DecoderBuffer();
	buffer.Init( dracoData, dracoData.length );

	var geometryType = decoder.GetEncodedGeometryType( buffer );

	var mesh = new module.Mesh();

	var decodingStatus = decoder.DecodeBufferToMesh( buffer, mesh );

	if ( ! decodingStatus.ok() ) {

		console.error( "SEA3D Draco Decoding failed:", decodingStatus.error_msg() );

	}

	var index = 0;

	this.vertex = this.readFloat32Array( module, decoder, mesh, index ++, module.POSITION );

	if ( attrib & 4 ) this.normal = this.readFloat32Array( module, decoder, mesh, index ++, module.NORMAL );

	if ( attrib & 32 ) {

		for ( i = 0; i < this.uv.length; i ++ ) {

			this.uv[ i ] = this.readFloat32Array( module, decoder, mesh, index ++, module.TEX_COORD );

		}

	}

	if ( attrib & 64 ) {

		this.jointPerVertex = decoder.GetAttribute( mesh, index ).num_components();

		this.joint = this.readUint16Array( module, decoder, mesh, index ++ );
		this.weight = this.readFloat32Array( module, decoder, mesh, index ++ );

	}

	this.indexes = this.readIndices( module, decoder, mesh );

	module.destroy( mesh );
	module.destroy( buffer );
	module.destroy( decoder );

};

SEA3D.GeometryDraco.getModule = function () {

	if ( ! this.module ) {

		this.module = DracoDecoderModule();

	}

	return this.module;

};

SEA3D.GeometryDraco.prototype.type = "sdrc";

SEA3D.GeometryDraco.prototype.readIndices = function ( module, decoder, mesh ) {

	var numFaces = mesh.num_faces(),
		numIndices = numFaces * 3,
		indices = new ( numIndices >= 0xFFFE ? Uint32Array : Uint16Array )( numIndices );

	var ia = new module.DracoInt32Array();

	for ( var i = 0; i < numFaces; ++ i ) {

		  decoder.GetFaceFromMesh( mesh, i, ia );

		  var index = i * 3;

		  indices[ index ] = ia.GetValue( 0 );
		  indices[ index + 1 ] = ia.GetValue( 1 );
		  indices[ index + 2 ] = ia.GetValue( 2 );

	}

	module.destroy( ia );

	return indices;

};

SEA3D.GeometryDraco.prototype.readTriangleStripIndices = function ( module, decoder, mesh ) {

	var dracoArray = new module.DracoInt32Array();
	decoder.GetTriangleStripsFromMesh( mesh, dracoArray );

	var size = mesh.num_faces() * 3,
		output = new ( size >= 0xFFFE ? Uint32Array : Uint16Array )( size );

	for ( var i = 0; i < size; ++ i ) {

		output[ i ] = dracoArray.GetValue( i );

	}

	module.destroy( dracoArray );

	return output;

};

SEA3D.GeometryDraco.prototype.readFloat32Array = function ( module, decoder, mesh, attrib, type ) {

	var attribute = decoder.GetAttribute( mesh, attrib ),
		numPoints = mesh.num_points();

	var dracoArray = new module.DracoFloat32Array();
	decoder.GetAttributeFloatForAllPoints( mesh, attribute, dracoArray );

	var size = numPoints * attribute.num_components(),
		output = new Float32Array( size );

	for ( var i = 0; i < size; ++ i ) {

		output[ i ] = dracoArray.GetValue( i );

	}

	module.destroy( dracoArray );

	return output;

};

SEA3D.GeometryDraco.prototype.readUint16Array = function ( module, decoder, mesh, attrib, type ) {

	var attribute = decoder.GetAttribute( mesh, attrib ),
		numPoints = mesh.num_points();

	var dracoArray = new module.DracoUInt16Array();
	decoder.GetAttributeUInt16ForAllPoints( mesh, attribute, dracoArray );

	var size = numPoints * attribute.num_components(),
		output = new Uint16Array( size );

	for ( var i = 0; i < size; ++ i ) {

		output[ i ] = dracoArray.GetValue( i );

	}

	module.destroy( dracoArray );

	return output;

};

//
//	Geometry Update
//

SEA3D.GeometryUpdateDraco = function ( name, data, sea3d ) {

	this.name = name;
	this.data = data;
	this.sea3d = sea3d;

	this.index = data.readUInt();
	this.bytes = data.concat( data.position, data.length - data.position );

};

SEA3D.GeometryUpdateDraco.prototype.type = "sDRC";

//
//	Updaters
//

THREE.SEA3D.prototype.readGeometryUpdateDraco = function ( sea ) {

	var obj = this.file.objects[ sea.index ],
		geo = obj.tag;

	var seaUpdate = new SEA3D.GeometryDraco( "", sea.bytes, sea.sea3d );
	seaUpdate.tag = geo;

	this.readGeometryBuffer( seaUpdate );

};

//
//	Extension
//

THREE.SEA3D.EXTENSIONS_LOADER.push( {

	setTypeRead: function () {

		this.file.addClass( SEA3D.GeometryDraco, true );
		this.file.addClass( SEA3D.GeometryUpdateDraco, true );

		this.file.typeRead[ SEA3D.GeometryDraco.prototype.type ] = this.readGeometryBuffer;
		this.file.typeRead[ SEA3D.GeometryUpdateDraco.prototype.type ] = this.readGeometryUpdateDraco;

	}

} );
