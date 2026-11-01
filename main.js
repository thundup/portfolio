(() => {
  const root = document.documentElement;
  root.classList.add("js");

  const bar = document.querySelector(".bar");
  const onScroll = () => bar.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  const backdrop = document.querySelector(".menu-backdrop");
  const closeBtn = menu.querySelector(".menu-close");
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setMenu = (open, { returnFocus = true } = {}) => {
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      menu.hidden = false;
      backdrop.hidden = false;
      requestAnimationFrame(() => {
        menu.classList.add("open");
        backdrop.classList.add("open");
      });
      closeBtn.focus();
    } else {
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      setTimeout(() => {
        if (isOpen()) return;
        menu.hidden = true;
        backdrop.hidden = true;
      }, 400);
      if (returnFocus) toggle.focus();
    }
  };
  toggle.addEventListener("click", () => setMenu(!isOpen()));
  closeBtn.addEventListener("click", () => setMenu(false));
  backdrop.addEventListener("click", () => setMenu(false));
  menu.addEventListener("click", (e) => { if (e.target.closest("a[href^='#']")) setMenu(false, { returnFocus: false }); });
  document.addEventListener("keydown", (e) => {
    if (!isOpen()) return;
    if (e.key === "Escape") { setMenu(false); return; }
    if (e.key !== "Tab") return;
    const items = menu.querySelectorAll("a, button");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  const now = new Date();
  const year = document.getElementById("year");
  if (year) year.textContent = now.getFullYear();

  const careerStart = { year: 2019, month: 6 };
  const monthsWorked = (now.getFullYear() - careerStart.year) * 12 + (now.getMonth() - careerStart.month);
  const yoe = Math.floor(monthsWorked / 12);
  document.querySelectorAll("[data-yoe]").forEach((el) => { el.textContent = yoe; });
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = description.content.replace(/\d+\+ years/, `${yoe}+ years`);

  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
    return;
  }

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

  const navLinks = document.querySelectorAll(".skill-nav a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  document.querySelectorAll(".skill").forEach((el) => spy.observe(el));
})();
