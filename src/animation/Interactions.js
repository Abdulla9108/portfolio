import * as THREE from 'three';

export class Interactions {
    constructor(deskScene, scrollAnimator) {
        this.deskScene = deskScene;
        this.scrollAnimator = scrollAnimator;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Removed old WebGL hover logic because CSS3D DOM elements natively support CSS :hover!
        // We only keep dot navigation syncing here.

        this.setupDotNavigation();
    }

    setupDotNavigation() {
        const dots = document.querySelectorAll('.dot-nav-item');
        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const sectionId = dot.dataset.section;
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    update() {
        // Find which section is currently most centered to update dots
        const sections = document.querySelectorAll('.scroll-section');
        let currentSectionId = 'hero-section';
        let minDistance = Infinity;

        sections.forEach((sec) => {
            const rect = sec.getBoundingClientRect();
            const dist = Math.abs(rect.top);
            if (dist < minDistance) {
                minDistance = dist;
                // Map part2 to the main about section so the dot stays active
                currentSectionId = sec.id === 'about-section-part2' ? 'about-section' : sec.id;
            }
        });

        const dots = document.querySelectorAll('.dot-nav-item');
        dots.forEach((dot) => {
            if (dot.dataset.section === currentSectionId) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }
}
