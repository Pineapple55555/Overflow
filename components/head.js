import { Snake } from '/components/snake.js';

export class Head extends Snake {
    constructor() {
        super(0.5); // Head size (radius) is 0.5

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            '/assets/head.png',
            (texture) => {
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;

                this.ball.material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true, // Support transparency
                });

                this.ball.material.needsUpdate = true;
            },
            undefined,
            () => {
                console.error("Failed to load head texture!");
            }
        );

        // Align the sphere's front texture with the Z-axis
        this.ball.rotation.x = Math.PI / 2; // Rotate 90 degrees to align texture properly
    }

    move(gridSize, gridStep) {
        super.move(gridSize, gridStep);

        // Rotate the head based on movement direction (yaw only)
        const angle = Math.atan2(-this.direction.y, this.direction.x); // Calculate direction angle
        this.ball.rotation.set(Math.PI / 2, 0, -angle); // Lock pitch (X) and roll (Z)
    }
}


