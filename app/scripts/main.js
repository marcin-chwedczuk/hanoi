import World from 'world';

(function() {
    "use strict";

    const WIDTH = 800;
    const HEIGHT = 640;

    let world = new World(WIDTH, HEIGHT);

    // ----------------------------------------------------

    function render() {
      world.render();
      requestAnimationFrame( render );
    }
    render();

    // -----------------------------------------------------
    var sceneEl = document.getElementById("scene");
    if (!sceneEl) {
        throw new Error("scene HTML element not found!");
    }

    sceneEl.appendChild(world.renderer.domElement);

}());
