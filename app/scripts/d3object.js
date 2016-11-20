
export default class D3Object {
    constructor(mesh) {
        if (mesh == null)
            throw new Error("mesh cannot be null");
        this._mesh = mesh;
    }

    addToScene(scene) {
        scene.add(this._mesh);
        this._addToScene(scene);
    }

    _addToScene(scene) { } // eslint-disable-line

    position(x, y, z) {
        if (arguments.length === 0)
            return this._mesh.position;

        this._mesh.position.set(x, y, z);
        this._positionChanged();
    }

    _positionChanged() { }

    rotate(x, y, z) {
        this._mesh.rotation.set(x, y, z);
        this._rotationChanged();
    }

    _rotationChanged() { }
}
