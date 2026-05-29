import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createMonitor(scene) {
    const group = new THREE.Group();
    group.name = 'monitor';

    // Monitor screen masking mesh (punches a hole in WebGL so CSS3D behind it shows through)
    const screenGeo = new THREE.BoxGeometry(2.6, 1.6, 0.08);
    const screenMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        blending: THREE.NoBlending,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.name = 'monitor-screen';
    screen.position.set(0, 3.1, -1.2);
    group.add(screen);

    // CSS3D Object for the screen content
    const monitorDOM = document.getElementById('monitor-content');
    if (monitorDOM) {
        monitorDOM.style.display = 'flex'; // Unhide
        const cssObj = new CSS3DObject(monitorDOM);
        // Scale down heavily because CSS uses pixels (1000px) and Three uses world units (2.6 units)
        cssObj.scale.set(0.0026, 0.0026, 0.0026);
        cssObj.position.set(0, 3.1, -1.155); // Slightly in front of the center
        group.add(cssObj);
    }

    // Monitor bezel
    const bezelGeo = new THREE.BoxGeometry(2.75, 1.75, 0.06);
    const bezelMat = new THREE.MeshToonMaterial({
        color: 0x111111,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 3.1, -1.24);
    group.add(bezel);

    // Monitor stand neck
    const neckGeo = new THREE.BoxGeometry(0.25, 0.6, 0.15);
    const neckMat = new THREE.MeshToonMaterial({ color: 0x222222 });
    const neck = new THREE.Mesh(neckGeo, neckMat);
    neck.position.set(0, 2.45, -1.26); // Moved back slightly
    group.add(neck);

    // Monitor base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.06, 16);
    const baseMat = new THREE.MeshToonMaterial({ color: 0x222222 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 2.18, -1.2);
    group.add(base);

    // Keyboard
    const kbGeo = new THREE.BoxGeometry(2.0, 0.06, 0.7);
    const kbMat = new THREE.MeshToonMaterial({ color: 0x222222 });
    const keyboard = new THREE.Mesh(kbGeo, kbMat);
    keyboard.name = 'keyboard';
    keyboard.position.set(0, 2.12, -0.2);
    group.add(keyboard);

    // Keyboard keys
    const keyMat = new THREE.MeshToonMaterial({ color: 0x333333 });
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 12; col++) {
            const keyGeo = new THREE.BoxGeometry(0.12, 0.03, 0.12);
            const key = new THREE.Mesh(keyGeo, keyMat);
            key.position.set(-0.75 + col * 0.14, 2.16, -0.42 + row * 0.16);
            group.add(key);
        }
    }

    // Mouse
    const mouseGeo = new THREE.BoxGeometry(0.25, 0.06, 0.4);
    const mouse = new THREE.Mesh(mouseGeo, kbMat);
    mouse.position.set(1.6, 2.12, -0.2);
    group.add(mouse);

    // Screen ambient light glow
    const screenLight = new THREE.PointLight(0x8b5cf6, 0.5, 4);
    screenLight.position.set(0, 3.1, -0.8);
    group.add(screenLight);

    scene.add(group);
    return group;
}
