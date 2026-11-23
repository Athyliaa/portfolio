/* =========================================================
   SHARED: icons, helpers, header, footer, image fallbacks.
   You shouldn't need to edit this file to add projects.
   ========================================================= */

/* ---------- Icons (inline SVG, no extra downloads) ---------- */
const ICON_PATHS = {
  gamepad: '<rect x="2" y="6" width="20" height="12" rx="5"/><path d="M6.5 12h4M8.5 10v4M15 11h.01M17.5 13h.01"/>',
  cube: '<path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5z"/><path d="M12 21.5V12M20.5 7.25L12 12 3.5 7.25"/>',
  play: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 8.75l5 3.25-5 3.25z" fill="currentColor"/>',
  browser: '<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M2 9h20M5.5 6.5h.01M8.5 6.5h.01"/>',
  mail: '<rect x="2" y="4.5" width="20" height="15" rx="2.5"/><path d="M2.5 6.5l9.5 7 9.5-7"/>',
  linkedin: '<rect x="2.5" y="2.5" width="19" height="19" rx="3.5"/><path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13.5a2.75 2.75 0 0 1 5.5 0v3"/>',
  download: '<path d="M12 3.5v11M7 10l5 5 5-5M4.5 20h15"/>',
  arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
  external: '<path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="9" cy="9" r="2"/><path d="M21 15.5l-5-5L5 21"/>',
  user: '<circle cx="12" cy="8.5" r="4"/><path d="M4 20.5c1.5-4 4.5-5.5 8-5.5s6.5 1.5 8 5.5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M9 9v12"/>',
  check: '<path d="M4.5 12.5l5 5 10-11"/>',
  playSolid: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>'
};

/* Logo mark: a cel-shaded "highlight" sparkle. Swap this SVG to change the logo. */
const LOGO_MARK = `
  <svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 2.5c1.6 9.4 5.6 13.6 15.5 15.5-9.9 1.9-13.9 6-15.5 15.5-1.6-9.5-5.6-13.6-15.5-15.5C14.4 16.1 18.4 11.9 20 2.5z"
      fill="var(--coral)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" transform="translate(2.5 2.5)" class="brand__mark-shadow"/>
    <path d="M20 2.5c1.6 9.4 5.6 13.6 15.5 15.5-9.9 1.9-13.9 6-15.5 15.5-1.6-9.5-5.6-13.6-15.5-15.5C14.4 16.1 18.4 11.9 20 2.5z"
      fill="var(--coral)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <path d="M14.5 15.5c1.2-1.6 2.2-3.4 3-5.6" fill="none" stroke="var(--paper)" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;

/* ---------- Video links ----------
   Turns a YouTube / Google Drive / .mp4 link into an embeddable source. */
function parseVideo(url) {
  if (!url || isPlaceholder(url)) return null;
  const u = String(url).trim();
  let m =
    u.match(/youtu\.be\/([\w-]{11})/) ||
    u.match(/youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  if (m) {
    return {
      type: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`,
      thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`,
      watch: `https://www.youtube.com/watch?v=${m[1]}`,
      label: "YouTube"
    };
  }
  m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]+)/);
  if (m) {
    return {
      type: "iframe",
      src: `https://drive.google.com/file/d/${m[1]}/preview`,
      thumb: "",
      watch: `https://drive.google.com/file/d/${m[1]}/view`,
      label: "Google Drive"
    };
  }
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(u)) {
    return { type: "file", src: u, thumb: "", watch: u, label: "video file" };
  }
  return { type: "link", src: u, thumb: "", watch: u, label: "video" };
}

function icon(name, extraClass = "") {
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
}

/* ---------- Text helpers ---------- */
function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Escapes text and highlights [placeholders] so they're easy to spot. */
function txt(value) {
  return esc(value).replace(/\[([^\]]+)\]/g, '<mark class="todo" title="Placeholder: fill this in">$1</mark>');
}

function isPlaceholder(value) {
  return !value || /^\s*\[.*\]\s*$/.test(String(value));
}

function asList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function projectCategories(project) {
  return asList(project.category);
}

function projectsIn(categoryId) {
  return PROJECTS.filter((p) => projectCategories(p).includes(categoryId));
}

function projectUrl(project, preferredCategory) {
  const catId = preferredCategory && projectCategories(project).includes(preferredCategory)
    ? preferredCategory
    : projectCategories(project)[0];
  const cat = categoryById(catId);
  return `${cat ? cat.page : "index.html"}#${encodeURIComponent(project.id)}`;
}

/* ---------- Media with automatic placeholder ----------
   Renders an image. If the file is missing (or no path given),
   a styled placeholder shows instead, so the layout never breaks. */
function mediaHTML({ src, fallback = "", alt = "", label = "Image coming soon", iconName = "image", tone = "coral", ratio = "", className = "" }) {
  if (!src && fallback) {
    const list = fallback.split("|");
    src = list.shift();
    fallback = list.join("|");
  }
  const img = src
    ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${fallback ? `data-fallback="${esc(fallback)}"` : ""}>`
    : "";
  return `
    <div class="media media--${esc(tone)} ${src ? "" : "is-missing"} ${className}" ${ratio ? `style="aspect-ratio:${esc(ratio)}"` : ""} ${src ? `title="${esc(alt)}"` : ""}>
      <div class="media__ph" aria-hidden="${src ? "true" : "false"}">
        <span class="media__ph-icon">${icon(iconName)}</span>
        <span class="media__ph-label">${esc(label)}</span>
      </div>
      ${img}
    </div>`;
}

function markImage(img, ok) {
  const box = img.closest(".media");
  if (!box) return;
  if (ok) {
    box.classList.add("is-loaded");
  } else if (img.dataset.fallback) {
    // e.g. no thumbnail yet, so try the YouTube poster
    // fallbacks are separated by "|", tried in order
    const list = img.dataset.fallback.split("|").filter(Boolean);
    const next = list.shift();
    if (list.length) img.dataset.fallback = list.join("|");
    else delete img.dataset.fallback;
    if (next) { img.src = next; return; }
    markImage(img, false);
    return;
  } else {
    // Gallery images: hide entirely instead of showing a placeholder
    const hideable = box.closest("[data-hide-if-missing]");
    if (hideable) {
      hideable.hidden = true;
      document.dispatchEvent(new CustomEvent("media:hidden", { detail: hideable }));
    }
    box.classList.add("is-missing");
    const ph = box.querySelector(".media__ph");
    if (ph) ph.setAttribute("aria-hidden", "false");
    img.remove();
    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
      console.info(`[portfolio] Image not found yet: ${img.getAttribute("src")}`);
    }
  }
}

// Catch image load / error events from anywhere on the page.
document.addEventListener("load", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".media")) markImage(e.target, true);
}, true);
document.addEventListener("error", (e) => {
  if (e.target.tagName === "IMG" && e.target.closest(".media")) markImage(e.target, false);
}, true);

function checkExistingImages(root = document) {
  root.querySelectorAll(".media img").forEach((img) => {
    if (img.complete) markImage(img, img.naturalWidth > 0);
  });
}

/* ---------- Header & footer ---------- */
const NAV_ITEMS = [
  { id: "home", label: "Home", href: "index.html" },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, href: c.page })),
  { id: "about", label: "About", href: "about.html" }
];

function renderHeader() {
  const slot = document.getElementById("site-header");
  if (!slot) return;
  const current = document.body.dataset.page;

  slot.outerHTML = `
    <header class="site-header" id="top">
      <div class="container site-header__inner">
        <a class="brand" href="index.html" aria-label="${esc(SITE.name)}, home">
          ${LOGO_MARK}
          <span class="brand__name">${esc(SITE.name)}</span>
        </a>

        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="nav-toggle__open">${icon("menu")}</span>
          <span class="nav-toggle__close">${icon("close")}</span>
          <span class="sr-only">Menu</span>
        </button>

        <nav class="site-nav" id="site-nav" aria-label="Main">
          <ul class="site-nav__list">
            ${NAV_ITEMS.map((item) => `
              <li><a class="site-nav__link" href="${item.href}" ${item.id === current ? 'aria-current="page"' : ""}>${esc(item.label)}</a></li>
            `).join("")}
          </ul>
          <a class="btn btn--coral btn--sm" href="about.html#contact">
            ${icon("mail")} Contact
          </a>
        </nav>
      </div>
    </header>`;

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width: 1080px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

function renderFooter() {
  const slot = document.getElementById("site-footer");
  if (!slot) return;
  const year = new Date().getFullYear();

  slot.outerHTML = `
    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div class="site-footer__intro">
          <a class="brand brand--light" href="index.html">
            ${LOGO_MARK}
            <span class="brand__name">${esc(SITE.name)}</span>
          </a>
          <p>${esc(SITE.tagline)} at Universiti Malaysia Sabah. Looking for an internship.</p>
          <div class="site-footer__actions">
            <a class="btn btn--coral btn--sm" data-email-link>${icon("mail")} Email me</a>
            <a class="btn btn--teal btn--sm" data-linkedin-link>${icon("linkedin")} LinkedIn</a>
          </div>
        </div>
        <nav class="site-footer__nav" aria-label="Footer">
          <p class="site-footer__heading">Pages</p>
          <ul>
            ${NAV_ITEMS.map((item) => `<li><a href="${item.href}">${esc(item.label)}</a></li>`).join("")}
          </ul>
        </nav>
      </div>
      <div class="container site-footer__bottom">
        <p>&copy; ${year} ${esc(SITE.fullName)}</p>
      </div>
    </footer>`;
}

/* ---------- Fill in contact links anywhere on the page ----------
   Use data-email-link, data-linkedin-link,
   data-email-text on any element. */
function wireContactLinks(root = document) {
  root.querySelectorAll("[data-email-link]").forEach((a) => {
    a.href = `mailto:${SITE.email}`;
    // mailto only works if the visitor has an email app set up, and fails
    // silently otherwise. So also copy the address and offer Gmail.
    a.addEventListener("click", () => {
      navigator.clipboard?.writeText(SITE.email).catch(() => {});
      showEmailToast();
    });
  });
  root.querySelectorAll("[data-email-text]").forEach((el) => {
    el.textContent = SITE.email;
  });
  root.querySelectorAll("[data-copy-email]").forEach((btn) => {
    const original = btn.innerHTML;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(SITE.email);
        btn.textContent = "Copied!";
      } catch {
        window.prompt("Copy my email address:", SITE.email);
      }
      btn.classList.add("is-done");
      setTimeout(() => { btn.innerHTML = original; btn.classList.remove("is-done"); }, 1800);
    });
  });
  root.querySelectorAll("[data-linkedin-link]").forEach((a) => {
    if (SITE.linkedin) {
      a.href = SITE.linkedin;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      // Placeholder until a LinkedIn URL is added in js/config.js
      a.removeAttribute("href");
      a.classList.add("is-placeholder");
      a.setAttribute("aria-disabled", "true");
      a.title = "Add your LinkedIn URL in js/config.js";
    }
  });
}

/* ---------- Email pop-up (shown when an email button is clicked) ---------- */
let emailToastTimer;
function showEmailToast() {
  let toast = document.getElementById("email-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "email-toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(SITE.email)}`;
  toast.innerHTML = `
    <p class="toast__text"><strong>${esc(SITE.email)}</strong> copied.<br>No email app opened? Paste it into your email, or:</p>
    <div class="toast__actions">
      <a class="btn btn--coral btn--sm" href="${gmail}" target="_blank" rel="noopener">Open in Gmail</a>
      <button class="btn btn--sm" type="button" data-toast-close>Close</button>
    </div>`;
  toast.querySelector("[data-toast-close]").addEventListener("click", () => toast.classList.remove("is-open"));
  requestAnimationFrame(() => toast.classList.add("is-open"));
  clearTimeout(emailToastTimer);
  emailToastTimer = setTimeout(() => toast.classList.remove("is-open"), 9000);
}

/* ---------- Boot ---------- */
renderHeader();
renderFooter();
wireContactLinks();
checkExistingImages();

if (!SITE.linkedin && (location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
  console.info("[portfolio] Reminder: add your LinkedIn URL in js/config.js");
}
