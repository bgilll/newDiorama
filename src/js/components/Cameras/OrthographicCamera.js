import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class OrthographicCamera extends THREE.OrthographicCamera {
  constructor(left, right, top, bottom, near, far) {
    const d = 7;
    const aspect = window.innerWidth / window.innerHeight;
    super(-d * aspect, d * aspect, d, -d, 1, 1000);

    this.position.set(10, 10, -10);
    this.lookAt(new THREE.Vector3(0, 0, 0));

    this.controls = null;
  }

  addControls(canvas) {
    if (!canvas) { return; }
    this.controls = new OrbitControls(this, canvas);
  }

  update() {
    if (!this.controls) { return; }
    this.controls.update();
  }
}
