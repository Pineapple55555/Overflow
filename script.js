// Scene setup
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a chessboard-style grid plane
const gridSize = 17; // Total grid size
const squareSize = 1; // Size of each square
const chessboardGroup = new THREE.Group();

for (let x = -gridSize / 2; x < gridSize / 2; x++) {
  for (let z = -gridSize / 2; z < gridSize / 2; z++) {
    const color = (x + z) % 2 === 0 ? 0x646464 : 0x202020; // Alternate colors
    const squareGeometry = new THREE.PlaneGeometry(squareSize, squareSize);
    const squareMaterial = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    const square = new THREE.Mesh(squareGeometry, squareMaterial);
    square.rotation.x = -Math.PI / 2; // Rotate to lie flat
    square.position.set(x + 0.5, 0, z + 0.5); // Center each square
    chessboardGroup.add(square);
  }
}
scene.add(chessboardGroup);

// Create a sphere (ball)
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Radius, width segments, height segments
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); // Ball color
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.y = 0.3; // Position the ball above the plane
scene.add(ball);

// Position the camera for a top-down view
camera.position.set(0, 13, 0); // Higher camera position
camera.lookAt(0, 0, 0);

// Movement variables
const gridStep = 1; // Size of each grid cell
let direction = new THREE.Vector2(0, 0); // Initial direction (x, z)
let lastUpdateTime = 0;

// Listen for keyboard events
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') {
    direction.set(0, -1); // Move up
  } else if (key === 'arrowdown' || key === 's') {
    direction.set(0, 1); // Move down
  } else if (key === 'arrowleft' || key === 'a') {
    direction.set(-1, 0); // Move left
  } else if (key === 'arrowright' || key === 'd') {
    direction.set(1, 0); // Move right
  }
});

// Render loop
function animate(time) {
  requestAnimationFrame(animate);

  // Update position based on direction at regular intervals
  if (time - lastUpdateTime > 200) { // 200ms per grid movement
    ball.position.x = THREE.MathUtils.clamp(
      ball.position.x + direction.x * gridStep,
      -gridSize / 2 + 0.5, gridSize / 2 - 0.5
    );
    ball.position.z = THREE.MathUtils.clamp(
      ball.position.z + direction.y * gridStep,
      -gridSize / 2 + 0.5, gridSize / 2 - 0.5
    );
    lastUpdateTime = time;
  }

  renderer.render(scene, camera);
}

animate(0);
