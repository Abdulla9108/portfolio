import * as THREE from 'three';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { createDesk } from './objects/Desk.js';
import { createMonitor } from './objects/Monitor.js';
import { createNotebook } from './objects/Notebook.js';
import { createPenHolder } from './objects/PenHolder.js';
import { createCoffeeMug } from './objects/CoffeeMug.js';
import { createPlant } from './objects/Plant.js';
import { createBooks } from './objects/Books.js';
import { createClipboard } from './objects/Clipboard.js';
import { createLighting } from './objects/Lighting.js';

export class DeskScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.cssContainer = document.getElementById('css3d-container');
        this.objects = {};
        this.clock = new THREE.Clock();

        this.initRenderers();
        this.initScene();
        this.initCamera();
        this.createEnvironment();
        this.createDeskObjects();
        this.handleResize();

        window.addEventListener('resize', () => this.handleResize());
    }

    initRenderers() {
        // WebGL Renderer (Foreground with alpha to let CSS show through)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.setClearColor(0x000000, 0); // Fully transparent background

        // Ensure canvas lets clicks pass through to the CSS renderer beneath
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '2';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';

        // CSS3D Renderer (Background)
        this.cssRenderer = new CSS3DRenderer();
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        this.cssRenderer.domElement.style.position = 'fixed';
        this.cssRenderer.domElement.style.top = '0';
        this.cssRenderer.domElement.style.zIndex = '1';
        this.cssContainer.appendChild(this.cssRenderer.domElement);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = null;
        this.scene.fog = new THREE.FogExp2(0x0a0a14, 0.035);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.set(0, 6.5, 8);
        this.camera.lookAt(0, 2.5, 0);
    }

    createEnvironment() {
        // Ground plane (dark wood/carpet)
        const groundGeo = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x1a1518,
            roughness: 0.9,
            metalness: 0.05,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Room Walls
        const wallMat = new THREE.MeshStandardMaterial({
            color: 0x1c2331, // Deep navy blue for a cozy night vibe
            roughness: 1.0,
        });

        // Back Wall
        const backWallGeo = new THREE.PlaneGeometry(30, 15);
        const backWall = new THREE.Mesh(backWallGeo, wallMat);
        backWall.position.set(0, 7.5, -5);
        backWall.receiveShadow = true;
        this.scene.add(backWall);

        // Left Wall
        const leftWallGeo = new THREE.PlaneGeometry(30, 15);
        const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
        leftWall.position.set(-8, 7.5, 0);
        leftWall.rotation.y = Math.PI / 2;
        leftWall.receiveShadow = true;
        this.scene.add(leftWall);

        // Right Wall
        const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
        rightWall.position.set(10, 7.5, 0);
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.receiveShadow = true;
        this.scene.add(rightWall);

        this.createWindow();
        this.dustParticles = this.createDustParticles();
    }

    createWindow() {
        // Window Frame
        const frameGeo = new THREE.BoxGeometry(4, 3, 0.2);
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.set(-3, 5, -4.9);
        this.scene.add(frame);

        // Window Glass / Night Sky Glow
        const glassGeo = new THREE.PlaneGeometry(3.6, 2.6);
        const glassMat = new THREE.MeshBasicMaterial({ 
            color: 0x243447, // Soft night sky blue
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.set(-3, 5, -4.8);
        this.scene.add(glass);

        // Moonlight streaming in
        const moonLight = new THREE.SpotLight(0x8da4d6, 2.5);
        moonLight.position.set(-3, 5, -4.7);
        moonLight.angle = Math.PI / 3;
        moonLight.penumbra = 0.8;
        moonLight.decay = 2;
        moonLight.distance = 25;
        moonLight.target.position.set(0, 1, 0);
        this.scene.add(moonLight);
        this.scene.add(moonLight.target);
    }

    createDustParticles() {
        const count = 250;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = Math.random() * 8;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
            sizes[i] = Math.random() * 2 + 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xffd700, // Warm gold dust motes
            size: 0.04,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(geometry, material);
        particles.name = 'dustParticles';
        this.scene.add(particles);
        return particles;
    }

    createDeskObjects() {
        // Graphic aesthetic: outlines and vibrant colors
        this.objects.desk = createDesk(this.scene);
        this.objects.monitor = createMonitor(this.scene);
        this.objects.notebook = createNotebook(this.scene);
        this.objects.penHolder = createPenHolder(this.scene);
        this.objects.coffeeMug = createCoffeeMug(this.scene);
        this.objects.plant = createPlant(this.scene);
        this.objects.books = createBooks(this.scene);
        this.objects.clipboard = createClipboard(this.scene);
        this.objects.lighting = createLighting(this.scene);
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.cssRenderer.setSize(width, height);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.cssRenderer.render(this.scene, this.camera);
    }
}
