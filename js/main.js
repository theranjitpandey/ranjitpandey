/**
 * Ranjit Pandey — Portfolio
 * Zero-dependency vanilla JS. No jQuery, no build step.
 * Sections:
 *   1. Theme (light/dark) toggle with persisted preference
 *   2. Mobile navigation menu
 *   3. Scroll-spy active nav link (IntersectionObserver)
 *   4. Scroll-reveal animations (IntersectionObserver)
 *   5. Hero role typing effect
 *   6. Animated skill bars
 *   7. Contact form validation + mailto handoff
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------------- */
  /* 1. Theme toggle                                                 */
  /* -------------------------------------------------------------- */
  function initTheme() {
    var root = document.documentElement;
    var toggle = document.getElementById("themeToggle");
    var stored = null;

    try {
      stored = localStorage.getItem("rp-theme");
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — fall back to default */
    }

    var systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var initial = stored || (systemPrefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initial);

    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("rp-theme", next);
      } catch (e) {
        /* ignore persistence failure */
      }
    });
  }

  /* -------------------------------------------------------------- */
  /* 2. Mobile nav                                                   */
  /* -------------------------------------------------------------- */
  function initMobileNav() {
    var menuToggle = document.getElementById("menuToggle");
    var navLinks = document.getElementById("navLinks");
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------------------------------------------------------------- */
  /* 3. Scroll-spy                                                   */
  /* -------------------------------------------------------------- */
  function initScrollSpy() {
    var sections = document.querySelectorAll("main section[id]");
    var links = document.querySelectorAll(".nav-links a[href^='#']");
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      map[id] = link;
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id;
          var link = map[id];
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* -------------------------------------------------------------- */
  /* 4. Scroll reveal                                                */
  /* -------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  /* -------------------------------------------------------------- */
  /* 5. Hero role typing effect                                      */
  /* -------------------------------------------------------------- */
  function initTyping() {
    var el = document.getElementById("roleTyped");
    if (!el) return;

    var roles = ["Python Developer", "Data Engineer", "Data Analyst"];

    if (prefersReducedMotion) {
      el.textContent = roles[0];
      return;
    }

    var roleIndex = 0;
    var charIndex = roles[0].length;
    var deleting = false;

    function tick() {
      var word = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        if (charIndex > word.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
          setTimeout(tick, 300);
          return;
        }
      }

      el.textContent = word.slice(0, charIndex);
      setTimeout(tick, deleting ? 40 : 75);
    }

    setTimeout(tick, 1400);
  }

  /* -------------------------------------------------------------- */
  /* 6. Animated skill bars                                          */
  /* -------------------------------------------------------------- */
  function initSkillBars() {
    var rows = document.querySelectorAll(".skill-row");
    if (!rows.length) return;

    function fill(row) {
      var pct = row.getAttribute("data-skill") || "0";
      var bar = row.querySelector(".skill-fill");
      if (bar) bar.style.width = pct + "%";
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      rows.forEach(fill);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    rows.forEach(function (row) { observer.observe(row); });
  }

  /* -------------------------------------------------------------- */
  /* 7. Contact form                                                 */
  /* -------------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var status = document.getElementById("formStatus");
    var fields = {
      name: { input: document.getElementById("name"), error: document.getElementById("nameError") },
      email: { input: document.getElementById("email"), error: document.getElementById("emailError") },
      message: { input: document.getElementById("message"), error: document.getElementById("messageError") }
    };

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function setError(field, hasError) {
      var wrapper = field.input.closest(".field");
      if (!wrapper) return;
      wrapper.classList.toggle("has-error", hasError);
      field.input.setAttribute("aria-invalid", hasError ? "true" : "false");
    }

    function validate() {
      var valid = true;

      var nameOk = fields.name.input.value.trim().length > 1;
      setError(fields.name, !nameOk);
      if (!nameOk) valid = false;

      var emailOk = isValidEmail(fields.email.input.value.trim());
      setError(fields.email, !emailOk);
      if (!emailOk) valid = false;

      var messageOk = fields.message.input.value.trim().length > 4;
      setError(fields.message, !messageOk);
      if (!messageOk) valid = false;

      return valid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validate()) {
        status.classList.remove("is-visible");
        return;
      }

      var name = fields.name.input.value.trim();
      var email = fields.email.input.value.trim();
      var message = fields.message.input.value.trim();

      var subject = "Portfolio inquiry from " + name;
      var body = message + "\n\n— " + name + " (" + email + ")";
      var mailto =
        "mailto:theranjitkartik@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      status.textContent = "Opening your email client to send this message…";
      status.classList.add("is-visible");
    });

    /* Clear error state as the person fixes a field */
    Object.keys(fields).forEach(function (key) {
      fields[key].input.addEventListener("input", function () {
        setError(fields[key], false);
      });
    });
  }

  /* -------------------------------------------------------------- */
  /* Footer year + init                                              */
  /* -------------------------------------------------------------- */
  function initFooterYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initTyping();
    initSkillBars();
    initContactForm();
    initFooterYear();
  });
})();
