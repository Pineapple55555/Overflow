export class Camera {
    constructor(width, height) {
        this.camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
        );
        this.camera.position.set(0, 13, 0);
        this.camera.lookAt(0, 0, 0);
      }
    
      getCamera() {
        return this.camera;
      }
  }