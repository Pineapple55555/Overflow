import { DataHandler } from '/components/dataHandler.js';

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

  async generateBinary() {
    const gridSize = 16; // Size of the board
    const bitCount = 8;  // Number of 0s and 1s to generate
    const stockData = { price_usd: 0.002312, market_cap: 1234567 }; // Example stock data

    const dataSet = new DataHandler(stockData, gridSize, bitCount);

    const positions = await dataSet.generatePositions();
    console.log('Generated Positions:', positions);

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

