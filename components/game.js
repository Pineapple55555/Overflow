import { Camera } from '/components/camera.js';
import { Grid } from '/components/grid.js';
import { Head } from '/components/head.js';
import { Tail } from '/components/tail.js';
import { Binary } from '/components/binaryBits.js';

export class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.gridSize = 17;
        this.squareSize = 1;
        this.gridStep = 1;
        this.lastUpdateTime = 0;

        // Set up camera, grid, head, and tail
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.grid = new Grid(this.gridSize, this.squareSize);
        this.head = new Head();
        this.tail = new Tail();
        this.binary = new Binary();

        // Add objects to the scene
        this.scene.add(this.grid.getGroup());
        this.scene.add(this.head.getBall());
        this.scene.add(this.tail.getBall()); // Tail's first segment
        this.binary.generateBinary()

        // Set up renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Keyboard input listener
        document.addEventListener('keydown', (event) => this.handleInput(event));
    }


    handleInput(event) {
        const key = event.key.toLowerCase();

        // Movement logic
        if (key === 'arrowup' || key === 'w') {
            this.head.setDirection(0, -1);
        } else if (key === 'arrowdown' || key === 's') {
            this.head.setDirection(0, 1);
        } else if (key === 'arrowleft' || key === 'a') {
            this.head.setDirection(-1, 0);
        } else if (key === 'arrowright' || key === 'd') {
            this.head.setDirection(1, 0);
        }

        // Extend the snake with Space
        if (key === ' ') {
            this.tail.addSegment();
        }

        // Remove a segment with Alt
        if (event.altKey) {
            this.tail.removeSegment();
        }
    }

    animate(time) {
        requestAnimationFrame((t) => this.animate(t));

        // Update position at regular intervals
        if (time - this.lastUpdateTime > 200) {
            this.head.move(this.gridSize, this.gridStep);
            this.tail.update(this.head.getBall().position);
            this.lastUpdateTime = time;
        }

        this.renderer.render(this.scene, this.camera.getCamera());
    }

    start() {
        this.animate(0);
    }
}
