export class Environment {
    constructor(scene, renderer, camera) {
        this.sunLocation = new THREE.Vector3(0, 13, -10)
        //this.sunRot = new THREE.Vector3
        //this.sunRot.lookAt(0, 0, 0);
        this.scene = scene;
        this.light = new THREE.PointLight(0xffaa00, 2, 10);
        this.lightSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffaa00 })
            );
        this.renderer = renderer
        this.camera = new THREE.OrthographicCamera()
        
    }
    binaryRiver() {
        const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float intensity = step(0.9, random(vec2(vUv.x, fract(vUv.y - mod(time * 0.1, 1.0)))));
    gl_FragColor = vec4(vec3(intensity), 1.0);
  }
`;

const binaryMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    time: { value: 0 }
  },
});

const geometry = new THREE.PlaneGeometry(100, 100);
const binaryPlane = new THREE.Mesh(geometry, binaryMaterial);
scene.add(binaryPlane);
        
    }
    shaders(){
        // Add a Light Behind the Grid
        this.light.position.set(0, 1, -3); // Behind the grid
        this.scene.add(this.light);
        const l = new THREE.PointLight(0xffff00,1.5,10)
        l.position.set(0,1,0);
        this.scene.add(l)
        
        const lightSphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const lightSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSphereMaterial);
        this.scene.add(lightSphere);

        // Optional: Small Sphere to Represent Light Source
        
        this.lightSphere.position.copy(this.light.position);
        this.scene.add(this.lightSphere);

        // Animation Loop
        
    }
    animate() {
        //requestAnimationFrame(this.animate);
        this.light.position.x = Math.sin(Date.now() * 0.002) * 3; // Move the light dynamically
        this.lightSphere.position.copy(this.light.position);
        this.renderer.render(this.scene, this.camera);
    
    }
}