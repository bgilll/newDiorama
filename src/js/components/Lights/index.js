import * as THREE from 'three';
import Global from '../../core/Global';

class Lights {
  constructor(scene) {
    this.scene = scene;

    this.state = {
      ambientColor: 0xffffff,
      ambientIntensity: 1,
      directionalColor: 0xffffff,
      directionalIntensity: 1.5,
      position: { x: 15, y: 40, z: -15 },
      castShadow: true,
      shadowMapSize: 1024,
    }

    this.hemisphere = new THREE.HemisphereLight()
    this.ambient = new THREE.AmbientLight(this.state.ambientColor, this.state.ambientIntensity);
    this.directional = new THREE.DirectionalLight(this.state.directionalColor, this.state.directionalIntensity);

    this.directional.position.set(this.state.position.x, this.state.position.y, this.state.position.z);
    this.directional.castShadow = true;

    const size = 25;
    this.directional.shadow.camera.left = -size;
    this.directional.shadow.camera.right = size;
    this.directional.shadow.camera.top = size;
    this.directional.shadow.camera.bottom = -size;

    this.directional.shadow.camera.far = 80;
    this.directional.shadow.mapSize.width = this.state.shadowMapSize;
    this.directional.shadow.mapSize.height = this.state.shadowMapSize;

    this.scene.add(this.hemisphere);
    this.scene.add(this.ambient);
    this.scene.add(this.directional);

    const help = new THREE.CameraHelper(this.directional.shadow.camera);
    // this.scene.add(help);
  }
}

export default Lights;
