export class Snake {
    constructor(size = 0.5) {
        this.previousPositions = [];   
        const ballGeometry = new THREE.SphereGeometry(size, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.y = 0.3;
        this.direction = new THREE.Vector2(0, 0);
        this.tailSize = 0;
    }
  
    getBall() {
        return this.ball;
    }
  
    setDirection(x, y) {
        this.direction.set(x, y);
    }
  
    move(gridSize, gridStep) {
      // Store the original position before updating it
      const originalX = this.ball.position.x;
      const originalZ = this.ball.position.z;
  
      // Move the ball based on direction and gridStep
      this.ball.position.x += this.direction.x * gridStep;
      this.ball.position.z += this.direction.y * gridStep;
  
      // Check for wall collision (if position goes out of bounds)
      if (this.ball.position.x < -gridSize / 2 + 0.5 || this.ball.position.x > gridSize / 2 - 0.5 ||
          this.ball.position.z < -gridSize / 2 + 0.5 || this.ball.position.z > gridSize / 2 - 0.5) {
          this.death("collided with wall");
          return; // Exit early if collision with wall
      }
  
      // Check for self-collision (you need to maintain previous positions of the ball)
      if (this.isCollidingWithItself(this.ball.position.x, this.ball.position.z)) {
          this.death("collided with itself");
          return; // Exit early if collision with itself
      }
  
      // After all checks, store the current position in previous positions for self-collision detection
      this.previousPositions.push({ x: this.ball.position.x, z: this.ball.position.z });

        // Keep only tailSize number of positions
        if (this.previousPositions.length > this.tailSize) {
            this.previousPositions.shift();  // Remove oldest position
}


        // Keep only tailSize number of positions
        if (this.previousPositions.length > this.tailSize) {
            this.previousPositions.shift(); 
        }

        if (this.isCollidingWithItself(this.ball.position.x, this.ball.position.z)) {
            console.log("Collision detected!");
            this.death("collided with itself");
            return;
        }
        console.log("Head Position:", this.ball.position.x, this.ball.position.z);
        console.log("Tracked Tail Positions:", this.previousPositions);

  }
  
  // Helper function to check if the ball is colliding with itself
  isCollidingWithItself(x, z) {
    if (this.previousPositions.length === 0) return false;

    // Ignore the last position (the head's current position)
    for (let i = 0; i < this.previousPositions.length - 1; i++) {
        if (this.previousPositions[i].x === x && this.previousPositions[i].z === z) {
            return true;
        }
    }
    return false;
}


  
  // Handle death (trigger event, reset game, etc.)
  death(reason) {
    console.log("Game Over! Reason: " + reason);
    
    if (this.game && typeof this.game.clearTail === "function") {  
        this.game.clearTail();
    }

    this.resetGame();
}
  
  // Example reset game function
  resetGame() {
      // Reset game state (adjust according to your game logic)
      this.ball.position.set(0, 0, 0); // Reset ball position
      this.previousPositions = []; // Clear previous positions
      this.direction.set(0, 0); // Reset direction
      console.log("Game reset!");
  }
  }