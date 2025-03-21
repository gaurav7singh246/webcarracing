let scene, camera, renderer, car, light, fireEffect, missiles = [], planeLogos = [], clouds = [];
let speed = 0;
let raceTime = 0;
let playerScore = 0;
let distanceTraveled = 0;
let playerLevel = 1;
let gameActive = false;
let currentCar = "Scorpio";
let isFlying = false;

function createClouds() {
    for (let i = 0; i < 20; i++) {
        let cloud = new THREE.Mesh(
            new THREE.SphereGeometry(3, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
        );
        cloud.position.set((Math.random() - 0.5) * 50, Math.random() * 20 + 10, (Math.random() - 0.5) * 500);
        clouds.push(cloud);
        scene.add(cloud);
    }
}

function animateClouds() {
    clouds.forEach(cloud => {
        cloud.position.z += 0.1;
        if (cloud.position.z > 50) {
            cloud.position.z = -500;
        }
    });
}

function checkPlanePickup() {
    planeLogos.forEach(logo => {
        if (car.position.distanceTo(logo.position) < 1.5 && !isFlying) {
            startFlyingMode();
            logo.visible = false;
        }
    });
}

function startFlyingMode() {
    isFlying = true;
    car.position.y = 5;
    setTimeout(() => {
        car.position.y = 0;
        isFlying = false;
    }, 30000);
}

function init() {
    setTimeout(() => {
        document.getElementById("splash-screen").style.display = "none";
    }, 1000);
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    light = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(light);
    
    car = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 3), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    scene.add(car);
    
    let mahadevMurti = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshStandardMaterial({ color: 0x8B4513 }));
    mahadevMurti.position.set(0.5, 0.5, -1);
    car.add(mahadevMurti);
    
    fireEffect = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 8), new THREE.MeshBasicMaterial({ color: 0xff4500 }));
    fireEffect.position.set(0, -0.3, 1.7);
    fireEffect.visible = false;
    car.add(fireEffect);
    
    camera.position.set(0, 3, 5);
    createClouds();
    gameActive = true;
    
    window.addEventListener("deviceorientation", (event) => {
        let tilt = event.gamma / 10;
        car.position.x += tilt;
    });
    
    setInterval(() => {
        if (gameActive) {
            raceTime += 1;
            playerScore += 10;
            distanceTraveled += speed * 0.1;
            document.getElementById("timer").innerText = raceTime;
            document.getElementById("player-score").innerText = playerScore;
            document.getElementById("distance-traveled").innerText = distanceTraveled.toFixed(2);
            checkPlanePickup();
        }
    }, 1000);
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    car.position.z -= speed;
    fireEffect.visible = speed > 0.2;
    animateClouds();
    renderer.render(scene, camera);
}

init();