const container = document.querySelector('#three-container');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.set(0, 1.6, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(-3, 10, -10);
scene.add(dirLight);

// Load local .glb avatar
let avatar;
const loader = new THREE.GLTFLoader();
loader.load(
    'assets/models/avatar.glb', // <-- your offline .glb relative path
    (gltf) => {
        avatar = gltf.scene;
        avatar.scale.set(1, 1, 1); // Adjust size if needed
        avatar.position.set(0, 0, 0);
        scene.add(avatar);
    },
    undefined,
    (error) => console.error(error)
);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (avatar) avatar.rotation.y += 0.005;
    renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
