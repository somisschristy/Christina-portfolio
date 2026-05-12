// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-card, .contact-item, .about-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(el);
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Validate form
        if (!name || !email || !subject || !message) {
            showMessage('Please fill out all fields.', 'error');
            return;
        }

        // Since this is a static site, we'll simulate email sending
        // In a real application, you'd send this to a backend service
        console.log('Form Data:', { name, email, subject, message });

        // Show success message
        showMessage('Thank you for reaching out! I will get back to you soon.', 'success');

        // Reset form
        contactForm.reset();

        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    });
}

function showMessage(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
}

// Add parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Theme toggle for light/dark mode
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const activeTheme = savedTheme || (prefersDarkMode ? 'dark' : 'light');

const applyTheme = (theme) => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    localStorage.setItem('theme', theme);
};

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

applyTheme(activeTheme);

const heroSection = document.getElementById('hero');
const heroCanvas = document.getElementById('hero-canvas');

if (heroSection && heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width = 0;
    let height = 0;
    const particles = [];
    const rings = [];
    const particleCount = 55;
    const colors = ['rgba(255,182,193,0.8)', 'rgba(255,105,180,0.75)', 'rgba(255,240,245,0.65)'];
    let burstActive = true;
    let burstTimer = 0;

    const resizeCanvas = () => {
        const ratio = window.devicePixelRatio || 1;
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        heroCanvas.width = width * ratio;
        heroCanvas.height = height * ratio;
        heroCanvas.style.width = `${width}px`;
        heroCanvas.style.height = `${height}px`;
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createParticle = () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        speedY: Math.random() * 0.25 + 0.08,
        speedX: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
    });

    const shootingStars = [];

    const createRing = () => ({
        x: Math.random() * width * 0.6 + width * 0.2,
        y: Math.random() * height * 0.35 + height * 0.15,
        radius: Math.random() * 50 + 40,
        maxRadius: Math.random() * 120 + 160,
        lineWidth: Math.random() * 1.8 + 0.9,
        alpha: 0.24,
        growRate: Math.random() * 0.25 + 0.12
    });

    const createShootingStar = () => ({
        x: Math.random() < 0.5 ? -30 : width + 30,
        y: Math.random() * height * 0.4 + 20,
        vx: Math.random() < 0.5 ? 10 + Math.random() * 6 : -10 - Math.random() * 6,
        vy: Math.random() * 2 + 2,
        alpha: 1,
        trail: [],
        color: 'rgba(255,105,180,0.95)'
    });

    const resetParticles = () => {
        particles.length = 0;
        rings.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    };

    const spawnRing = () => {
        if (rings.length < 4 && Math.random() < 0.018) {
            rings.push(createRing());
        }
    };

    const update = () => {
        particles.forEach(p => {
            p.x += p.speedX;
            p.y -= p.speedY;
            if (p.y < -20) {
                p.x = Math.random() * width;
                p.y = height + 20;
            }
            if (p.x < -20) {
                p.x = width + 20;
            } else if (p.x > width + 20) {
                p.x = -20;
            }
        });

        rings.forEach((ring, index) => {
            ring.radius += ring.growRate;
            ring.alpha -= 0.0025;
            if (ring.radius > ring.maxRadius || ring.alpha <= 0) {
                rings.splice(index, 1);
            }
        });

        if (Math.random() < 0.005) {
            spawnRing();
        }

        if (Math.random() < 0.02 && shootingStars.length < 4) {
            shootingStars.push(createShootingStar());
        }

        shootingStars.forEach((star, index) => {
            star.trail.unshift({ x: star.x, y: star.y, alpha: star.alpha });
            if (star.trail.length > 18) {
                star.trail.pop();
            }
            star.x += star.vx;
            star.y += star.vy;
            star.alpha -= 0.02;

            const outOfBounds = star.x < -50 || star.x > width + 50 || star.y > height + 50;
            if (star.alpha <= 0 || outOfBounds) {
                shootingStars.splice(index, 1);
            }
        });

        if (burstActive) {
            burstTimer += 1;
            if (burstTimer > 70) {
                burstActive = false;
            }
        }
    };

    const drawBurst = () => {
        if (!burstActive) return;

        const progress = burstTimer / 70;
        const radius = width * 0.8 * progress;
        const alpha = 0.28 * (1 - progress);
        const gradient = ctx.createRadialGradient(width * 0.25, height * 0.35, 0, width * 0.25, height * 0.35, radius);
        gradient.addColorStop(0, `rgba(255, 182, 193, ${alpha})`);
        gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    };

    const drawParticles = () => {
        ctx.clearRect(0, 0, width, height);

        const glow = ctx.createRadialGradient(width * 0.25, height * 0.3, 0, width * 0.25, height * 0.3, width * 0.7);
        glow.addColorStop(0, 'rgba(255, 182, 193, 0.18)');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        rings.forEach(ring => {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 182, 193, ${Math.max(0, ring.alpha)})`;
            ctx.lineWidth = ring.lineWidth;
            ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            ctx.stroke();
        });

        particles.forEach(p => {
            ctx.beginPath();
            ctx.fillStyle = p.color.replace(/0\.\d+\)/, `${p.alpha})`);
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        shootingStars.forEach(star => {
            ctx.save();
            ctx.globalAlpha = star.alpha;
            for (let i = 0; i < star.trail.length; i += 1) {
                const point = star.trail[i];
                const trailFade = (1 - i / star.trail.length) * star.alpha;
                ctx.fillStyle = `rgba(255,105,180,${trailFade})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2.5 - (i / star.trail.length) * 1.8, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.strokeStyle = `rgba(255,105,180,${star.alpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x - star.vx * 0.6, star.y - star.vy * 0.6);
            ctx.stroke();
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        if (burstActive) {
            drawBurst();
        }
    };

    const animateHero = () => {
        update();
        drawParticles();
        requestAnimationFrame(animateHero);
    };

    resizeCanvas();
    resetParticles();
    animateHero();
    window.addEventListener('resize', () => {
        resizeCanvas();
        resetParticles();
    });
}

// Navigation toggle for mobile
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('nav');

if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Add header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        header.style.boxShadow = '0 10px 40px rgba(255, 105, 180, 0.2)';
    } else {
        header.style.boxShadow = '0 8px 32px rgba(255, 105, 180, 0.1)';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Animate numbers in skills grid on scroll
const animateOnScroll = (element, callback) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(element);
};

// Add subtle hover glow effect
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.boxShadow = `0 ${y - rect.height / 2}px 40px rgba(255, 105, 180, 0.3)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 15px 40px rgba(255, 105, 180, 0.3)';
    });
});

// PDF Modal Functions
function openPDFModal() {
    const modal = document.getElementById('pdf-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closePDFModal() {
    const modal = document.getElementById('pdf-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    const modal = document.getElementById('pdf-modal');
    if (modal && e.target === modal) {
        closePDFModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePDFModal();
    }
});
