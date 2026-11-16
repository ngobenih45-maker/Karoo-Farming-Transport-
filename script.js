// Karoo Farming Transport interactions
const WA_NUMBER = "27792145474";
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
  }));
}

document.querySelectorAll("[data-wa]").forEach(link => {
  const message = link.dataset.wa || "Hello Karoo Farming Transport. I have a transport enquiry.";
  link.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

// Carry the clicked service into the contact form and prefill the WhatsApp enquiry.
document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    try { sessionStorage.setItem("kftSelectedService", link.dataset.service); } catch(e) {}
  });
});
const serviceSelect = document.querySelector('select[name="service"]');
if (serviceSelect) {
  let selected = "";
  try { selected = sessionStorage.getItem("kftSelectedService") || ""; sessionStorage.removeItem("kftSelectedService"); } catch(e) {}
  if (selected) {
    const option = [...serviceSelect.options].find(o => o.text.toLowerCase() === selected.toLowerCase());
    if (option) serviceSelect.value = option.value;
    else {
      const other = [...serviceSelect.options].find(o => o.text.toLowerCase().includes("other"));
      if (other) serviceSelect.value = other.value;
    }
  }
}

const quoteForm = document.getElementById("quoteForm");
if (quoteForm) {
  quoteForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!quoteForm.reportValidity()) return;
    const data = new FormData(quoteForm);
    const fields = [
      ["Name", "name"], ["Company", "company"], ["Phone", "phone"], ["Email", "email"],
      ["Pickup location", "pickup"], ["Delivery destination", "destination"], ["Service", "service"],
      ["Preferred collection date", "date"], ["Estimated load weight / size", "weight"], ["Cargo details", "details"]
    ];
    const lines = ["Hello Karoo Farming Transport, I would like to request a transport quote.", ""];
    fields.forEach(([label, key]) => {
      const value = String(data.get(key) || "").trim();
      if (value) lines.push(`${label}: ${value}`);
    });
    lines.push("", "Please let me know the next steps. Thank you.");
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });
}

document.querySelectorAll("#year").forEach(el => el.textContent = new Date().getFullYear());

// Reveal content as it enters the viewport; gracefully show everything if unsupported.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Subtle pointer-based 3D tilt on desktop service cards.
if (window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("mousemove", event => {
      const r = card.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - 0.5;
      const y = (event.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });
}
