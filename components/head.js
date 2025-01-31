import { Snake } from '/components/snake.js';

export class Head extends Snake {
    constructor(game) {
        super(0.5);
        this.game = game;
        this.textureLoader = new THREE.TextureLoader();
        this.isHellMode = false; // Track current mode

        this.ball.material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF, // ✅ Ensure no tinting
            transparent: true,
        });

        this.loadTexture('/assets/head.png'); // Load default texture
        this.ball.rotation.x = Math.PI / 2;
    }

    // ✅ Function to load a texture dynamically
    loadTexture(texturePath) {
        this.textureLoader.load(
            texturePath,
            (texture) => {
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;

                this.ball.material.map = texture;
                this.ball.material.color.set(0xFFFFFF); // ✅ Ensure no tinting
                this.ball.material.needsUpdate = true;
            },
            undefined,
            () => {
                console.error(`❌ Failed to load texture: ${texturePath}`);
            }
        );
    }

    // ✅ Function to toggle head appearance
    updateHeadAppearance(isAlternateTheme) {
        this.isHellMode = isAlternateTheme;
        const newTexture = isAlternateTheme ? "/assets/gernot.png" : "/assets/head.png";
        console.log(newTexture)
        this.loadTexture(newTexture);
        console.log(`🐍 Head texture changed to ${isAlternateTheme ? "🔥 Hell Mode" : "🔵 Normal Mode"}`);
    }

    move(gridSize, gridStep) {
        super.move(gridSize, gridStep);

        // Rotate the head based on movement direction (yaw only)
        const angle = Math.atan2(-this.direction.y, this.direction.x); // Calculate direction angle
        this.ball.rotation.set(Math.PI / 2, 0, -angle); // Lock pitch (X) and roll (Z)
    }
}


