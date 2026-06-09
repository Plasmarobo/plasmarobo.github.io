/* =========================================================================
   Subtle "digital rain" background.
   Renders into <canvas id="visualizer" class="bkgcanvas">. The canvas itself
   is kept at low opacity via CSS so it reads as ambient texture, not noise.
   Honors prefers-reduced-motion and pauses while the tab is hidden.
   ========================================================================= */
(function () {
    "use strict";

    var canvas = document.getElementById("visualizer");
    if (!canvas || !canvas.getContext) { return; }

    var reduceMotion = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { return; }

    var ctx = canvas.getContext("2d");
    var GLYPHS = "01<>{}[]/\\=+*ABCDEF0123456789".split("");
    var FONT_SIZE = 16;
    var columns = [];
    var width = 0;
    var height = 0;
    var lastDraw = 0;
    var DRAW_INTERVAL = 55; // ms between frames — slow, ambient

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        var count = Math.floor(width / FONT_SIZE);
        columns = [];
        for (var i = 0; i < count; i++) {
            // random vertical start so the rain isn't a flat line
            columns[i] = Math.random() * (height / FONT_SIZE);
        }
        ctx.font = FONT_SIZE + "px 'Space Mono', monospace";
        ctx.textBaseline = "top";
    }

    function draw(now) {
        window.requestAnimationFrame(draw);
        if (now - lastDraw < DRAW_INTERVAL) { return; }
        lastDraw = now;

        // translucent wash creates the fading trail
        ctx.fillStyle = "rgba(10, 10, 12, 0.10)";
        ctx.fillRect(0, 0, width, height);

        for (var i = 0; i < columns.length; i++) {
            var glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            var x = i * FONT_SIZE;
            var y = columns[i] * FONT_SIZE;

            // brighter "head", dimmer trailing glyphs
            ctx.fillStyle = Math.random() > 0.975 ? "#7ffadf" : "#2de2a6";
            ctx.fillText(glyph, x, y);

            if (y > height && Math.random() > 0.975) {
                columns[i] = 0;
            } else {
                columns[i] += 1;
            }
        }
    }

    var resizeTimer = null;
    window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 150);
    });

    resize();
    window.requestAnimationFrame(draw);
})();
