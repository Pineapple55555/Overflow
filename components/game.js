import { Camera } from '/components/camera.js';
import { Grid } from '/components/grid.js';
import { Head } from '/components/head.js';
import { Tail } from '/components/tail.js';
import { Binary } from '/components/binaryBits.js';
import { Ui } from '/components/ui.js';
import { Environment } from '/components/env.js';



export class Game {
    active = false
    

    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.gridSize = 17;
        this.squareSize = 1;
        this.gridStep = 1;
        this.lastUpdateTime = 0;
        this.isAlternateTheme = false;
        this.currentPoints = 0
        
        // Set up camera and grid
        this.camera = new Camera(window.innerWidth, window.innerHeight);
        this.grid = new Grid(this.gridSize, this.squareSize);
        this.ui = new Ui()
        this.ui.updateTargetNumber();
        this.ui.updatePoints(this.currentPoints);
        this.tailSegments = [];
        this.positionQueue = [];
        this.snakeList = [];
        this.currentBinary = null
        this.defaultStockData = { price_usd: 0.002312, market_cap: 1234567 };

        //env setup
        //this.environmentHandler = new Environment(this.scene, this.renderer, this.camera)
        //this.environmentHandler.shaders()
    
        // Generate binary grid
        this.binary = new Binary();
        this.binaryGroup = null;
        this.generateLevel()
        
        // Add objects to scene
        this.scene.add(this.grid.getGroup());
    
        this.head = new Head(this);  
        this.scene.add(this.head.getBall());
    
        // Set up renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // window listener
        /*
        window.addEventListener('keydown', (event) => {
            if (event.key === 'F12') {
                setTimeout(() => {
                    resizeScene();
                }, 100); // Slight delay to allow DevTools to open
            }
        });
        window.addEventListener('resize', resizeScene);
        */
    
        // Keyboard listener
        document.addEventListener("keydown", (event) => this.handleInput(event));

        // Listen for collision events
        this.head.addEventListener("homeCollision", (event) => {
            //gets snake list, this.snakeList, and runs a check
            this.checkBinary(this.snakeList)
            this.snakeList = []

        });
        document.addEventListener("playerDied", (event) => {
            console.log("Resetting score due to death. Reason:", event.detail.reason);
            this.currentPoints = 0;
            console.log("reset first" + this.snakeList.length)
            this.ui.updateTargetNumber();
            this.ui.updatePoints(this.currentPoints);/////////
            console.log(this.snakeList.length)
        });
        this.movementQueue = []; // Stores upcoming moves

    }
    clearLevel(){
        while (this.binaryGroup.children.length > 0) {
            const child = this.binaryGroup.children.pop();
            this.binaryGroup.remove(child);
            child.geometry.dispose();
            child.material.dispose();
        }
    }
    generateLevel() {
        this.binary.generateBinary(this.defaultStockData, this.gridSize, 8).then((group) => {
            this.binaryGroup = group;
            this.scene.add(this.binaryGroup);
        });
        
}
    /*
    resizeScene() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update camera aspect ratio and projection matrix
        this.camera.getCamera().aspect = width / height;
        this.camera.getCamera().updateProjectionMatrix();

        // Update renderer size
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    } */
    
    checkBinary(userBinary) {
        console.log("user", userBinary);
        console.log("comparison", this.ui.currentBinary.split(''));

        // ✅ Convert userBinary to a string and pad with leading 0s if needed
        let paddedUserBinary = userBinary.map(String).join('').padStart(8, '0');

        // ✅ Ensure the comparison binary is also 8 characters
        let targetBinary = this.ui.currentBinary.padStart(8, '0').split('');

        console.log("Padded user binary:", paddedUserBinary);
        console.log("Target binary:", targetBinary);

        // ✅ Compare the padded binary with the stored binary
        if (paddedUserBinary.length === targetBinary.length &&
            paddedUserBinary.split('').every((bit, index) => bit === targetBinary[index])) {
            console.log("✅ Binary match!");
            this.pointsManager(10)
            const scoreSound = new Audio('/assets/score.mp3');
            scoreSound.play();
            this.end();
        } else {
            console.log("❌ Binary mismatch.");
            if (this.currentPoints > 0) {
                this.pointsManager(-5)
            }
            console.log("sound first" + this.snakeList.length)
            if (this.snakeList.length > 0) {
            const incorrectSound = new Audio('/assets/incorrect.mp3');
            incorrectSound.play();
            }
        
        }
        this.end();
    }


    pointsManager(points) {
        //adds points and updates anything that needs updating
        console.log("adds points");
        this.currentPoints += points
        this.ui.updateTargetNumber();
        this.ui.updatePoints(this.currentPoints);
    }

    animate(time) {
        requestAnimationFrame((t) => this.animate(t));
    
        if (time - this.lastUpdateTime > 200) {
            // Apply the next valid direction if queued
            if (this.movementQueue.length > 0) {
                const nextMove = this.movementQueue.shift(); // Get the next move
                this.head.setDirection(nextMove.x, nextMove.y);
            }
    
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
        this.clearDisplay();
    }
    
    

    addTailSegment(type) {
        let texturePath, baseColor;
    
        if (this.isAlternateTheme) { // 🔥 Hell Mode
            texturePath = type === 0 ? "/assets/ben_0.png" :
                          type === 1 ? "/assets/ben_1.png" :
                                       "/assets/blank.png";
            baseColor = type === 0 ? 0xfc3705 : type === 1 ? 0x5c1605 : 0x808080;
        } else { // 🔵 Normal Mode
            texturePath = type === 0 ? "/assets/0.png" :
                          type === 1 ? "/assets/1.png" :
                                       "/assets/blank.png";
            baseColor = type === 0 ? 0x000000 : type === 1 ? 0xffffff : 0x808080;
        }
    
        const newTailSegment = new Tail(texturePath, baseColor);
        const referenceBall = this.tailSegments.length > 0 
            ? this.tailSegments[this.tailSegments.length - 1].getBall()
            : this.head.getBall();
    
        newTailSegment.getBall().position.copy(referenceBall.position.clone());
        this.tailSegments.push(newTailSegment);
        this.scene.add(newTailSegment.getBall());
    
        this.head.tailSize++;
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
            
                // Play munch sound
                const munchSound = new Audio('/assets/munch.mp3');
                munchSound.play();
            
                this.snakeList.push(cube.value);
                this.addTailSegment(cube.value);
                
            

                // Remove the cube from the group and scene
                this.binaryGroup.remove(cube);
                this.scene.remove(cube);
            }
        });
    }

    handleInput(event) {
        const key = event.key.toLowerCase();
    
        if (this.head.onHomeSquare) {
            console.log("🏡 Leaving home, movement allowed again!");
            this.active = true;
            this.head.ye = false;
        }
    
        if (key === 'x') {
            console.log("hell mode")
            this.isAlternateTheme = !this.isAlternateTheme;
            this.grid.toggleGridColors(this.isAlternateTheme);
            this.ui.updateFavicon(this.isAlternateTheme);
            this.ui.updateSegments(this.snakeList, this.isAlternateTheme);
            this.head.updateHeadAppearance(this.isAlternateTheme);
        }
        const lastX = this.head.direction.x;
        const lastY = this.head.direction.y;
    
        let nextX = lastX;
        let nextY = lastY;
    
        // Determine next direction based on key press
        if ((key === 'arrowup' || key === 'w') && lastY === 0) {
            nextX = 0;
            nextY = -1;
        } else if ((key === 'arrowdown' || key === 's') && lastY === 0) {
            nextX = 0;
            nextY = 1;
        } else if ((key === 'arrowleft' || key === 'a') && lastX === 0) {
            nextX = -1;
            nextY = 0;
        } else if ((key === 'arrowright' || key === 'd') && lastX === 0) {
            nextX = 1;
            nextY = 0;
        } else {
            return; // Ignore invalid inputs
        }
        
        console.log("hellllllll pls")
        // Push to movement queue (max 2 moves to prevent excessive buffering)
        if (this.movementQueue.length < 2) {
            this.movementQueue.push({ x: nextX, y: nextY });
        }
    }
    

    clearDisplay() {
        this.ui.updateSegments(this.snakeList, this.isAlternateTheme);
    }
    
    start() {
        
        console.log("Starting game...");
        this.animate(0);
        this.active = true
    }
    
    end(){
        if (this.active) {
            this.clearLevel()
            this.generateLevel()
        }
        // change active to false
        this.active = false
        console.log("game end")
        // manage points
        
        
    }
}
