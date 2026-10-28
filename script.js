"use strict";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const CONFIG = {
  email: "edwin.olaez@edu.sait.ca",
  github: "https://github.com/edwinolaez",
  // Create a free form at https://formspree.io and paste its ID (e.g. "xyzabcd").
  // Left empty, the contact form falls back to opening the visitor's email app.
  formspreeId: "",
};

// Repos are private, so cards link to live deploys only.
// Set liveUrl to null to show "Live link coming soon".
const PROJECTS = [
  {
    id: "relayops",
    icon: "📊",
    title: "Relay OPS",
    subtitle: "Founder & Lead Developer",
    summary:
      "AI-powered operations platform for independent quick-service restaurants: ML scheduling, training, hiring, inventory, and a daily AI briefing for GMs.",
    categories: ["ai", "data"],
    stack: ["Python", "scikit-learn", "pandas", "Streamlit", "Claude API", "Docker"],
    liveUrl: "https://smart-schedule-optimizer-production.up.railway.app",
    problem:
      "QSR turnover runs 75–150% a year and most GMs still schedule from intuition and spreadsheets. Poor schedules hurt morale, which hurts service, which hurts sales.",
    highlights: [
      "<strong>6 connected modules</strong>: Smart Scheduling, Training & Development, Hiring Needs, Inventory Forecasting, Daily GM Briefing, and a Staff Portal",
      "<strong>Random Forest demand model</strong> trained on 2 years of sales data (13k+ rows) with last-year context features",
      "<strong>Schedule optimizer with 9 hard rules</strong>, min-hours guarantees, and a pay-period equity balancer",
      "<strong>Claude-powered daily briefing</strong> that digests all modules into plain language for the GM",
      "<strong>38 unit tests</strong> covering every scheduling rule",
    ],
  },
  {
    id: "pathr",
    icon: "🎓",
    title: "Pathr",
    subtitle: "SAIT Capstone · for Apply Alberta",
    summary:
      "AI pathway advisor helping Alberta students discover, compare, and apply to programs across all 27 public post-secondary institutions, in 15 languages.",
    categories: ["ai", "fullstack", "data"],
    stack: ["Next.js 16", "React 19", "TypeScript", "Convex", "Claude API", "Tailwind v4", "FastAPI"],
    liveUrl: "https://apas-pathway-tool.vercel.app",
    problem:
      "Program information is scattered across 27 institution websites, and newcomer and international students face language and requirement barriers.",
    highlights: [
      "<strong>~1,787 programs</strong> across all 27 publicly funded Alberta institutions",
      "<strong>Claude Sonnet recommendations</strong> ranked against a student's profile",
      "<strong>Real-time AI chat in 15 languages</strong> with voice input",
      "<strong>International student hub</strong>: tuition, IELTS/TOEFL, and deadlines from a Python scraper pipeline",
      "<strong>Validated data pipeline</strong>: extract → validate → review queue → approve → write",
    ],
  },
  {
    id: "bluepulse",
    icon: "🌊",
    title: "BluePulse AI",
    subtitle: "Project Manager · QA & Security Lead",
    summary:
      "Post-wildfire environmental monitoring platform for the Athabasca watershed in Jasper National Park, with a live digital twin and AI analysis.",
    categories: ["ai", "fullstack", "data"],
    stack: ["Next.js", "Leaflet", "deck.gl", "FastAPI", "Kong", "Supabase + PostGIS", "TensorFlow", "Claude API"],
    liveUrl: "https://bluepulseai-capstone.vercel.app",
    problem:
      "The 2024 Jasper wildfire burned ~35,000 hectares. Monitoring erosion and water contamination across that area with field surveys alone is slow and expensive.",
    highlights: [
      "<strong>Led a 5-person team</strong> as PM, owning QA, CI/CD, auth, and integration",
      "<strong>Interactive 2D/3D hazard maps</strong>: erosion, water quality, burn scar, and flood layers",
      "<strong>Digital twin sliders</strong> for rainfall, slope, and contamination that re-run ML models live",
      "<strong>Real data</strong> from Environment Canada, NASA SRTM, and Alberta Wildfire",
      "<strong>Role-based access</strong> (Viewer → Analyst → Admin → Superadmin) and rate limiting via Kong",
    ],
  },
  {
    id: "phinvoice",
    icon: "🥐",
    title: "Pacific Hut Invoice System",
    subtitle: "Full-Stack Developer · Real client",
    summary:
      "Invoice and production coordination system for a Calgary bakery: six microservices, an admin dashboard, a driver delivery app, and QuickBooks sync.",
    categories: ["fullstack", "microservices"],
    stack: ["TypeScript", "Node.js", "React", "PostgreSQL", "PWA", "QuickBooks API", "Docker", "CI/CD"],
    liveUrl: null,
    problem:
      "Orders, production planning, delivery routes, and invoicing lived in separate manual processes, which caused errors and double entry.",
    highlights: [
      "<strong>6 microservices</strong>: identity/JWT, catalog, customer-routes, invoicing, production planning, and QuickBooks sync",
      "<strong>Admin dashboard</strong> for invoices, credits, standing orders, and production projections",
      "<strong>Driver PWA</strong> for on-route delivery submissions",
      "<strong>QuickBooks Online integration</strong> to remove double entry",
      "<strong>CI/CD pipeline</strong> with auto-deployed staging and approval-gated production releases",
    ],
  },
];

const FILTER_LABELS = { ai: "AI / ML", fullstack: "Full-Stack", microservices: "Microservices", data: "Data" };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

function externalLink(href, text, cls) {
  return el("a", { href, class: cls, target: "_blank", rel: "noopener noreferrer", text });
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const root = document.documentElement;
const themeIcon = $(".theme-icon");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  localStorage.setItem("theme", theme);
}

setTheme(
  localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
);
$("#themeToggle").addEventListener("click", () =>
  setTheme(root.dataset.theme === "dark" ? "light" : "dark")
);

// ---------------------------------------------------------------------------
// Project cards
// ---------------------------------------------------------------------------
const grid = $("#projectGrid");

function statusBadge(p) {
  return p.liveUrl
    ? el("span", { class: "status live", text: "Live" })
    : el("span", { class: "status soon", text: "Live link coming soon" });
}

PROJECTS.forEach((p) => {
  const card = el("article", {
    class: "card reveal",
    tabindex: "0",
    role: "button",
    "aria-label": `Open details for ${p.title}`,
    "data-cats": p.categories.join(" "),
  }, [
    el("div", { class: "card-icon", text: p.icon, "aria-hidden": "true" }),
    el("div", {}, [el("h3", { text: p.title }), el("span", { class: "subtitle", text: p.subtitle })]),
    el("p", { text: p.summary }),
    el("ul", { class: "tags" }, p.stack.slice(0, 5).map((s) => el("li", { text: s }))),
    el("div", { class: "card-footer" }, [
      statusBadge(p),
      el("span", { class: "note", text: "Click for details →" }),
    ]),
  ]);

  card.addEventListener("click", () => openModal(p));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(p); }
  });
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
  grid.append(card);
});

// Filters
$$(".chip").forEach((chip) =>
  chip.addEventListener("click", () => applyFilter(chip.dataset.filter))
);

function applyFilter(filter) {
  $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === filter));
  $$(".card", grid).forEach((card) => {
    const show = filter === "all" || card.dataset.cats.split(" ").includes(filter);
    card.classList.toggle("hidden", !show);
  });
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
const modal = $("#modal");
const modalContent = $("#modalContent");
let lastFocus = null;

function openModal(p) {
  lastFocus = document.activeElement;
  modalContent.replaceChildren(
    el("div", { class: "card-icon", text: p.icon, "aria-hidden": "true" }),
    el("h2", { id: "modalTitle", text: p.title }),
    el("span", { class: "subtitle note", text: p.subtitle }),
    el("h4", { text: "The problem" }),
    el("p", { text: p.problem }),
    el("h4", { text: "What I built" }),
    el("ul", { class: "points" }, p.highlights.map((h) => el("li", { html: h }))),
    el("h4", { text: "Tech stack" }),
    el("ul", { class: "tags" }, p.stack.map((s) => el("li", { text: s }))),
    el("div", { class: "modal-actions" }, [
      p.liveUrl
        ? externalLink(p.liveUrl, "Open live site ↗", "btn primary small")
        : el("span", { class: "status soon", text: "Live link coming soon" }),
      el("span", { class: "note", text: "Source is private. Happy to walk through it on request." }),
    ])
  );
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $(".modal-close").focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocus?.focus();
}

$$("[data-close]", modal).forEach((n) => n.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

// ---------------------------------------------------------------------------
// Scroll reveal + counters
// ---------------------------------------------------------------------------
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      $$("[data-count]", entry.target).forEach(countUp);
      io.unobserve(entry.target);
    }),
  { threshold: 0.12 }
);
$$(".reveal").forEach((n, i) => {
  n.style.transitionDelay = `${Math.min(i % 4, 3) * 80}ms`;
  io.observe(n);
});

function countUp(node) {
  const target = Number(node.dataset.count);
  const start = performance.now();
  const dur = 1200;
  const tick = (now) => {
    const t = Math.min((now - start) / dur, 1);
    node.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---------------------------------------------------------------------------
// Terminal
// ---------------------------------------------------------------------------
const termBody = $("#termBody");
const termForm = $("#termForm");
const termInput = $("#termCmd");
const history = [];
let histIdx = 0;

function print(parts, cls) {
  const line = el("div", cls ? { class: cls } : {});
  for (const part of [].concat(parts)) line.append(typeof part === "string" ? part : part);
  termBody.append(line);
  termBody.scrollTop = termBody.scrollHeight;
}

const hl = (t) => el("span", { class: "hl", text: t });

const COMMANDS = {
  help: () => {
    print("Available commands:");
    [
      ["whoami", "who I am"],
      ["about", "short bio"],
      ["projects", "list featured projects"],
      ["open <n>", "open project details (e.g. open 1)"],
      ["skills", "my toolbox"],
      ["filter <tag>", "filter project grid: ai, fullstack, microservices, data, all"],
      ["contact", "how to reach me"],
      ["theme", "toggle dark / light mode"],
      ["clear", "clear the terminal"],
    ].forEach(([c, d]) => print(["  ", hl(c.padEnd(14)), d]));
  },
  whoami: () => print("Edwin Olaez: software developer, founder of Relay OPS Inc., ex-QSR GM."),
  about: () =>
    print(
      "SAIT Software Development student (grad Aug 2026). 27 years running quick-service restaurants, " +
        "now building AI-powered tools that fix the operational problems I lived with."
    ),
  projects: () =>
    PROJECTS.forEach((p, i) =>
      print([`  [${i + 1}] `, hl(p.title), ` - ${p.summary.split(":")[0].split(",")[0]}`])
    ),
  open: (arg) => {
    const n = parseInt(arg, 10);
    const p = PROJECTS[n - 1] || PROJECTS.find((x) => x.id === (arg || "").toLowerCase());
    if (!p) return print(`Usage: open <1-${PROJECTS.length}>`, "err");
    print(`Opening ${p.title}...`);
    setTimeout(() => openModal(p), 250);
  },
  skills: () =>
    print("TypeScript · Python · React/Next.js · Node.js · FastAPI · PostgreSQL/PostGIS · Convex · " +
      "Supabase · scikit-learn · Claude API · Docker · CI/CD"),
  filter: (arg) => {
    const f = (arg || "").toLowerCase();
    if (f !== "all" && !FILTER_LABELS[f]) return print("Usage: filter ai|fullstack|microservices|data|all", "err");
    applyFilter(f);
    print(`Filtered projects to: ${f === "all" ? "All" : FILTER_LABELS[f]}`);
    $("#projects").scrollIntoView({ behavior: "smooth" });
  },
  contact: () => {
    print(["  email:  ", el("a", { href: `mailto:${CONFIG.email}`, text: CONFIG.email })]);
    print(["  github: ", externalLink(CONFIG.github, CONFIG.github.replace("https://", ""))]);
  },
  theme: () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    print(`Theme set to ${root.dataset.theme}.`);
  },
  clear: () => termBody.replaceChildren(),
  sudo: () => print("Nice try. 😄", "err"),
};

termForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = termInput.value.trim();
  termInput.value = "";
  if (!raw) return;
  history.push(raw);
  histIdx = history.length;
  print(`$ ${raw}`, "cmd");
  const [cmd, ...args] = raw.split(/\s+/);
  const fn = COMMANDS[cmd.toLowerCase()];
  if (fn) fn(args.join(" "));
  else print(`command not found: ${cmd}. Type 'help'.`, "err");
});

termInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && histIdx > 0) {
    termInput.value = history[--histIdx];
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    histIdx = Math.min(histIdx + 1, history.length);
    termInput.value = history[histIdx] || "";
    e.preventDefault();
  }
});

$("#term").addEventListener("click", () => termInput.focus({ preventScroll: true }));
print("Welcome! Type 'help' to see what I can do.");

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
const form = $("#contactForm");
const statusEl = $("#formStatus");
const COOLDOWN_MS = 60_000;

function setStatus(msg, kind) {
  statusEl.textContent = msg;
  statusEl.className = `form-status ${kind || ""}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (data._gotcha) return;

  let valid = true;
  $$("input[required], textarea[required]", form).forEach((f) => {
    const ok = f.checkValidity() && f.value.trim() !== "";
    f.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) return setStatus("Please fill in all fields with a valid email.", "err");

  const last = Number(sessionStorage.getItem("lastSend") || 0);
  if (Date.now() - last < COOLDOWN_MS) {
    return setStatus("Thanks! Please wait a minute before sending another message.", "err");
  }

  if (!CONFIG.formspreeId) {
    const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n- ${data.name} (${data.email})`);
    window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
    sessionStorage.setItem("lastSend", String(Date.now()));
    return setStatus("Opening your email app...", "ok");
  }

  const btn = $("button[type=submit]", form);
  btn.disabled = true;
  setStatus("Sending...");
  try {
    const res = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(String(res.status));
    sessionStorage.setItem("lastSend", String(Date.now()));
    form.reset();
    setStatus("Message sent! I'll get back to you soon.", "ok");
  } catch {
    setStatus(`Something went wrong. Email me directly at ${CONFIG.email}.`, "err");
  } finally {
    btn.disabled = false;
  }
});

$("#year").textContent = new Date().getFullYear();
