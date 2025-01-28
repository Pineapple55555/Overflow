import { Camera } from '/components/camera.js';
import { Grid } from '/components/grid.js';
import { Snake } from '/components/snake.js';


export class Game {
    constructor() {
      this.scene = new THREE.Scene();
          this.renderer = new THREE.WebGLRenderer();
          this.gridSize = 17;
          this.squareSize = 1;
          this.gridStep = 1;
          this.lastUpdateTime = 0;
      
          // Set up camera, grid, and snake
          this.camera = new Camera(window.innerWidth, window.innerHeight);
          this.grid = new Grid(this.gridSize, this.squareSize);
          this.snake = new Snake();
      
          // Add objects to the scene
          this.scene.add(this.grid.getGroup());
          this.scene.add(this.snake.getBall());
      
          // Set up renderer
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          document.body.appendChild(this.renderer.domElement);
      
          // Keyboard input listener
          document.addEventListener('keydown', (event) => this.handleInput(event));
        }
      
        handleInput(event) {
          const key = event.key.toLowerCase();
          if (key === 'arrowup' || key === 'w') {
            this.snake.setDirection(0, -1);
          } else if (key === 'arrowdown' || key === 's') {
            this.snake.setDirection(0, 1);
          } else if (key === 'arrowleft' || key === 'a') {
            this.snake.setDirection(-1, 0);
          } else if (key === 'arrowright' || key === 'd') {
            this.snake.setDirection(1, 0);
          }
        }
      
        animate(time) {
          requestAnimationFrame((t) => this.animate(t));
      
          // Update position at regular intervals
          if (time - this.lastUpdateTime > 200) {
            this.snake.move(this.gridSize, this.gridStep);
            this.lastUpdateTime = time;
          }
      
          this.renderer.render(this.scene, this.camera.getCamera());
        }
      
        start() {
          this.animate(0);
        }
  }