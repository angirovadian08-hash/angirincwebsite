// Angir Welding & Fabrication — site.js (no dependencies)
(() => {
  // header shadow
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // mobile drawer
  const drawer = document.getElementById("drawer");
  const openBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".drawer-close");
  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.hidden = !open;
    openBtn && openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeBtn && closeBtn.focus(); else openBtn && openBtn.focus();
  };
  openBtn && openBtn.addEventListener("click", () => setDrawer(true));
  closeBtn && closeBtn.addEventListener("click", () => setDrawer(false));
  drawer && drawer.addEventListener("click", (e) => { if (e.target === drawer) setDrawer(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer && !drawer.hidden) setDrawer(false); });

  // reveal on scroll
  const els = document.querySelectorAll(".card, .area-card, .pillars article, .steps li, .type, .why-c, .svc-group-head, .split-img, .g-card");
  if ("IntersectionObserver" in window) {
    els.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  // quote forms
  document.querySelectorAll("form.quote").forEach((form) => {
    const note = form.querySelector(".form-note");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("[required]").forEach((f) => { const bad = !f.value.trim(); f.classList.toggle("invalid", bad); if (bad) ok = false; });
      if (!ok) { note.textContent = "Please add your name and phone so we can reach you."; note.className = "form-note"; return; }
      const data = Object.fromEntries(new FormData(form).entries());
      data.page = location.pathname;
      const endpoint = form.dataset.endpoint;
      const btn = form.querySelector("button[type=submit]");
      if (endpoint) {
        btn.disabled = true; note.textContent = "Sending…";
        try {
          const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error();
          form.reset(); note.textContent = "Thanks — we got it and will call you shortly."; note.className = "form-note ok";
        } catch { note.textContent = "Couldn't send — please call or text us instead."; note.className = "form-note"; }
        btn.disabled = false;
      } else {
        const body = `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || ""}\nAddress: ${data.address || ""}\nType: ${data.type || ""}\nService: ${data.service || ""}\n\n${data.message || ""}\n\n(sent from ${location.href})`;
        location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent("Quote request" + (data.service ? " — " + data.service : ""))}&body=${encodeURIComponent(body)}`;
        note.textContent = "Opening your email app… or call/text us directly."; note.className = "form-note ok";
      }
    });
  });
})();
