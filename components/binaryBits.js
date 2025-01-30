import { DataHandler } from '/components/dataHandler.js';

export class Binary {
  static defaultSize = 0.5;
  static defaultColor0 = 0x000000; // Black for 0
  static defaultColor1 = 0xffffff; // White for 1

  constructor(x, y, z, value) {
    const width = Binary.defaultSize * 1.5;
    const height = 0.2; // Flat
    const depth = Binary.defaultSize * 1.5;
    
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      value === 1 ? '/assets/tasty_1.png' : '/assets/tasty_0.png'
    );
    
    const geometry = new THREE.BoxGeometry(width, height, depth); // Book-like cuboid
    const material = new THREE.MeshBasicMaterial({ map: texture });
    
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(x, z, y);
    this.cube.value = value;
    
    this.boundingBox = new THREE.Box3().setFromObject(this.cube);
  }

  async generateBinary(stockData, gridSize, bitCount) {
    const dataSet = new DataHandler(stockData, gridSize, bitCount);
    const positions = await dataSet.generatePositions();
    console.log(positions);

    const group = new THREE.Group();
    
    positions.forEach((pos) => {
      const slate = new Binary(
        pos.x - gridSize / 2 + 0.5,
        pos.y - gridSize / 2 + 0.5,
        0,
        pos.value
      );
      group.add(slate.getBinary());
    });

    return group;
  }

  getBinary() {
    return this.cube;
  }

  static setDefaultSize(newSize) {
    Binary.defaultSize = newSize;
  }
}
