/**
 * Typing animation for the hero role text
 */
export function initTypingAnimation() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const strings = [
        'AI & Machine Learning Engineer',
        'AI Automation Engineer',
        'Full-Stack Developer',
        'Voice Agent Developer',
        'Building Intelligent Solutions',
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const fullString = strings[stringIndex];
        let currentText;

        if (!isDeleting) {
            currentText = fullString.substring(0, charIndex + 1);
            charIndex++;
        } else {
            currentText = fullString.substring(0, charIndex - 1);
            charIndex--;
        }

        el.textContent = currentText;

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === fullString.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1000);
}

/**
 * Counter animation for stats
 */
export function initCountAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 40);
}

/**
 * Contact links are now static clickable <a> tags — no JS handler needed.
 */
export function initContactForm() {
    // Form removed — contact details are now clickable links in the HTML
}

/**
 * Smooth scroll for anchor links within the scroll container
 */
export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
