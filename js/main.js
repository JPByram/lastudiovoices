// ==========================================================
// LA Studio Voices — site behaviour
// EDIT: set your real email address here. Every "email us" link updates from it.
// ==========================================================
const EMAIL = "byram.jonathan@gmail.com";
const SUBJECT = "New project — let's talk";

// --- Email links -------------------------------------------------
const baseMailto = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}`;
document.querySelectorAll(".js-mailto").forEach((a) => (a.href = baseMailto));
document.querySelectorAll(".js-email").forEach((el) => (el.textContent = EMAIL));

// --- Nav: scrolled state, mobile menu, floating button ----------
const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
const floatCta = document.getElementById("float-cta");
const contact = document.getElementById("contact");

const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 30);
  const pastHero = window.scrollY > window.innerHeight * 0.8;
  const atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.7;
  floatCta.classList.toggle("is-visible", pastHero && !atContact);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  links.classList.toggle("is-open", open);
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// --- Reveal on scroll -------------------------------------------
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// --- Project brief -> pre-filled email ---------------------------
document.querySelectorAll("#type-chips .chip").forEach((chip) =>
  chip.addEventListener("click", () =>
    chip.setAttribute("aria-pressed", String(chip.getAttribute("aria-pressed") !== "true"))
  )
);

document.getElementById("brief").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target.elements;
  const name = f.name.value.trim();
  const timing = f.timing.value;
  const details = f.details.value.trim();
  const types = [...document.querySelectorAll('#type-chips [aria-pressed="true"]')].map((c) => c.textContent);

  const lines = ["Hi LA Studio Voices,", "", details || "I've got a project I'd love to talk to you about.", ""];
  if (types.length) lines.push(`Project type: ${types.join(", ")}`);
  if (timing) lines.push(`Timing: ${timing}`);
  if (types.length || timing) lines.push("");
  lines.push("Thanks!");
  if (name) lines.push(name);

  const subject = types.length ? `New project — ${types.join(" / ")}` : SUBJECT;
  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
});

// --- Copy email --------------------------------------------------
const copyBtn = document.getElementById("copy-email");
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copyBtn.textContent = "Copied — paste it anywhere";
  } catch {
    copyBtn.textContent = EMAIL;
  }
  setTimeout(() => (copyBtn.textContent = "Copy address"), 2400);
});

document.getElementById("year").textContent = new Date().getFullYear();
