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

        // Phone Content Setup
        this.initPhoneContent();
        window.addEventListener('resize', () => this.initPhoneContent());

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

    initPhoneContent() {
        const isMobile = window.innerWidth <= 768;
        const phoneDOM = document.getElementById('phone-content');
        const monitorDOM = document.getElementById('monitor-content');
        const experienceContent = document.getElementById('experience-content');

        // Note: Projects doesn't have a specific wrapper right now, it's siblings with Experience.
        // Let's grab all children of monitor-scroll-wrapper that aren't the h2. 
        // Actually, experience.sh has everything inside monitor-scroll-wrapper.
        
        if (isMobile && phoneDOM && monitorDOM) {
            const monitorBody = monitorDOM.querySelector('.monitor-scroll-wrapper');
            const phoneBody = phoneDOM.querySelector('.phone-scroll-wrapper');
            if (monitorBody && phoneBody && monitorBody.children.length > 0) {
                // Move everything from monitor wrapper to phone
                while(monitorBody.firstChild) {
                    phoneBody.appendChild(monitorBody.firstChild);
                }
            }
        } else if (!isMobile && phoneDOM && monitorDOM) {
            const monitorBody = monitorDOM.querySelector('.monitor-scroll-wrapper');
            const phoneBody = phoneDOM.querySelector('.phone-scroll-wrapper');
            if (monitorBody && phoneBody && phoneBody.children.length > 0) {
                // Move everything from phone back to monitor
                while(phoneBody.firstChild) {
                    monitorBody.appendChild(phoneBody.firstChild);
                }
            }
        }
    }
}

// Launch
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
