export class Grid {
    constructor(gridSize, squareSize) {
        this.group = new THREE.Group();
        this.gridSize = gridSize;
        this.squareSize = squareSize;
        this.isAlternateTheme = false; // ✅ Track the current theme

        // ✅ Create (0,0) first with a separate material
        const homeGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
        this.homeMaterial = new THREE.MeshBasicMaterial({
            color: 0xDA70D6, //  Default Purple
            side: THREE.DoubleSide,
        });

        this.homeTile = new THREE.Mesh(homeGeometry, this.homeMaterial);
        this.homeTile.rotation.x = -Math.PI / 2;
        this.homeTile.position.set(0, 0.01, 0);
        this.group.add(this.homeTile);

        // ✅ Create grid squares
        this.squares = [];
        for (let x = -gridSize / 2; x < gridSize / 2; x++) {
            for (let z = -gridSize / 2; z < gridSize / 2; z++) {
                if (x === 0 && z === 0) continue; // Skip (0,0)

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
                this.squares.push(square);
            }
        }

        // ✅ Create 3D Border
        //this.createBorder(gridSize, squareSize);
    }

    createBorder(gridSize, squareSize) {
        const homeGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
        const homeMaterial = new THREE.MeshBasicMaterial({
            color: 0xDA70D6, // Default Purple
            side: THREE.DoubleSide,
        });
    }

    getGroup() {
        return this.group;
    }

    // ✅ Toggle grid colors between default and crimson/orange
    toggleGridColors(isAlternateTheme) {
    
        this.squares.forEach((square, index) => {
            if (isAlternateTheme) {
                square.material.color.setHex((index % 2 === 0) ? 0xfc3705 : 0x5c1605); // 🔥 Crimson & Dark Orange
            } else {
                square.material.color.setHex((index % 2 === 0) ? 0x4F7CAC : 0x2A3680); // 🔵 Default Blue Shades
            }
            square.material.needsUpdate = true;
        });
    }
}
