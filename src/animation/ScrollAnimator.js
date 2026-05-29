import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Adjusted camera keyframes to focus heavily on the text surfaces so it's readable
const getCameraKeyframes = () => {
    const isMobile = window.innerWidth <= 768;
    return [
        {
            // Hero - Wide overview
            position: { x: 0, y: isMobile ? 8.0 : 6.5, z: isMobile ? 12 : 8 },
            lookAt: { x: 0, y: 2.5, z: 0 },
            fov: isMobile ? 65 : 45,
        },
        {
            // About - Zoom tightly to notebook
            position: { x: -2.5, y: isMobile ? 5.5 : 4.5, z: isMobile ? 1.5 : 0.3 },
            lookAt: { x: -2.5, y: 2.1, z: 0.3 },
            fov: isMobile ? 55 : 35,
        },
        {
            // Experience - Move squarely in front of monitor
            position: { x: 0, y: isMobile ? 3.5 : 3.1, z: isMobile ? 3.0 : 1.8 },
            lookAt: { x: 0, y: 3.1, z: -1.2 },
            fov: isMobile ? 65 : 50,
        },
        {
            // Skills - Zoom in on the clustered sticky notes
            position: { x: 1.8, y: isMobile ? 4.2 : 3.4, z: isMobile ? 1.2 : 0.4 },
            lookAt: { x: 1.8, y: 2.1, z: -0.5 },
            fov: isMobile ? 60 : 40,
        },
        {
            // Contact - Clipboard (Clipboard is at 1.8, 1.3)
            position: { x: 1.8, y: isMobile ? 4.5 : 3.5, z: isMobile ? 3.2 : 2.5 },
            lookAt: { x: 1.8, y: 2.1, z: 1.3 },
            fov: isMobile ? 60 : 40,
        },
    ];
};

export class ScrollAnimator {
    constructor(deskScene) {
        this.deskScene = deskScene;
        this.camera = deskScene.camera;
        this.lookAtTarget = { x: 0, y: 2.5, z: 0 };

        this.setupScrollTrigger();
        
        // Show hero overlay
        setTimeout(() => {
            const hero = document.getElementById('heroOverlay');
            if (hero) hero.classList.add('visible');
        }, 100);
    }

    setupScrollTrigger() {
        // Hero visibility toggle
        ScrollTrigger.create({
            trigger: '#hero-section',
            start: 'top top',
            end: 'bottom center',
            onLeave: () => {
                const hero = document.getElementById('heroOverlay');
                if (hero) hero.classList.remove('visible');
            },
            onEnterBack: () => {
                const hero = document.getElementById('heroOverlay');
                if (hero) hero.classList.add('visible');
            }
        });

        this.masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.scroll-container',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1, // Smooth scrub
            }
        });

        const keyframes = getCameraKeyframes();
        const totalSections = keyframes.length;

        for (let i = 0; i < totalSections - 1; i++) {
            const from = keyframes[i];
            const to = keyframes[i + 1];
            const duration = 1;

            this.masterTimeline.to(
                this.camera.position,
                {
                    x: to.position.x,
                    y: to.position.y,
                    z: to.position.z,
                    duration,
                    ease: 'power1.inOut',
                },
                i * duration
            );

            this.masterTimeline.to(
                this.lookAtTarget,
                {
                    x: to.lookAt.x,
                    y: to.lookAt.y,
                    z: to.lookAt.z,
                    duration,
                    ease: 'power1.inOut',
                },
                i * duration
            );

            this.masterTimeline.to(
                this.camera,
                {
                    fov: to.fov,
                    duration,
                    ease: 'power1.inOut',
                    onUpdate: () => this.camera.updateProjectionMatrix(),
                },
                i * duration
            );
        }
    }

    update() {
        this.camera.lookAt(this.lookAtTarget.x, this.lookAtTarget.y, this.lookAtTarget.z);
    }
}
