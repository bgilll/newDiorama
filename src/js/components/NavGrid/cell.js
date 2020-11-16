import * as THREE from 'three';

class Cell {
  constructor(size, coordinate, walkable, visible, font) {
    this.size = size;
    this.walkable = walkable;
    this.visible = visible;
    this.coordinate = coordinate || [0, 0];

    this.font = font;
    this.mesh = this.createCell();
    this.text = this.createText();
  }

  setPath() {
    this.mesh.material.color.set('#34d159');
    this.mesh.material.wireframe = false;
  }

  clearPath() {
    this.mesh.material.color.set('#000000');
    this.mesh.material.wireframe = true;
  }

  createCell() {
    const geom = new THREE.PlaneGeometry(this.size, this.size, 1, 1);
    geom.translate((this.size / 2), (this.size / 2), 0);
    const mat = new THREE.MeshBasicMaterial({
      color: '#000000',
      wireframe: this.walkable ? true : false,
      transparent: !this.visible,
      opacity: this.visible ? 1 : 0,
      side: THREE.DoubleSide,
    });

    return new THREE.Mesh(geom, mat);;
  }

  createText = () => {
    const size = 0.2;
    const text = `${this.coordinate[0]}, ${this.coordinate[1]}`;
    var textGeo = new THREE.TextGeometry(text, {
      font: this.font,
      size: size,
      height: 0,
      curveSegments: 12,
      bevelThickness: 0,
      bevelSize: 0,
      bevelEnabled: false
    });
    textGeo.translate(-(this.size / 1.6), (this.size / 2), 0);

    var textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    return new THREE.Mesh(textGeo, textMaterial);
  }
}

export default Cell;