document.addEventListener("DOMContentLoaded", () => {
  // force-start autoplay videos — Safari sometimes ignores the autoplay
  // attribute alone and needs an explicit play() call
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.muted = true;
    const tryPlay = () => video.play().catch(() => {});
    tryPlay();
    video.addEventListener("loadedmetadata", tryPlay);
  });

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-primary");

  // solid header after scrolling past the hero
  if (header) {
    const solidify = () => {
      header.classList.toggle("is-solid", window.scrollY > 80);
    };
    solidify();
    window.addEventListener("scroll", solidify, { passive: true });
  }

  // mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
      });
    });
  }

  // scroll reveal
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // gallery filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".masonry-item");
  if (filterBtns.length && galleryItems.length) {
    const applyFilter = (filter) => {
      galleryItems.forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !match);
      });
    };
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter(btn.dataset.filter);
      });
    });
    const initialBtn = document.querySelector(".filter-btn.active") || filterBtns[0];
    applyFilter(initialBtn.dataset.filter);
  }

  // inquire form — opens the visitor's email client with the details pre-filled
  const form = document.querySelector(".inquire-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const label = (id) => form.querySelector(`label[for="${id}"]`)?.textContent || id;
      const lines = [];
      for (const [name, value] of data.entries()) {
        if (value) lines.push(`${label(name)}: ${value}`);
      }

      const subject = `Wedding Film Inquiry — ${data.get("partner1") || "New Inquiry"}`;
      const body = lines.join("\n");
      const to = "anabellemerlick@gmail.com";
      const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const mailtoUrl = `mailto:${to}?${query}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Gmail compose opens in the browser using the visitor's existing Gmail login
      // (no mail-app setup or password); fall back to their mail app if blocked
      const win = window.open(gmailUrl, "_blank", "noopener");
      if (!win) window.location.href = mailtoUrl;

      const fallback = document.querySelector("#mailto-fallback");
      if (fallback) fallback.href = mailtoUrl;

      form.hidden = true;
      document.querySelector(".form-success").classList.add("is-visible");
    });
  }
});
