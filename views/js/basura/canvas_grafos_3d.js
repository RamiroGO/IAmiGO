// Configuración de la escena, la cámara y el renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Añadir controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Añade un suavizado al movimiento de la cámara

// Datos del grafo
const nodes = [
    { id: "A", position: new THREE.Vector3(0, 0, 0) },
    { id: "B", position: new THREE.Vector3(1, 1, 1) },
    { id: "C", position: new THREE.Vector3(-1, -1, -1) }
];

const links = [
    { source: "A", target: "B" },
    { source: "A", target: "C" }
];

// Crear nodos
nodes.forEach(node => {
    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x69b3a2 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(node.position);
    node.mesh = sphere;
    scene.add(sphere);
});

// Crear enlaces
links.forEach(link => {
    const material = new THREE.LineBasicMaterial({ color: 0x999999 });
    const points = [];
    const sourceNode = nodes.find(n => n.id === link.source);
    const targetNode = nodes.find(n => n.id === link.target);
    points.push(sourceNode.position);
    points.push(targetNode.position);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
});

// Configuración de la cámara
camera.position.set(0, 0, 5);

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualizar los controles de órbita en cada frame
    renderer.render(scene, camera);
}

animate();
