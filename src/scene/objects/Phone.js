import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createPhone(scene) {
    const group = new THREE.Group();
    group.name = 'phone';

    // Phone Body
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.6, 0.05);
    const bodyMat = new THREE.MeshToonMaterial({
        color: 0x111111,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Screen Mask (punches a hole for CSS3D)
    const screenGeo = new THREE.PlaneGeometry(0.72, 1.48);
    const screenMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.ZeroFactor,
        blendDst: THREE.ZeroFactor,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0, 0.026); // Slightly in front of body
    group.add(screen);

    // CSS3D Object for the phone screen content
    const phoneDOM = document.getElementById('phone-content');
    if (phoneDOM) {
        phoneDOM.style.display = 'flex'; // Unhide
        const cssObj = new CSS3DObject(phoneDOM);
        // Scale down to match WebGL units. If phone width is 360px CSS, 360 * 0.002 = 0.72 units.
        cssObj.scale.set(0.002, 0.002, 0.002);
        cssObj.position.set(0, 0, 0.026); // Match mask position
        group.add(cssObj);
    }

    // Phone Camera Bump (on the back)
    const bumpGeo = new THREE.BoxGeometry(0.2, 0.25, 0.02);
    const bumpMat = new THREE.MeshToonMaterial({ color: 0x0a0a0a });
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(-0.25, 0.6, -0.026);
    group.add(bump);

    // Place on the desk
    group.position.set(2.2, 2.126, 0.4); 
    group.rotation.x = -Math.PI / 2; // Lay flat on desk
    group.rotation.z = -0.15; // Slight angle

    scene.add(group);
    return group;
}
