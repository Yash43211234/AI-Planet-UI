const scene = new THREE.Scene();

// Create and position the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); // Start at (0, 1, 5)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Set the background color
renderer.setClearColor(0xD3D3D3);

document.body.appendChild(renderer.domElement);

// Create lens geometry
const lensGeometry = new THREE.CircleGeometry(0.5, 32);
const lensMaterial = new THREE.MeshBasicMaterial({ color: 'lightblue', side: THREE.DoubleSide });

// Create left lens
const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
leftLens.position.x = -0.75; // Position to the left

// Create right lens
const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
rightLens.position.x = 0.55; // Position to the right

// Create frame geometry
const frameMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
const frameThickness = 0.05;

// Create left frame
const leftFrameGeometry = new THREE.RingGeometry(0.5, .51, 400 );
const leftFrame = new THREE.Line(leftFrameGeometry, frameMaterial);
leftFrame.position.x = -0.75;
leftFrame.position.y = 0;
leftFrame.position.z = 0.05;

// Create right frame
const rightFrameGeometry = new THREE.RingGeometry(0.5, .51, 400 );
const rightFrame = new THREE.Line(rightFrameGeometry, frameMaterial);
rightFrame.position.x = 0.54;
rightFrame.position.y =0;
rightFrame.position.z = 0.05;


// Create bridge of the eyeglasses
const bridgeGeometry = new THREE.BoxGeometry(0.3, .07, .02);
const bridgeMesh = new THREE.Mesh(bridgeGeometry, frameMaterial);
bridgeMesh.position.y = 0;
bridgeMesh.position.z = 0;
bridgeMesh.position.x = -.096;

// Create sticks for the eyeglasses
const stickLength = 1.5; 
const stickThickness = 0.02; 
const leftStickGeometry = new THREE.CylinderGeometry(stickThickness, stickThickness, stickLength, 16);
const rightStickGeometry = new THREE.CylinderGeometry(stickThickness, stickThickness, stickLength, 16);

const leftStick = new THREE.Mesh(leftStickGeometry, frameMaterial);
const rightStick = new THREE.Mesh(rightStickGeometry, frameMaterial);

// Position the left stick
leftStick.rotation.z = -Math.PI / 12;
leftStick.position.x = -1.08;
leftStick.position.y = .7;
leftStick.position.z = 0;

// Position the right stick
rightStick.rotation.z = Math.PI / 12;
rightStick.position.x = .87;
rightStick.position.y = .7;
rightStick.position.z = 0;

// Add all components to the scene
scene.add(leftLens);
scene.add(rightLens);
scene.add(leftFrame);
scene.add(rightFrame);
scene.add(bridgeMesh);
scene.add(leftStick);
scene.add(rightStick);

// Animation loop
let q = 0;
let scale = 1;

function animate() {
    // Apply the crushing effect
    // scale = 1 + 0.2 * Math.sin(q); // Creates a squeezing effect
    // leftLens.scale.set(scale, 1, 1);
    // rightLens.scale.set(scale, 1, 1);
    // leftFrame.scale.set(scale, 1, 1);
    // rightFrame.scale.set(scale, 1, 1);
    // bridgeMesh.scale.set(scale, 1, 1);
    // leftStick.scale.set(scale, 1, 1);
    // rightStick.scale.set(scale, 1, 1);

    // Update rotation for dynamic effect
    leftLens.rotation.x -= 0.01;
    rightLens.rotation.x -= 0.01;
    leftFrame.rotation.x -= 0.01;
    rightFrame.rotation.x -= 0.01;
    bridgeMesh.rotation.x += 0.01;
    // leftStick.rotation.x += 0.01;
    // rightStick.rotation.x += 0.01;

    q += 0.1; // Increment q for smooth animation

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Camera movement control
const keyboard = {};

window.addEventListener('keydown', (event) => {
    keyboard[event.code] = true;
});

window.addEventListener('keyup', (event) => {
    keyboard[event.code] = false;
});

function moveCamera() {
    const speed = 0.1;

    if (keyboard['ArrowUp'] || keyboard['KeyW']) {
        camera.position.z -= speed; // Move forward
    }
    if (keyboard['ArrowDown'] || keyboard['KeyS']) {
        camera.position.z += speed; // Move backward
    }
    if (keyboard['ArrowLeft'] || keyboard['KeyA']) {
        camera.position.x -= speed; // Move left
    }
    if (keyboard['ArrowRight'] || keyboard['KeyD']) {
        camera.position.x += speed; // Move right
    }

    requestAnimationFrame(moveCamera);
}
// moveCamera();

animate();
