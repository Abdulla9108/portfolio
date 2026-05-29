import * as THREE from 'three';

/**
 * Sets up all scene lighting including a desk lamp
 */
export function createLighting(scene) {
    const group = new THREE.Group();
    group.name = 'lighting';

    // Ambient light (soft blueish)
    const ambient = new THREE.AmbientLight(0x2a1a4e, 0.4);
    scene.add(ambient);

    // Main directional light (key light from upper left)
    const dirLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
    dirLight.position.set(-4, 8, 3);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -6;
    dirLight.shadow.camera.right = 6;
    dirLight.shadow.camera.top = 6;
    dirLight.shadow.camera.bottom = -6;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Fill light (soft purple from right)
    const fillLight = new THREE.DirectionalLight(0x6644aa, 0.3);
    fillLight.position.set(5, 5, 2);
    scene.add(fillLight);

    // Rim light from behind
    const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.2);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // Desk lamp model
    const lampGroup = new THREE.Group();
    lampGroup.name = 'deskLamp';

    const metalMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.3,
        metalness: 0.8,
    });

    // Lamp base
    const baseGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.06, 16);
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = 2.12;
    lampGroup.add(base);

    // Lamp arm 1
    const arm1Geo = new THREE.CylinderGeometry(0.025, 0.025, 1.2, 8);
    const arm1 = new THREE.Mesh(arm1Geo, metalMat);
    arm1.position.set(0, 2.72, 0);
    arm1.rotation.z = 0.15;
    lampGroup.add(arm1);

    // Joint
    const jointGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const joint = new THREE.Mesh(jointGeo, metalMat);
    joint.position.set(0.09, 3.3, 0);
    lampGroup.add(joint);

    // Lamp arm 2
    const arm2Geo = new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8);
    const arm2 = new THREE.Mesh(arm2Geo, metalMat);
    arm2.position.set(0.3, 3.55, 0);
    arm2.rotation.z = -0.5;
    lampGroup.add(arm2);

    // Lamp shade
    const shadeGeo = new THREE.ConeGeometry(0.25, 0.2, 16, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4,
        metalness: 0.7,
        side: THREE.DoubleSide,
    });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0.5, 3.75, 0);
    shade.rotation.z = 0.1;
    lampGroup.add(shade);

    // Lamp light (warm point light)
    const lampLight = new THREE.PointLight(0xffd699, 1.2, 5);
    lampLight.position.set(0.5, 3.65, 0);
    lampLight.castShadow = true;
    lampLight.shadow.mapSize.width = 512;
    lampLight.shadow.mapSize.height = 512;
    lampGroup.add(lampLight);

    // Lamp glow sphere (visible light source)
    const bulbGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xfff5e0,
        emissive: 0xffd699,
        emissiveIntensity: 2,
        roughness: 0.1,
    });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0.5, 3.68, 0);
    lampGroup.add(bulb);

    // Position lamp on back-right of desk
    lampGroup.position.set(-3.0, 0, -1.0);
    scene.add(lampGroup);
    group.add(lampGroup);

    return {
        group,
        lampLight,
        dirLight,
        ambient,
    };
}
