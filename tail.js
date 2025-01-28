import { Snake } from '/components/snake.js';

export class Tail extends Snake {
    constructor(texturePath) {
        super(0.4);

        this.positions = []; // Initialize positions array

        const loader = new THREE.TextureLoader();
        loader.load(texturePath, (texture) => {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;

            this.ball.material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
            });

            this.ball.material.needsUpdate = true;
        });

        // Rotate the ball to fix texture alignment
        this.ball.rotation.x = Math.PI / 2; // Adjust if necessary
        this.ball.rotation.y = Math.PI / 2;
    }

    update(headPosition) {
        if (this.positions.length >= this.tailSize) this.positions.shift(); 
        this.positions.push(headPosition.clone());

        if (this.positions.length > 0) {
            const nextPosition = this.positions[0];
            this.ball.position.set(nextPosition.x, this.ball.position.y, nextPosition.z);
        }
    }
}
