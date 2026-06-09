/* =========================================================================
   Gallery lightbox for the projects detail page.
   Clicking a gallery thumbnail opens the full image in an overlay.
   ========================================================================= */
(function () {
    "use strict";

    var box = document.getElementById("lightbox");
    var boxImg = document.getElementById("lightbox-img");
    var closeBtn = document.getElementById("lightbox-close");
    if (!box || !boxImg) { return; }

    function open(src, alt) {
        boxImg.setAttribute("src", src);
        boxImg.setAttribute("alt", alt || "");
        box.classList.add("is-open");
        box.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function close() {
        box.classList.remove("is-open");
        box.setAttribute("aria-hidden", "true");
        boxImg.setAttribute("src", "");
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".gallery a").forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            var img = link.querySelector("img");
            open(link.getAttribute("href"), img ? img.getAttribute("alt") : "");
        });
    });

    box.addEventListener("click", function (e) {
        if (e.target === box || e.target === boxImg) { /* click backdrop closes */ }
        if (e.target !== boxImg) { close(); }
    });
    if (closeBtn) { closeBtn.addEventListener("click", close); }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && box.classList.contains("is-open")) { close(); }
    });
})();
