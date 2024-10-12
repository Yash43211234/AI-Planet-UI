// Global Variables
let scene, camera, renderer, model;
let faceMesh;

// Initialize the Three.js scene
function initThreeJS() {
    // Check if THREE is defined
    if (typeof THREE === 'undefined') {
        console.error("THREE is not defined. Check if the Three.js library is loaded correctly.");
        return;
    }

    // Your Three.js initialization code...
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    camera.position.z = 2; // Adjust camera position
}


// Load the 3D model
function loadModel() {
    const loader = new THREE.GLTFLoader();
    loader.load('models/your_model.gltf', function(gltf) {
        model = gltf.scene;  // Assign loaded model to the global variable
        scene.add(model);    // Add model to the scene
        model.scale.set(0.5, 0.5, 0.5); // Scale the model if necessary
    }, undefined, function(error) {
        console.error('Error loading model:', error);
    });
}

// Update model position based on face landmarks
function onResults(results) {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        console.error("No face landmarks detected.");
        return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const nose = landmarks[1]; // Use the nose landmark

    // Convert MediaPipe coordinates to Three.js coordinates
    const x = (nose.x - 0.5) * 2;
    const y = (nose.y - 0.5) * -2;
    const z = nose.z * -2;

    // Check if the model is loaded
    if (model) {
        model.position.set(x, y, z); // Set the model's position based on face landmarks
        model.rotation.y += 0.01; // Rotate the model (optional)
    } else {
        console.warn("Model not loaded yet.");
    }
}

// Initialize MediaPipe FaceMesh
async function initFaceMesh() {
    faceMesh = new faceapi.FaceMesh({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }
    });

    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);
}

// Start camera and initialize everything
async function startCamera() {
    const videoElement = document.querySelector('.input_video');
    
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    videoElement.srcObject = stream;

    const video = await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            resolve(videoElement);
        };
    });

    video.play();
    await initFaceMesh();

    const sendVideoToFaceMesh = () => {
        faceMesh.send({ image: video });
        requestAnimationFrame(sendVideoToFaceMesh);
    };
    
    sendVideoToFaceMesh();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Initialize and start everything
async function init() {
    initThreeJS();
    loadModel();
    await startCamera();
    animate();
}

init();
