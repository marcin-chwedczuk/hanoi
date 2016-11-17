export default class Ring {

    constructor(innerRadius, outerRadius, height, color) {
        var points = [];

        var r = innerRadius,
            R = outerRadius;

        var N = 5,
            i;

    // inner wall
        for (i = 0; i <= N; i++) {
            points.push(point(r, height * i / N));
        }

    // ---->
        for (i = 0; i <= N; i++) {
            points.push(point(r + (R - r) * i / N, height));
        }

    // outher wall
        for (i = N; i >= 0; i--) {
            points.push(point(R, height * i / N));
        }

    // <-----
        for (i = N; i >= 0; i--) {
            points.push(point(r + (R - r) * i / N, 0));
        }

        var geometry = new THREE.LatheGeometry(points, 36);

        var material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 10
        });
        material.side = THREE.DoubleSide;

        this._height = height;
        this._mesh = new THREE.Mesh(geometry, material);

        function point(x, y) {
            return new THREE.Vector2(x, y);
        }
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

    get height() {
        return this._height;
    }
}
