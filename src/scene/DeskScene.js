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
        // Ground plane that only catches shadows (transparent otherwise)
        // This allows the 360 panoramic floor to show through seamlessly
        const groundGeo = new THREE.PlaneGeometry(30, 30);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // 360 Room Skybox
        const textureLoader = new THREE.TextureLoader();
        const baseUrl = import.meta.env.BASE_URL; // Handles Vite base path automatically
        const bgTexture = textureLoader.load(baseUrl + 'room-pano.png');
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        
        // SphereGeometry to wrap around the scene
        const sphereGeo = new THREE.SphereGeometry(30, 60, 40);
        // Invert the sphere geometry so we are on the inside
        sphereGeo.scale(-1, 1, 1);
        
        const sphereMat = new THREE.MeshBasicMaterial({
            map: bgTexture,
            side: THREE.BackSide
        });
        
        const skybox = new THREE.Mesh(sphereGeo, sphereMat);
        // Rotate the sphere so the room is oriented nicely around the desk
        skybox.rotation.y = -Math.PI / 2; 
        this.scene.add(skybox);
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
