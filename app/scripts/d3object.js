
export default class D3Object {
  constructor(mesh) {
    if (mesh == null)
      throw new Error('mesh cannot be null');
    this._mesh = mesh;
  }

  addToScene(scene) {
    scene.add(this._mesh);
  }

  position(x, y, z) {
    this._mesh.position.set(x, y, z);
  }

  rotate(x, y, z) {
    this._mesh.rotation.set(x, y, z);
  }
}
