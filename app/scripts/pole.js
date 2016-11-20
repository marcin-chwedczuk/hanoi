import D3Object from "d3object";

export default class Pole extends D3Object {

    constructor(radius, height, texture, labelTextureOpt) {
        super(Pole._createMesh(radius, height, texture));
        this.height = height;

        if (labelTextureOpt) {
            this._addLabel(labelTextureOpt);
        }

        this._rings = [];
    }

    top() {
        if (this._rings.length) {
            return this._rings[this._rings.length-1].top();
        }
        else {
            return this.position().y - this.height/2;
        }
    }

    pushRing(ring) {
        this._rings.push(ring);
    }

    popRing() {
        if (this._rings.length == 0)
            throw new Error("No rings on pole!");

        return this._rings.pop();
    }

    _addToScene(scene) {
        if (this._label) {
            scene.add(this._label);
        }
    }

    hideLabel() {
        if (this._label)
            this._label.visible = false;
    }

    showLabel() {
        if (this._label)
            this._label.visible = true;
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

    _addLabel(labelTexture) {
        var material = new THREE.SpriteMaterial({
            map: labelTexture,
            fog: false
        });
        var sprite = new THREE.Sprite(material);

    // more crisp image
        labelTexture.generateMipmaps = false;
        labelTexture.magFilter = THREE.NearestFilter;
        labelTexture.minFilter = THREE.NearestFilter;

        this._label = sprite;
    }

    _positionChanged() {
        if (this._label) {
            let position = this.position();
            this._label.position.set(position.x, 0.4 + this.height, position.z);
        }
    }
}
