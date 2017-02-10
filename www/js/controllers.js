angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,THREE, Detector) {
  $scope.rotateBody = rotateBody;
  function rotateBody(rotate) {
    blendMesh.rotation.y = rotate*Math.PI * -135 / 180;
  }
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      var container, stats;
      var blendMesh, helper, camera, scene, renderer, controls;
      var clock = new THREE.Clock();
      var gui = null;
      var isFrameStepping = false;
      var timeToStep = 0;
      init();
      function init() {
        container = document.getElementById( 'container' );
        scene = new THREE.Scene();
        scene.add ( new THREE.AmbientLight( 0xffffff ) );
        renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
        renderer.setClearColor( 0xFFFFFF );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.autoClear = true;
        container.appendChild( renderer.domElement );
        //
        //stats = new Stats();
        //container.appendChild( stats.dom );
        //
        //window.addEventListener( 'resize', onWindowResize, false );
        // listen for messages from the gui
        // window.addEventListener( 'start-animation', onStartAnimation );
        // window.addEventListener( 'stop-animation', onStopAnimation );
        // window.addEventListener( 'pause-animation', onPauseAnimation );
        // window.addEventListener( 'step-animation', onStepAnimation );
        // window.addEventListener( 'weight-animation', onWeightAnimation );
        // window.addEventListener( 'crossfade', onCrossfade );
        // window.addEventListener( 'warp', onWarp );
        // window.addEventListener( 'toggle-show-skeleton', onShowSkeleton );
        // window.addEventListener( 'toggle-show-model', onShowModel );
        blendMesh = new THREE.BlendCharacter();
        blendMesh.load( "models/skinned/marine/marine_anims_core.json", start );
      }
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      function onStartAnimation( event ) {

        var data = event.detail;
        blendMesh.stopAll();
        blendMesh.unPauseAll();
        // the blend mesh will combine 1 or more animations
        for ( var i = 0; i < data.anims.length; ++i ) {
          blendMesh.play(data.anims[i], data.weights[i]);
        }
        isFrameStepping = false;
      }
      function onStopAnimation( event ) {
        blendMesh.stopAll();
        isFrameStepping = false;
      }
      function onPauseAnimation( event ) {
        ( isFrameStepping ) ? blendMesh.unPauseAll(): blendMesh.pauseAll();
        isFrameStepping = false;
      }
      function onStepAnimation( event ) {
        blendMesh.unPauseAll();
        isFrameStepping = true;
        timeToStep = event.detail.stepSize;
      }
      function onWeightAnimation(event) {
        var data = event.detail;
        for ( var i = 0; i < data.anims.length; ++i ) {
          blendMesh.applyWeight( data.anims[ i ], data.weights[ i ] );
        }
      }
      function onCrossfade(event) {
        var data = event.detail;
        blendMesh.stopAll();
        blendMesh.crossfade( data.from, data.to, data.time );
        isFrameStepping = false;
      }
      function onWarp( event ) {
        var data = event.detail;
        blendMesh.stopAll();
        blendMesh.warp( data.from, data.to, data.time );
        isFrameStepping = false;
      }
      function onShowSkeleton( event ) {
        var shouldShow = event.detail.shouldShow;
        helper.visible = shouldShow;
      }
      function onShowModel( event ) {
        var shouldShow = event.detail.shouldShow;
        blendMesh.showModel( shouldShow );
      }
      function start() {
        blendMesh.rotation.y = 4*Math.PI * -135 / 180;
        scene.add( blendMesh );
        var aspect = window.innerWidth / window.innerHeight;
        var radius = blendMesh.geometry.boundingSphere.radius;
        camera = new THREE.PerspectiveCamera( 45, aspect, 1, 10000 );
        camera.position.set( 0.0, radius, radius * 3.5 );
        // Controls move object perspective
        // controls = new THREE.OrbitControls( camera );
        // controls.target.set( 0, radius, 0 );
        // controls.update();
        // Set default weights
        // blendMesh.applyWeight( 'idle', 1 / 3 );
        // blendMesh.applyWeight( 'walk', 1 / 3 );
        // blendMesh.applyWeight( 'run', 1 / 3 );
        gui = new BlendCharacterGui(blendMesh);
        // Create the debug visualization
        helper = new THREE.SkeletonHelper( blendMesh );
        helper.material.linewidth = 3;
        scene.add( helper );
        helper.visible = false;
        animate();
      }
      function animate() {
        requestAnimationFrame( animate, renderer.domElement );
        //stats.begin();
        // step forward in time based on whether we're stepping and scale
        var scale = gui.getTimeScale();
        var delta = clock.getDelta();
        var stepSize = (!isFrameStepping) ? delta * scale: timeToStep;
        // modify blend weights
        blendMesh.update( stepSize );
        helper.update();
        gui.update( blendMesh.mixer.time );
        renderer.render( scene, camera );
        //stats.end();
        // if we are stepping, consume time
        // ( will equal step size next time a single step is desired )
        timeToStep = 0;
      }
})

.controller('ChatsCtrl', function($scope, THREE, $timeout, $state) {
    $scope.doRefresh = doRefresh;
    function doRefresh(){
			$window.location.reload(true);
        $scope.$broadcast('scroll.refreshComplete');
    }
            var container;

			var camera, scene, renderer;

			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;


			
    init();
    animate();
    
			function init() {

				container = document.getElementById( 'container1' );
				//document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.z = 80;

				// scene

				scene = new THREE.Scene();

				var ambient = new THREE.AmbientLight( 0x101030 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 );
				scene.add( directionalLight );

				// texture

				var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};


				var loader = new THREE.ImageLoader( manager );
				loader.load( 'textures/perlin-512.png', function ( image ) {

					texture.image = image;
					texture.needsUpdate = true;

				} );

				// model

				var loader = new THREE.OBJLoader( manager );
				loader.load( 'objects/male02/deer-obj.obj', function ( object ) {

					object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material.map = texture;

						}

					} );

					object.position.y = 0;
					scene.add( object );

				}, onProgress, onError );

				//

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

				//

				//window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight ;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = ( event.clientX - windowHalfX ) / 2;
				mouseY = ( event.clientY - windowHalfY ) / 2;

			}

			//

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * .2;
				camera.position.y += ( - mouseY - camera.position.y ) * .2;

				camera.lookAt( scene.position );

				renderer.render( scene, camera );

			}
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
