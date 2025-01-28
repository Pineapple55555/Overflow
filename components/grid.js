export class Grid {
    constructor(gridSize, squareSize) {
        this.group = new THREE.Group();
        for (let x = -gridSize / 2; x < gridSize / 2; x++) {
          for (let z = -gridSize / 2; z < gridSize / 2; z++) {
            const color = (x + z) % 2 === 0 ? 0x4F7CAC : 0x2A3680;
            const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
            const squareMaterial = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            square.rotation.x = -Math.PI / 2;
            square.position.set(x + 0.5, 0, z + 0.5);
            this.group.add(square);
          }
        }
      }
    
      getGroup() {
        return this.group;
      }
  }