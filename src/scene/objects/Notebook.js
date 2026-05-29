import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createNotebook(scene) {
    const group = new THREE.Group();
    group.name = 'notebook';

    // Masking material for paper
    const paperMaskMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        blending: THREE.NoBlending,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide,
    });

    const coverMat = new THREE.MeshToonMaterial({
        color: 0x2a1a5e,
    });

    // Left page (slightly angled up)
    const leftPageGeo = new THREE.PlaneGeometry(1.2, 1.6);
    const leftPage = new THREE.Mesh(leftPageGeo, paperMaskMat);
    leftPage.position.set(-0.62, 2.13, 0);
    leftPage.rotation.order = 'ZYX';
    leftPage.rotation.z = 0.03;
    leftPage.rotation.x = -Math.PI / 2;
    group.add(leftPage);

    // Right page
    const rightPageGeo = new THREE.PlaneGeometry(1.2, 1.6);
    const rightPage = new THREE.Mesh(rightPageGeo, paperMaskMat);
    rightPage.position.set(0.62, 2.13, 0);
    rightPage.rotation.order = 'ZYX';
    rightPage.rotation.z = -0.03;
    rightPage.rotation.x = -Math.PI / 2;
    group.add(rightPage);

    // --- CSS3D Content ---
    const scale = 0.0023;
    
    const leftDOM = document.getElementById('notebook-left');
    if (leftDOM) {
        leftDOM.style.display = 'block';
        const cssLeft = new CSS3DObject(leftDOM);
        cssLeft.scale.set(scale, scale, scale);
        // Position exactly at the WebGL masking plane to avoid parallax holes
        cssLeft.position.set(-0.62, 2.13, 0);
        cssLeft.rotation.order = 'ZYX';
        cssLeft.rotation.z = 0.03;
        cssLeft.rotation.x = -Math.PI / 2;
        group.add(cssLeft);
    }

    const rightDOM = document.getElementById('notebook-right');
    if (rightDOM) {
        rightDOM.style.display = 'block';
        const cssRight = new CSS3DObject(rightDOM);
        cssRight.scale.set(scale, scale, scale);
        cssRight.position.set(0.62, 2.13, 0);
        cssRight.rotation.order = 'ZYX';
        cssRight.rotation.z = -0.03;
        cssRight.rotation.x = -Math.PI / 2;
        group.add(cssRight);
    }

    // Cover
    const leftCoverGeo = new THREE.BoxGeometry(1.25, 0.04, 1.65);
    const leftCover = new THREE.Mesh(leftCoverGeo, coverMat);
    leftCover.position.set(-0.63, 2.1, 0);
    leftCover.rotation.z = 0.04;
    group.add(leftCover);

    const rightCoverGeo = new THREE.BoxGeometry(1.25, 0.04, 1.65);
    const rightCover = new THREE.Mesh(rightCoverGeo, coverMat);
    rightCover.position.set(0.63, 2.1, 0);
    rightCover.rotation.z = -0.04;
    group.add(rightCover);

    // Spine
    const spineGeo = new THREE.BoxGeometry(0.08, 0.08, 1.65);
    const spine = new THREE.Mesh(spineGeo, coverMat);
    spine.position.set(0, 2.12, 0);
    group.add(spine);

    // Spiral binding
    const spiralMat = new THREE.MeshToonMaterial({ color: 0xaaaaaa });
    for (let i = 0; i < 8; i++) {
        const ringGeo = new THREE.TorusGeometry(0.06, 0.012, 8, 12);
        const ring = new THREE.Mesh(ringGeo, spiralMat);
        ring.position.set(0, 2.16, -0.65 + i * 0.2);
        ring.rotation.y = Math.PI / 2;
        group.add(ring);
    }

    // Removed pen to prevent it from blocking the text

    group.position.set(-2.5, 0, 0.3);
    scene.add(group);
    return group;
}
