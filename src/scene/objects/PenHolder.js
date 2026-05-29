import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createPenHolder(scene) {
    const group = new THREE.Group();
    group.name = 'penHolder';

    const cupMat = new THREE.MeshToonMaterial({ color: 0x3a3a5e });
    const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.28, 0.8, 16), cupMat);
    outer.position.y = 2.5;
    group.add(outer);

    const innerMat = new THREE.MeshToonMaterial({ color: 0x1a1a2e });
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.24, 0.78, 16), innerMat);
    inner.position.y = 2.52;
    group.add(inner);

    const penColors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
    const penAngles = [-0.12, -0.05, 0.03, 0.1, -0.08];
    const penTilts = [0.08, -0.06, 0.04, -0.1, 0.02];

    penColors.forEach((color, i) => {
        const penGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.0, 6);
        const penMat = new THREE.MeshToonMaterial({ color: color });
        const pen = new THREE.Mesh(penGeo, penMat);
        pen.position.set(penAngles[i] * 0.8, 3.0, penTilts[i] * 0.5);
        pen.rotation.x = penTilts[i];
        pen.rotation.z = penAngles[i];
        group.add(pen);
    });

    // Sticky notes with CSS3D content — neatly clustered in the center-right empty space
    const stickyColors = ['#fff176', '#ff8a80', '#80cbc4', '#b39ddb', '#ffcc80'];
    
    // Relative to PenHolder at [2.8, 0, -0.8]
    const stickyPositions = [
        [-1.5, 2.120, 0.3],    // Note 1 (Yellow) - Left, front
        [-1.2, 2.122, 0.0],    // Note 2 (Red) - Mid-left, back
        [-1.0, 2.124, 0.5],    // Note 3 (Cyan) - Center, front
        [-0.7, 2.126, 0.1],    // Note 4 (Purple) - Mid-right, back
        [-0.5, 2.128, 0.6],    // Note 5 (Orange) - Right, front
    ];
    // Natural slight rotations
    const stickyRotations = [-0.1, 0.05, -0.15, 0.1, -0.05];

    const stickyMaskMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.ZeroFactor,
        blendDst: THREE.ZeroFactor,
        side: THREE.DoubleSide
    });

    for(let i = 1; i <= 5; i++) {
        // Mask
        const stickyGeo = new THREE.PlaneGeometry(0.5, 0.5);
        const sticky = new THREE.Mesh(stickyGeo, stickyMaskMat);
        sticky.position.set(...stickyPositions[i-1]);
        sticky.rotation.order = 'ZYX';
        sticky.rotation.z = stickyRotations[i-1];
        sticky.rotation.x = -Math.PI / 2;
        group.add(sticky);

        // CSS3D
        const dom = document.getElementById(`sticky-${i}`);
        if (dom) {
            dom.style.display = 'block';
            dom.style.backgroundColor = stickyColors[i-1]; // Apply color to HTML
            const cssObj = new CSS3DObject(dom);
            cssObj.scale.set(0.0025, 0.0025, 0.0025);
            // Must have the exact same position as the mask to prevent parallax holes
            cssObj.position.set(...stickyPositions[i-1]);
            cssObj.rotation.order = 'ZYX';
            cssObj.rotation.z = stickyRotations[i-1];
            cssObj.rotation.x = -Math.PI / 2;
            group.add(cssObj);
        }
    }

    // Position pen holder at the back right
    group.position.set(2.8, 0, -0.8);
    scene.add(group);
    return group;
}
