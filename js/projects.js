/* =========================================================
   YOUR PROJECTS
   Every project on the site comes from this list.
   To add one: copy a block { ... }, paste it, change the values.

   FIELDS
   id           unique, lowercase-with-dashes. Also the image folder name:
                images/projects/<id>/
   title        project name
   category     "games", "3d", "videos", "websites" or "ui"
                (use a list like ["videos", "3d"] to show it on two pages)
   year         e.g. "2026"
   status       optional, e.g. "In progress"
   featured     optional, true = shown as the big project on the home page
                (only one project should have this)
   description  1-2 sentences, shown on the card
   details      optional, longer text shown in the detail view
   role         what YOU did, as a list
   tools        software / languages used, as a list
   video        optional: a YouTube / Google Drive link, shown first in the slideshow.
                Several: ["https://youtu.be/...", "https://youtu.be/..."]

   IMAGES AND VIDEO FILES: no code needed, just name the files.
   Put them in images/projects/<id>/ :
     thumbnail.jpg          the card image (only on cards, not in the popup)
     video.mp4              your own video file, first slide in the popup
     video-2.mp4            a second video (then video-3.mp4 ...), after the first
     screenshot-1.jpg       popup slideshow, in number order
     screenshot-2.jpg       ... as many as you like, no gaps in the numbers
   (.png also works for thumbnail and screenshots)

   Optional overrides (you normally don't need these):
   thumbnail    a different card image path
   images       your own list instead of screenshot-1, -2, ...
                e.g. ["images/projects/x/a.jpg", { src: "images/projects/x/b.jpg", caption: "Main menu" }]
   liveLink     optional, a link to the live website / playable build / prototype
   liveLabel    optional, button text for liveLink (default "Visit live site")

   Text in [square brackets] shows on the site as a highlighted
   placeholder, so you can spot what still needs filling in.
   If a file doesn't exist yet, the site shows a placeholder or skips it.
   ========================================================= */

const PROJECTS = [
  /* ---------------- GAMES ---------------- */
  {
    id: "mysteries-of-bidasari",
    title: "Mysteries of Bidasari",
    category: "games",
    year: "2026",
    status: "In progress",
    featured: true,
    description:
      "My final year project: a cel-shaded 3D game based on Sabah's Kadazan-Dusun folklore, built in Unity.",
    details:
      "A two-person team project. We used chibi stylization and cel-shading to avoid the uncanny valley, so the characters' expressions read clearly to players.",
    role: [
      "UI Design and Implementation",
      "Story and Level Design",
      "3D Modelling and Asset Creation",
      "Gameplay Programming (C#, Unity)",
      "Game Testing and Quality Assurance (QA)"
    ],
    tools: ["Unity", "Blender", "C#"],
    video: "", // optional: YouTube / Google Drive link (or just add video.mp4 to the folder)
    liveLink: ""
  },
  {
    id: "coin-runner",
    title: "Coin Runner",
    category: "games",
    year: "2025",
    description: "A 3D game built in C++ with OpenGL (GLUT) in Code::Blocks.",
    role: [
      "Programmed the character movement (switching lanes and jumping)",
      "Built the road and obstacle generation"
    ],
    tools: ["C++", "OpenGL (GLUT)", "Code::Blocks"],
    video: "", // optional: YouTube / Google Drive link (or just add video.mp4 to the folder)
    liveLink: ""
  },

  /* ---------------- 3D MODELLING ---------------- */
  {
    id: "bidasari-3d-models",
    title: "Bidasari Characters & Environments",
    category: "3d",
    year: "2026",
    status: "In progress",
    description:
      "Chibi-stylized characters and environments I modelled for my final year game, Mysteries of Bidasari.",
    role: ["3D modelling for the game"],
    tools: ["Blender"],
    video: "", // optional: YouTube / Google Drive link (or just add video.mp4 to the folder)
    liveLink: ""
  },
  {
    id: "ar-interactive-storybook",
    title: "AR Interactive Storybook",
    category: "3d",
    year: "2025",
    description:
      "A physical storybook whose pages trigger 3D cartoon animations with audio when scanned.",
    details:
      "A group project, presented to visitors at a university exhibition booth. The AR scanning ran on a local XAMPP server.",
    role: [
      "Built the 3D models and animations in Blender",
      "Contributed to the AR scanning code"
    ],
    tools: ["Blender", "XAMPP"],
    video: "", // optional: YouTube / Google Drive link (or just add video.mp4 to the folder)
    liveLink: ""
  },

  /* ---------------- VIDEOS ---------------- */
  {
    id: "pizza-shop-ad",
    title: "Paradise Pizza 3D Animated Short Ad",
    category: ["videos", "3d"],
    year: "2024",
    description: "A short 3D animated advertisement for a pizza shop, made as a group project in Blender.",
    role: [
      "Modelled some of the 3D environments",
      "Animated assigned scenes"
    ],
    tools: ["Blender"],
    video: "https://youtu.be/2E6yEK3caKE",
    liveLink: ""
  },

  /* ---------------- WEBSITES ---------------- */
  {
    id: "lights-out",
    title: "Lights Out (2025)",
    category: "websites",
    year: "2026",
    description:
      "A Formula 1 fan website introducing the drivers and teams, summarising the 2025 season.",
    role: [
      "Planned the content and designed the site",
      "Built it in HTML, CSS and JavaScript with AI-assisted coding"
    ],
    tools: ["HTML", "CSS", "JavaScript"],
    video: "", // optional: YouTube / Google Drive link (or just add video.mp4 to the folder)
    liveLink: "https://athyliaa.github.io/lights-out-2025/"
  },

  /* ---------------- UI DESIGN ---------------- */
  {
    id: "mental-health-app-ui",
    title: "Mental Health App UI Design",
    category: "ui",
    year: "2025",
    description: "UI mockups for a mental health app, with a screen-by-screen user flow showing what users see after each tap.",
    role: ["Designed the app screens", "Mapped the user flow between screens"],
    tools: ["Canva"],
    video: "", // optional: YouTube / Google Drive link (or just add video.mp4 to the folder)
    liveLink: "https://canva.link/l5totnfzdhu7s8l", // all the screens on Canva
    liveLabel: "View all screens"
  }
];
