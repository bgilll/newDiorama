import * as THREE from 'three';

import Stats from 'stats.js';
import Global from './core/Global';

import Renderer from './components/Renderer/index';
import Lights from './components/Lights/index';
import MainCamera from './components/Cameras/Main/index';
import EditorCamera from './components/Cameras/Editor/index';

import Ground from './components/Ground/index'
import NavGrid from './components/NavGrid/index'

import Diorama from './components/Diorama/index';

class SceneManager {
  constructor() {
    Global.main = this;

    this.stats = new Stats();
    if (this.stats) document.body.appendChild(this.stats.dom);

    this.renderer = new Renderer();
    this.mainCamera = new MainCamera();
    this.editorCamera = new EditorCamera();
    this.activeCamera = this.mainCamera;
    this.scene = new THREE.Scene();
    this.lights = new Lights(this.scene);
    // this.ground = new Ground(this.scene);
    this.navGrid = new NavGrid(this.scene);

    window.addEventListener('resize', e => this.onWindowResize(e), false);
  }

  onWindowResize(e) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.activeCamera.aspect = window.innerWidth / window.innerHeight;
    this.activeCamera.updateProjectionMatrix();
    this.activeCamera.lookAt(this.scene.position);
  }

  update = (dt) => {
    this.navGrid.update(dt);
    this.activeCamera.update();

    if (this.stats) this.stats.update();

    this.renderer.render(this.scene, this.activeCamera);
  }

  showHelpers() {
    const gridSize = 1000;
    var gridHelper = new THREE.GridHelper(gridSize, (gridSize / 2));
    this.scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(10);
    axesHelper.position.y = 5;
    this.scene.add(axesHelper);
  }
}

export default SceneManager;
