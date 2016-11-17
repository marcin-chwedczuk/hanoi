import D3Object from 'd3object'

export default class Floor extends D3Object {

  constructor(floorSize, texture) {
    super(Floor._createMesh(floorSize, texture));
  }

  static _createMesh(floorSize, texture) {
    var geometry = new THREE.PlaneGeometry(floorSize, floorSize, 10, 10);

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);

    var material = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: 0.5
    });
    material.side = THREE.DoubleSide;

    var floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;

    return floor;
  }
}
