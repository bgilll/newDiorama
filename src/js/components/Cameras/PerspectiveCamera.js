import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

export default class PerspectiveCamera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super();

    this.fov = fov || 45;
    this.near = near || 1;
    this.far = far || 1000;
    this.aspect = aspect || (window.innerWidth / window.innerHeight);

    this.controls = null;
    window.onWindowResize = (e) => this.onWindowResize(e);
  }

  addControls(canvas) {
    if (!canvas) { return }
    this.controls = new OrbitControls(this, canvas)
  }

  update() {
    if (!this.controls) { return }
    this.controls.update();
  }

  onWindowResize() {
    this.aspect = window.innerWidth / window.innerHeight;
    this.updateProjectionMatrix()
  }
}