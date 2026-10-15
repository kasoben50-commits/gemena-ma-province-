// Sud-Ubangi Infos — interactions côté navigateur
"use strict";

const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      menuToggle.textContent = "☰";
    });
  });
}

// Recherche dans le tableau de prix : les valeurs restent "à collecter"
// jusqu'à ce qu'elles soient vérifiées et saisies par l'éditeur.
const marketSearch = document.querySelector("#marketSearch");
const marketPlace = document.querySelector("#marketPlace");
const marketRows = Array.from(document.querySelectorAll("#marketTable tr"));

function filterMarketRows() {
  const query = (marketSearch?.value || "").trim().toLocaleLowerCase("fr");
  const place = marketPlace?.value || "all";

  marketRows.forEach((row) => {
    const product = (row.dataset.product || "").toLocaleLowerCase("fr");
    const rowPlace = row.dataset.place || "";
    const matchesProduct = product.includes(query);
    const matchesPlace = place === "all" || rowPlace === place;
    row.hidden = !(matchesProduct && matchesPlace);
  });
}

marketSearch?.addEventListener("input", filterMarketRows);
marketPlace?.addEventListener("change", filterMarketRows);

// Le formulaire prépare un brouillon à copier : aucun envoi automatique.
// Pour recevoir les messages, il faudra connecter un service ou un backend.
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const topic = String(formData.get("topic") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const draft = [
    "Message pour Sud-Ubangi Infos",
    `Nom / organisation : ${name}`,
    `Sujet : ${topic}`,
    "",
    message
  ].join("\n");

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(draft)
      .then(() => {
        formMessage.textContent = "Le brouillon a été copié. Il reste à l'envoyer à l'équipe du site.";
      })
      .catch(() => showDraft(draft));
  } else {
    showDraft(draft);
  }
});

function showDraft(draft) {
  const textarea = document.createElement("textarea");
  textarea.value = draft;
  textarea.setAttribute("aria-label", "Brouillon du message à copier");
  textarea.style.marginTop = "10px";
  formMessage.textContent = "Copiez le brouillon ci-dessous puis envoyez-le à l'équipe du site.";
  formMessage.insertAdjacentElement("afterend", textarea);
  textarea.focus();
  textarea.select();
}

const currentYear = document.querySelector("#currentYear");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
