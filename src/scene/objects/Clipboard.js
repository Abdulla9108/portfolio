import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createClipboard(scene) {
    const group = new THREE.Group();
    group.name = 'clipboard';

    // Clipboard base (wood)
    const boardGeo = new THREE.BoxGeometry(1.2, 0.04, 1.6);
    const boardMat = new THREE.MeshToonMaterial({ color: 0x8c5a35 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 2.12, 0);
    group.add(board);

    // Metal clip
    const clipGeo = new THREE.BoxGeometry(0.8, 0.08, 0.2);
    const clipMat = new THREE.MeshToonMaterial({ color: 0xcccccc });
    const clip = new THREE.Mesh(clipGeo, clipMat);
    clip.position.set(0, 2.16, -0.65);
    group.add(clip);

    // Paper mask matches CSS3D size perfectly (400*0.0024 = 0.96, 550*0.0024 = 1.32)
    const paperGeo = new THREE.PlaneGeometry(0.96, 1.32);
    const paperMaskMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.ZeroFactor,
        blendDst: THREE.ZeroFactor,
        side: THREE.DoubleSide
    });
    const paper = new THREE.Mesh(paperGeo, paperMaskMat);
    paper.position.set(0, 2.145, 0.05); // Raised slightly to prevent flickering with board at 2.14
    paper.rotation.x = -Math.PI / 2;
    group.add(paper);

    // CSS3D Form
    const dom = document.getElementById('clipboard-content');
    if (dom) {
        dom.style.display = 'block';
        const cssObj = new CSS3DObject(dom);
        cssObj.scale.set(0.0024, 0.0024, 0.0024);
        cssObj.position.set(0, 2.145, 0.05); // Match mask exactly
        cssObj.rotation.x = -Math.PI / 2;
        group.add(cssObj);
    }

    // Moved slightly back to avoid camera clipping while remaining centered
    group.position.set(1.8, 0, 1.3); 
    group.rotation.y = -0.2;
    scene.add(group);
    return group;
}
