export class Snake {
    constructor() {
      // Snake Stuff Here
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.position.y = 0.3;
        this.direction = new THREE.Vector2(0, 0);
        this.tailSize = 0
      }
    
      getBall() {
        return this.ball;
      }
    
      setDirection(x, y) {
        this.direction.set(x, y);
      }
    
      move(gridSize, gridStep) {
        this.ball.position.x = THREE.MathUtils.clamp(
          this.ball.position.x + this.direction.x * gridStep,
          -gridSize / 2 + 0.5,
          gridSize / 2 - 0.5
        );
        this.ball.position.z = THREE.MathUtils.clamp(
          this.ball.position.z + this.direction.y * gridStep,
          -gridSize / 2 + 0.5,
          gridSize / 2 - 0.5
        );
      }
      addTail() {
        
      }
      removeTail() {
        
      }
  
  }