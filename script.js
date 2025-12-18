// ================= NAV FIXE =================
const nav = document.querySelector("nav");
const trigger = document.querySelector("#nav-trigger");

const observer = new IntersectionObserver(
    ([entry]) => {
        if (!entry.isIntersecting) {
            nav.classList.add("fixed");
        } else {
            nav.classList.remove("fixed");
        }
    },
    { threshold: 0 }
);

observer.observe(trigger);

// ================= SCROLL ANIMÉ POUR TOUS LES LIENS =================
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");

        // Si Home
        if (targetId === "#") {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        // Si lien vers une section
        if (targetId.startsWith("#")) {
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ================= SKILLS ANIMATION =================
const cards = document.querySelectorAll(".skill-card");

const cardsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

cards.forEach(card => {
    card.classList.add("hidden");
    cardsObserver.observe(card);
});

