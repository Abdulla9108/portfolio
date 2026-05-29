/**
 * Loading screen manager
 */
export class LoadingScreen {
    constructor(onReady) {
        this.screen = document.getElementById('loadingScreen');
        this.bar = document.getElementById('loadingBar');
        this.enterBtn = document.getElementById('enterBtn');
        this.onReady = onReady;
        this.progress = 0;

        this.simulateLoading();
    }

    simulateLoading() {
        // Simulate loading progress since we're building everything programmatically
        const steps = [10, 25, 40, 55, 70, 85, 95, 100];
        let i = 0;

        const advance = () => {
            if (i < steps.length) {
                this.setProgress(steps[i]);
                i++;
                setTimeout(advance, 200 + Math.random() * 300);
            } else {
                this.showEnterButton();
            }
        };

        setTimeout(advance, 300);
    }

    setProgress(value) {
        this.progress = value;
        if (this.bar) {
            this.bar.style.width = value + '%';
        }
    }

    showEnterButton() {
        if (this.enterBtn) {
            this.enterBtn.classList.add('visible');

            const loadingText = this.screen?.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Workspace ready!';
            }

            this.enterBtn.addEventListener('click', () => {
                this.hide();
            });
        }
    }

    hide() {
        if (this.screen) {
            this.screen.classList.add('hidden');
        }
        if (this.onReady) {
            this.onReady();
        }
    }
}
