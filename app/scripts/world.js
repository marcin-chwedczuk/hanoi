import generateRings from "ringFactory";
import Pole from "pole";
import Floor from "floor";
import TrackballControls from "TrackballControls";
import OrbitControls from "OrbitControls";

export default class World {

  constructor(viewportWidth, viewportHeight) {
    this._setupThreeJs(viewportWidth, viewportHeight);
    this._setupCamera(viewportWidth, viewportHeight);
    // this._setupTrackballControls();
    this._setupOrbitControls();

    this.scene = new THREE.Scene();
    this.loader = new THREE.TextureLoader();

    this._setupLights();
    this._buildScene();
  }

  _setupThreeJs(viewportWidth, viewportHeight) {
    let renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(viewportWidth, viewportHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer = renderer;
  }

  _setupCamera(viewportWidth, viewportHeight) {
    let camera = new THREE.PerspectiveCamera(60,
            viewportWidth/viewportHeight, 0.1, 1000);

    camera.position.set(0, 4, 4);
    camera.up = new THREE.Vector3(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0,0,0));

    this.camera = camera;
  }

  _setupTrackballControls() {
      let controls = new THREE.TrackballControls(this.camera);

      controls.rotateSpeed = 2.5;
      controls.zoomSpeed = 0.2;
      controls.panSpeed = 0.2;
      controls.noZoom = false;
      controls.noPan = false;
      controls.staticMoving = true;
      controls.dynamicDampingFactor = 0.3;

    	// controls.keys = [ 65, 83, 68 ];
      controls.addEventListener( "change", () => this._render());

      this.controls = controls;
  }

  _setupOrbitControls() {
    let controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
			//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		controls.enableDamping = true;
		controls.dampingFactor = 0.15;
		controls.enableZoom = false;

    controls.rotateSpeed = 0.3;
    this.controls = controls;
  }

  _setupLights() {
      let light = new THREE.DirectionalLight( 0xcccccc );
      light.position.set( 0, 1, 1 ).normalize();
      this.scene.add(light);

      light = new THREE.AmbientLight( 0xa0a0a0 ); // soft white light
      this.scene.add(light);
  }

  _buildScene() {
    // dance floor
    this.loader.load("images/floor.jpg", (texture) => {
      let floor = new Floor(8, texture);
      floor.addToScene(this.scene);
      floor.position(0, -0.01, 0);
    });

    // poles
    function addPole(scene, x, z, texture) {
        const radius = 0.05;
        const height = 1.2;

        let pole = new Pole(radius, height, texture);
        pole.addToScene(scene);
        pole.position(x, height/2, z);

        return pole;
    }

    // poles will be placed in vertexes of equilateral triangle
    const distanceBetweenPooles = 2;
    let h = -Math.sqrt(3)*distanceBetweenPooles/2;
    this.loader.load("images/wood.jpg", (texture) => {
      this.using = addPole(this.scene, 0, h/2, texture);
    });

    this.loader.load("images/wood.jpg", (texture) => {
      this.to = addPole(this.scene, distanceBetweenPooles/2, -h/2, texture);
    });

    this._loadTexture("images/wood.jpg")
      .then((texture) => {
        this.from = addPole(this.scene, -distanceBetweenPooles/2, -h/2, texture);
      })
      .then(() => {
        // generate rings on from pole
        this.rings = [];

        let rings = generateRings(8);
        let fromPolePosition = this.from.position();
        let h = 0;

        rings.reverse().forEach(ring => {
          ring.position(fromPolePosition.x, h, fromPolePosition.z);
          ring.addToScene(this.scene);

          this.rings.push(ring);

          h += ring.height;
        });
      });
 }

  _loadTexture(imageUrl) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        imageUrl,
        (texture) => resolve(texture),
        () => {},
        () => reject('cannot load texture: ' + imageUrl));
    });
  }

  _render() {
    this.renderer.render(this.scene, this.camera );
  }

  render() {
    this.controls.update();
    this._render();
  }
}
