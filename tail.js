import { Snake } from '/components/snake.js';

export class Tail extends Snake {
    constructor(color) {
        super();

        // Set the color based on the input
        this.ball.material.color.set(color);

        this.positions = []; // To keep track of previous positions of the head
    }

    update(headPosition) {
        // Update the tail's position to follow the head
        if (this.positions.length >= this.tailSize) {
            this.positions.shift();
        }
        this.positions.push(headPosition.clone());

        // Update the tail segment's position
        if (this.positions.length > 0) {
            const nextPosition = this.positions[0];
            this.ball.position.set(nextPosition.x, this.ball.position.y, nextPosition.z);
        }
    }

    addSegment() {
        this.tailSize++;
    }

    removeSegment() {
        this.tailSize = Math.max(0, this.tailSize - 1);
    }
}
