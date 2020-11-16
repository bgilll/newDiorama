import * as THREE from 'three';
import Pathfinding from 'pathfinding';
import Signals from '../../core/signals';
import NavCell from './cell';
import Interaction from './interaction';
import Player from '../Character/index';
import Global from '../../core/Global';
import Grid from '../../config/grid';
import Diorama from '../../config/diorama';
import Hover from './hoverIndicator';

import {
  isArrayInArray,
  getRandomCoor
} from '../../helpers/global';

class NavGrid {
  constructor(scene) {
    this.scene = scene;

    this.interaction = new Interaction();
    this.interaction.bind();

    this.width = Grid.width;
    this.height = Grid.height;
    this.cellSize = Grid.cellSize;

    this.group = new THREE.Group();
    this.group.position.x = ((this.width / 2) - this.cellSize);
    this.group.position.z = ((this.height / 2) - this.cellSize);

    this.container = this.createContainer();
    this.group.add(this.container);
    this.scene.add(this.group);

    // this.player = new Player(Global, this.group);
    this.players = [
      new Player(Global, this.group, '#fafafa'),
    ];

    this.hover = new Hover(this.container);
    this.group.add(this.hover.object);

    this.cells = {
      lookup: {},
      walkable: [],
      notWalkable: Grid.notWalkable,
    }

    this.state = {
      show: true,
    }

    this.baseGrid = new Pathfinding.Grid((this.width / this.cellSize), (this.height / this.cellSize));
    this.pfGrid = this.baseGrid.clone();
    this.pfFinder = new Pathfinding.AStarFinder({
      allowDiagonal: true,
      dontCrossCorners: true
    });

    this.font = null;

    this.init();

    Signals.cellSelected.add((coordinate) => this.createPath(this.players[0], coordinate));
    // Signals.cellHovered.add((coordinate) => this.moveHover(coordinate));
    Signals.clearHover.add(() => this.clearHover());
    Signals.moveFinished.add(() => this.moveFinished());

    setTimeout(() => {
      Signals.cellSelected.dispatch(getRandomCoor());
    }, 1500);
  }

  moveFinished() {
    this.clearCells();

    setTimeout(() => {
      Signals.cellSelected.dispatch(getRandomCoor());
    }, 500);
  }

  clearHover() {
    if (this.hover) this.hover.object.visible = false;
  }

  moveHover(coordinate) {
    if (this.hover && !this.hover.object.visible) {
      this.hover.object.visible = true;
    }

    if (this.hover && coordinate && coordinate.length > 0) {
      this.hover.moveTo(coordinate[0], coordinate[1]);
    }
  }

  createPath(player, coordinate) {
    const start = player.coordinates;

    this.pfGrid = this.baseGrid.clone();
    this.setTaken();

    this.path = this.pfFinder.findPath(start.x, start.y, coordinate[0], coordinate[1], this.pfGrid);
    this.showPath();
    const cell = this.cells.lookup[`${coordinate[0]}${coordinate[1]}`];
    if (cell) cell.taken = true;

    player.lookAt(this.path[0]);
    player.move(this.path);
  }

  setTaken() {
    if (this.cells.notWalkable && this.cells.notWalkable.length > 0) {
      for (let i = 0; i < this.cells.notWalkable.length; i++) {
        const coordinate = this.cells.notWalkable[i];
        this.pfGrid.setWalkableAt(coordinate[0], coordinate[1], false);
      }
    }
  }

  init() {
    const that = this;

    const loader = new THREE.FontLoader();
    loader.load('assets/fonts/helvetiker_regular.typeface.json', function (font) {
      console.log('font loaded', font);
      that.font = font;
      that.createGrid();
    });
  }

  toggleGrid() {
    const cells = Object.values(this.cells.lookup);
    if (cells.length > 0) {
      cells.forEach(cell => {
        cell.mesh.material.transparent = !this.state.show;
        cell.mesh.material.opacity = this.state.show ? 1 : 0;
      });
    }
  }

  clearCells() {
    const cells = Object.values(this.cells.walkable);
    if (cells.length > 0) {
      cells.forEach(cell => {
        cell.clearPath();
      });
    }
  }

  showPath() {
    this.clearCells();

    for (let i = 0; i < this.path.length; i++) {
      const path = this.path[i];
      const cell = this.cells.lookup[`${path[0]}${path[1]}`];

      if (cell && this.state.show) {
        cell.setPath();
      }
    }
  }

  createGrid() {
    let x = 0;
    let y = 0;

    for (let i = 0; i < (this.height / this.cellSize); i++) {
      for (let j = 0; j < (this.width / this.cellSize); j++) {

        const coorX = j;
        const coorZ = i;
        const coordinate = [coorX, coorZ];

        const walkable = !isArrayInArray(this.cells.notWalkable, coordinate);

        const cell = new NavCell(this.cellSize, coordinate, walkable, this.state.show, this.font);
        cell.taken = false;
        cell.mesh.position.x = -(x * this.cellSize);
        cell.mesh.position.y = -(y * this.cellSize);
        cell.mesh.coordinate = coordinate;

        // add cell to global list, used when raycasting
        if (walkable) {
          Global.cells.push(cell.mesh);
          this.cells.walkable.push(cell);
        } else {
          this.pfGrid.setWalkableAt(j, i, false);
        }

        // create colliders
        if (!walkable && Diorama.colliders) {
          this.createCollider([coorX, coorZ], cell.mesh.position);
        }

        this.cells.lookup[`${coorX}${coorZ}`] = cell;

        // add to scene
        this.container.add(cell.mesh);

        cell.text.position.x = -(x * this.cellSize);
        cell.text.position.y = -(y * this.cellSize);
        cell.text.scale.x = -1;
        this.container.add(cell.text);

        x++;
      }

      x = 0;
      y++;
    }

    this.toggleGrid();
  }

  check(x, y) {
    let check = false;

    for (let i = 0; i < this.path.length; i++) {
      const cor = this.path[i];
      if (cor[0] == x && cor[1] == y) {
        check = true;
        break;
      }
    }

    return check;
  }

  createCollider(coordinate, position) {
    var box = new THREE.BoxGeometry(this.cellSize, Diorama.height, this.cellSize);
    box.translate(-(this.cellSize / 2), 0, (this.cellSize / 2));

    const mat = new THREE.MeshStandardMaterial({
      color: '#f0e573',
    });

    mat.roughness = 0.5;
    mat.metalness = 0.0;
    mat.shading = THREE.FlatShading;

    var collider = new THREE.Mesh(box, mat);
    collider.position.x = coordinate[0] * this.cellSize;
    collider.position.y = coordinate[1] * this.cellSize;
    collider.position.z = -(Diorama.height / 2);

    collider.receiveShadow = true;
    collider.castShadow = true;

    collider.rotation.x = Math.PI * 0.5;

    this.container.add(collider);
  }

  createContainer() {
    const geom = new THREE.PlaneGeometry(this.width, this.height, 1, 1);
    // geom.translate((this.width / 2) - (this.cellSize), (this.height / 2) - (this.cellSize), 0);
    const mat = new THREE.MeshBasicMaterial({
      color: '#1d42f7',
      transparent: true,
      opacity: 0,
      wireframe: true,
    });

    const container = new THREE.Mesh(geom, mat);
    container.rotation.x = Math.PI * 0.5;

    return container;
  }

  update(dt) {
    this.interaction.update();

    for (let i = 0; i < this.players.length; i++) {
      this.players[i].update(dt);
    }
  }

}

export default NavGrid;
