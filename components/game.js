import { Camera } from '/components/camera.js';
import { Grid } from '/components/grid.js';
import { Head } from '/components/head.js';
import { Tail } from '/components/tail.js';
import { Binary } from '/components/binaryBits.js';

export class Game {
    active = false

    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.gridSize = 17;
        this.squareSize = 1;
        this.gridStep = 1;
        this.lastUpdateTime = 0;
        
        // Set up camera and grid
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.grid = new Grid(this.gridSize, this.squareSize);
        this.tailSegments = [];
        this.positionQueue = [];
        this.snakeList = [];
    
        // Generate binary grid
        const stockData = { price_usd: 0.002312, market_cap: 1234567 };
        this.binary = new Binary();
        this.binaryGroup = null;
        this.binary.generateBinary(stockData, this.gridSize, 8).then((group) => {
            this.binaryGroup = group;
            this.scene.add(this.binaryGroup);
        });
    
        // Add objects to scene
        this.scene.add(this.grid.getGroup());
    
        this.head = new Head(this);  
        this.scene.add(this.head.getBall());
    
        // Set up renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    
        // Keyboard listener
        document.addEventListener("keydown", (event) => this.handleInput(event));
    }
    
    gameManager() {
        //generate a number from randomly choosing a number in a json file
        getRandomLineFromJson('path/to/your/file.json').then(result => {
            if (result) {
                console.log('Random Line:', result.line);
                console.log('Index:', result.index);
            }
        });
        //display that number on the screen, where the user will work out which number it is
        //when user is home, check binary 
    }

    animate(time) {
    
        requestAnimationFrame((t) => this.animate(t));
    
        if (time - this.lastUpdateTime > 200) {
            const headPosition = this.head.getBall().position.clone();
            this.head.move(this.gridSize, this.gridStep);
            this.positionQueue.push(headPosition);
    
            while (this.positionQueue.length > this.tailSegments.length) {
                this.positionQueue.shift();
            }
    
            this.tailSegments.forEach((segment, index) => {
                if (this.positionQueue[index]) {
                    segment.update(this.positionQueue[index]);
                }
            });
    
            this.pickupChecker();
            this.lastUpdateTime = time;
        }
    
        this.renderer.render(this.scene, this.camera.getCamera());
    }
    

    addTailSegment(type) {
        let texturePath, baseColor;
    
        if (type === 0) {
            texturePath = "/assets/0.png";
            baseColor = 0x000000;
        } else if (type === 1) {
            texturePath = "/assets/1.png";
            baseColor = 0xffffff;
        } else {
            texturePath = "/assets/blank.png";
            baseColor = 0x808080;
        }
    
        const newTailSegment = new Tail(texturePath, baseColor);
        const referenceBall = this.tailSegments.length > 0 
            ? this.tailSegments[this.tailSegments.length - 1].getBall()
            : this.head.getBall();
    
        newTailSegment.getBall().position.copy(referenceBall.position.clone());
        this.tailSegments.push(newTailSegment);
        this.scene.add(newTailSegment.getBall());
    
        this.head.tailSize++;
        console.log("Tail Added! New Size:", this.head.tailSize);
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
                console.log("Head is touching a cube!", cube.value);
                this.snakeList.push(cube.value)
                this.addTailSegment(cube.value)
                this.end()

                // Remove the cube from the group and scene
                this.binaryGroup.remove(cube);
                this.scene.remove(cube);
            }
        });
    }

    handleInput(event) {
        const key = event.key.toLowerCase();
    
        // If the snake is at (0,0), allow movement again
        if (this.head.onRedSquare) {
            console.log("🏡 Leaving home, movement allowed again!");
            this.head.onRedSquare = false;
        }
    
        // Prevent reversing direction
        if ((key === 'arrowup' || key === 'w') && this.head.direction.y === 1) return;
        if ((key === 'arrowdown' || key === 's') && this.head.direction.y === -1) return;
        if ((key === 'arrowleft' || key === 'a') && this.head.direction.x === 1) return;
        if ((key === 'arrowright' || key === 'd') && this.head.direction.x === -1) return;
    
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
        
        /* 
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
        */
    }
    
    start() {
        console.log("Starting game...");
        this.animate(0);
        this.active = true
    }
    
    end(){
        this.active = false
        console.log("game end")
    }
}
