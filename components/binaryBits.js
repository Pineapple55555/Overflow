import { DataHandler } from '/components/dataHandler.js';

export class Binary {
  static defaultSize = 0.7;
  static defaultColor = 0x00ff00;

  constructor(x, y, z, value, text = "") {
    const size = Binary.defaultSize;
    const color = Binary.defaultColor;

    const geometry = new THREE.BoxGeometry(size, size, size);
    const materialArray = [];
    
    for (let i = 0; i < 6; i++) { 
      materialArray.push(new THREE.MeshBasicMaterial({ color }));
    }

    this.cube = new THREE.Mesh(geometry, materialArray);
    this.cube.position.set(x,z,y);
    this.cube.value = value

    this.boundingBox = new THREE.Box3().setFromObject(this.cube);
  }

  async generateBinary(stockData, gridSize, bitCount) {
    const dataSet = new DataHandler(stockData, gridSize, bitCount);
    const positions = await dataSet.generatePositions(); // positions = x,y,0/1
    console.log(positions)

    // Create cubes based on positions
    const group = new THREE.Group();

    
    positions.forEach((pos, index) => {
      const cube = new Binary(pos.x - (gridSize / 2)+0.5, pos.y - (gridSize / 2)+0.5, 0, pos.value);  // Adjust z if necessary
      group.add(cube.getBinary());
    });

    return group; // Return the group containing all cubes
  }

  getBinary() {
    return this.cube;
  }

  static setDefaultSize(newSize) {
    Binary.defaultSize = newSize;
  }

  static setDefaultColor(newColor) {
    Binary.defaultColor = newColor;
  }
}
