import * as THREE from 'three';

/**
 * Creates a stack of books on the desk
 */
export function createBooks(scene) {
    const group = new THREE.Group();
    group.name = 'books';

    const bookConfigs = [
        { color: 0x8b5cf6, width: 1.2, height: 0.18, depth: 0.85, label: 'AI' },
        { color: 0x06b6d4, width: 1.15, height: 0.15, depth: 0.82, label: 'ML' },
        { color: 0xf472b6, width: 1.25, height: 0.2, depth: 0.88, label: 'Web' },
        { color: 0x10b981, width: 1.1, height: 0.14, depth: 0.8, label: 'Py' },
        { color: 0xf59e0b, width: 1.18, height: 0.16, depth: 0.84, label: 'JS' },
    ];

    let currentY = 2.15;

    bookConfigs.forEach((config, i) => {
        const bookGroup = new THREE.Group();

        // Book body
        const bookGeo = new THREE.BoxGeometry(config.width, config.height, config.depth);
        const bookMat = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.7,
            metalness: 0.05,
        });
        const book = new THREE.Mesh(bookGeo, bookMat);
        book.castShadow = true;
        bookGroup.add(book);

        // Pages edge (white strip on front)
        const pagesGeo = new THREE.BoxGeometry(config.width - 0.05, config.height - 0.04, 0.02);
        const pagesMat = new THREE.MeshStandardMaterial({
            color: 0xf5f0e8,
            roughness: 0.9,
        });
        const pages = new THREE.Mesh(pagesGeo, pagesMat);
        pages.position.z = config.depth / 2 - 0.01;
        bookGroup.add(pages);

        // Spine text (simple box to indicate embossed text)
        const spineTextGeo = new THREE.BoxGeometry(0.02, config.height * 0.5, 0.01);
        const spineTextMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            roughness: 0.4,
            metalness: 0.5,
            emissive: 0xffd700,
            emissiveIntensity: 0.1,
        });
        const spineText = new THREE.Mesh(spineTextGeo, spineTextMat);
        spineText.position.set(-config.width / 2 + 0.01, 0, 0);
        bookGroup.add(spineText);

        bookGroup.position.y = currentY + config.height / 2;
        // Slight random offsets for realistic stacking
        bookGroup.position.x = (Math.random() - 0.5) * 0.1;
        bookGroup.position.z = (Math.random() - 0.5) * 0.05;
        bookGroup.rotation.y = (Math.random() - 0.5) * 0.05;

        currentY += config.height;
        group.add(bookGroup);
    });

    // A small book leaning against the stack
    const leanBook = new THREE.Group();
    const leanGeo = new THREE.BoxGeometry(0.8, 0.12, 1.0);
    const leanMat = new THREE.MeshStandardMaterial({
        color: 0xe74c3c,
        roughness: 0.7,
        metalness: 0.05,
    });
    const leanMesh = new THREE.Mesh(leanGeo, leanMat);
    leanBook.add(leanMesh);
    leanBook.position.set(0.8, 2.2, 0);
    leanBook.rotation.z = 0.9;
    leanBook.rotation.y = 0.1;
    leanBook.castShadow = true;
    group.add(leanBook);

    // Position books further left to avoid intersecting the monitor
    group.position.set(-2.2, 0, -1.0);

    scene.add(group);
    return group;
}
