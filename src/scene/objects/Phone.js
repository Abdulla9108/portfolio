import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createPhone(scene) {
    const group = new THREE.Group();
    group.name = 'phone';

    // Phone Body (iPhone style)
    const bodyGeo = new RoundedBoxGeometry(0.8, 1.6, 0.05, 4, 0.08);
    const bodyMat = new THREE.MeshToonMaterial({
        color: 0x111111,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Dynamic Island / Notch
    const notchGeo = new RoundedBoxGeometry(0.25, 0.06, 0.01, 2, 0.03);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.position.set(0, 0.7, 0.027); // Very top of the screen
    group.add(notch);

    // Screen Mask (punches a hole for CSS3D)
    const screenGeo = new RoundedBoxGeometry(0.72, 1.48, 0.01, 4, 0.06);
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
    const bumpGeo = new RoundedBoxGeometry(0.25, 0.25, 0.02, 2, 0.05);
    const bumpMat = new THREE.MeshToonMaterial({ color: 0x0a0a0a });
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(-0.2, 0.55, -0.026);
    group.add(bump);

    // Place on the desk, below the keyboard! (z = 1.3)
    group.position.set(-0.6, 2.126, 1.3); 
    group.rotation.x = -Math.PI / 2; // Lay flat on desk
    group.rotation.z = 0.1; // Slight angle

    scene.add(group);
    return group;
}
