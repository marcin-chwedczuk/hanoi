import Ring from "ring";

export default function generateRings(n) {
    var rings = [];

    for (var i = 0; i < n; i++) {

        var color = new THREE.Color(`hsl(${Math.floor(i*300/n)}, 50%, 50%)`);

        var outherRadius = 0.2 + i*0.06;
        var innerRadius = 0.08;
        var height = 0.1;

        rings.push(new Ring(innerRadius, outherRadius, height, color));
    }

    return rings;
}
