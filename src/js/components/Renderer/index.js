import * as THREE from 'three';
export default class Renderer extends THREE.WebGLRenderer {
  constructor() {
    super({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })

    this.config = {
      gamma: 2.2,
      exposure: 1,
    }

    this.gammaOutput = true;
    this.gammaFactor = this.config.gamma;
    this.physicallyCorrectLights = true;
    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap;
    this.toneMappingExposure = this.config.exposure;

    this.setSize(window.innerWidth, window.innerHeight)
    this.setPixelRatio(window.devicePixelRatio)

    document.body.appendChild(this.domElement);
  }
}