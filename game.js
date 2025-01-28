import { Camera } from '/components/camera.js';
import { Grid } from '/components/grid.js';
import { Head } from '/components/head.js';
import { Tail } from '/components/tail.js';

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
        this.tailSegments = []; // Array to hold tail segments
        this.positionQueue = []; // Queue for storing head positions for the tail

        // Add objects to the scene
        this.scene.add(this.grid.getGroup());
        this.scene.add(this.head.getBall());

        // Set up renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Keyboard input listener
        document.addEventListener('keydown', (event) => this.handleInput(event));
    }

    animate(time) {
        requestAnimationFrame((t) => this.animate(t));

        // Update position at regular intervals
        if (time - this.lastUpdateTime > 200) {
            // Save the current head position for the tail to follow
            const headPosition = this.head.getBall().position.clone();
            
            // Move the head
            this.head.move(this.gridSize, this.gridStep);

            // Add the head's previous position to the queue
            this.positionQueue.push(headPosition);

            // Ensure the queue length matches the total number of tail segments
            while (this.positionQueue.length > this.tailSegments.length) {
                this.positionQueue.shift(); // Remove old positions
            }

            // Update the tail segments
            this.tailSegments.forEach((segment, index) => {
                if (this.positionQueue[index]) {
                    segment.update(this.positionQueue[index]);
                }
            });

            this.lastUpdateTime = time;
        }

        this.renderer.render(this.scene, this.camera.getCamera());
    }

    addTailSegment(color) {
        const newTailSegment = new Tail(color);

        // Reference the last segment or head
        const referenceBall = this.tailSegments.length > 0
            ? this.tailSegments[this.tailSegments.length - 1].getBall()
            : this.head.getBall();

        // Initialize the new tail segment's position to match the reference
        newTailSegment.getBall().position.copy(referenceBall.position.clone());

        this.tailSegments.push(newTailSegment);
        this.scene.add(newTailSegment.getBall());
    }

    removeLastSegment() {
        if (this.tailSegments.length > 0) {
            const segmentToRemove = this.tailSegments.pop();
            this.scene.remove(segmentToRemove.getBall());
            this.positionQueue.pop(); // Keep the queue aligned with the number of tail segments
        }
    }

    clearTail() {
        while (this.tailSegments.length > 0) {
            this.removeLastSegment();
        }
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

        // Add tail segments with different colors
        if (key === 'e') {
            this.addTailSegment(0xff0000); // Red for '0'
        } else if (key === 'r') {
            this.addTailSegment(0x0000ff); // Blue for "nothing"
        } else if (key === 't') {
            this.addTailSegment(0x00ff00); // Green for '1'
        }

        // Remove the last tail segment
        if (key === 'q') {
            this.removeLastSegment();
        }

        // Clear the entire tail
        if (key === 'x') {
            this.clearTail();
        }
    }
}
