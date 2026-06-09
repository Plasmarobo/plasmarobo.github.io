/* =========================================================================
   Live GitHub repository grid.
   Fetches public repos from both accounts via the public GitHub REST API,
   merges, de-dupes, filters forks, and renders a filterable grid.
   Unauthenticated requests are rate-limited (60/hr per IP); failures degrade
   gracefully to a link out to the profiles.
   ========================================================================= */
(function () {
    "use strict";

    var ACCOUNTS = ["Plasmarobo", "millibyte-products"];
    var grid = document.getElementById("repo-grid");
    var toolbar = document.getElementById("repo-filters");
    if (!grid) { return; }

    // Repos to hide from the live grid (already featured, or not portfolio-worthy)
    var HIDE = {
        "plasmarobo.github.io": true,
        "klipper-backup": true
    };

    var LANG_COLORS = {
        "C": "#555555", "C++": "#f34b7d", "Rust": "#dea584", "Python": "#3572A5",
        "JavaScript": "#f1e05a", "TypeScript": "#3178c6", "HTML": "#e34c26",
        "CSS": "#563d7c", "Shell": "#89e051", "Verilog": "#b2b7f8", "Go": "#00ADD8"
    };

    var ICON_STAR = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>';
    var ICON_FORK = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';

    function esc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function timeAgo(iso) {
        var then = new Date(iso).getTime();
        if (isNaN(then)) { return ""; }
        var secs = Math.max(1, Math.floor((Date.now() - then) / 1000));
        var units = [["yr", 31536000], ["mo", 2592000], ["wk", 604800],
                     ["d", 86400], ["h", 3600], ["m", 60]];
        for (var i = 0; i < units.length; i++) {
            var n = Math.floor(secs / units[i][1]);
            if (n >= 1) { return n + units[i][0] + " ago"; }
        }
        return "just now";
    }

    function renderSkeletons() {
        var html = "";
        for (var i = 0; i < 6; i++) { html += '<div class="repo-skel"></div>'; }
        grid.innerHTML = html;
    }

    function repoCard(r) {
        var langDot = r.language
            ? '<span class="repo__lang"><span class="lang-dot" style="background:' +
              (LANG_COLORS[r.language] || "#9aa0ab") + '"></span>' + esc(r.language) + "</span>"
            : "";
        var stars = r.stargazers_count > 0
            ? '<span>' + ICON_STAR + " " + r.stargazers_count + "</span>" : "";
        var fork = r.fork ? '<span title="fork">' + ICON_FORK + " fork</span>" : "";
        return '<a class="repo" href="' + esc(r.html_url) + '" target="_blank" rel="noopener"' +
            ' data-lang="' + esc(r.language || "") + '" data-owner="' + esc(r.owner.login) + '">' +
            '<div class="repo__top"><span class="repo__name">' + esc(r.name) + "</span></div>" +
            '<div class="repo__owner">' + esc(r.owner.login) + "</div>" +
            '<p class="repo__desc">' + (r.description ? esc(r.description) : "No description provided.") + "</p>" +
            '<div class="repo__meta">' + langDot + stars + fork +
            "<span>" + timeAgo(r.updated_at) + "</span></div></a>";
    }

    function buildFilters(repos) {
        if (!toolbar) { return; }
        var langs = {};
        repos.forEach(function (r) { if (r.language) { langs[r.language] = (langs[r.language] || 0) + 1; } });
        var ordered = Object.keys(langs).sort(function (a, b) { return langs[b] - langs[a]; });
        var html = '<button class="filter is-active" data-filter="all">All</button>';
        ordered.forEach(function (l) {
            html += '<button class="filter" data-filter="' + esc(l) + '">' + esc(l) + "</button>";
        });
        toolbar.innerHTML = html;
        toolbar.addEventListener("click", function (e) {
            var btn = e.target.closest(".filter");
            if (!btn) { return; }
            toolbar.querySelectorAll(".filter").forEach(function (b) { b.classList.remove("is-active"); });
            btn.classList.add("is-active");
            var f = btn.getAttribute("data-filter");
            grid.querySelectorAll(".repo").forEach(function (card) {
                card.style.display = (f === "all" || card.getAttribute("data-lang") === f) ? "" : "none";
            });
        });
    }

    function render(repos) {
        if (!repos.length) {
            grid.innerHTML = '<p class="repo-status">No repositories to show.</p>';
            return;
        }
        grid.innerHTML = repos.map(repoCard).join("");
        buildFilters(repos);
    }

    function fail() {
        grid.innerHTML = '<p class="repo-status">Couldn\'t load the live repository feed right now ' +
            '(GitHub may be rate-limiting). Browse everything directly on ' +
            '<a href="https://github.com/Plasmarobo?tab=repositories" target="_blank" rel="noopener">@Plasmarobo</a> and ' +
            '<a href="https://github.com/millibyte-products?tab=repositories" target="_blank" rel="noopener">@millibyte-products</a>.</p>';
    }

    function fetchAccount(user) {
        return fetch("https://api.github.com/users/" + user +
            "/repos?per_page=100&sort=updated", { headers: { "Accept": "application/vnd.github+json" } })
            .then(function (res) {
                if (!res.ok) { throw new Error("HTTP " + res.status); }
                return res.json();
            });
    }

    renderSkeletons();

    Promise.all(ACCOUNTS.map(function (u) {
        return fetchAccount(u).catch(function () { return []; });
    })).then(function (lists) {
        var all = [].concat.apply([], lists);
        if (!all.length) { fail(); return; }

        var seen = {};
        var repos = all.filter(function (r) {
            if (!r || r.private || r.archived) { return false; }
            if (HIDE[r.name.toLowerCase()]) { return false; }
            if (seen[r.full_name]) { return false; }
            seen[r.full_name] = true;
            return true;
        });

        // Sort: own repos first, then by stars, then most recently updated
        repos.sort(function (a, b) {
            if (a.fork !== b.fork) { return a.fork ? 1 : -1; }
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        render(repos);
    }).catch(fail);
})();
