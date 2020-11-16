import * as THREE from 'three';
import Grid from '../../config/grid';
import { isArrayInArray, getPositionAtCoor } from '../../helpers/global';

class Hover {
  constructor(scene) {
    this.height = 2;
    this.scene = scene;
    this.object = this.create();
  }

  moveTo(x, z) {
    // const position = getPositionAtCoor(x, y);
    this.object.position.set(-x * Grid.cellSize, 0, -z * Grid.cellSize);
  }

  create() {
    var materials = [
      // left
      new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.BackSide,
        opacity: 0,
      }),
      // right
      new THREE.MeshBasicMaterial({
        color: '#000',
        transparent: true,
        side: THREE.BackSide,
        opacity: 0.5,
        map: THREE.ImageUtils.loadTexture('/assets/textures/white.png')
      }),
      // top
      new THREE.MeshBasicMaterial({
        transparent: true,
        side: THREE.BackSide,
        opacity: 0,
        // map: THREE.ImageUtils.loadTexture('/assets/textures/green.png')
      }),
      // bottom
      new THREE.MeshBasicMaterial({
        color: '#000',
        side: THREE.BackSide,
        transparent: true,
        opacity: 1,
        // map: THREE.ImageUtils.loadTexture('/assets/textures/blue.png')
      }),
      // front
      new THREE.MeshBasicMaterial({
        color: '#000',
        transparent: true,
        side: THREE.BackSide,
        opacity: 0.5,
        map: THREE.ImageUtils.loadTexture('/assets/textures/white.png')
      }),
      // back
      new THREE.MeshBasicMaterial({
        // color: '#f71d44',
        transparent: true,
        opacity: 0,
        // side: THREE.BackSide,
        map: THREE.ImageUtils.loadTexture('/assets/textures/white.png')
      })
    ];

    const mat = new THREE.MeshBasicMaterial({
      color: '#000',
      transparent: true,
      opacity: 0.5,
      depthWrite: true,
      side: THREE.DoubleSide,
    });

    const geom = new THREE.BoxGeometry(Grid.cellSize, this.height, Grid.cellSize, 1, 1, 1);
    // geom.translate((Grid.cellSize / 2), (Grid.cellSize / 2), 0);
    const cube = new THREE.Mesh(geom, materials);

    cube.position.z = -(this.height / 2);
    cube.rotation.x = -(Math.PI * 0.5);

    const geometry = new THREE.BoxGeometry(2, 0.001, 2);
    geometry.translate((Grid.cellSize / 2), -0.01, (Grid.cellSize / 2));
    const material = new THREE.MeshBasicMaterial({ color: '#34d159', wireframe: false });
    const c = new THREE.Mesh(geometry, material);

    // cube.visible = false;
    // cube.renderOrder = 2;

    // this.scene.add(cube);

    // const axesHelper = new THREE.AxesHelper(3);
    // cube.add(axesHelper);

    return c;
  }
}

export default Hover;