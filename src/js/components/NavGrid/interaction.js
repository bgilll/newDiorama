import * as THREE from 'three';
import Signals from '../../core/signals';

import Global from '../../core/Global';
import Grid from '../../config/grid';

class Interaction {
  constructor() {
    this.intersected = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(999, 999);

    this.down = false;
    this.sent = false;
  }

  bind() {
    Global.main.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    Global.main.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
    Global.main.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
  }

  onMouseDown(event) {
    if (event.button !== 0) return;
    this.down = true;
  }

  onMouseUp(event) {
    this.down = false;
    this.sent = false;
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  update() {
    // set raycaster from / to
    this.raycaster.setFromCamera(this.mouse, Global.main.activeCamera);
    // objects intersected by the ray
    const intersects = this.raycaster.intersectObjects(Global.cells);
    // set current / clear previous
    this.handleIntersects(intersects);
  }

  handleIntersects(intersects) {
    if (intersects.length > 0) {
      // not intersecting the same object as previous, clear previous intersected object
      if (intersects[0] !== this.intersected && this.intersected) {
        // this.clearPrevious();
      }

      Signals.cellHovered.dispatch(intersects[0].object.coordinate);

      // handle intersected object
      // this.setCurrentIntersect(intersects[0]);

      if (this.down && !this.sent && intersects[0].object.coordinate) {
        this.sent = true;
        Signals.cellSelected.dispatch(intersects[0].object.coordinate);
      }

      // no objects intersected
    } else {
      Signals.clearHover.dispatch();
    }
  }

  setCurrentIntersect(intersect) {
    if (this.intersected && !this.intersected.taken) {
      this.intersected.object.material.color.set('#0a0a0a');
      this.intersected.object.material.wireframe = true;
    }

    this.intersected = intersect;
    this.intersected.object.material.color.set('#34d159');
    this.intersected.object.material.wireframe = false;
  }
}

export default Interaction;
