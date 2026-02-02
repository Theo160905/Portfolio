// ================= ANIMATED BACKGROUND =================
(function() {
    'use strict';
    
    console.log('🎨 Initialisation du background animé...');
    
    // Créer le canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'animated-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    // Insérer le canvas dès que possible
    if (document.body) {
        document.body.insertBefore(canvas, document.body.firstChild);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertBefore(canvas, document.body.firstChild);
        });
    }
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Configuration
    const config = {
        particleCount: 80,
        connectionDistance: 150,
        particleColor: 'rgba(96, 165, 250, 0.6)',
        lineColor: 'rgba(96, 165, 250, 0.15)',
        particleSpeed: 0.5,
        mouseRadius: 100,
        mouseForce: 0.02
    };
    
    // Classe Particle
    class Particle {
        constructor() {
            this.reset();
            // Position aléatoire initiale
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
        }
        
        reset() {
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * config.particleSpeed;
            this.speedY = (Math.random() - 0.5) * config.particleSpeed;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Rebond sur les bords avec une petite marge
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
        }
        
        draw() {
            ctx.fillStyle = config.particleColor;
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Redimensionner le canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(`📐 Canvas redimensionné: ${canvas.width}x${canvas.height}`);
    }
    
    // Initialiser les particules
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
        console.log(`✨ ${particles.length} particules créées`);
    }
    
    // Dessiner les connexions entre particules
    function drawConnections() {
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    const opacity = (1 - distance / config.connectionDistance) * 0.3;
                    ctx.strokeStyle = config.lineColor;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    }
    
    // Animation principale
    function animate() {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mettre à jour et dessiner les particules
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Dessiner les connexions
        drawConnections();
        
        // Continuer l'animation
        requestAnimationFrame(animate);
    }
    
    // Interaction souris
    let mouseX = -1000;
    let mouseY = -1000;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Effet de répulsion
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseRadius) {
                const force = (1 - distance / config.mouseRadius) * config.mouseForce;
                particle.x -= dx * force;
                particle.y -= dy * force;
            }
        });
    });
    
    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    // Démarrer l'animation
    function start() {
        resizeCanvas();
        initParticles();
        animate();
        console.log('🚀 Animation démarrée !');
    }
    
    // Lancer au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

// ================= MODAL GALLERY =================

function openModal(element) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    
    const img = element.querySelector('img');
    
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;
    
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

document.getElementById('modalImage')?.addEventListener('click', function(event) {
    event.stopPropagation();
});


// ================= SMOOTH SCROLL =================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


// ================= SCROLL ANIMATIONS =================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.role-card, .tech-card, .team-member, .gallery-item');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});


// ================= ACTIVE NAV LINK =================

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});