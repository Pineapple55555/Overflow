// parent class for Head and Tail child classes
export class Snake extends EventTarget{
    constructor(size = 0.5) {
        super();
        // physical ball setup
        const ballGeometry = new THREE.SphereGeometry(size, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
        this.ball.position.y = 0.3;
        this.direction = new THREE.Vector2(0, 0);
        this.tailSize = 0; 
        this.previousPositions = [];    // array for self collisions
    }
  
    getBall() {
        return this.ball;
    }
  
    setDirection(x, y) {
        // Prevent reversing direction
        if (this.direction.x === -x && this.direction.y === -y) {
            return;  // Block input if trying to reverse
        }
    
        this.direction.set(x, y);
    }

  
    move(gridSize, gridStep) {
        // Store the original position before updating it
        const originalX = this.ball.position.x;
        const originalZ = this.ball.position.z;
    
        // Move the ball based on direction and gridStep
        this.ball.position.x += this.direction.x * gridStep;
        this.ball.position.z += this.direction.y * gridStep;
    
        // Stop movement and reset tail if (0,0) is reached
        if (this.ball.position.x === 0 && this.ball.position.z === 0) {
            if (!this.onHomeSquare) {  // Prevent multiple resets
                console.log("🏡 Snake reached home! Resetting tail.");
                this.onHomeSquare = true;
                if (this.game && typeof this.game.clearTail === "function") {
                    this.dispatchEvent(new CustomEvent("homeCollision"));
                    this.game.clearTail();  // Reset the tail
                    this.tailSize = 0;
                }
                this.direction.set(0, 0);  // Stop movement
            }
            return;
        } else {
            this.onHomeSquare = false;  // Allow movement again after leaving (0,0)
        }
    
        // ✅ Check if tail size is too large
        if (this.tailSize > 8) {
            console.log("Overflow!");
            this.death("overflow");
            return;
        }
    
        // Check for wall collision (if position goes out of bounds)
        if (this.ball.position.x < -gridSize / 2 + 0.5 || this.ball.position.x > gridSize / 2 - 0.5 ||
            this.ball.position.z < -gridSize / 2 + 0.5 || this.ball.position.z > gridSize / 2 - 0.5) {
            this.death("collided with wall");
            return;
        }
    
        // ✅ Check for self-collision after moving
        if (this.isCollidingWithItself(this.ball.position.x, this.ball.position.z)) {
            this.death("collided with itself");
            return;
        }
    
        // ✅ Store the old head position as part of the tail before moving
        if (this.tailSize > 0) {
            this.previousPositions.push({ x: originalX, z: originalZ });
    
            // ✅ Ensure `previousPositions` only stores `tailSize` positions
            if (this.previousPositions.length > this.tailSize) {
                this.previousPositions.shift();
            }
        }
    }
    
    
  
  // Helper function to check if the ball is colliding with itself
  isCollidingWithItself(x, z) {
    if (this.previousPositions.length === 0) return false;

    // ✅ Ensure we are only checking actual tail segments
    for (let i = 0; i < this.previousPositions.length; i++) {
        if (this.previousPositions[i].x === x && this.previousPositions[i].z === z) {
            console.log("💀 Self-collision detected at:", x, z);
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
        this.tailSize = 0
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