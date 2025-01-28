import { Snake } from '/components/snake.js';

export class Head extends Snake {
    constructor() {
        super();
        // Optionally, customize the head's appearance
        this.ball.material.color.set(0xff0000); // Set to red for distinction
    }

    move(gridSize, gridStep) {
        // Same logic as Snake's move, but could be extended
        super.move(gridSize, gridStep);
    }
}
