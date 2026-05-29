import * as THREE from 'three';

/**
 * Creates a coffee mug with steam particles
 */
export function createCoffeeMug(scene) {
    const group = new THREE.Group();
    group.name = 'coffeeMug';

    const mugMat = new THREE.MeshStandardMaterial({
        color: 0xf0f0f0,
        roughness: 0.3,
        metalness: 0.1,
    });

    // Mug body
    const bodyGeo = new THREE.CylinderGeometry(0.25, 0.22, 0.55, 16);
    const body = new THREE.Mesh(bodyGeo, mugMat);
    body.position.y = 2.38;
    body.castShadow = true;
    group.add(body);

    // Inner dark liquid
    const liquidGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 16);
    const liquidMat = new THREE.MeshStandardMaterial({
        color: 0x3a1f0a,
        roughness: 0.3,
        metalness: 0.1,
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = 2.62;
    group.add(liquid);

    // Handle (torus segment)
    const handleGeo = new THREE.TorusGeometry(0.14, 0.03, 8, 12, Math.PI);
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.position.set(0.3, 2.4, 0);
    handle.rotation.z = -Math.PI / 2;
    handle.rotation.y = Math.PI / 2;
    group.add(handle);

    // Purple accent stripe on mug
    const stripeGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.08, 16, 1, true);
    const stripeMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        roughness: 0.4,
        metalness: 0.2,
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 2.35;
    group.add(stripe);

    // Steam particles
    const steamGroup = new THREE.Group();
    steamGroup.name = 'steam';

    const steamMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        roughness: 1,
    });

    for (let i = 0; i < 8; i++) {
        const steamGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 6, 6);
        const particle = new THREE.Mesh(steamGeo, steamMat.clone());
        particle.position.set(
            (Math.random() - 0.5) * 0.15,
            2.7 + Math.random() * 0.4,
            (Math.random() - 0.5) * 0.15
        );
        particle.userData.baseY = particle.position.y;
        particle.userData.speed = 0.3 + Math.random() * 0.4;
        particle.userData.offset = Math.random() * Math.PI * 2;
        steamGroup.add(particle);
    }

    group.add(steamGroup);

    // Position on the front right corner of the desk
    group.position.set(3.0, 0, 0.8);

    scene.add(group);
    return group;
}
