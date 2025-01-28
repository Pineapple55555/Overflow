 

export class Binary {
  static defaultSize = 0.7;
  static defaultColor = 0x00ff00;

  constructor(x, y, z, text = "") {
    const size = Binary.defaultSize;
    const color = Binary.defaultColor;

    const geometry = new THREE.BoxGeometry(size, size, size);
    const materialArray = [];

    for (let i = 0; i < 6; i++) { 
      materialArray.push(new THREE.MeshBasicMaterial({ color }));

    }

    this.cube = new THREE.Mesh(geometry, materialArray);
    this.cube.position.set(x, y, z);

    this.boundingBox = new THREE.Box3().setFromObject(this.cube);
  }

  getBinary() {
    return this.cube;
  }

  checkCollision() {
    this.boundingBox.setFromObject(this.cube);
    if (this.boundingBox.intersectsSphere(this.snake.boundingBox)) {
      this.scene.remove(this.cube); // Default: remove from scene
    }
  }

  static setDefaultSize(newSize) {
    Cube.defaultSize = newSize;
  }

  static setDefaultColor(newColor) {
    Cube.defaultColor = newColor;
  }
}
