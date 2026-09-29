(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  const show = id => {
    const element = document.getElementById(id);
    if (element) element.hidden = false;
  };
  const hide = id => {
    const element = document.getElementById(id);
    if (element) element.hidden = true;
  };
  const validUsername = typeof config.githubUsername === "string"
    && /^[a-z\d]+(?:-[a-z\d]+)*$/i.test(config.githubUsername)
    && config.githubUsername.length <= 39;
  const validEmail = typeof config.email === "string"
    && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(config.email);

  if (validUsername) {
    document.querySelectorAll("[data-github-link]").forEach(link => {
      link.href = "https://github.com/" + encodeURIComponent(config.githubUsername);
      link.textContent = "github.com/" + config.githubUsername;
    });
    ["profile-details", "github-row", "contact-details", "contact-github-row"].forEach(show);
  }
  if (validEmail) {
    document.querySelectorAll("[data-email-link]").forEach(link => {
      link.href = "mailto:" + encodeURIComponent(config.email).replace(/%40/g, "@");
      link.textContent = config.email;
    });
    ["profile-details", "email-row", "contact-details", "contact-email-row"].forEach(show);
  }
  if (validUsername || validEmail) {
    hide("contact-pending");
    show("contact-intro");
  }
  if (typeof config.affiliation === "string" && config.affiliation.trim()) {
    const affiliation = document.getElementById("affiliation-value");
    if (affiliation) {
      affiliation.textContent = config.affiliation.trim();
      show("profile-details");
      show("affiliation-row");
    }
  }
  // Optional owner-provided portrait, resolved relative to config.js on every page.
  // Local asset paths only: no tracking URLs or remote image services.
  const image = document.getElementById("portrait");
  const configScript = [...document.scripts].find(script => /\/config\.js$/.test(script.src));
  if (image && configScript && typeof config.portrait === "string"
      && /^assets\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp|avif)$/i.test(config.portrait)) {
    image.addEventListener("load", () => {
      show("profile-photo");
      hide("profile-monogram");
    }, { once: true });
    image.src = new URL(config.portrait, configScript.src).href;
  }
})();
