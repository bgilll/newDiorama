import * as THREE from 'three';
import PerspectiveCamera from '../PerspectiveCamera';
import Global from '../../../core/Global';

class EditorCamera extends PerspectiveCamera {
  constructor(dom) {
    super();

    this.state = {
      position: { x: 10, y: 10, z: -10 },
      target: { x: 0, y: 2, z: 0 },
      pan: true,
      rotateSpeed: 0.25,
      zoom: true,
      maxZoom: 800,
      damping: true,
      dampingFactor: 0.15,
      minPolarAngle: 0,
      maxPolarAngle: 3.3,
    }

    const { x, y, z } = this.state.position;
    this.position.set(x, y, z);
    this.addControls(Global.main.renderer.domElement);
    this.init();
  }

  init() {
    const {
      target,
      controls,
      pan,
      rotateSpeed,
      zoom,
      maxZoom,
      damping,
      dampingFactor,
      minPolarAngle,
      maxPolarAngle,
    } = this.state;

    this.controls.enabled = controls;
    this.controls.target = new THREE.Vector3(target.x, target.y, target.z);
    this.controls.enablePan = pan;
    this.controls.rotateSpeed = rotateSpeed;
    this.controls.enableZoom = zoom;
    this.controls.maxDistance = maxZoom;
    this.controls.enableDamping = damping;
    this.controls.dampingFactor = dampingFactor;
    this.controls.minPolarAngle = minPolarAngle;
    this.controls.maxPolarAngle = maxPolarAngle;

    this.update();
    this.controls.update();
    this.updateProjectionMatrix();
  }
}

export default EditorCamera;
