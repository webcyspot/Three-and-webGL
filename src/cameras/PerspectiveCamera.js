/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author tschw
 */

THREE.PerspectiveCamera = function( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.type = 'PerspectiveCamera';

	this.fov = fov !== undefined ? fov : 50;
	this.zoom = 1;

	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;
	this.focus = 10;

	this.aspect = aspect !== undefined ? aspect : 1;
	this.view = null;

	this.filmGauge = 35;	// width of the film (default in millimeters)
	this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = Object.create( THREE.Camera.prototype );
THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;


/**
 * Sets the FOV by focal length (DEPRECATED).
 *
 * Optionally also sets .filmGauge, otherwise uses it. See .setFocalLength.
 */
THREE.PerspectiveCamera.prototype.setLens = function( focalLength, filmGauge ) {

	console.warn( "THREE.PerspectiveCamera.setLens is deprecated. " +
			"Use .setFocalLength and .filmGauge for a photographic setup." );

	if ( filmGauge !== undefined ) this.filmGauge = filmGauge;
	this.setFocalLength( focalLength );

};

/**
 * Sets the FOV by focal length in respect to the current .filmGauge.
 *
 * The default film gauge is 35, so that the focal length can be specified for
 * a 35mm (full frame) camera.
 *
 * Values for focal length and film gauge must have the same unit.
 */
THREE.PerspectiveCamera.prototype.setFocalLength = function( focalLength ) {

	// see http://www.bobatkins.com/photography/technical/field_of_view.html
	var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;

	this.fov = THREE.Math.RAD2DEG * 2 * Math.atan( vExtentSlope );
	this.updateProjectionMatrix();

};


/**
 * Calculates the focal length from the current .fov and .filmGauge.
 */
THREE.PerspectiveCamera.prototype.getFocalLength = function() {

	var vExtentSlope = Math.tan( THREE.Math.DEG2RAD * 0.5 * this.fov );

	return 0.5 * this.getFilmHeight() / vExtentSlope;

};

THREE.PerspectiveCamera.prototype.getEffectiveFOV = function() {

	return THREE.Math.RAD2DEG * 2 * Math.atan(
			Math.tan( THREE.Math.DEG2RAD * 0.5 * this.fov ) / this.zoom );

};

THREE.PerspectiveCamera.prototype.getFilmWidth = function() {

	// film not completely covered in portrait format (aspect < 1)
	return this.filmGauge * Math.min( this.aspect, 1 );

};

THREE.PerspectiveCamera.prototype.getFilmHeight = function() {

	// film not completely covered in landscape format (aspect > 1)
	return this.filmGauge / Math.max( this.aspect, 1 );

};



/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */
THREE.PerspectiveCamera.prototype.setViewOffset = function( fullWidth, fullHeight, x, y, width, height ) {

	this.aspect = fullWidth / fullHeight;

	this.view = {
		fullWidth: fullWidth,
		fullHeight: fullHeight,
		offsetX: x,
		offsetY: y,
		width: width,
		height: height
	};

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function() {

	var near = this.near,
		top = near * Math.tan(
				THREE.Math.DEG2RAD * 0.5 * this.fov ) / this.zoom,
		height = 2 * top,
		width = this.aspect * height,
		left = - 0.5 * width,
		view = this.view;

	if ( view !== null ) {

		var fullWidth = view.fullWidth,
			fullHeight = view.fullHeight;

		left += view.offsetX * width / fullWidth;
		top -= view.offsetY * height / fullHeight;
		width *= view.width / fullWidth;
		height *= view.height / fullHeight;

	}

	var skew = this.filmOffset;
	if ( skew !== 0 ) left += near * skew / this.getFilmWidth();

	this.projectionMatrix.makeFrustum(
			left, left + width, top - height, top, near, this.far );

};

THREE.PerspectiveCamera.prototype.copy = function( source ) {

	THREE.Camera.prototype.copy.call( this, source );

	this.fov = source.fov;
	this.zoom = source.zoom;

	this.near = source.near;
	this.far = source.far;
	this.focus = source.focus;

	this.aspect = source.aspect;
	this.view = source.view === null ? null : Object.assign( {}, source.view );

	this.filmGauge = source.filmGauge;
	this.filmOffset = source.filmOffset;

	return this;

};

THREE.PerspectiveCamera.prototype.toJSON = function( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.fov = this.fov;
	data.object.zoom = this.zoom;

	data.object.near = this.near;
	data.object.far = this.far;
	data.object.focus = this.focus;

	data.object.aspect = this.aspect;
	
	if( this.view ) data.object.view = Object.assign( {}, this.view );

	data.object.filmGauge = this.filmGauge;
	data.object.filmOffset = this.filmOffset;

	return data;

};
