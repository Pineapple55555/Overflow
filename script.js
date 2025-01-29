// Import THREE.js
import { Game } from '/components/game.js';
import * as ui from '/components/ui.js';
// Main
const game = new Game();
game.start();

  
// Call the update function when the page loads
window.onload = function() {
    ui.updateTargetNumber();
};