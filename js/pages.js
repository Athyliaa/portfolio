/* =========================================================
   PAGE CONTENT: builds each page from js/projects.js.
   You shouldn't need to edit this file to add projects.
   ========================================================= */

const page = document.body.dataset.page;

/* ---------- Small building blocks ---------- */
function chipsHTML(items, className = "chip") {
  return asList(items).map((item) => `<li class="${className}">${txt(item)}</li>`).join("");
}

function metaPills(project, { withCategory = false } = {}) {
  const bits = [];
  if (project.status) bits.push(`<span class="pill pill--live">${txt(project.status)}</span>`);
  if (withCategory) {
    projectCategories(project).forEach((id) => {
      const c = categoryById(id);
      if (c) bits.push(`<span class="pill pill--${c.color}">${esc(c.label)}</span>`);
    });
  }
  if (project.year) bits.push(`<span class="pill">${txt(project.year)}</span>`);
  return bits.join("");
}

function toneFor(project, preferred) {
  const ids = projectCategories(project);
  const c = categoryById(ids.includes(preferred) ? preferred : ids[0]);
  return c || { icon: "image", color: "coral" };
}

function isRealLink(url) {
  return url && !isPlaceholder(url) && /^(https?:)?\/\//i.test(url.trim());
}

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

function plainTitle(project) {
  return String(project.title).replace(/[[\]]/g, "");
}

/* A project's videos: `video` can be one link or a list of links */
function projectVideos(project) {
  return asList(project.video).map((url) => ({ url, v: parseVideo(url) })).filter((x) => x.v);
}

/* A project's images: each can be "path.jpg" or { src: "path.jpg", caption: "..." } */
function projectImages(project) {
  return asList(project.images)
    .map((img) => (typeof img === "string" ? { src: img } : img))
    .filter((img) => img && img.src && !isPlaceholder(img.src));
}

/* ---------- Automatic media: just name the files ----------
   images/projects/<id>/thumbnail.jpg   card image
   images/projects/<id>/video.mp4       first slide in the popup
   images/projects/<id>/screenshot-1.jpg, screenshot-2.jpg, ...  the rest of the slideshow
   (.png also works for thumbnail and screenshots) */
const mediaDir = (p) => `images/projects/${p.id}/`;

function thumbOf(p) {
  return p.thumbnail || `${mediaDir(p)}thumbnail.jpg`;
}
function thumbFallbacks(p) {
  const list = [];
  if (!p.thumbnail) list.push(`${mediaDir(p)}thumbnail.png`);
  const yt = projectVideos(p)[0]?.v.thumb;
  if (yt) list.push(yt);
  return list.join("|");
}

function probeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// Checks a video file exists by loading only its metadata (a few KB)
function probeVideoFile(src) {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    let settled = false;
    const done = (ok) => {
      if (settled) return;
      settled = true;
      v.removeAttribute("src");
      v.load();
      resolve(ok);
    };
    v.preload = "metadata";
    v.muted = true;
    v.onloadedmetadata = () => done(true);
    v.onerror = () => done(false);
    setTimeout(() => done(false), 8000);
    v.src = src;
  });
}

const videoCache = new Map();
const imageCache = new Map();

// Video links from projects.js, or images/projects/<id>/video.mp4 if it exists
function discoverVideos(p) {
  if (!videoCache.has(p.id)) {
    videoCache.set(p.id, (async () => {
      const listed = projectVideos(p).map((x) => x.url);
      if (listed.length) return listed;
      // video.mp4 (or video-1.mp4), then video-2.mp4, video-3.mp4 ... until one is missing
      const found = [];
      for (let n = 1; n <= 20; n++) {
        const names = n === 1 ? ["video.mp4", "video-1.mp4"] : [`video-${n}.mp4`];
        let hit = null;
        for (const name of names) {
          if (await probeVideoFile(mediaDir(p) + name)) { hit = mediaDir(p) + name; break; }
        }
        if (!hit) break;
        found.push(hit);
      }
      return found;
    })());
  }
  return videoCache.get(p.id);
}

// Images listed in projects.js, or screenshot-1, screenshot-2, ... until one is missing
function discoverImages(p) {
  if (!imageCache.has(p.id)) {
    imageCache.set(p.id, (async () => {
      const listed = projectImages(p);
      if (listed.length) return listed;
      const found = [];
      for (let n = 1; n <= 40; n++) {
        let hit = null;
        for (const ext of ["jpg", "png"]) {
          const src = `${mediaDir(p)}screenshot-${n}.${ext}`;
          if (await probeImage(src)) { hit = src; break; }
        }
        if (!hit) break;
        found.push({ src: hit });
      }
      return found;
    })());
  }
  return imageCache.get(p.id);
}

/* ---------- Video player (loads the video only when clicked = fast pages) ---------- */
function videoHTML(url, { poster = "", title = "Video", tone = "coral" } = {}) {
  const v = parseVideo(url);
  if (!v) {
    return `<div class="video">${mediaHTML({ src: "", label: "Video coming soon", iconName: "play", tone, ratio: "16 / 9" })}</div>`;
  }
  if (v.type === "file") {
    // Your own .mp4: shows its first frame, plays with the normal controls
    return `<div class="video video--file">
      <video src="${esc(v.src)}" controls preload="metadata" playsinline ${poster ? `poster="${esc(poster)}"` : ""} aria-label="${esc(title)}"></video>
    </div>`;
  }
  if (v.type === "link") {
    return `<div class="video">
      ${mediaHTML({ src: poster, alt: title, label: "Watch the video", iconName: "play", tone, ratio: "16 / 9" })}
      <a class="video__play" href="${esc(v.watch)}" target="_blank" rel="noopener" aria-label="Watch ${esc(title)} (opens in a new tab)">${icon("playSolid")}</a>
    </div>`;
  }
  return `<div class="video" data-video-type="${v.type}" data-video-src="${esc(v.src)}" data-video-title="${esc(title)}">
    ${mediaHTML({ src: poster, fallback: v.thumb, alt: `${title} video poster`, label: "Press play", iconName: "play", tone, ratio: "16 / 9" })}
    <button class="video__play" type="button" aria-label="Play video: ${esc(title)}">${icon("playSolid")}</button>
  </div>`;
}

// Remembers each player's poster so it can be reset (= stopped) later
const videoPosters = new WeakMap();
function stopVideos(scope, except) {
  scope.querySelectorAll("video").forEach((vid) => {
    if (except && except.contains(vid)) return;
    vid.pause();
  });
  scope.querySelectorAll(".video.is-playing").forEach((box) => {
    if (except && except.contains(box)) return;
    box.innerHTML = videoPosters.get(box) || "";
    box.classList.remove("is-playing");
  });
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button.video__play");
  if (!btn) return;
  const box = btn.closest(".video");
  const { videoType, videoSrc, videoTitle } = box.dataset;
  videoPosters.set(box, box.innerHTML);
  box.classList.add("is-playing");
  if (videoType === "file") {
    box.innerHTML = `<video src="${esc(videoSrc)}" controls autoplay playsinline></video>`;
  } else {
    box.innerHTML = `<iframe src="${esc(videoSrc)}" title="${esc(videoTitle)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  }
});

/* ---------- Project card (used on category pages) ---------- */
function cardHTML(project, categoryId) {
  const t = toneFor(project, categoryId);
  const tools = asList(project.tools);
  return `
    <a class="pcard card card--hover" href="#${esc(project.id)}" data-project="${esc(project.id)}">
      <div class="pcard__media">
        ${mediaHTML({ src: thumbOf(project), fallback: thumbFallbacks(project), alt: `${plainTitle(project)} thumbnail`, label: "Thumbnail coming soon", iconName: t.icon, tone: t.color })}
        <span class="pcard__badge" data-video-badge="${esc(project.id)}" hidden>${icon("play")} Video</span>
      </div>
      <div class="pcard__body">
        <div class="pcard__meta">${metaPills(project)}</div>
        <h3 class="pcard__title">${txt(project.title)}</h3>
        <p class="pcard__desc">${txt(project.description)}</p>
        <ul class="chips chips--sm">${chipsHTML(tools.slice(0, 4))}</ul>
        <span class="pcard__more">View details ${icon("arrow")}</span>
      </div>
    </a>`;
}

/* ---------- Website card ---------- */
function siteCardHTML(project) {
  const live = isRealLink(project.liveLink);
  return `
    <article class="scard card">
      <a class="scard__frame" href="#${esc(project.id)}" data-project="${esc(project.id)}" aria-label="${esc(plainTitle(project))} details">
        <div class="browser">
          <div class="browser__bar" aria-hidden="true">
            <span class="browser__dots"><i></i><i></i><i></i></span>
            <span class="browser__url">${live ? esc(hostOf(project.liveLink)) : "live link coming soon"}</span>
          </div>
          ${mediaHTML({ src: thumbOf(project), fallback: thumbFallbacks(project), alt: `${plainTitle(project)} home page screenshot`, label: "Screenshot coming soon", iconName: "browser", tone: "teal" })}
        </div>
      </a>
      <div class="scard__body">
        <div class="pcard__meta">${metaPills(project)}</div>
        <h3 class="scard__title">${txt(project.title)}</h3>
        <p class="pcard__desc">${txt(project.description)}</p>
        <ul class="chips chips--sm">${chipsHTML(project.tools)}</ul>
        <div class="btn-row">
          ${live
            ? `<a class="btn btn--coral" href="${esc(project.liveLink)}" target="_blank" rel="noopener">${icon("external")} ${esc(project.liveLabel || "Visit live site")}</a>`
            : `<span class="btn is-placeholder" title="Add liveLink in js/projects.js">${icon("external")} Live link coming soon</span>`}
          <a class="btn" href="#${esc(project.id)}" data-project="${esc(project.id)}">Details</a>
        </div>
      </div>
    </article>`;
}

/* "More coming" box at the end of every category page */
const NEXT_SLOT_TEXT = {
  games:    ["Next game loading…",    "More games will appear here."],
  "3d":     ["Next model loading…",   "More 3D projects will appear here."],
  videos:   ["Next video loading…",   "More videos will appear here."],
  websites: ["Next site loading…",    "More web projects will appear here."],
  ui:       ["Next design loading…",  "More UI designs will appear here."]
};
function nextSlotHTML(cat) {
  const [title, text] = NEXT_SLOT_TEXT[cat.id] || ["More coming soon…", "More projects will appear here."];
  return `
    <div class="slot card${cat.id === "videos" ? " slot--wide" : ""}" aria-label="More ${esc(cat.label)} projects coming">
      <span class="slot__icon">${icon(cat.icon)}</span>
      <p class="slot__title">${esc(title)}</p>
      <div class="slot__bar" aria-hidden="true"><span></span></div>
      <p class="slot__text">${esc(text)}</p>
    </div>`;
}

/* ---------- Video row (videos page) ---------- */
function videoRowHTML(project) {
  const t = toneFor(project, "videos");
  return `
    <article class="vrow card">
      <div class="vrow__player" data-video-row="${esc(project.id)}">${videoHTML(projectVideos(project)[0]?.url || "", { poster: thumbOf(project), title: plainTitle(project), tone: t.color })}</div>
      <div class="vrow__body">
        <div class="pcard__meta">${metaPills(project)}</div>
        <h3 class="scard__title">${txt(project.title)}</h3>
        <p class="pcard__desc">${txt(project.description)}</p>
        <p class="label">My role</p>
        <ul class="role-list">${asList(project.role).map((r) => `<li>${icon("check")}<span>${txt(r)}</span></li>`).join("")}</ul>
        <p class="label">Tools</p>
        <ul class="chips chips--sm">${chipsHTML(project.tools)}</ul>
        <div class="btn-row">
          <a class="btn btn--sm" href="#${esc(project.id)}" data-project="${esc(project.id)}">Details ${icon("arrow")}</a>
        </div>
      </div>
    </article>`;
}

/* ---------- Slideshow (arrows, dots, swipe, keyboard) ---------- */
function initCarousel(root) {
  if (!root) return null;
  const track = root.querySelector(".carousel__track");
  const count = root.querySelector(".carousel__count");
  const dots = root.querySelector(".carousel__dots");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;

  const slides = () => Array.from(track.querySelectorAll(":scope > [data-slide]"));

  function setIndex(i) {
    index = i;
    const n = slides().length;
    count.textContent = `${i + 1} / ${n}`;
    dots.querySelectorAll("button").forEach((d, k) => d.setAttribute("aria-current", k === i ? "true" : "false"));
    stopVideos(track, slides()[i]); // leaving a video stops it
  }

  function build() {
    const all = slides();
    if (!all.length) track.innerHTML = root.dataset.empty;
    const n = slides().length;
    root.classList.toggle("is-single", n <= 1);
    dots.innerHTML = slides().map((_, k) =>
      `<button type="button" class="carousel__dot" aria-label="Show item ${k + 1} of ${n}"></button>`).join("");
    if (index > n - 1) index = n - 1;
    jump(index, false);
  }

  function jump(i, smooth = true) {
    const all = slides();
    if (!all.length) return;
    i = (i + all.length) % all.length; // wraps around at both ends
    track.scrollTo({ left: all[i].offsetLeft, behavior: smooth && !reduce ? "smooth" : "auto" });
    setIndex(i);
  }

  root.querySelector(".carousel__arrow--prev").addEventListener("click", () => jump(index - 1));
  root.querySelector(".carousel__arrow--next").addEventListener("click", () => jump(index + 1));
  dots.addEventListener("click", (e) => {
    const d = e.target.closest(".carousel__dot");
    if (d) jump(Array.from(dots.children).indexOf(d));
  });

  // Swiping / trackpad scrolling updates the counter
  let raf;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
      if (i !== index && i < slides().length) setIndex(i);
    });
  }, { passive: true });

  // Screenshots that don't exist yet are removed from the slideshow
  const dropMissing = (img) => { img.closest("[data-slide]")?.remove(); build(); };
  track.querySelectorAll(".carousel__img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) dropMissing(img);
    else img.addEventListener("error", () => dropMissing(img), { once: true });
  });

  build();
  return { go: (step) => jump(index + step) };
}

/* ---------- Detail view (modal) ---------- */
const modal = (() => {
  const dialog = document.createElement("dialog");
  dialog.className = "modal";
  dialog.setAttribute("aria-labelledby", "modal-title");
  dialog.innerHTML = `
    <div class="modal__panel card">
      <button class="modal__close" type="button" aria-label="Close project details">${icon("close")}</button>
      <div class="modal__content"></div>
    </div>`;
  document.body.appendChild(dialog);

  const content = dialog.querySelector(".modal__content");
  const baseTitle = document.title;
  let currentId = null;
  let pushed = false;

  function render(project) {
    const t = toneFor(project, page);
    const v = projectVideos(project)[0]?.v; // for the "Watch on YouTube" button
    const live = isRealLink(project.liveLink);
    const title = plainTitle(project);

    const emptySlide = `<div class="carousel__slide" data-slide>${mediaHTML({ src: "", label: "Screenshots coming soon", iconName: t.icon, tone: t.color })}</div>`;

    const hero = `
      <div class="carousel is-single is-loading" data-carousel data-empty="${esc(emptySlide)}">
        <div class="carousel__stage">
        <div class="carousel__track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="${esc(title)} images and videos. Use the arrow keys to browse.">
        </div>
        <button class="carousel__arrow carousel__arrow--prev" type="button" aria-label="Previous image">${icon("arrow")}</button>
        <button class="carousel__arrow carousel__arrow--next" type="button" aria-label="Next image">${icon("arrow")}</button>
        </div>
        <div class="carousel__bar">
          <span class="carousel__count" aria-live="polite"></span>
          <div class="carousel__dots"></div>
        </div>
      </div>`;

    const links = [];
    if (live) links.push(`<a class="btn btn--coral" href="${esc(project.liveLink)}" target="_blank" rel="noopener">${icon("external")} ${esc(project.liveLabel || "Visit live site")}</a>`);
    if (v && v.type !== "file") links.push(`<a class="btn" href="${esc(v.watch)}" target="_blank" rel="noopener">${icon("play")} Watch on ${esc(v.label)}</a>`);

    content.innerHTML = `
      <header class="modal__head">
        <div class="pcard__meta">${metaPills(project, { withCategory: true })}</div>
        <h2 class="modal__title" id="modal-title">${txt(project.title)}</h2>
        <p class="modal__lead">${txt(project.description)}</p>
      </header>

      <div class="modal__hero">${hero}</div>

      <div class="modal__body">
        <div class="modal__main">
          ${project.details ? `<p>${txt(project.details)}</p>` : ""}
        </div>
        <aside class="modal__side">
          <div class="side-box">
            <p class="label">My role</p>
            <ul class="role-list">${asList(project.role).map((r) => `<li>${icon("check")}<span>${txt(r)}</span></li>`).join("")}</ul>
          </div>
          <div class="side-box">
            <p class="label">Tools</p>
            <ul class="chips chips--sm">${chipsHTML(project.tools)}</ul>
          </div>
          ${links.length ? `<div class="btn-row btn-row--stack">${links.join("")}</div>` : ""}
        </aside>
      </div>`;

    checkExistingImages(content);
    fillSlideshow(project, t, title);
  }

  // Slideshow: videos first, then every screenshot (the thumbnail is only for cards)
  async function fillSlideshow(project, t, title) {
    const [videoUrls, images] = await Promise.all([discoverVideos(project), discoverImages(project)]);
    if (currentId !== project.id) return; // popup was closed or switched meanwhile
    const root = content.querySelector("[data-carousel]");
    if (!root) return;

    const slides = [
      ...videoUrls.map((url, i) => `
        <div class="carousel__slide" data-slide>
          ${videoHTML(url, { title: videoUrls.length > 1 ? `${title} (video ${i + 1})` : title, tone: t.color })}
        </div>`),
      ...images.map((img, i) => `
        <figure class="carousel__slide" data-slide>
          <img class="carousel__img" src="${esc(img.src)}" alt="${esc(String(img.caption || `${title} screenshot ${i + 1}`).replace(/[[\]]/g, ""))}" decoding="async">
          ${img.caption ? `<figcaption class="carousel__cap">${txt(img.caption)}</figcaption>` : ""}
        </figure>`)
    ];
    // Video project without a video yet
    if (!videoUrls.length && projectCategories(project).includes("videos")) {
      slides.unshift(`<div class="carousel__slide" data-slide>${videoHTML("", { tone: t.color })}</div>`);
    }
    // No images or videos, but a link (e.g. a Canva prototype): show a big button instead
    if (!slides.length && isRealLink(project.liveLink)) {
      const label = project.liveLabel || "Visit live site";
      slides.push(`
        <div class="carousel__slide" data-slide>
          <div class="slide-cta media--${esc(t.color)}">
            <span class="media__ph-icon">${icon(t.icon)}</span>
            <p class="slide-cta__text">See the full ${esc(plainTitle(project))}</p>
            <a class="btn btn--coral btn--lg" href="${esc(project.liveLink)}" target="_blank" rel="noopener">${icon("external")} ${esc(label)}</a>
            <p class="slide-cta__host">Opens ${esc(hostOf(project.liveLink) || "in a new tab")}</p>
          </div>
        </div>`);
    }

    root.querySelector(".carousel__track").innerHTML = slides.join("");
    root.classList.remove("is-loading");
    carousel = initCarousel(root);
  }

  let carousel = null;

  // Left / right arrow keys flip through the slideshow while the popup is open
  dialog.addEventListener("keydown", (e) => {
    if (!carousel || e.target.closest("input, textarea, iframe, video")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); carousel.go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); carousel.go(1); }
  });

  function open(id, { push = true } = {}) {
    const project = PROJECTS.find((p) => p.id === id);
    if (!project) return false;
    currentId = id;
    render(project);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    if (push) {
      history.pushState({ project: id }, "", `#${encodeURIComponent(id)}`);
      pushed = true;
    }
    document.title = `${plainTitle(project)} | ${SITE.name}`;
    return true;
  }

  dialog.addEventListener("close", () => {
    content.innerHTML = ""; // stops any playing video
    carousel = null;
    document.title = baseTitle;
    if (decodeURIComponent(location.hash.slice(1)) === currentId) {
      if (pushed) history.back();
      else history.replaceState(null, "", location.pathname + location.search);
    }
    pushed = false;
    currentId = null;
  });

  dialog.querySelector(".modal__close").addEventListener("click", () => dialog.close());
  // click on the dark backdrop closes
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

  // Hide the gallery block if none of its images exist yet
  document.addEventListener("media:hidden", (e) => {
    const gal = e.detail.closest("[data-gallery]");
    if (gal && !gal.querySelector("[data-hide-if-missing]:not([hidden])")) gal.hidden = true;
  });

  window.addEventListener("popstate", () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && PROJECTS.some((p) => p.id === id)) {
      open(id, { push: false });
    } else if (dialog.open) {
      pushed = false;
      currentId = null;
      dialog.close();
    }
  });

  return { open };
})();

// Any element with data-project="<id>" opens that project's detail view
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-project]");
  if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  if (modal.open(trigger.dataset.project)) e.preventDefault();
});

/* ---------- HOME ---------- */
function renderFeatured() {
  const slot = document.getElementById("featured");
  if (!slot) return;
  const project = PROJECTS.find((p) => p.featured) || PROJECTS[0];
  if (!project) return;
  const cat = categoryById(projectCategories(project)[0]);

  slot.innerHTML = `
    <article class="featured card">
      <a class="featured__media" href="${projectUrl(project)}" data-project="${esc(project.id)}" tabindex="-1" aria-hidden="true">
        ${mediaHTML({
          src: thumbOf(project),
          fallback: thumbFallbacks(project),
          alt: `${plainTitle(project)} screenshot`,
          label: "Thumbnail coming soon",
          iconName: cat ? cat.icon : "image",
          tone: cat ? cat.color : "coral"
        })}
      </a>
      <div class="featured__body">
        <div class="featured__meta">${metaPills(project)}</div>
        <h3 class="featured__title">${txt(project.title)}</h3>
        <p class="featured__desc">${txt(project.description)}</p>

        <p class="label">My role</p>
        <ul class="chips">${chipsHTML(project.role, "chip chip--coral")}</ul>

        <p class="label">Tools</p>
        <ul class="chips">${chipsHTML(project.tools)}</ul>

        <div class="btn-row">
          <a class="btn btn--ink" href="${projectUrl(project)}" data-project="${esc(project.id)}">View project ${icon("arrow")}</a>
          ${cat ? `<a class="btn" href="${cat.page}">All ${esc(cat.label.toLowerCase())}</a>` : ""}
        </div>
      </div>
    </article>`;
}

function renderCategoryTiles() {
  const slot = document.getElementById("category-tiles");
  if (!slot) return;

  slot.innerHTML = CATEGORIES.map((cat) => {
    const count = projectsIn(cat.id).length;
    return `
      <a class="tile tile--${cat.color} card card--hover" href="${cat.page}">
        <span class="tile__icon">${icon(cat.icon)}</span>
        <span class="tile__title">${esc(cat.label)}</span>
        <span class="tile__blurb">${esc(cat.blurb)}</span>
        <span class="tile__foot">
          <span>${count} ${count === 1 ? "project" : "projects"}</span>
          <span class="tile__arrow">${icon("arrow")}</span>
        </span>
      </a>`;
  }).join("");
}

/* ---------- CATEGORY PAGES ---------- */
function renderCategoryPage(cat) {
  const root = document.getElementById("category-page");
  if (!root) return;
  const projects = projectsIn(cat.id);

  const others = CATEGORIES.filter((c) => c.id !== cat.id)
    .map((c) => `<a class="switch" href="${c.page}">${icon(c.icon)} ${esc(c.label)}</a>`).join("");

  let body;
  if (cat.id === "websites") {
    body = `<div class="site-grid">${projects.map(siteCardHTML).join("")}${nextSlotHTML(cat)}</div>`;
  } else if (cat.id === "videos") {
    body = `<div class="vlist">${projects.map(videoRowHTML).join("")}${nextSlotHTML(cat)}</div>`;
  } else {
    body = `<div class="card-grid">${projects.map((p) => cardHTML(p, cat.id)).join("")}${nextSlotHTML(cat)}</div>`;
  }

  root.innerHTML = `
    <section class="page-head">
      <div class="container">
        <span class="page-head__icon page-head__icon--${cat.color}">${icon(cat.icon)}</span>
        <h1 class="page-head__title">${esc(cat.label)}</h1>
        <p class="page-head__intro">${esc(cat.blurb)}</p>
        <p class="page-head__count">${projects.length} ${projects.length === 1 ? "project" : "projects"}</p>
      </div>
    </section>

    <section class="section section--flush-top">
      <div class="container">${body}</div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <nav class="switcher" aria-label="Other work">
          <p class="label">More work</p>
          <div class="switcher__row">${others}</div>
        </nav>
      </div>
    </section>`;
}


/* Category pages: show the "Video" badge and the video player once a video is found */
function fillVideoExtras(projects) {
  projects.forEach(async (p) => {
    const urls = await discoverVideos(p);
    if (!urls.length) return;
    document.querySelectorAll(`[data-video-badge="${CSS.escape(p.id)}"]`).forEach((b) => { b.hidden = false; });
    document.querySelectorAll(`[data-video-row="${CSS.escape(p.id)}"]`).forEach((row) => {
      if (projectVideos(p).length) return; // a link from projects.js is already shown
      const t = toneFor(p, "videos");
      row.innerHTML = videoHTML(urls[0], { poster: "", title: plainTitle(p), tone: t.color });
    });
  });
}

/* ---------- Boot ---------- */
if (page === "home") {
  renderFeatured();
  renderCategoryTiles();
} else {
  const cat = categoryById(page);
  if (cat) {
    renderCategoryPage(cat);
    fillVideoExtras(projectsIn(cat.id));
  }
}

checkExistingImages();

// Open a project straight from a link like games.html#mysteries-of-bidasari
const startId = decodeURIComponent(location.hash.slice(1));
if (startId && PROJECTS.some((p) => p.id === startId)) modal.open(startId, { push: false });
