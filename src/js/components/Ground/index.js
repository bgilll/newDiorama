import * as THREE from 'three';
import State from './state';

export default class Ground {
  constructor(scene) {
    const h = 2;
    var geometry = new THREE.BoxGeometry(20, h, 20);
    var material = new THREE.MeshStandardMaterial({ color: '#f0e573' });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.y = -h / 2;
    scene.add(cube);
  }
}
