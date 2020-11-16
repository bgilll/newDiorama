import TWEEN from '@tweenjs/tween.js';
import SceneManager from './sceneManager';

class Main {
  constructor() {
    this.sceneManager = new SceneManager(this.update);
    this.update();
  }

  update = (dt) => {
    requestAnimationFrame(this.update);
    this.sceneManager.update(dt);
    TWEEN.update();
  }
}

document.addEventListener('DOMContentLoaded', () => new Main());