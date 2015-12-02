/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ColladaLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ColladaLoader.prototype = {

	constructor: THREE.ColladaLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		function getBaseUrl( url ) {

			var parts = url.split( '/' );
			parts.pop();
			return ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';

		}

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text, getBaseUrl( url ) ) );

		}, onProgress, onError );

	},

	options: {

		set convertUpAxis ( value ) {

			console.log( 'ColladaLoder.options.convertUpAxis: TODO' );

		}

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( text, baseUrl ) {

		function getElementsByTagName( xml, name ) {

			// Non recursive xml.getElementsByTagName() ...

			var array = [];
			var childNodes = xml.childNodes;

			for ( var i = 0, l = childNodes.length; i < l; i ++ ) {

				var child = childNodes[ i ];

				if ( child.nodeName === name ) {

					array.push( child );

				}

			}

			return array;

		}

		function parseFloats( text ) {

			var parts = text.trim().split( /\s+/ );
			var array = new Array( parts.length );

			for ( var i = 0, l = parts.length; i < l; i ++ ) {

				array[ i ] = parseFloat( parts[ i ] );

			}

			return array;

		}

		function parseInts( text ) {

			var parts = text.trim().split( /\s+/ );
			var array = new Array( parts.length );

			for ( var i = 0, l = parts.length; i < l; i ++ ) {

				array[ i ] = parseInt( parts[ i ] );

			}

			return array;

		}

		function parseId( text ) {

			return text.substring( 1 );

		}

		// asset

		function parseAsset( xml ) {

			return {
				upAxis: parseAssetUpAxis( getElementsByTagName( xml, 'up_axis' )[ 0 ] )
			};

		}

		function parseAssetUpAxis( xml ) {

			return xml !== undefined ? xml.textContent : 'Y_UP';

		}

		// library

		function parseLibrary( xml, data, libraryName, nodeName, parser ) {

			var library = getElementsByTagName( xml, libraryName )[ 0 ];

			if ( library !== undefined ) {

				var elements = getElementsByTagName( library, nodeName );

				for ( var i = 0; i < elements.length; i ++ ) {

					parser( elements[ i ] );

				}

			}

		}

		function buildLibrary( data, builder ) {

			for ( var name in data ) {

				var object = data[ name ];
				object.build = builder( data[ name ] );

			}

		}

		// get

		function getBuild( data, builder ) {

			if ( data.build !== undefined ) return data.build;

			data.build = builder( data );

			return data.build;

		}

		// image

		var imageLoader = new THREE.ImageLoader();

		function parseImage( xml ) {

			var data = {
				url: getElementsByTagName( xml, 'init_from' )[ 0 ].textContent
			};

			library.images[ xml.getAttribute( 'id' ) ] = data;

		}

		function buildImage( data ) {

			if ( data.build !== undefined ) return data.build;

			var url = data.url;

			if ( baseUrl !== undefined ) url = baseUrl + url;

			return imageLoader.load( url );

		}

		function getImage( id ) {

			return getBuild( library.images[ id ], buildImage );

		}

		// effect

		function parseEffect( xml ) {

		}

		function buildEffect( data ) {

		}

		function getEffect( id ) {

			return getBuild( library.effects[ id ], buildEffect );

		}

		// camera

		function parseCamera( xml ) {

			var data = {
				name: xml.getAttribute( 'name' )
			};

			library.cameras[ xml.getAttribute( 'id' ) ] = {};

		}

		function buildCamera( data ) {

			var camera = new THREE.PerspectiveCamera();
			camera.name = data.name;

			return camera;

		}

		function getCamera( id ) {

			return getBuild( library.cameras[ id ], buildCamera );

		}

		// light

		function parseLight( xml ) {

			var data = {};

			for ( var i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				var child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'technique_common':
						data = parseLightTechnique( child );
						break;

				}

			}

			library.lights[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseLightTechnique( xml ) {

			var data = {};

			for ( var i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				var child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'directional':
					case 'point':
					case 'spot':
					case 'ambient':

						data.technique = child.nodeName;
						data.parameters = parseLightParameters( child );

				}

			}

			return data;

		}

		function parseLightParameters( xml ) {

			var data = {};

			for ( var i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				var child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'color':
						var array = parseFloats( child.textContent );
						data.color = new THREE.Color().fromArray( array );
						break;

					case 'falloff_angle':
						data.falloffAngle = parseFloat( child.textContent );
						break;

					case 'quadratic_attenuation':
						var f = parseFloat( child.textContent );
						data.distance = f ? Math.sqrt( 1 / f ) : 0;
						break;

				}

			}

			return data;

		}

		function buildLight( data ) {

			var light;

			switch ( data.technique ) {

				case 'directional':
					light = new THREE.DirectionalLight();
					break;

				case 'point':
					light = new THREE.PointLight();
					break;

				case 'spot':
					light = new THREE.SpotLight();
					break;

				case 'ambient':
					light = new THREE.AmbientLight();
					break;

			}

			if ( data.parameters.color ) light.color.copy( data.parameters.color );
			if ( data.parameters.distance ) light.distance = data.parameters.distance;

			return light;

		}

		function getLight( id ) {

			return getBuild( library.lights[ id ], buildLight );

		}

		// geometry

		function parseSource( xml ) {

			var data = {
				array: [],
				stride: 3
			};

			for ( var i = 0; i < xml.childNodes.length; i ++ ) {

				var child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'float_array':
						data.array = parseFloats( child.textContent );
						break;

					case 'technique_common':
						var accessor = getElementsByTagName( child, 'accessor' )[ 0 ];

						if ( accessor !== undefined ) {

							data.stride = parseInt( accessor.getAttribute( 'stride' ) );

						}
						break;

					default:
						console.log( child );

				}

			}

			return data;

		}

		function parseGeometry( xml ) {

			var data = {
				name: xml.getAttribute( 'name' ),
				sources: {},
				primitives: []
			};

			var mesh = getElementsByTagName( xml, 'mesh' )[ 0 ];

			for ( var i = 0; i < mesh.childNodes.length; i ++ ) {

				var child = mesh.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				var id = child.getAttribute( 'id' );

				switch ( child.nodeName ) {

					case 'source':
						data.sources[ id ] = parseSource( child );
						break;

					case 'vertices':
						data.sources[ id ] = data.sources[ parseId( getElementsByTagName( child, 'input' )[ 0 ].getAttribute( 'source' ) ) ];
						break;

					case 'polygons':
						console.log( 'ColladaLoader: Unsupported primitive type: ', child.nodeName );
						break;

					case 'lines':
					case 'linestrips':
					case 'polylist':
					case 'triangles':
						data.primitives.push( parseGeometryPrimitive( child ) );
						break;

					default:
						console.log( child );

				}

			}

			library.geometries[ xml.getAttribute( 'id' ) ] = data;

		}

		function parseGeometryPrimitive( xml ) {

			var primitive = {
				type: xml.nodeName,
				inputs: {},
				stride: 0
			};

			for ( var i = 0, l = xml.childNodes.length; i < l; i ++ ) {

				var child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'input':
						var id = parseId( child.getAttribute( 'source' ) );
						var semantic = child.getAttribute( 'semantic' );
						var offset = parseInt( child.getAttribute( 'offset' ) );
						primitive.inputs[ semantic ] = { id: id, offset: offset };
						primitive.stride = Math.max( primitive.stride, offset + 1 );
						break;

					case 'vcount':
						primitive.vcount = parseInts( child.textContent );
						break;

					case 'p':
						primitive.p = parseInts( child.textContent );
						break;

				}

			}

			return primitive;

		}

		var DEFAULT_MATERIAL = new THREE.MeshPhongMaterial();

		function buildGeometry( data ) {

			var group = new THREE.Group();

			var sources = data.sources;
			var primitives = data.primitives;

			if ( primitives.length === 0 ) return group;

			for ( var p = 0; p < primitives.length; p ++ ) {

				var primitive = primitives[ p ];

				var inputs = primitive.inputs;
				var stride = primitive.stride;
				var vcount = primitive.vcount;

				var indices = primitive.p;
				var vcount = primitive.vcount;

				var maxcount = 0;

				var geometry = new THREE.BufferGeometry();
				if ( data.name ) geometry.name = data.name;

				for ( var name in inputs ) {

					var input = inputs[ name ];

					var source = sources[ input.id ];
					var sourceArray = source.array;
					var sourceStride = source.stride;

					var offset = input.offset;

					var array = [];

					function pushVector( i ) {

						var index = indices[ i + offset ] * sourceStride;

						if ( asset.upAxis === 'Z_UP' ) {

							array.push( sourceArray[ index + 0 ], sourceArray[ index + 2 ], - sourceArray[ index + 1 ] );

						} else {

							array.push( sourceArray[ index + 0 ], sourceArray[ index + 1 ], sourceArray[ index + 2 ] );

						}

					}

					if ( primitive.vcount !== undefined ) {

						var index = 0;

						for ( var i = 0, l = vcount.length; i < l; i ++ ) {

							var count = vcount[ i ];

							if ( count === 4 ) {

								var a = index + stride * 0;
								var b = index + stride * 1;
								var c = index + stride * 2;
								var d = index + stride * 3;

								pushVector( a ); pushVector( b ); pushVector( d );
								pushVector( b ); pushVector( c ); pushVector( d );

							} else if ( count === 3 ) {

								var a = index + stride * 0;
								var b = index + stride * 1;
								var c = index + stride * 2;

								pushVector( a ); pushVector( b ); pushVector( c );

							} else {

								maxcount = Math.max( maxcount, count );

							}

							index += stride * count;

						}

					} else {

						for ( var i = 0, l = indices.length; i < l; i += stride ) {

							pushVector( i );

						}

					}

					switch ( name )	{

						case 'VERTEX':
							geometry.addAttribute( 'position', new THREE.Float32Attribute( array, 3 ) );
							break;

						case 'COLOR':
							geometry.addAttribute( 'color', new THREE.Float32Attribute( array, 3 ) );
							break;

						case 'NORMAL':
							geometry.addAttribute( 'normal', new THREE.Float32Attribute( array, 3 ) );
							break;

					}

				}

				if ( maxcount > 0 ) {

					console.log( 'ColladaLoader: Geometry', data.id, 'has faces with more than 4 vertices.' );

				}

				switch ( primitive.type ) {

					case 'lines':
						group.add( new THREE.LineSegments( geometry ) );
						break;

					case 'linestrips':
						group.add( new THREE.Line( geometry ) );
						break;

					case 'triangles':
					case 'polylist':
						var material = DEFAULT_MATERIAL;
						if ( geometry.attributes.color !== undefined ) {

							// Temporal Workaround for EXTW models

							material = new THREE.MeshBasicMaterial( {
								vertexColors: THREE.VertexColors
							} );

						}
						group.add( new THREE.Mesh( geometry, material ) );
						break;

				}

			}

			// flatten

			if ( group.children.length === 1 ) {

				return group.children[ 0 ];

			}

			return group;

		}

		function getGeometry( id ) {

			return getBuild( library.geometries[ id ], buildGeometry );

		}

		// nodes

		var matrix = new THREE.Matrix4();
		var vector = new THREE.Vector3();

		function parseNode( xml ) {

			var data = {
				name: xml.getAttribute( 'name' ),
				matrix: new THREE.Matrix4(),
				nodes: [],
				instanceCameras: [],
				instanceLights: [],
				instanceGeometries: [],
				instanceNodes: []
			};

			for ( var i = 0; i < xml.childNodes.length; i ++ ) {

				var child = xml.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'node':
						parseNode( child );
						data.nodes.push( child.getAttribute( 'id' ) );
						break;

					case 'instance_camera':
						data.instanceCameras.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_light':
						data.instanceLights.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_geometry':
						data.instanceGeometries.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'instance_node':
						data.instanceNodes.push( parseId( child.getAttribute( 'url' ) ) );
						break;

					case 'matrix':
						var array = parseFloats( child.textContent );
						data.matrix.multiply( matrix.fromArray( array ).transpose() ); // .transpose() when Z_UP?
						break;

					case 'translate':
						var array = parseFloats( child.textContent );
						vector.fromArray( array );
						data.matrix.multiply( matrix.makeTranslation( vector.x, vector.y, vector.z ) );
						break;

					case 'rotate':
						var array = parseFloats( child.textContent );
						var angle = THREE.Math.degToRad( array[ 3 ] );
						data.matrix.multiply( matrix.makeRotationAxis( vector.fromArray( array ), angle ) );
						break;

					case 'scale':
						var array = parseFloats( child.textContent );
						data.matrix.scale( vector.fromArray( array ) );
						break;

					case 'extra':
						break;

					default:
						console.log( child );

				}

			}

			if ( xml.getAttribute( 'id' ) !== null ) {

				library.nodes[ xml.getAttribute( 'id' ) ] = data;

			}

			return data;

		}

		function buildNode( data ) {

			var objects = [];

			var matrix = data.matrix;
			var nodes = data.nodes;
			var instanceCameras = data.instanceCameras;
			var instanceLights = data.instanceLights;
			var instanceGeometries = data.instanceGeometries;
			var instanceNodes = data.instanceNodes;

			for ( var i = 0, l = nodes.length; i < l; i ++ ) {

				objects.push( getNode( nodes[ i ] ).clone() );

			}

			for ( var i = 0, l = instanceCameras.length; i < l; i ++ ) {

				objects.push( getCamera( instanceCameras[ i ] ).clone() );

			}

			for ( var i = 0, l = instanceLights.length; i < l; i ++ ) {

				objects.push( getLight( instanceLights[ i ] ).clone() );

			}

			for ( var i = 0, l = instanceGeometries.length; i < l; i ++ ) {

				objects.push( getGeometry( instanceGeometries[ i ] ).clone() );

			}

			for ( var i = 0, l = instanceNodes.length; i < l; i ++ ) {

				objects.push( getNode( instanceNodes[ i ] ).clone() );

			}

			var object;

			if ( objects.length === 1 ) {

				object = objects[ 0 ];

			} else {

				object = new THREE.Group();

				for ( var i = 0; i < objects.length; i ++ ) {

					object.add( objects[ i ] );

				}

			}

			object.name = data.name;
			matrix.decompose( object.position, object.quaternion, object.scale );

			return object;

		}

		function getNode( id ) {

			return getBuild( library.nodes[ id ], buildNode );

		}

		// visual scenes

		function parseVisualScene( xml ) {

			var data = {
				name: xml.getAttribute( 'name' ),
				children: []
			};

			var elements = getElementsByTagName( xml, 'node' );

			for ( var i = 0; i < elements.length; i ++ ) {

				data.children.push( parseNode( elements[ i ] ) );

			}

			library.visualScenes[ xml.getAttribute( 'id' ) ] = data;

		}

		function buildVisualScene( data ) {

			var group = new THREE.Group();
			group.name = data.name;

			var children = data.children;

			for ( var i = 0; i < children.length; i ++ ) {

				group.add( buildNode( children[ i ] ) );

			}

			return group;

		}

		function getVisualScene( id ) {

			return getBuild( library.visualScenes[ id ], buildVisualScene );

		}

		// scenes

		function parseScene( xml ) {

			var instance = getElementsByTagName( xml, 'instance_visual_scene' )[ 0 ];
			return getVisualScene( parseId( instance.getAttribute( 'url' ) ) );

		}

		console.time( 'ColladaLoader' );

		console.time( 'ColladaLoader: DOMParser' );

		var xml = new DOMParser().parseFromString( text, 'application/xml' );

		console.timeEnd( 'ColladaLoader: DOMParser' );

		var collada = getElementsByTagName( xml, 'COLLADA' )[ 0 ];

		// metadata

		var version = collada.getAttribute( 'version' );
		console.log( 'ColladaLoader: File version', version );

		var asset = parseAsset( getElementsByTagName( collada, 'asset' )[ 0 ] );

		//

		var library = {
			images: {},
			// effects: {},
			cameras: {},
			lights: {},
			geometries: {},
			nodes: {},
			visualScenes: {}
		};

		console.time( 'ColladaLoader: Parse' );

		parseLibrary( collada, library.images, 'library_images', 'image', parseImage );
		// parseLibrary( collada, library.effects, 'library_effects', 'effect', parseEffect );
		parseLibrary( collada, library.cameras, 'library_cameras', 'camera', parseCamera );
		parseLibrary( collada, library.lights, 'library_lights', 'light', parseLight );
		parseLibrary( collada, library.geometries, 'library_geometries', 'geometry', parseGeometry );
		parseLibrary( collada, library.nodes, 'library_nodes', 'node', parseNode );
		parseLibrary( collada, library.visualScenes, 'library_visual_scenes', 'visual_scene', parseVisualScene );

		console.timeEnd( 'ColladaLoader: Parse' );

		console.time( 'ColladaLoader: Build' );

		// buildLibrary( library.images, buildImage );
		// buildLibrary( library.effects, buildEffect );
		buildLibrary( library.cameras, buildCamera );
		buildLibrary( library.lights, buildLight );
		buildLibrary( library.geometries, buildGeometry );
		buildLibrary( library.nodes, buildNode );
		buildLibrary( library.visualScenes, buildVisualScene );

		console.timeEnd( 'ColladaLoader: Build' );

		// console.log( library );

		var scene = parseScene( getElementsByTagName( collada, 'scene' )[ 0 ] );

		console.timeEnd( 'ColladaLoader' );

		// console.log( scene );

		return {
			animations: [],
			kinematics: { joints: [] },
			scene: scene
		};

	}

};
