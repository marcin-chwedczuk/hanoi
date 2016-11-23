import World from "world";

const WIDTH = 800;
const HEIGHT = 640;

document.addEventListener("DOMContentLoaded", function (event) {
  let world = new World(WIDTH, HEIGHT);

  let fullReset = () => {
    world.reset();
    startStopButton.innerHTML = 'START';
  };

  // ----------------------------------------------------

  var showLabelsCheckbox = document.getElementById('showLabelsCheckbox');
  showLabelsCheckbox.addEventListener('change', function (event) {
      world.setShowLabels(showLabelsCheckbox.checked);
  });

  var startStopButton = document.getElementById("startStopButton");
  startStopButton.addEventListener('click', () => {
    var started = world.startStop();
    startStopButton.innerHTML = (started ? 'PAUSE' : 'START');
  });

  document.getElementById("resetButton").addEventListener('click', () => {
    fullReset();
  });

  document.getElementById("numberOfDisks").addEventListener("change", (e) => {
    var numberOfDisks = e.target.value;
    world.setNumberOfDisks(numberOfDisks);
    fullReset();
  });

  document.getElementById("animationSpeed").addEventListener("change", (e) => {
    var index = e.target.value;
    var multipliers = [0.3, 0.5, 0.75, 1, 1.5, 3, 5];
    world.setAnimationSpeedMultiplier(multipliers[index]);
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
