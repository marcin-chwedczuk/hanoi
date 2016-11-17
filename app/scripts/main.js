import generateRings from "ringFactory";
import Pole from "pole";
import Floor from "floor";
import TrackballControls from "TrackballControls";

(function() {
    "use strict";

    var WIDTH = 800;
    var HEIGHT = 640;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75,
                    WIDTH/HEIGHT, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setPixelRatio( window.devicePixelRatio );

  var loader = new THREE.TextureLoader();

  loader.load("images/floor.jpg", (texture) => {
    var floor = new Floor(8, texture);
    floor.addToScene(scene);
  });

    (function() {
        function buildAxis( src, dst, colorHex, dashed ) {
            var geom = new THREE.Geometry(),
                mat;

            if(dashed) {
                mat = new THREE.LineDashedMaterial({
                    linewidth: 3,
                    color: colorHex,
                    dashSize: 3,
                    gapSize: 3
                });
            } else {
                mat = new THREE.LineBasicMaterial({
                    linewidth: 5,
                    color: colorHex
                });
            }

            geom.vertices.push( src.clone() );
            geom.vertices.push( dst.clone() );
            geom.computeLineDistances();

            var axis = new THREE.LineSegments( geom, mat, THREE.LinePieces );

            return axis;
        }

        var length = 2;
        var axes = new THREE.Object3D();

        axes.add( buildAxis(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X

        axes.add( buildAxis(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y

        axes.add( buildAxis(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        scene.add(axes);
    }());

    function addPole(scene, x, z, texture) {
        var radius = 0.05;
        var height = 1.8;

        var pole = new Pole(radius, height, texture);
        pole.addToScene(scene);
        pole.position(x, height/2, z);
    }

    loader.load("images/wood.jpg", (texture) => {
      addPole(scene, 1, 1, texture);
      addPole(scene, -1, 1, texture);
    });



    // tower 1
    var rings = generateRings(8);
    var h = 0;
    rings.reverse().forEach(ring => {
        ring.position(0, h, 0);
        h += ring.height;
        ring.addToScene(scene);
    });

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    var light = new THREE.DirectionalLight( 0xcccccc );
    light.position.set( 0, 1, 1 ).normalize();
    scene.add(light);

    light = new THREE.AmbientLight( 0xa0a0a0 ); // soft white light
    scene.add( light );

    camera.position.set(0, 3, 3);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0,0,0));

    var controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 2.5;
    controls.zoomSpeed = 0.2;
    controls.panSpeed = 0.2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
	// controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( "change", function() {
        renderer.render( scene, camera );
    });

    function beforeRender() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    // ----------------------------------------------------

    function render() {
        beforeRender();

        controls.update();
        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }
    render();

    // -----------------------------------------------------
    var sceneEl = document.getElementById("scene");
    if (!sceneEl) {
        throw new Error("scene HTML element not found!");
    }

    sceneEl.appendChild( renderer.domElement );

}());
