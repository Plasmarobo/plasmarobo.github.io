/* =========================================================================
   Site chrome: sticky-nav state, mobile menu, active-section highlighting,
   and footer year.
   ========================================================================= */
(function () {
    "use strict";

    var nav = document.getElementById("nav");
    var toggle = document.getElementById("nav-toggle");
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));

    // Sticky nav shadow on scroll
    function onScroll() {
        if (!nav) { return; }
        nav.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Mobile menu
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
        });
        nav.querySelectorAll(".nav__links a, .nav__cta").forEach(function (a) {
            a.addEventListener("click", function () { nav.classList.remove("is-open"); });
        });
    }

    // Active section highlighting
    var sections = links
        .map(function (a) {
            var id = a.getAttribute("href");
            return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
        })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) { return; }
                links.forEach(function (a) {
                    a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
        sections.forEach(function (s) { observer.observe(s); });
    }

    // Footer year
    var year = document.getElementById("year");
    if (year) { year.textContent = new Date().getFullYear(); }
})();
