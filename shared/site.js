document.addEventListener("DOMContentLoaded", async () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  const contentBox = document.getElementById("content");
  const links = Array.from(document.querySelectorAll(".navlink"));

  async function loadTab(tabId) {
    if (!tabId) tabId = "about";
    links.forEach(a => a.classList.toggle("active", a.dataset.tab === tabId));

    try {
      const res = await fetch(`/content/${tabId}.html`, { cache: "no-cache" });
      if (!res.ok) throw new Error();
      contentBox.innerHTML = await res.text();
    } catch {
      contentBox.innerHTML = `
        <section class="section active">
          <h2>Missing content</h2>
          <p class="muted">Could not load: <code>/content/${tabId}.html</code></p>
        </section>
      `;
    }
  }

  links.forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const tab = a.dataset.tab;
      history.pushState(null, "", `/#${tab}`);
      loadTab(tab);
    });
  });

  window.addEventListener("popstate", () => {
    loadTab((location.hash || "#about").replace("#", ""));
  });

  loadTab((location.hash || "#about").replace("#", ""));
});
