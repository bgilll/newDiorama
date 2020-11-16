import Signal from 'min-signal';

class Signals {
  constructor() {
    // Global
    this.assetsLoaded = new Signal();

    // Nav
    this.cellSelected = new Signal();
    this.cellHovered = new Signal();
    this.clearHover = new Signal();

    // Moving
    this.moveFinished = new Signal();

    // Window
    this.onResize = new Signal();

    this.bind();
  }

  bind() {
    this.handleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.onResize.dispatch(window.innerWidth, window.innerHeight)
  }
}

export default new Signals()