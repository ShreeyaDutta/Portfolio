/* =========================================================
   script.js — Portfolio JS
   Sections:
   1. Typing Effect
   2. Smooth Scroll
   3. Navbar Shadow on Scroll
   4. Three.js Hero Animation
   5. Contact Form Handler
   6. Project Modal Popups
   7. Small Utilities
   ========================================================= */

/* ================= 1️⃣ TYPING EFFECT ================= */
// (function typingEffect() {
//     const words = ["Developer", "Designer", "AI Builder", "3D Creator"];
//     const el = document.querySelector(".hero-typing");
//     if (!el) return;

//     let wordIndex = 0;
//     let charIndex = 0;
//     let deleting = false;
//     const TYPING_SPEED = 120;
//     const DELETING_SPEED = 60;
//     const HOLD_DELAY = 1200;

//     function tick() {
//         const current = words[wordIndex];
//         el.textContent = current.slice(0, charIndex);

//         if (!deleting) {
//             charIndex++;
//             if (charIndex === current.length) {
//                 deleting = true;
//                 setTimeout(tick, HOLD_DELAY);
//                 return;
//             }
//             setTimeout(tick, TYPING_SPEED);
//         } else {
//             charIndex--;
//             if (charIndex === 0) {
//                 deleting = false;
//                 wordIndex = (wordIndex + 1) % words.length;
//                 setTimeout(tick, 200);
//                 return;
//             }
//             setTimeout(tick, DELETING_SPEED);
//         }
//     }

//     setTimeout(tick, 500);
// })();

/* ================= 2️⃣ SMOOTH SCROLL ================= */
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});

/* ================= 3️⃣ NAVBAR SHADOW ON SCROLL ================= */
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 40) navbar.classList.add("nav-shadow");
    else navbar.classList.remove("nav-shadow");
});

/* ================= 4️⃣ THREE.JS HERO ANIMATION ================= */
(function initThreeHero() {
    const container = document.getElementById("three-container");
    if (!container || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const w = container.clientWidth || 360;
    const h = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
    camera.position.set(0, 0.6, 2.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    // Torus
    const mat = new THREE.MeshStandardMaterial({
        color: 0x5c6cff,
        metalness: 0.35,
        roughness: 0.25,
        emissive: 0x10204a,
        emissiveIntensity: 0.15
    });
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.18, 32, 80), mat);
    torus.rotation.x = 0.7;
    scene.add(torus);

    // Inner sphere
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x0f1224, roughness: 0.2 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), sphereMat);
    scene.add(sphere);

    // Lights
    const rim = new THREE.DirectionalLight(0xffffff, 0.6);
    rim.position.set(5, 5, 5);
    scene.add(rim);

    const soft = new THREE.PointLight(0x5c6cff, 0.9, 8);
    soft.position.set(-2, 1, 2);
    scene.add(soft);

    scene.add(new THREE.AmbientLight(0xffffff, 0.12));

    // Animate
    let time = 0;
    function animate() {
        time += 0.01;
        torus.rotation.y += 0.008;
        torus.rotation.x = 0.65 + Math.sin(time * 0.8) * 0.06;
        sphere.rotation.y -= 0.006;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    // Handle resize
    window.addEventListener("resize", () => {
        const W = container.clientWidth;
        const H = container.clientHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    });
})();

/* ================= 5️⃣ CONTACT FORM HANDLER ================= */
(function contactFormHandler() {
    const form = document.getElementById("contactForm");
    const notice = document.getElementById("contactNotice");
    if (!form) return;

    form.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get("name")?.trim();
        const email = formData.get("email")?.trim();
        const message = formData.get("message")?.trim();

        if (!name || !email || !message) {
            notice.textContent = "Please fill all fields.";
            notice.style.color = "salmon";
            return;
        }

        notice.textContent = "Sending message…";
        notice.style.color = "var(--text)";

        setTimeout(() => {
            notice.textContent = `Thanks ${name.split(" ")[0]} — message received! I'll reply at ${email}.`;
            notice.style.color = "lightgreen";
            form.reset();
        }, 900);
    });
})();

/* ================= 6️⃣ PROJECT MODAL POPUPS ================= */
(function projectModal() {
    const modal = document.getElementById("projectModal");
    const backdrop = document.getElementById("modalBackdrop");
    const closeBtn = document.getElementById("modalClose");
    const cards = document.querySelectorAll(".project-card");
    if (!modal) return;

    function openModal(data) {
        document.getElementById("modalTitle").textContent = data.title;
        document.getElementById("modalDesc").textContent = data.desc;
        const extras = document.getElementById("modalExtras");
        extras.innerHTML = "";

        if (data.tech) {
            const techDiv = document.createElement("div");
            techDiv.className = "tech-list";
            techDiv.textContent = "Tech: " + data.tech.join(" · ");
            extras.appendChild(techDiv);
        }

        document.getElementById("modalDemo").href = data.demo || "#";
        document.getElementById("modalRepo").href = data.repo || "#";

        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const title = card.querySelector("h3")?.textContent || "Project";
            const desc = card.querySelector("p")?.textContent || "";
            const tech = card.dataset.tech?.split(",") || null;
            const demo = card.dataset.demo || "";
            const repo = card.dataset.repo || "";
            openModal({ title, desc, tech, demo, repo });
        });
    });

    backdrop?.addEventListener("click", closeModal);
    closeBtn?.addEventListener("click", closeModal);

    window.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
    });
})();

/* ================= 7️⃣ SMALL UTILITIES ================= */
// Update current year in footer
document.getElementById("year")?.textContent = new Date().getFullYear();
