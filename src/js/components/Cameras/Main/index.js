import OrthographicCamera from '../OrthographicCamera';
import Global from '../../../core/Global';

class MainCamera extends OrthographicCamera {
  constructor() {
    super();
    this.addControls(Global.main.renderer.domElement);
    // this.controls.enableZoom = false;
    this.controls.rotateSpeed = 0;
  }
}

export default MainCamera;
