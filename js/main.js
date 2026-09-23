document.addEventListener("DOMContentLoaded", () => {
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
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        galleryItems.forEach((item) => {
          const match = filter === "all" || item.dataset.category === filter;
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  // inquire form — opens the visitor's email client with the details pre-filled
  const form = document.querySelector(".inquire-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const label = (id) => form.querySelector(`label[for="${id}"]`)?.textContent || id;
      const lines = [];
      for (const [name, value] of data.entries()) {
        if (value) lines.push(`${label(name)}: ${value}`);
      }

      const subject = `Wedding Film Inquiry — ${data.get("partner1") || "New Inquiry"}`;
      const body = lines.join("\n");
      const mailtoUrl = `mailto:anabellemerlick@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;

      form.hidden = true;
      document.querySelector(".form-success").classList.add("is-visible");
    });
  }
});
