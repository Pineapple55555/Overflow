export class Grid {
  constructor(gridSize, squareSize) {
      this.group = new THREE.Group();

      // ✅ Create (0,0) first with a separate material
      const homeGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
      const homeMaterial = new THREE.MeshBasicMaterial({
          color: 0xDA70D6, //  Purple
          side: THREE.DoubleSide,
      });

      this.homeTile = new THREE.Mesh(homeGeometry, homeMaterial);
      this.homeTile.rotation.x = -Math.PI / 2;
      this.homeTile.position.set(0, 0.01, 0);  // ✅ Raise it slightly to prevent overlap
      this.group.add(this.homeTile);

      // ✅ Now create the rest of the grid
      for (let x = -gridSize / 2; x < gridSize / 2; x++) {
          for (let z = -gridSize / 2; z < gridSize / 2; z++) {
              // Skip (0,0) since we already made it
              if (x === 0 && z === 0) continue;

              let color = (x + z) % 2 === 0 ? 0x4F7CAC : 0x2A3680;

              const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
              const squareMaterial = new THREE.MeshBasicMaterial({
                  color,
                  side: THREE.DoubleSide,
              });

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
