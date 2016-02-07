var camera;
var vrControls;
var effect;
var renderer;
var scene;
var vrMode = false;

function init() {

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio ? window.devicePixelRatio : 1 );
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.layers.enable(1);

  effect = new THREE.VREffect( renderer );
  vrControls = new THREE.VRControls( camera );


  var textures = getTexturesFromAtlasFile( "images/sun_temple.png", 12 );


  var materials = [];

  for ( var i = 0; i < 6; i ++ ) {

      materials.push( new THREE.MeshBasicMaterial( { map: textures[i] } ) );

  }

  var skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1024, 1024, 1024 ), new THREE.MeshFaceMaterial( materials ) );
  skyBox.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, -1 ) );
  skyBox.layers.set( 1 );
  scene.add( skyBox );


  var materialsR = [];

  for ( var i = 6; i < 12; i ++ ) {

      materialsR.push( new THREE.MeshBasicMaterial( { map: textures[i] } ) );

  }

  var skyBoxR = new THREE.Mesh( new THREE.CubeGeometry( 1024, 1024, 1024 ), new THREE.MeshFaceMaterial( materialsR ) );
  skyBoxR.applyMatrix( new THREE.Matrix4().makeScale( 1, 1, -1 ) );
  skyBoxR.layers.set( 2 );
  scene.add( skyBoxR );

  animate();
  onWindowResize();

}

function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

  var textures = [];

  for ( var i=0; i < tilesNum; i++ ) {

    textures[i] = new THREE.Texture();

  }

  var imageObj = new Image();

  imageObj.onload = function() {

    var canvas, context;
    var tileWidth = imageObj.height;

    for ( var i = 0; i < textures.length; i++ ) {

      canvas = document.createElement( 'canvas' );
      context = canvas.getContext( '2d' );
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
      textures[i].image = canvas
      textures[i].needsUpdate = true;

    }

  };

  imageObj.src = atlasImgUrl;

  return textures;

}

function requestFullscreen() {

    effect.setFullScreen( true );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  if (vrMode) {

    effect.setSize(window.innerWidth, window.innerHeight);

  } else {

    renderer.setSize(window.innerWidth, window.innerHeight);
    
  }

}

function onFullscreenChange(e) {

  var fsElement = document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement;

  if ( !fsElement ) {

    vrMode = false;

  } else {

    window.screen.orientation.lock( 'landscape' );

  }

}

function animate() {

  if ( vrMode ) {

    effect.render( scene, camera );

  } else {

    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );

  }

  vrControls.update();
  requestAnimationFrame( animate );

}

document.querySelector( '#VrMode' ).addEventListener( 'click', function() {

  vrMode = vrMode ? false : true;
  requestFullscreen();
  onWindowResize();

} );

document.addEventListener( 'fullscreenchange', onFullscreenChange );
document.addEventListener( 'mozfullscreenchange', onFullscreenChange );
window.addEventListener( 'resize', onWindowResize, false );

init();