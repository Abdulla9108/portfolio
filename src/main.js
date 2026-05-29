import './styles/main.css';
import { DeskScene } from './scene/DeskScene.js';
import { ScrollAnimator } from './animation/ScrollAnimator.js';
import { AmbientAnimations } from './animation/AmbientAnimations.js';
import { Interactions } from './animation/Interactions.js';
import { LoadingScreen } from './ui/LoadingScreen.js';
import { initTypingAnimation, initCountAnimation, initContactForm, initSmoothScroll } from './ui/Sections.js';

/**
 * Main application entry point
 */
class App {
    constructor() {
        this.isReady = false;

        // Initialize loading screen first
        this.loadingScreen = new LoadingScreen(() => {
            this.onReady();
        });

        // Initialize 3D scene
        const canvas = document.getElementById('scene3d');
        if (!canvas) {
            console.error('Canvas #scene3d not found');
            return;
        }

        this.deskScene = new DeskScene(canvas);
        this.ambientAnimations = new AmbientAnimations(this.deskScene);

        // Start render loop immediately (for loading screen background)
        this.animate();
    }

    onReady() {
        this.isReady = true;

        // Initialize scroll-driven camera animation
        this.scrollAnimator = new ScrollAnimator(this.deskScene);

        // Initialize interactions (click/hover on 3D objects)
        this.interactions = new Interactions(this.deskScene, this.scrollAnimator);

        // Initialize UI
        initTypingAnimation();
        initCountAnimation();
        initContactForm();
        initSmoothScroll();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Always run ambient animations (steam, dust, etc.)
        this.ambientAnimations.update();

        // Update scroll-driven camera
        if (this.scrollAnimator) {
            this.scrollAnimator.update();
        }

        // Update hover/click interactions
        if (this.interactions) {
            this.interactions.update();
        }

        // Render scene
        this.deskScene.render();
    }
}

// Launch
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
