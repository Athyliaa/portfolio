/* =========================================================
   SITE SETTINGS
   Your personal details live here. Change them once and
   every page updates.
   Anything left as "" shows as a placeholder on the site.
   ========================================================= */

const SITE = {
  shortName: "Alia",
  name: "Nur Alia Safia",
  fullName: "Nur Alia Safia binti Mohamad",
  tagline: "IT (Multimedia Technology) student",
  location: "Kajang, Selangor",

  email: "aliasafia03@gmail.com",
  linkedin: "https://www.linkedin.com/in/alia-safia/",

  photo: "images/profile/alia.jpg" // add a photo with this exact name (square works best)
};

/* The four work categories.
   "id" is what you type in a project's `category` in js/projects.js. */
const CATEGORIES = [
  {
    id: "games",
    label: "Games",
    page: "games.html",
    icon: "gamepad",
    color: "coral",
    blurb: "Cel-shaded 3D games built in Unity, from story and levels to UI."
  },
  {
    id: "3d",
    label: "3D Modelling",
    page: "3d-modelling.html",
    icon: "cube",
    color: "teal",
    blurb: "Stylized characters, environments and props made in Blender."
  },
  {
    id: "videos",
    label: "Videos",
    page: "videos.html",
    icon: "play",
    color: "coral-tint",
    blurb: "3D animation and video projects."
  },
  {
    id: "websites",
    label: "Websites",
    page: "websites.html",
    icon: "browser",
    color: "teal-tint",
    blurb: "Sites built with HTML, CSS and JavaScript."
  },
  {
    id: "ui",
    label: "UI Design",
    page: "ui-design.html",
    icon: "layout",
    color: "yellow",
    blurb: "App and interface designs, from screens to navigation flow."
  }
];
