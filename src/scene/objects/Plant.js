import * as THREE from 'three';

/**
 * Creates a small potted desk plant
 */
export function createPlant(scene) {
    const group = new THREE.Group();
    group.name = 'plant';

    // Pot
    const potMat = new THREE.MeshStandardMaterial({
        color: 0xc4713c,
        roughness: 0.7,
        metalness: 0.1,
    });

    const potGeo = new THREE.CylinderGeometry(0.28, 0.2, 0.45, 12);
    const pot = new THREE.Mesh(potGeo, potMat);
    pot.position.y = 2.33;
    pot.castShadow = true;
    group.add(pot);

    // Pot rim
    const rimGeo = new THREE.TorusGeometry(0.29, 0.025, 8, 16);
    const rim = new THREE.Mesh(rimGeo, potMat);
    rim.position.y = 2.555;
    rim.rotation.x = Math.PI / 2;
    group.add(rim);

    // Soil
    const soilGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.04, 12);
    const soilMat = new THREE.MeshStandardMaterial({
        color: 0x3a2510,
        roughness: 0.95,
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.y = 2.54;
    group.add(soil);

    // Stem
    const stemMat = new THREE.MeshStandardMaterial({
        color: 0x2d6b30,
        roughness: 0.6,
    });

    const stemGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.5, 6);
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 2.8;
    group.add(stem);

    // Leaves
    const leafMat = new THREE.MeshStandardMaterial({
        color: 0x3da33e,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide,
    });

    const leafDarkMat = new THREE.MeshStandardMaterial({
        color: 0x2d7a2f,
        roughness: 0.6,
        metalness: 0.05,
        side: THREE.DoubleSide,
    });

    const leafConfigs = [
        { pos: [0, 3.0, 0], rot: [0.3, 0, 0.5], scale: 1.0, mat: leafMat },
        { pos: [0, 2.95, 0], rot: [-0.4, 1.2, -0.3], scale: 0.9, mat: leafDarkMat },
        { pos: [0, 2.9, 0], rot: [0.2, 2.4, 0.4], scale: 0.85, mat: leafMat },
        { pos: [0, 3.05, 0], rot: [-0.3, 3.6, -0.2], scale: 1.1, mat: leafDarkMat },
        { pos: [0, 2.85, 0], rot: [0.5, 4.8, 0.1], scale: 0.8, mat: leafMat },
        { pos: [0, 3.1, 0], rot: [-0.2, 0.8, 0.3], scale: 0.95, mat: leafMat },
        { pos: [0, 2.88, 0], rot: [0.4, 5.5, -0.4], scale: 0.75, mat: leafDarkMat },
    ];

    leafConfigs.forEach((config) => {
        // Leaf shape: elongated ellipse using a scaled sphere
        const leafGeo = new THREE.SphereGeometry(0.15, 6, 4);
        leafGeo.scale(1.8, 0.1, 1);
        const leaf = new THREE.Mesh(leafGeo, config.mat);
        leaf.position.set(...config.pos);
        leaf.rotation.set(...config.rot);
        leaf.scale.setScalar(config.scale);
        leaf.name = 'leaf';
        group.add(leaf);
    });

    // Position near the coffee mug
    group.position.set(3.0, 0, -1.2);

    scene.add(group);
    return group;
}
