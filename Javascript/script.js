// ================= ANIMATED BACKGROUND =================
function createAnimatedBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'animated-bg';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Configuration
    const particleCount = 80;
    const connectionDistance = 150;
    const colors = {
        particles: 'rgba(96, 165, 250, 0.6)',
        lines: 'rgba(96, 165, 250, 0.15)'
    };
    
    // Redimensionnement du canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Classe Particle
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebond sur les bords
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = colors.particles;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Initialisation des particules
    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connexion des particules
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = colors.lines;
                    ctx.globalAlpha = opacity * 0.3;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    // Animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }
    
    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });
    
    // Interaction avec la souris
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Repousser les particules proches de la souris
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.x -= dx * 0.02;
                particle.y -= dy * 0.02;
            }
        });
    });
    
    // Initialisation
    resizeCanvas();
    init();
    animate();
}

// Lancer l'animation au chargement
window.addEventListener('load', createAnimatedBackground);

// ================= NAV FIXE =================
const nav = document.querySelector("nav");
const trigger = document.querySelector("#nav-trigger");

if (trigger) {
    const observer = new IntersectionObserver(
        ([entry]) => {
            nav.classList.toggle("fixed", !entry.isIntersecting);
        },
        { threshold: 0 }
    );
    
    observer.observe(trigger);
}

// ================= SCROLL SMOOTH =================
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (targetId.startsWith("#")) {
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});