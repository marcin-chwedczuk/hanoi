import D3Object from 'd3object';

export default class Pole extends D3Object {

  constructor(radius, height, texture) {
    super(Pole._createMesh(radius, height, texture));

    this.height = height;
  }

  static _createMesh(radius, height, texture) {
    var geometry = new THREE.CylinderGeometry(radius, radius, height, 32);

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.41, 0.8);

    var material = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: 0.5
    });

    return new THREE.Mesh(geometry, material);
  }
}
