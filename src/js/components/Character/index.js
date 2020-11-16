import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import Signals from '../../core/signals';
import Grid from '../../config/grid';
import { isArrayInArray, getPositionAtCoor } from '../../helpers/global';
import Global from '../../core/Global';

class Player {
  constructor(global, parent, color) {
    this.global = global;
    this.color = color;
    this.parent = parent;
    this.speed = 500;

    this.cellSize = Grid.cellSize;

    this.queue = null;

    this.coordinates = { x: 0, y: 0 };
    this.model = null;

    this.loop = null;
    this.mixer = null;
    this.animations = {};

    this.loadModel();
  }

  lookAt(coordinate) {
    if (!this.model || !coordinate) return;

    console.log(`Look at: ${coordinate}`);

    const cell = Global.cells.filter(cell => {
      return cell.coordinate[0] === coordinate[0] && cell.coordinate[1] === coordinate[1]
    });
    const target = new THREE.Vector3();
    cell[0].getWorldPosition(target);
    target.y = 0;

    this.model.lookAt(target);
  }

  move(queue) {
    let index = 0;

    if (this.loop) {
      clearInterval(this.loop);
      this.queue = null;
      this.loop = null;
    }

    this.animations.idle.action.stop();
    this.animations.run.action.play();

    this.queue = queue;

    this.loop = setInterval(() => {
      const current = this.queue[index];

      this.lookAt(current);
      console.log(`Move to: ${current}`);
      this.setPosition(current[0], current[1]);
      index++;

      if (index === this.queue.length) {
        clearInterval(this.loop);
        this.queue = null;
        this.loop = null;
        Signals.moveFinished.dispatch();

        this.animations.run.action.stop();
        this.animations.idle.action.play();
      }
    }, this.speed);
  }

  setPosition(x, y) {
    this.coordinates = { x, y };
    const position = getPositionAtCoor(x, y);
    const posx = -position.x - -(Grid.cellSize / 2);
    const posz = -position.y - -(Grid.cellSize / 2);

    this.model.position.set(posx, 0, posz)
  }

  loadModel() {
    const that = this;
    const mat = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.5,
      metalness: 0.2,
      skinning: true,
    });

    const loader = new FBXLoader();
    loader.load('character/t-pose.fbx', (fbx) => {
      fbx.scale.setScalar(0.02);
      fbx.position.set(1, 0, 1);
      fbx.traverse(c => {
        c.castShadow = true;

        if (c.isMesh) {
          c.material = mat;
        }
      });

      that.model = fbx;
      that.setPosition(5, 4);
      that.parent.add(fbx);

      this.mixer = new THREE.AnimationMixer(fbx);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {

        this.animations.idle.action.play();

        console.log('loading done');
        console.log(this.animations);
      };

      const loader = new FBXLoader(this._manager);
      loader.load('character/run.fbx', (a) => {
        this.onAnimationLoad('run', a);
      });
      loader.load('character/idle.fbx', (a) => {
        this.onAnimationLoad('idle', a);
      });
    });
  }

  onAnimationLoad = (animName, anim) => {
    const clip = anim.animations[0];
    const action = this.mixer.clipAction(clip);

    this.animations[animName] = {
      clip: clip,
      action: action,
    };
  };

  update() {
    if (this.mixer) this.mixer.update(0.01);
  }
}

export default Player;