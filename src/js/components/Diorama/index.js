import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

import State from './state';

class Diorama {
  constructor(scene) {
    this.scene = scene;
    this.gltfURL = 'models/Diorama04.gltf';
    this.loader = new GLTFLoader();
    this.object = null;
    this.floor = null;
    this.walls = [];
    this.colliders = [];
  }

  load(loadCallback) {
    this.loader.load(
      this.gltfURL,
      (gltf) => this.onComplete(gltf, loadCallback),
      (xhr) => this.onProgress(xhr),
      (error) => this.onError(error)
    )
  }

  onComplete(gltf, loadCallback) {
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {

        const material = new THREE.MeshStandardMaterial({
          color: '#fff',
          roughness: 1.0,
          metalness: 0.0,
          shading: THREE.FlatShading,
        });

        material.color.convertSRGBToLinear();

        // FLOOR
        if (node.name === "|floor") {
          material.color = State.floorColor;
          node.material = material;
          this.floor = node;
        }

        const name = node.name.split('_');
        
        if(node.name == "FloorShape") {
          material.color.set(State.floorColor)
          node.material = material;
        }

        // WALLS
        if (name[1] === "wall" || name[1] === "wallShape") {
          if (name[0] === "north") {
            material.color.set(State.northColor)
            node.visible = State.northVisible;
          }
          if (name[0] === "west") {
            material.color.set(State.westColor)
            node.visible = State.westVisible;
          }

          // Remove when removed from model
          if (name[0] === "east") {
            material.color.set(State.eastColor)
            node.visible = false;
          }
          if (name[0] === "south") {
            material.color.set(State.southColor)
            node.visible = false;
          }

          node.material = material;
          this.walls.push(node);
        }

        // COLLIDERS
        if (name[0] === "pc") {
          this.colliders.push(node);
          node.visible = false;
        }
        
        if (node.name == "shelf_collider") {
          this.colliders.push(node);
          node.visible = false;
        }

        // Remove when removed from model
        if (node.name === "GroundPIV") {
          node.visible = false;
        }

        node.receiveShadow = true;
        node.castShadow = true;
      }
    });

    this.object = gltf.scene;
    this.scene.add(this.object);
    if (loadCallback) loadCallback();
  }

  onProgress(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  }

  onError(error) {
    console.log(`Error loading - ${this.gltfURL}`, error);
  }
}

export default Diorama;
