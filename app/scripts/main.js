import World from "world";

const WIDTH = 800;
const HEIGHT = 640;

document.addEventListener("DOMContentLoaded", function (event) {
  let world = new World(WIDTH, HEIGHT);

  // ----------------------------------------------------

  var showLabelsCheckbox = document.getElementById('showLabelsCheckbox');
  showLabelsCheckbox.addEventListener('change', function (event) {
      world.setShowLabels(showLabelsCheckbox.checked);
  });

  document.getElementById("resetButton").addEventListener('click', () => {
    world.reset();
  });

  var startStopButton = document.getElementById("startStopButton");
  startStopButton.addEventListener('click', () => {
    var started = world.startStop();
    startStopButton.value = started ? 'PAUSE' : 'START';
  });

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

});
