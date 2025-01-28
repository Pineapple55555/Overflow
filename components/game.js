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
        this.tailSegments = []; // Array to hold tail segments
        this.positionQueue = []; // Queue for storing head positions for the tail

        // Stock data for generating binary grid
        const stockData = { price_usd: 0.002312, market_cap: 1234567 }; // Example stock data
        const binary = new Binary(); // Binary object for generating cubes
        this.binaryGroup = null;

        // Generate the binary grid
        binary.generateBinary(stockData, this.gridSize, 8) // gridSize and bitCount
            .then((group) => {
                this.binaryGroup = group; // Store the group of cubes
                this.scene.add(this.binaryGroup); // Add the group to the scene
            });

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
            const headPosition = this.head.getBall().position.clone(); // Save the current head position

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

            this.pickupChecker(); // Check for pickups

            this.lastUpdateTime = time;
        }

        this.renderer.render(this.scene, this.camera.getCamera());
    }

    addTailSegment(type) {
        let texturePath, baseColor;

        // Assign base colors and textures based on the type
        if (type === 0) {
            texturePath = '/assets/0.png'; // Texture for "0"
            baseColor = 0x000000; // Black for "0"
        } else if (type === 1) {
            texturePath = '/assets/1.png'; // Texture for "1"
            baseColor = 0xffffff; // White for "1"
        } else if (type === 2) {
            texturePath = '/assets/blank.png'; // Texture for "none"
            baseColor = 0x808080; // Grey for "none"
        }

        const newTailSegment = new Tail(texturePath, baseColor);

        // Position the new tail segment at the last segment or head
        const referenceBall = this.tailSegments.length > 0
            ? this.tailSegments[this.tailSegments.length - 1].getBall()
            : this.head.getBall();

        newTailSegment.getBall().position.copy(referenceBall.position.clone());

        this.tailSegments.push(newTailSegment);
        this.scene.add(newTailSegment.getBall());
    }

    removeLastSegment() {
        if (this.tailSegments.length > 0) {
            const segmentToRemove = this.tailSegments.shift(); // Removes the first segment
            this.scene.remove(segmentToRemove.getBall());

            // Remove the first element in the position queue, if it exists
            if (this.positionQueue.length > 0) {
                this.positionQueue.shift();
            }
        }
    }

    clearTail() {
        while (this.tailSegments.length > 0) {
            this.removeLastSegment();
        }
    }

    pickupChecker() {
        if (!this.binaryGroup) {
            console.warn("binaryGroup is not initialized yet.");
            return; // Exit early if binaryGroup is undefined
        }

        const headPosition = this.head.getBall().position; // Get the head's position

        // Loop through all cubes in the group
        this.binaryGroup.children.forEach((cube) => {
            const cubePosition = cube.position;

            // Check if the head's position matches the cube's position
            if (headPosition.x === cubePosition.x && headPosition.z === cubePosition.z) {
                console.log("Head is touching a cube!");

                // Remove the cube from the group and scene
                this.binaryGroup.remove(cube);
                this.scene.remove(cube);
            }
        });
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

        // Add tail segments with different types
        if (key === 'e') {
            this.addTailSegment(0); // Black (0)
        } else if (key === 'r') {
            this.addTailSegment(1); // White (1)
        } else if (key === 't') {
            this.addTailSegment(2); // Grey ("none")
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

    start() {
        this.animate(0);
    }
}
