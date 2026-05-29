import * as THREE from 'three';

/**
 * Continuous ambient animations for desk objects
 */
export class AmbientAnimations {
    constructor(deskScene) {
        this.scene = deskScene.scene;
        this.clock = deskScene.clock;
    }

    update() {
        const time = this.clock.getElapsedTime();

        this.animateSteam(time);
        this.animateLeaves(time);
        this.animateMonitorGlow(time);
    }

    animateSteam(time) {
        const steam = this.scene.getObjectByName('steam');
        if (!steam) return;

        steam.children.forEach((particle) => {
            const { baseY, speed, offset } = particle.userData;
            if (baseY === undefined) return;

            // Float upward and oscillate
            const cycle = ((time * speed + offset) % 2);
            particle.position.y = baseY + cycle * 0.3;
            particle.position.x = Math.sin(time * speed + offset) * 0.05;
            particle.position.z = Math.cos(time * speed * 0.7 + offset) * 0.05;

            // Fade out as it rises
            const progress = cycle / 2;
            particle.material.opacity = 0.15 * (1 - progress);
            particle.scale.setScalar(1 + progress * 0.8);
        });
    }

    animateLeaves(time) {
        this.scene.traverse((child) => {
            if (child.name === 'leaf') {
                // Gentle sway
                const baseRot = child.rotation.clone();
                child.rotation.x += Math.sin(time * 0.5 + child.id) * 0.001;
                child.rotation.z += Math.cos(time * 0.3 + child.id * 0.5) * 0.001;
            }
        });
    }

    animateMonitorGlow(time) {
        const screen = this.scene.getObjectByName('monitor-screen');
        if (!screen) return;

        // Subtle pulsing emissive
        const pulse = 0.25 + Math.sin(time * 1.5) * 0.08;
        screen.material.emissiveIntensity = pulse;
    }
}
