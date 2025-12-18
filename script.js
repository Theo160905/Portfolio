// ================= NAV FIXE =================
const nav = document.querySelector("nav");
const trigger = document.querySelector("#nav-trigger");

const observer = new IntersectionObserver(
    ([entry]) => {
        nav.classList.toggle("fixed", !entry.isIntersecting);
    },
    { threshold: 0 }
);

observer.observe(trigger);

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
