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

  // inquire form — submits to Formspree, which emails the inquiry to Anabelle
  const form = document.querySelector(".inquire-form");
  if (form) {
    const FORMSPREE_URL = "https://formspree.io/f/xljdnooe";
    const errorBox = document.querySelector(".form-error");
    const submitBtn = form.querySelector(".form-submit");

    form.addEventListener("submit", async (e) => {
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
      data.append("_subject", subject);

      if (errorBox) errorBox.hidden = true;
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        const res = await fetch(FORMSPREE_URL, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Formspree error " + res.status);
        form.hidden = true;
        document.querySelector(".form-success").classList.add("is-visible");
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        if (errorBox) {
          const body = encodeURIComponent(lines.join("\n"));
          const link = errorBox.querySelector("a");
          if (link) {
            link.href = `mailto:anabellemerlick@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
          }
          errorBox.hidden = false;
        }
      }
    });
  }
});
