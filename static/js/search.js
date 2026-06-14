(function () {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  let fuse = null;
  let loading = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error("failed to load " + src));
      document.head.appendChild(script);
    });
  }

  // Load Fuse.js and the search index lazily, on first focus
  function ensureFuse() {
    if (!loading) {
      loading = loadScript(input.dataset.fuseUrl)
        .then(() => loadScript(input.dataset.indexUrl))
        .then(() => {
          // Exclude entries with an empty body (section pages etc.)
          fuse = new Fuse(window.searchIndex.filter((e) => e.body), {
            keys: ["title", "body"],
            includeMatches: true,
            ignoreLocation: true,
            threshold: 0.3,
            minMatchCharLength: 2,
          });
          render();
        });
    }
    return loading;
  }

  function snippet(result) {
    const body = result.item.body;
    const bodyMatch = (result.matches || []).find((m) => m.key === "body");
    if (!bodyMatch || bodyMatch.indices.length === 0) {
      return body.slice(0, 60);
    }
    const [start] = bodyMatch.indices[0];
    const from = Math.max(0, start - 20);
    return (from > 0 ? "…" : "") + body.slice(from, from + 60) + "…";
  }

  function render() {
    const query = input.value.trim();
    results.innerHTML = "";
    if (!fuse || query.length < 2) {
      results.hidden = true;
      return;
    }
    const hits = fuse.search(query, { limit: 8 });
    for (const hit of hits) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = hit.item.url;
      const title = document.createElement("span");
      title.className = "search-title";
      title.textContent = hit.item.title || hit.item.url;
      const body = document.createElement("span");
      body.className = "search-snippet";
      body.textContent = snippet(hit);
      a.append(title, body);
      li.appendChild(a);
      results.appendChild(li);
    }
    results.hidden = hits.length === 0;
  }

  input.addEventListener("focus", ensureFuse, { once: true });
  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      results.hidden = true;
      input.blur();
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".site-search")) {
      results.hidden = true;
    }
  });
})();
