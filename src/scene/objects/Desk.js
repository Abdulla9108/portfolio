import * as THREE from 'three';

/**
 * Creates the desk surface and legs
 */
export function createDesk(scene) {
    const desk = new THREE.Group();
    desk.name = 'desk';

    // Wood material
    const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x5c3a1e,
        roughness: 0.7,
        metalness: 0.05,
    });

    const darkWoodMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2512,
        roughness: 0.75,
        metalness: 0.05,
    });

    // Desktop surface
    const topGeo = new THREE.BoxGeometry(8, 0.15, 4);
    const top = new THREE.Mesh(topGeo, woodMaterial);
    top.position.set(0, 2, 0);
    top.receiveShadow = true;
    top.castShadow = true;
    desk.add(top);

    // Desktop edge trim
    const edgeGeo = new THREE.BoxGeometry(8.1, 0.06, 4.1);
    const edgeMat = new THREE.MeshStandardMaterial({
        color: 0x4a2e15,
        roughness: 0.6,
        metalness: 0.1,
    });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(0, 1.92, 0);
    desk.add(edge);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
    const legPositions = [
        [-3.7, 1, -1.7],
        [3.7, 1, -1.7],
        [-3.7, 1, 1.7],
        [3.7, 1, 1.7],
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, darkWoodMaterial);
        leg.position.set(...pos);
        leg.castShadow = true;
        desk.add(leg);
    });

    // Back panel
    const backGeo = new THREE.BoxGeometry(7.6, 0.8, 0.08);
    const back = new THREE.Mesh(backGeo, darkWoodMaterial);
    back.position.set(0, 1.5, -1.75);
    desk.add(back);

    // Drawer
    const drawerGeo = new THREE.BoxGeometry(2.5, 0.6, 3.2);
    const drawerMat = new THREE.MeshStandardMaterial({
        color: 0x4a2e15,
        roughness: 0.65,
        metalness: 0.05,
    });
    const drawer = new THREE.Mesh(drawerGeo, drawerMat);
    drawer.position.set(2.5, 1.4, 0);
    drawer.castShadow = true;
    desk.add(drawer);

    // Drawer handle
    const handleGeo = new THREE.BoxGeometry(0.8, 0.06, 0.06);
    const handleMat = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.3,
        metalness: 0.8,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(2.5, 1.45, 1.65);
    desk.add(handle);

    scene.add(desk);
    return desk;
}
