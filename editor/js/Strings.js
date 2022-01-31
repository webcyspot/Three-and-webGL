function Strings( config ) {

	const language = config.getKey( 'language' );

	const values = {

		en: {

			'menubar/file': 'File',
			'menubar/file/new': 'New',
			'menubar/file/import': 'Import',
			'menubar/file/export/geometry': 'Export Geometry',
			'menubar/file/export/object': 'Export Object',
			'menubar/file/export/scene': 'Export Scene',
			'menubar/file/export/dae': 'Export DAE',
			'menubar/file/export/drc': 'Export DRC',
			'menubar/file/export/glb': 'Export GLB',
			'menubar/file/export/gltf': 'Export GLTF',
			'menubar/file/export/obj': 'Export OBJ',
			'menubar/file/export/ply': 'Export PLY',
			'menubar/file/export/ply_binary': 'Export PLY (Binary)',
			'menubar/file/export/stl': 'Export STL',
			'menubar/file/export/stl_binary': 'Export STL (Binary)',
			'menubar/file/export/usdz': 'Export USDZ',
			'menubar/file/publish': 'Publish',

			'menubar/edit': 'Edit',
			'menubar/edit/undo': 'Undo (Ctrl+Z)',
			'menubar/edit/redo': 'Redo (Ctrl+Shift+Z)',
			'menubar/edit/clear_history': 'Clear History',
			'menubar/edit/center': 'Center',
			'menubar/edit/clone': 'Clone',
			'menubar/edit/delete': 'Delete (Del)',
			'menubar/edit/fixcolormaps': 'Fix Color Maps',

			'menubar/add': 'Add',
			'menubar/add/group': 'Group',
			'menubar/add/plane': 'Plane',
			'menubar/add/box': 'Box',
			'menubar/add/circle': 'Circle',
			'menubar/add/cylinder': 'Cylinder',
			'menubar/add/ring': 'Ring',
			'menubar/add/sphere': 'Sphere',
			'menubar/add/dodecahedron': 'Dodecahedron',
			'menubar/add/icosahedron': 'Icosahedron',
			'menubar/add/octahedron': 'Octahedron',
			'menubar/add/tetrahedron': 'Tetrahedron',
			'menubar/add/torus': 'Torus',
			'menubar/add/tube': 'Tube',
			'menubar/add/torusknot': 'TorusKnot',
			'menubar/add/lathe': 'Lathe',
			'menubar/add/sprite': 'Sprite',
			'menubar/add/pointlight': 'PointLight',
			'menubar/add/spotlight': 'SpotLight',
			'menubar/add/directionallight': 'DirectionalLight',
			'menubar/add/hemispherelight': 'HemisphereLight',
			'menubar/add/ambientlight': 'AmbientLight',
			'menubar/add/perspectivecamera': 'PerspectiveCamera',
			'menubar/add/orthographiccamera': 'OrthographicCamera',

			'menubar/status/autosave': 'autosave',

			'menubar/play': 'Play',
			'menubar/play/stop': 'Stop',
			'menubar/play/play': 'Play',

			'menubar/examples': 'Examples',
			'menubar/examples/Arkanoid': 'Arkanoid',
			'menubar/examples/Camera': 'Camera',
			'menubar/examples/Particles': 'Particles',
			'menubar/examples/Pong': 'Pong',
			'menubar/examples/Shaders': 'Shaders',

			'menubar/view': 'View',
			'menubar/view/fullscreen': 'Fullscreen',

			'menubar/help': 'Help',
			'menubar/help/source_code': 'Source Code',
			'menubar/help/icons': 'Icon Pack',
			'menubar/help/about': 'About',
			'menubar/help/manual': 'Manual',

			'sidebar/animations': 'Animations',
			'sidebar/animations/play': 'Play',
			'sidebar/animations/stop': 'Stop',
			'sidebar/animations/timescale': 'Time Scale',

			'sidebar/scene': 'Scene',
			'sidebar/scene/background': 'Background',
			'sidebar/scene/environment': 'Environment',
			'sidebar/scene/fog': 'Fog',

			'sidebar/properties/object': 'Object',
			'sidebar/properties/geometry': 'Geometry',
			'sidebar/properties/material': 'Material',
			'sidebar/properties/script': 'Script',

			'sidebar/object/type': 'Type',
			'sidebar/object/new': 'New',
			'sidebar/object/uuid': 'UUID',
			'sidebar/object/name': 'Name',
			'sidebar/object/position': 'Position',
			'sidebar/object/rotation': 'Rotation',
			'sidebar/object/scale': 'Scale',
			'sidebar/object/fov': 'Fov',
			'sidebar/object/left': 'Left',
			'sidebar/object/right': 'Right',
			'sidebar/object/top': 'Top',
			'sidebar/object/bottom': 'Bottom',
			'sidebar/object/near': 'Near',
			'sidebar/object/far': 'Far',
			'sidebar/object/intensity': 'Intensity',
			'sidebar/object/color': 'Color',
			'sidebar/object/groundcolor': 'Ground Color',
			'sidebar/object/distance': 'Distance',
			'sidebar/object/angle': 'Angle',
			'sidebar/object/penumbra': 'Penumbra',
			'sidebar/object/decay': 'Decay',
			'sidebar/object/shadow': 'Shadow',
			'sidebar/object/shadowBias': 'Shadow Bias',
			'sidebar/object/shadowNormalBias': 'Shadow Normal Bias',
			'sidebar/object/shadowRadius': 'Shadow Radius',
			'sidebar/object/cast': 'cast',
			'sidebar/object/receive': 'receive',
			'sidebar/object/visible': 'Visible',
			'sidebar/object/frustumcull': 'Frustum Cull',
			'sidebar/object/renderorder': 'Render Order',
			'sidebar/object/userdata': 'User data',

			'sidebar/geometry/type': 'Type',
			'sidebar/geometry/new': 'New',
			'sidebar/geometry/uuid': 'UUID',
			'sidebar/geometry/name': 'Name',
			'sidebar/geometry/bounds': 'Bounds',
			'sidebar/geometry/show_vertex_normals': 'Show Vertex Normals',

			'sidebar/geometry/box_geometry/width': 'Width',
			'sidebar/geometry/box_geometry/height': 'Height',
			'sidebar/geometry/box_geometry/depth': 'Depth',
			'sidebar/geometry/box_geometry/widthseg': 'Width Seg',
			'sidebar/geometry/box_geometry/heightseg': 'Height Seg',
			'sidebar/geometry/box_geometry/depthseg': 'Depth Seg',

			'sidebar/geometry/buffer_geometry/attributes': 'Attributes',
			'sidebar/geometry/buffer_geometry/index': 'index',

			'sidebar/geometry/circle_geometry/radius': 'Radius',
			'sidebar/geometry/circle_geometry/segments': 'Segments',
			'sidebar/geometry/circle_geometry/thetastart': 'Theta start',
			'sidebar/geometry/circle_geometry/thetalength': 'Theta length',

			'sidebar/geometry/cylinder_geometry/radiustop': 'Radius top',
			'sidebar/geometry/cylinder_geometry/radiusbottom': 'Radius bottom',
			'sidebar/geometry/cylinder_geometry/height': 'Height',
			'sidebar/geometry/cylinder_geometry/radialsegments': 'Radial segments',
			'sidebar/geometry/cylinder_geometry/heightsegments': 'Height segments',
			'sidebar/geometry/cylinder_geometry/openended': 'Open ended',

			'sidebar/geometry/extrude_geometry/curveSegments': 'Curve Segments',
			'sidebar/geometry/extrude_geometry/steps': 'Steps',
			'sidebar/geometry/extrude_geometry/depth': 'Depth',
			'sidebar/geometry/extrude_geometry/bevelEnabled': 'Bevel?',
			'sidebar/geometry/extrude_geometry/bevelThickness': 'Thickness',
			'sidebar/geometry/extrude_geometry/bevelSize': 'Size',
			'sidebar/geometry/extrude_geometry/bevelOffset': 'Offset',
			'sidebar/geometry/extrude_geometry/bevelSegments': 'Segments',
			'sidebar/geometry/extrude_geometry/shape': 'Convert to Shape',

			'sidebar/geometry/dodecahedron_geometry/radius': 'Radius',
			'sidebar/geometry/dodecahedron_geometry/detail': 'Detail',

			'sidebar/geometry/icosahedron_geometry/radius': 'Radius',
			'sidebar/geometry/icosahedron_geometry/detail': 'Detail',

			'sidebar/geometry/octahedron_geometry/radius': 'Radius',
			'sidebar/geometry/octahedron_geometry/detail': 'Detail',

			'sidebar/geometry/tetrahedron_geometry/radius': 'Radius',
			'sidebar/geometry/tetrahedron_geometry/detail': 'Detail',

			'sidebar/geometry/lathe_geometry/segments': 'Segments',
			'sidebar/geometry/lathe_geometry/phistart': 'Phi start (°)',
			'sidebar/geometry/lathe_geometry/philength': 'Phi length (°)',
			'sidebar/geometry/lathe_geometry/points': 'Points',

			'sidebar/geometry/plane_geometry/width': 'Width',
			'sidebar/geometry/plane_geometry/height': 'Height',
			'sidebar/geometry/plane_geometry/widthsegments': 'Width segments',
			'sidebar/geometry/plane_geometry/heightsegments': 'Height segments',

			'sidebar/geometry/ring_geometry/innerRadius': 'Inner radius',
			'sidebar/geometry/ring_geometry/outerRadius': 'Outer radius',
			'sidebar/geometry/ring_geometry/thetaSegments': 'Theta segments',
			'sidebar/geometry/ring_geometry/phiSegments': 'Phi segments',
			'sidebar/geometry/ring_geometry/thetastart': 'Theta start',
			'sidebar/geometry/ring_geometry/thetalength': 'Theta length',

			'sidebar/geometry/shape_geometry/curveSegments': 'Curve Segments',
			'sidebar/geometry/shape_geometry/extrude': 'Extrude',

			'sidebar/geometry/sphere_geometry/radius': 'Radius',
			'sidebar/geometry/sphere_geometry/widthsegments': 'Width segments',
			'sidebar/geometry/sphere_geometry/heightsegments': 'Height segments',
			'sidebar/geometry/sphere_geometry/phistart': 'Phi start',
			'sidebar/geometry/sphere_geometry/philength': 'Phi length',
			'sidebar/geometry/sphere_geometry/thetastart': 'Theta start',
			'sidebar/geometry/sphere_geometry/thetalength': 'Theta length',

			'sidebar/geometry/torus_geometry/radius': 'Radius',
			'sidebar/geometry/torus_geometry/tube': 'Tube',
			'sidebar/geometry/torus_geometry/radialsegments': 'Radial segments',
			'sidebar/geometry/torus_geometry/tubularsegments': 'Tubular segments',
			'sidebar/geometry/torus_geometry/arc': 'Arc',

			'sidebar/geometry/torusKnot_geometry/radius': 'Radius',
			'sidebar/geometry/torusKnot_geometry/tube': 'Tube',
			'sidebar/geometry/torusKnot_geometry/tubularsegments': 'Tubular segments',
			'sidebar/geometry/torusKnot_geometry/radialsegments': 'Radial segments',
			'sidebar/geometry/torusKnot_geometry/p': 'P',
			'sidebar/geometry/torusKnot_geometry/q': 'Q',

			'sidebar/geometry/tube_geometry/path': 'Path',
			'sidebar/geometry/tube_geometry/radius': 'Radius',
			'sidebar/geometry/tube_geometry/tube': 'Tube',
			'sidebar/geometry/tube_geometry/tubularsegments': 'Tubular segments',
			'sidebar/geometry/tube_geometry/radialsegments': 'Radial segments',
			'sidebar/geometry/tube_geometry/closed': 'Closed',
			'sidebar/geometry/tube_geometry/curvetype': 'Curve Type',
			'sidebar/geometry/tube_geometry/tension': 'Tension',

			'sidebar/material/new': 'New',
			'sidebar/material/copy': 'Copy',
			'sidebar/material/paste': 'Paste',
			'sidebar/material/slot': 'Slot',
			'sidebar/material/type': 'Type',
			'sidebar/material/uuid': 'UUID',
			'sidebar/material/name': 'Name',
			'sidebar/material/program': 'Program',
			'sidebar/material/info': 'Info',
			'sidebar/material/vertex': 'Vert',
			'sidebar/material/fragment': 'Frag',
			'sidebar/material/color': 'Color',
			'sidebar/material/depthPacking': 'Depth Packing',
			'sidebar/material/roughness': 'Roughness',
			'sidebar/material/metalness': 'Metalness',
			'sidebar/material/reflectivity': 'Reflectivity',
			'sidebar/material/emissive': 'Emissive',
			'sidebar/material/specular': 'Specular',
			'sidebar/material/shininess': 'Shininess',
			'sidebar/material/clearcoat': 'Clearcoat',
			'sidebar/material/clearcoatroughness': 'Clearcoat Roughness',
			'sidebar/material/transmission': 'Transmission',
			'sidebar/material/attenuationDistance': 'Attenuation Distance',
			'sidebar/material/attenuationColor': 'Attenuation Color',
			'sidebar/material/thickness': 'Thickness',
			'sidebar/material/vertexcolors': 'Vertex Colors',
			'sidebar/material/matcap': 'Matcap',
			'sidebar/material/map': 'Map',
			'sidebar/material/alphamap': 'Alpha Map',
			'sidebar/material/bumpmap': 'Bump Map',
			'sidebar/material/normalmap': 'Normal Map',
			'sidebar/material/clearcoatnormalmap': 'Clearcoat Normal Map',
			'sidebar/material/displacementmap': 'Displace Map',
			'sidebar/material/roughnessmap': 'Rough. Map',
			'sidebar/material/metalnessmap': 'Metal. Map',
			'sidebar/material/specularmap': 'Specular Map',
			'sidebar/material/envmap': 'Env Map',
			'sidebar/material/lightmap': 'Light Map',
			'sidebar/material/aomap': 'AO Map',
			'sidebar/material/emissivemap': 'Emissive Map',
			'sidebar/material/gradientmap': 'Gradient Map',
			'sidebar/material/side': 'Side',
			'sidebar/material/size': 'Size',
			'sidebar/material/sizeAttenuation': 'Size Attenuation',
			'sidebar/material/flatShading': 'Flat Shading',
			'sidebar/material/blending': 'Blending',
			'sidebar/material/opacity': 'Opacity',
			'sidebar/material/transparent': 'Transparent',
			'sidebar/material/alphatest': 'Alpha Test',
			'sidebar/material/depthtest': 'Depth Test',
			'sidebar/material/depthwrite': 'Depth Write',
			'sidebar/material/wireframe': 'Wireframe',

			'sidebar/script': 'Script',
			'sidebar/script/new': 'New',
			'sidebar/script/edit': 'Edit',
			'sidebar/script/remove': 'Remove',

			'sidebar/project': 'Project',
			'sidebar/project/title': 'Title',
			'sidebar/project/editable': 'Editable',
			'sidebar/project/vr': 'VR',
			'sidebar/project/renderer': 'Renderer',
			'sidebar/project/antialias': 'Antialias',
			'sidebar/project/shadows': 'Shadows',
			'sidebar/project/physicallyCorrectLights': 'Physical lights',
			'sidebar/project/toneMapping': 'Tone mapping',
			'sidebar/project/materials': 'Materials',
			'sidebar/project/Assign': 'Assign',

			'sidebar/project/video': 'Video',
			'sidebar/project/resolution': 'Resolution',
			'sidebar/project/duration': 'Duration',
			'sidebar/project/render': 'Render',

			'sidebar/settings': 'Settings',
			'sidebar/settings/language': 'Language',

			'sidebar/settings/shortcuts': 'Shortcuts',
			'sidebar/settings/shortcuts/translate': 'Translate',
			'sidebar/settings/shortcuts/rotate': 'Rotate',
			'sidebar/settings/shortcuts/scale': 'Scale',
			'sidebar/settings/shortcuts/undo': 'Undo',
			'sidebar/settings/shortcuts/focus': 'Focus',

			'sidebar/settings/viewport': 'Viewport',
			'sidebar/settings/viewport/grid': 'Grid',
			'sidebar/settings/viewport/helpers': 'Helpers',

			'sidebar/history': 'History',
			'sidebar/history/persistent': 'persistent',

			'toolbar/translate': 'Translate',
			'toolbar/rotate': 'Rotate',
			'toolbar/scale': 'Scale',
			'toolbar/local': 'Local',

			'viewport/info/objects': 'Objects',
			'viewport/info/vertices': 'Vertices',
			'viewport/info/triangles': 'Triangles',
			'viewport/info/frametime': 'Frametime'

		},

		fr: {

			'menubar/file': 'Fichier',
			'menubar/file/new': 'Nouveau',
			'menubar/file/import': 'Importer',
			'menubar/file/export/geometry': 'Exporter Geometrie',
			'menubar/file/export/object': 'Exporter Objet',
			'menubar/file/export/scene': 'Exporter Scene',
			'menubar/file/export/dae': 'Exporter DAE',
			'menubar/file/export/drc': 'Exporter DRC',
			'menubar/file/export/glb': 'Exporter GLB',
			'menubar/file/export/gltf': 'Exporter GLTF',
			'menubar/file/export/obj': 'Exporter OBJ',
			'menubar/file/export/ply': 'Exporer PLY',
			'menubar/file/export/ply_binary': 'Exporter PLY (Binaire)',
			'menubar/file/export/stl': 'Exporter STL',
			'menubar/file/export/stl_binary': 'Exporter STL (Binaire)',
			'menubar/file/export/usdz': 'Exporter USDZ',
			'menubar/file/publish': 'Publier',

			'menubar/edit': 'Edition',
			'menubar/edit/undo': 'Annuler (Ctrl+Z)',
			'menubar/edit/redo': 'Refaire (Ctrl+Shift+Z)',
			'menubar/edit/clear_history': 'Supprimer Historique',
			'menubar/edit/center': 'Center',
			'menubar/edit/clone': 'Cloner',
			'menubar/edit/delete': 'Supprimer (Supp)',
			'menubar/edit/fixcolormaps': 'Correction des couleurs',

			'menubar/add': 'Ajouter',
			'menubar/add/group': 'Groupe',
			'menubar/add/plane': 'Plan',
			'menubar/add/box': 'Cube',
			'menubar/add/circle': 'Cercle',
			'menubar/add/cylinder': 'Cylindre',
			'menubar/add/ring': 'Bague',
			'menubar/add/sphere': 'Sphère',
			'menubar/add/dodecahedron': 'Dodécaèdre',
			'menubar/add/icosahedron': 'Icosaèdre',
			'menubar/add/octahedron': 'Octaèdre',
			'menubar/add/tetrahedron': 'Tétraèdre',
			'menubar/add/torus': 'Torus',
			'menubar/add/tube': 'Tube',
			'menubar/add/torusknot': 'Noeud Torus',
			'menubar/add/lathe': 'Tour',
			'menubar/add/sprite': 'Sprite',
			'menubar/add/pointlight': 'Lumière ponctuelle',
			'menubar/add/spotlight': 'Projecteur',
			'menubar/add/directionallight': 'Lumière directionnelle',
			'menubar/add/hemispherelight': 'Lumière hémisphérique',
			'menubar/add/ambientlight': 'Lumière ambiante',
			'menubar/add/perspectivecamera': 'Caméra perspective',
			'menubar/add/orthographiccamera': 'Caméra orthographique',

			'menubar/status/autosave': 'enregistrement automatique',

			'menubar/play': 'Jouer',
			'menubar/play/stop': 'Arrêter',
			'menubar/play/play': 'Jouer',

			'menubar/examples': 'Exemples',
			'menubar/examples/Arkanoid': 'Arkanoid',
			'menubar/examples/Camera': 'Camera',
			'menubar/examples/Particles': 'Particles',
			'menubar/examples/Pong': 'Pong',
			'menubar/examples/Shaders': 'Shaders',

			'menubar/view': 'View',
			'menubar/view/fullscreen': 'Fullscreen',

			'menubar/help': 'Aide',
			'menubar/help/source_code': 'Code Source',
			'menubar/help/icons': 'Icon Pack',
			'menubar/help/about': 'A propos',
			'menubar/help/manual': 'Manual',

			'sidebar/animations': 'Animations',
			'sidebar/animations/play': 'Play',
			'sidebar/animations/stop': 'Stop',
			'sidebar/animations/timescale': 'Time Scale',

			'sidebar/scene': 'Scène',
			'sidebar/scene/background': 'Arrière Plan',
			'sidebar/scene/environment': 'Environment',
			'sidebar/scene/fog': 'Brouillard',

			'sidebar/properties/object': 'Objet',
			'sidebar/properties/geometry': 'Géométrie',
			'sidebar/properties/material': 'Matériaux',
			'sidebar/properties/script': 'Script',

			'sidebar/object/type': 'Type',
			'sidebar/object/new': 'Nouveau',
			'sidebar/object/uuid': 'UUID',
			'sidebar/object/name': 'Nom',
			'sidebar/object/position': 'Position',
			'sidebar/object/rotation': 'Rotation',
			'sidebar/object/scale': 'Échelle',
			'sidebar/object/fov': 'Champ de vision',
			'sidebar/object/left': 'Gauche',
			'sidebar/object/right': 'Droite',
			'sidebar/object/top': 'Haut',
			'sidebar/object/bottom': 'Bas',
			'sidebar/object/near': 'Près',
			'sidebar/object/far': 'Loin',
			'sidebar/object/intensity': 'Intensité',
			'sidebar/object/color': 'Couleur',
			'sidebar/object/groundcolor': 'Couleur de fond',
			'sidebar/object/distance': 'Distance',
			'sidebar/object/angle': 'Angle',
			'sidebar/object/penumbra': 'Pénombre',
			'sidebar/object/decay': 'Affaiblissement',
			'sidebar/object/shadow': 'Ombre',
			'sidebar/object/shadowBias': 'Biais directionnel des ombres',
			'sidebar/object/shadowNormalBias': 'Shadow Normal Bias',
			'sidebar/object/shadowRadius': 'Rayon de l\'ombre',
			'sidebar/object/cast': 'Projète',
			'sidebar/object/receive': 'Reçoit',
			'sidebar/object/visible': 'Visible',
			'sidebar/object/frustumcull': 'Culling',
			'sidebar/object/renderorder': 'Ordre de rendus',
			'sidebar/object/userdata': 'Données utilisateur',

			'sidebar/geometry/type': 'Type',
			'sidebar/geometry/new': 'Nouveau',
			'sidebar/geometry/uuid': 'UUID',
			'sidebar/geometry/name': 'Nom',
			'sidebar/geometry/bounds': 'Limites',
			'sidebar/geometry/show_vertex_normals': 'Afficher normales',

			'sidebar/geometry/box_geometry/width': 'Largeur',
			'sidebar/geometry/box_geometry/height': 'Hauteur',
			'sidebar/geometry/box_geometry/depth': 'Profondeur',
			'sidebar/geometry/box_geometry/widthseg': 'Segments en Largeur',
			'sidebar/geometry/box_geometry/heightseg': 'Segments en Hauteur',
			'sidebar/geometry/box_geometry/depthseg': 'Segments en Profondeur',

			'sidebar/geometry/buffer_geometry/attributes': 'Attributs',
			'sidebar/geometry/buffer_geometry/index': 'index',

			'sidebar/geometry/circle_geometry/radius': 'Rayon',
			'sidebar/geometry/circle_geometry/segments': 'Segments',
			'sidebar/geometry/circle_geometry/thetastart': 'Début Thêta (°)',
			'sidebar/geometry/circle_geometry/thetalength': 'Longueur Thêta (°)',

			'sidebar/geometry/cylinder_geometry/radiustop': 'Rayon supérieur',
			'sidebar/geometry/cylinder_geometry/radiusbottom': 'Rayon inférieur',
			'sidebar/geometry/cylinder_geometry/height': 'Hauteur',
			'sidebar/geometry/cylinder_geometry/radialsegments': 'Segments radiaux',
			'sidebar/geometry/cylinder_geometry/heightsegments': 'Segments en hauteur',
			'sidebar/geometry/cylinder_geometry/openended': 'Extrémités ouvertes',

			'sidebar/geometry/extrude_geometry/curveSegments': 'Segments de courbe',
			'sidebar/geometry/extrude_geometry/steps': 'Pas',
			'sidebar/geometry/extrude_geometry/depth': 'Profondeur',
			'sidebar/geometry/extrude_geometry/bevelEnabled': 'Biseau',
			'sidebar/geometry/extrude_geometry/bevelThickness': 'Épaisseur',
			'sidebar/geometry/extrude_geometry/bevelSize': 'Taille',
			'sidebar/geometry/extrude_geometry/bevelOffset': 'Décalage',
			'sidebar/geometry/extrude_geometry/bevelSegments': 'Segments',
			'sidebar/geometry/extrude_geometry/shape': 'Convertir en forme',

			'sidebar/geometry/dodecahedron_geometry/radius': 'Rayon',
			'sidebar/geometry/dodecahedron_geometry/detail': 'Détail',

			'sidebar/geometry/icosahedron_geometry/radius': 'Rayon',
			'sidebar/geometry/icosahedron_geometry/detail': 'Détail',

			'sidebar/geometry/octahedron_geometry/radius': 'Rayon',
			'sidebar/geometry/octahedron_geometry/detail': 'Détail',

			'sidebar/geometry/tetrahedron_geometry/radius': 'Rayon',
			'sidebar/geometry/tetrahedron_geometry/detail': 'Détail',

			'sidebar/geometry/lathe_geometry/segments': 'Segments',
			'sidebar/geometry/lathe_geometry/phistart': 'Début Phi (°)',
			'sidebar/geometry/lathe_geometry/philength': 'Longueur Phi (°)',
			'sidebar/geometry/lathe_geometry/points': 'Points',

			'sidebar/geometry/plane_geometry/width': 'Largeur',
			'sidebar/geometry/plane_geometry/height': 'Hauteur',
			'sidebar/geometry/plane_geometry/widthsegments': 'Segments en Largeur',
			'sidebar/geometry/plane_geometry/heightsegments': 'Segments en Hauteur',

			'sidebar/geometry/ring_geometry/innerRadius': 'Rayon intérieur',
			'sidebar/geometry/ring_geometry/outerRadius': 'Rayon extérieur',
			'sidebar/geometry/ring_geometry/thetaSegments': 'Segments Thêta',
			'sidebar/geometry/ring_geometry/phiSegments': 'Phi segments',
			'sidebar/geometry/ring_geometry/thetastart': 'Début Thêta',
			'sidebar/geometry/ring_geometry/thetalength': 'Longueur Thêta',

			'sidebar/geometry/shape_geometry/curveSegments': 'Segments de courbe',
			'sidebar/geometry/shape_geometry/extrude': 'Extruder',

			'sidebar/geometry/sphere_geometry/radius': 'Rayon',
			'sidebar/geometry/sphere_geometry/widthsegments': 'Segments en Largeur',
			'sidebar/geometry/sphere_geometry/heightsegments': 'Segments en Hauteur',
			'sidebar/geometry/sphere_geometry/phistart': 'Début Phi (°)',
			'sidebar/geometry/sphere_geometry/philength': 'Longueur Phi (°)',
			'sidebar/geometry/sphere_geometry/thetastart': 'Début Thêta',
			'sidebar/geometry/sphere_geometry/thetalength': 'Longueur Thêta',

			'sidebar/geometry/torus_geometry/radius': 'Rayon',
			'sidebar/geometry/torus_geometry/tube': 'Tube',
			'sidebar/geometry/torus_geometry/radialsegments': 'Segments radiaux',
			'sidebar/geometry/torus_geometry/tubularsegments': 'Segments tubulaires',
			'sidebar/geometry/torus_geometry/arc': 'Arc',

			'sidebar/geometry/torusKnot_geometry/radius': 'Rayon',
			'sidebar/geometry/torusKnot_geometry/tube': 'Tube',
			'sidebar/geometry/torusKnot_geometry/tubularsegments': 'Segments tubulaires',
			'sidebar/geometry/torusKnot_geometry/radialsegments': 'Segments radiaux',
			'sidebar/geometry/torusKnot_geometry/p': 'P',
			'sidebar/geometry/torusKnot_geometry/q': 'Q',

			'sidebar/geometry/tube_geometry/path': 'Chemin',
			'sidebar/geometry/tube_geometry/radius': 'Rayon',
			'sidebar/geometry/tube_geometry/tube': 'Tube',
			'sidebar/geometry/tube_geometry/tubularsegments': 'Segments tubulaires',
			'sidebar/geometry/tube_geometry/radialsegments': 'Segments radiaux',
			'sidebar/geometry/tube_geometry/closed': 'Fermé',
			'sidebar/geometry/tube_geometry/curvetype': 'Type de courbe',
			'sidebar/geometry/tube_geometry/tension': 'Tension',

			'sidebar/material/new': 'Nouveau',
			'sidebar/material/copy': 'Copier',
			'sidebar/material/paste': 'Coller',
			'sidebar/material/slot': 'Slot',
			'sidebar/material/type': 'Type',
			'sidebar/material/uuid': 'UUID',
			'sidebar/material/name': 'Nom',
			'sidebar/material/program': 'Programme',
			'sidebar/material/info': 'Info',
			'sidebar/material/vertex': 'Sommet',
			'sidebar/material/fragment': 'Fragment',
			'sidebar/material/color': 'Couleur',
			'sidebar/material/depthPacking': 'Encodage profondeur de couleur',
			'sidebar/material/roughness': 'Rugosité',
			'sidebar/material/metalness': 'Métal',
			'sidebar/material/reflectivity': 'Reflectivity',
			'sidebar/material/emissive': 'Émissif',
			'sidebar/material/specular': 'Spéculaire',
			'sidebar/material/shininess': 'Brillance',
			'sidebar/material/clearcoat': 'Vernis',
			'sidebar/material/clearcoatroughness': 'Rugosité du vernis',
			'sidebar/material/transmission': 'Transmission',
			'sidebar/material/attenuationDistance': 'Attenuation Distance',
			'sidebar/material/attenuationColor': 'Attenuation Color',
			'sidebar/material/thickness': 'Thickness',
			'sidebar/material/vertexcolors': 'Couleurs aux Sommets',
			'sidebar/material/matcap': 'Matcap',
			'sidebar/material/map': 'Texture',
			'sidebar/material/alphamap': 'Texture de transparence',
			'sidebar/material/bumpmap': 'Texture de relief',
			'sidebar/material/normalmap': 'Texture de normales',
			'sidebar/material/clearcoatnormalmap': 'Texture des normales du vernis',
			'sidebar/material/displacementmap': 'Texture de déplacement',
			'sidebar/material/roughnessmap': 'Texture de rugosité',
			'sidebar/material/metalnessmap': 'Texture métallique',
			'sidebar/material/specularmap': 'Texture spéculaire',
			'sidebar/material/envmap': 'Texture d\'environnement',
			'sidebar/material/lightmap': 'Texture d\'éclairage',
			'sidebar/material/aomap': 'Texture d\'occlusion ambiante',
			'sidebar/material/emissivemap': 'Texture d\'émission',
			'sidebar/material/gradientmap': 'Texture de gradient',
			'sidebar/material/side': 'Côté',
			'sidebar/material/size': 'Size',
			'sidebar/material/sizeAttenuation': 'Size Attenuation',
			'sidebar/material/flatShading': 'Flat Shading',
			'sidebar/material/blending': 'Mélange',
			'sidebar/material/opacity': 'Opacité',
			'sidebar/material/transparent': 'Transparence',
			'sidebar/material/alphatest': 'Test de transparence',
			'sidebar/material/depthtest': 'Depth Test',
			'sidebar/material/depthwrite': 'Depth Write',
			'sidebar/material/wireframe': 'Fil de fer',

			'sidebar/script': 'Script',
			'sidebar/script/new': 'Nouveau',
			'sidebar/script/edit': 'Editer',
			'sidebar/script/remove': 'Supprimer',

			'sidebar/project': 'Projet',
			'sidebar/project/title': 'Titre',
			'sidebar/project/editable': 'Modifiable',
			'sidebar/project/vr': 'VR',
			'sidebar/project/renderer': 'Rendus',
			'sidebar/project/antialias': 'Anticrénelage',
			'sidebar/project/shadows': 'Ombres',
			'sidebar/project/physicallyCorrectLights': 'Physical lights',
			'sidebar/project/toneMapping': 'Mappage des nuances',
			'sidebar/project/materials': 'Matériaux',
			'sidebar/project/Assign': 'Attribuer',

			'sidebar/project/video': 'Video',
			'sidebar/project/resolution': 'Resolution',
			'sidebar/project/duration': 'Duration',
			'sidebar/project/render': 'Render',

			'sidebar/settings': 'Paramètres',
			'sidebar/settings/language': 'Langue',

			'sidebar/settings/shortcuts': 'Shortcuts',
			'sidebar/settings/shortcuts/translate': 'Position',
			'sidebar/settings/shortcuts/rotate': 'Rotation',
			'sidebar/settings/shortcuts/scale': 'Échelle',
			'sidebar/settings/shortcuts/undo': 'Annuler',
			'sidebar/settings/shortcuts/focus': 'Focus',

			'sidebar/settings/viewport': 'Viewport',
			'sidebar/settings/viewport/grid': 'Grille',
			'sidebar/settings/viewport/helpers': 'Helpers',

			'sidebar/history': 'Historique',
			'sidebar/history/persistent': 'permanent',

			'toolbar/translate': 'Position',
			'toolbar/rotate': 'Rotation',
			'toolbar/scale': 'Échelle',
			'toolbar/local': 'Local',

			'viewport/info/objects': 'Objets',
			'viewport/info/vertices': 'Sommets',
			'viewport/info/triangles': 'Triangles',
			'viewport/info/frametime': 'Temps de trame'

		},

		zh: {

			'menubar/file': '文件',
			'menubar/file/new': '新建',
			'menubar/file/import': '导入',
			'menubar/file/export/geometry': '导出几何体',
			'menubar/file/export/object': '导出物体',
			'menubar/file/export/scene': '导出场景',
			'menubar/file/export/dae': '导出DAE',
			'menubar/file/export/drc': '导出DRC',
			'menubar/file/export/glb': '导出GLB',
			'menubar/file/export/gltf': '导出GLTF',
			'menubar/file/export/obj': '导出OBJ',
			'menubar/file/export/ply': '导出PLY',
			'menubar/file/export/ply_binary': '导出PLY(二进制)',
			'menubar/file/export/stl': '导出STL',
			'menubar/file/export/stl_binary': '导出STL(二进制)',
			'menubar/file/export/usdz': '导出USDZ',
			'menubar/file/publish': '发布',

			'menubar/edit': '编辑',
			'menubar/edit/undo': '撤销 (Ctrl+Z)',
			'menubar/edit/redo': '重做 (Ctrl+Shift+Z)',
			'menubar/edit/clear_history': '清空历史记录',
			'menubar/edit/center': '居中',
			'menubar/edit/clone': '拷贝',
			'menubar/edit/delete': '删除 (Del)',
			'menubar/edit/fixcolormaps': '修复颜色贴图',

			'menubar/add': '添加',
			'menubar/add/group': '组',
			'menubar/add/plane': '平面',
			'menubar/add/box': '正方体',
			'menubar/add/circle': '圆',
			'menubar/add/cylinder': '圆柱体',
			'menubar/add/ring': '环',
			'menubar/add/sphere': '球体',
			'menubar/add/dodecahedron': '十二面体',
			'menubar/add/icosahedron': '二十面体',
			'menubar/add/octahedron': '八面体',
			'menubar/add/tetrahedron': '四面体',
			'menubar/add/torus': '圆环体',
			'menubar/add/torusknot': '环面纽结体',
			'menubar/add/tube': '管',
			'menubar/add/lathe': '酒杯',
			'menubar/add/sprite': '精灵',
			'menubar/add/pointlight': '点光源',
			'menubar/add/spotlight': '聚光灯',
			'menubar/add/directionallight': '平行光',
			'menubar/add/hemispherelight': '半球光',
			'menubar/add/ambientlight': '环境光',
			'menubar/add/perspectivecamera': '透视相机',
			'menubar/add/orthographiccamera': '正交相机',

			'menubar/status/autosave': '自动保存',

			'menubar/play': '启动',
			'menubar/play/stop': '暂停',
			'menubar/play/play': '启动',

			'menubar/examples': '示例',
			'menubar/examples/Arkanoid': '打砖块',
			'menubar/examples/Camera': ' 摄像机',
			'menubar/examples/Particles': '粒子',
			'menubar/examples/Pong': '乒乓球',
			'menubar/examples/Shaders': '着色器',

			'menubar/view': '视图',
			'menubar/view/fullscreen': '全屏',

			'menubar/help': '帮助',
			'menubar/help/source_code': '源码',
			'menubar/help/icons': '图标组件包',
			'menubar/help/about': '关于',
			'menubar/help/manual': '手册',

			'sidebar/animations': '动画',
			'sidebar/animations/play': '播放',
			'sidebar/animations/stop': '暂停',
			'sidebar/animations/timescale': '时间缩放',

			'sidebar/scene': '场景',
			'sidebar/scene/background': '背景',
			'sidebar/scene/environment': '环境',
			'sidebar/scene/fog': '雾',

			'sidebar/properties/object': '属性',
			'sidebar/properties/geometry': '几何组件',
			'sidebar/properties/material': '材质组件',
			'sidebar/properties/script': '脚本',

			'sidebar/object/type': '类型',
			'sidebar/object/new': '更新',
			'sidebar/object/uuid': '识别码',
			'sidebar/object/name': '名称',
			'sidebar/object/position': '位置',
			'sidebar/object/rotation': '旋转',
			'sidebar/object/scale': '缩放',
			'sidebar/object/fov': '视角',
			'sidebar/object/left': '左',
			'sidebar/object/right': '右',
			'sidebar/object/top': '上',
			'sidebar/object/bottom': '下',
			'sidebar/object/near': '近点',
			'sidebar/object/far': '远点',
			'sidebar/object/intensity': '强度',
			'sidebar/object/color': '颜色',
			'sidebar/object/groundcolor': '基色',
			'sidebar/object/distance': '距离',
			'sidebar/object/angle': '角度',
			'sidebar/object/penumbra': '边缘',
			'sidebar/object/decay': '衰减',
			'sidebar/object/shadow': '阴影',
			'sidebar/object/shadowBias': '阴影偏移',
			'sidebar/object/shadowNormalBias': '阴影法线偏移',
			'sidebar/object/shadowRadius': '阴影半径',
			'sidebar/object/cast': '产生',
			'sidebar/object/receive': '接受',
			'sidebar/object/visible': '可见性',
			'sidebar/object/frustumcull': '视锥体裁剪',
			'sidebar/object/renderorder': '渲染次序',
			'sidebar/object/userdata': '自定义数据',

			'sidebar/geometry/type': '类型',
			'sidebar/geometry/new': '更新',
			'sidebar/geometry/uuid': '识别码',
			'sidebar/geometry/name': '名称',
			'sidebar/geometry/bounds': '界限',
			'sidebar/geometry/show_vertex_normals': '显示顶点法线',

			'sidebar/geometry/box_geometry/width': '宽度',
			'sidebar/geometry/box_geometry/height': '高度',
			'sidebar/geometry/box_geometry/depth': '深度',
			'sidebar/geometry/box_geometry/widthseg': '宽度分段',
			'sidebar/geometry/box_geometry/heightseg': '高度分段',
			'sidebar/geometry/box_geometry/depthseg': '深度分段',

			'sidebar/geometry/buffer_geometry/attributes': '属性',
			'sidebar/geometry/buffer_geometry/index': '索引',

			'sidebar/geometry/circle_geometry/radius': '半径',
			'sidebar/geometry/circle_geometry/segments': '分段',
			'sidebar/geometry/circle_geometry/thetastart': '弧度起点',
			'sidebar/geometry/circle_geometry/thetalength': '弧度长度',

			'sidebar/geometry/cylinder_geometry/radiustop': '顶部半径',
			'sidebar/geometry/cylinder_geometry/radiusbottom': '底部半径',
			'sidebar/geometry/cylinder_geometry/height': '高度',
			'sidebar/geometry/cylinder_geometry/radialsegments': '径向分段',
			'sidebar/geometry/cylinder_geometry/heightsegments': '高度分段',
			'sidebar/geometry/cylinder_geometry/openended': '开端',

			'sidebar/geometry/extrude_geometry/curveSegments': '曲线段',
			'sidebar/geometry/extrude_geometry/steps': '细分点数',
			'sidebar/geometry/extrude_geometry/depth': '深度',
			'sidebar/geometry/extrude_geometry/bevelEnabled': '启用斜角',
			'sidebar/geometry/extrude_geometry/bevelThickness': '斜角厚度',
			'sidebar/geometry/extrude_geometry/bevelSize': '斜角大小',
			'sidebar/geometry/extrude_geometry/bevelOffset': '斜角偏移量',
			'sidebar/geometry/extrude_geometry/bevelSegments': '斜角分段',
			'sidebar/geometry/extrude_geometry/shape': '转换图形',

			'sidebar/geometry/dodecahedron_geometry/radius': '半径',
			'sidebar/geometry/dodecahedron_geometry/detail': '面片分段',

			'sidebar/geometry/icosahedron_geometry/radius': '半径',
			'sidebar/geometry/icosahedron_geometry/detail': '面片分段',

			'sidebar/geometry/octahedron_geometry/radius': '半径',
			'sidebar/geometry/octahedron_geometry/detail': '面片分段',

			'sidebar/geometry/tetrahedron_geometry/radius': '半径',
			'sidebar/geometry/tetrahedron_geometry/detail': '面片分段',

			'sidebar/geometry/lathe_geometry/segments': '分段',
			'sidebar/geometry/lathe_geometry/phistart': '经度起点',
			'sidebar/geometry/lathe_geometry/philength': '经度长度',
			'sidebar/geometry/lathe_geometry/points': '点',

			'sidebar/geometry/plane_geometry/width': '宽度',
			'sidebar/geometry/plane_geometry/height': '长度',
			'sidebar/geometry/plane_geometry/widthsegments': '宽度分段',
			'sidebar/geometry/plane_geometry/heightsegments': '长度分段',

			'sidebar/geometry/ring_geometry/innerRadius': '内半径',
			'sidebar/geometry/ring_geometry/outerRadius': '外半径',
			'sidebar/geometry/ring_geometry/thetaSegments': '弧度分段',
			'sidebar/geometry/ring_geometry/phiSegments': '经度分段',
			'sidebar/geometry/ring_geometry/thetastart': '弧度起点',
			'sidebar/geometry/ring_geometry/thetalength': '弧度长度',

			'sidebar/geometry/shape_geometry/curveSegments': '曲线段',
			'sidebar/geometry/shape_geometry/extrude': '拉伸',

			'sidebar/geometry/sphere_geometry/radius': '半径',
			'sidebar/geometry/sphere_geometry/widthsegments': '宽度分段',
			'sidebar/geometry/sphere_geometry/heightsegments': '长度分段',
			'sidebar/geometry/sphere_geometry/phistart': '经度起点',
			'sidebar/geometry/sphere_geometry/philength': '经度长度',
			'sidebar/geometry/sphere_geometry/thetastart': '纬度起点',
			'sidebar/geometry/sphere_geometry/thetalength': '纬度长度',

			'sidebar/geometry/torus_geometry/radius': '半径',
			'sidebar/geometry/torus_geometry/tube': '管厚',
			'sidebar/geometry/torus_geometry/radialsegments': '半径分段',
			'sidebar/geometry/torus_geometry/tubularsegments': '管厚分段',
			'sidebar/geometry/torus_geometry/arc': '弧度',

			'sidebar/geometry/torusKnot_geometry/radius': '半径',
			'sidebar/geometry/torusKnot_geometry/tube': '管厚',
			'sidebar/geometry/torusKnot_geometry/tubularsegments': '管厚分段',
			'sidebar/geometry/torusKnot_geometry/radialsegments': '半径分段',
			'sidebar/geometry/torusKnot_geometry/p': '管长弧度',
			'sidebar/geometry/torusKnot_geometry/q': '扭曲弧度',

			'sidebar/geometry/tube_geometry/path': '路径',
			'sidebar/geometry/tube_geometry/radius': '半径',
			'sidebar/geometry/tube_geometry/tube': '管厚',
			'sidebar/geometry/tube_geometry/tubularsegments': '管厚分段',
			'sidebar/geometry/tube_geometry/radialsegments': '半径分段',
			'sidebar/geometry/tube_geometry/closed': '闭合',
			'sidebar/geometry/tube_geometry/curvetype': '曲线类型',
			'sidebar/geometry/tube_geometry/tension': '张力',

			'sidebar/material/new': '更新',
			'sidebar/material/copy': '复制',
			'sidebar/material/paste': '粘贴',
			'sidebar/material/slot': '插槽',
			'sidebar/material/type': '类型',
			'sidebar/material/uuid': '识别码',
			'sidebar/material/name': '名称',
			'sidebar/material/program': '程序',
			'sidebar/material/info': '信息',
			'sidebar/material/vertex': '顶点',
			'sidebar/material/fragment': '片元',
			'sidebar/material/color': '颜色',
			'sidebar/material/depthPacking': '深度包装',
			'sidebar/material/roughness': '粗糙度',
			'sidebar/material/metalness': '金属度',
			'sidebar/material/reflectivity': '反射率',
			'sidebar/material/emissive': '自发光',
			'sidebar/material/specular': '高光',
			'sidebar/material/shininess': '高光大小',
			'sidebar/material/clearcoat': '清漆',
			'sidebar/material/clearcoatroughness': '清漆粗糙度',
			'sidebar/material/transmission': '透光',
			'sidebar/material/attenuationDistance': '衰减距离',
			'sidebar/material/attenuationColor': 'Attenuation Color',
			'sidebar/material/thickness': '厚度',
			'sidebar/material/vertexcolors': '顶点颜色',
			'sidebar/material/matcap': '材质捕获',
			'sidebar/material/map': '贴图',
			'sidebar/material/alphamap': '透明贴图',
			'sidebar/material/bumpmap': '凹凸贴图',
			'sidebar/material/normalmap': '法线贴图',
			'sidebar/material/clearcoatnormalmap': '清漆法线贴图',
			'sidebar/material/displacementmap': '置换贴图',
			'sidebar/material/roughnessmap': '粗糙贴图',
			'sidebar/material/metalnessmap': '金属贴图',
			'sidebar/material/specularmap': '高光贴图',
			'sidebar/material/envmap': '环境贴图',
			'sidebar/material/lightmap': '光照贴图',
			'sidebar/material/aomap': '环境光遮蔽贴图',
			'sidebar/material/emissivemap': '自发光贴图',
			'sidebar/material/gradientmap': '渐变贴图',
			'sidebar/material/side': '面',
			'sidebar/material/size': '大小',
			'sidebar/material/sizeAttenuation': '大小衰减',
			'sidebar/material/flatShading': '平面着色',
			'sidebar/material/blending': '混合',
			'sidebar/material/opacity': '透明度',
			'sidebar/material/transparent': '透明性',
			'sidebar/material/alphatest': 'α测试',
			'sidebar/material/depthtest': '深度测试',
			'sidebar/material/depthwrite': '深度缓冲',
			'sidebar/material/wireframe': '线框',

			'sidebar/script': '脚本',
			'sidebar/script/new': '新建',
			'sidebar/script/edit': '编辑',
			'sidebar/script/remove': '删除',

			'sidebar/project': '项目',
			'sidebar/project/title': '标题',
			'sidebar/project/editable': '编辑性',
			'sidebar/project/vr': '虚拟现实',
			'sidebar/project/renderer': '渲染器',
			'sidebar/project/antialias': '抗锯齿',
			'sidebar/project/shadows': '阴影',
			'sidebar/project/physicallyCorrectLights': '物理灯',
			'sidebar/project/toneMapping': '色调映射',
			'sidebar/project/materials': '材质',
			'sidebar/project/Assign': '应用',

			'sidebar/project/video': '视频',
			'sidebar/project/resolution': '分辨率',
			'sidebar/project/duration': '时长',
			'sidebar/project/render': '渲染',

			'sidebar/settings': '设置',
			'sidebar/settings/language': '语言',

			'sidebar/settings/shortcuts': '快捷键',
			'sidebar/settings/shortcuts/translate': '移动',
			'sidebar/settings/shortcuts/rotate': '旋转',
			'sidebar/settings/shortcuts/scale': '缩放',
			'sidebar/settings/shortcuts/undo': '撤销',
			'sidebar/settings/shortcuts/focus': '聚焦',

			'sidebar/settings/viewport': '视窗',
			'sidebar/settings/viewport/grid': '网格',
			'sidebar/settings/viewport/helpers': '辅助',

			'sidebar/history': '历史记录',
			'sidebar/history/persistent': '本地存储',

			'toolbar/translate': '移动',
			'toolbar/rotate': '旋转',
			'toolbar/scale': '缩放',
			'toolbar/local': '本地',

			'viewport/info/objects': '物体',
			'viewport/info/vertices': '顶点',
			'viewport/info/triangles': '三角形',
			'viewport/info/frametime': '帧时'

		}

	};

	return {

		getKey: function ( key ) {

			return values[ language ][ key ] || '???';

		}

	};

}

export { Strings };
