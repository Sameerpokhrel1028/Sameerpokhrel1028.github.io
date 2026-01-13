document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const links = Array.from(document.querySelectorAll(".topnav .navlink"));

  // footer year
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  async function loadPage(link, pushHash = true) {
    const page = link.dataset.page;
    if (!page) return;

    // active tab highlight
    links.forEach(a => a.classList.toggle("active", a === link));

    try {
      const res = await fetch(page, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${page}`);
      const html = await res.text();
      content.innerHTML = html;

      // update URL hash
      if (pushHash) {
        const hash = link.getAttribute("href") || "#about";
        history.replaceState(null, "", hash);
      }

      // feel like "new page"
      window.scrollTo({ top: 0 });
    } catch (err) {
      content.innerHTML = `
        <h2>Page failed to load</h2>
        <p class="muted">Could not load: <b>${page}</b></p>
      `;
      console.error(err);
    }
  }

  // click events
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(link, true);
    });
  });

  // initial load based on hash
  const hash = (location.hash || "#about").toLowerCase();
  const match = links.find(a => (a.getAttribute("href") || "").toLowerCase() === hash) || links[0];
  loadPage(match, false);

  // handle manual hash changes
  window.addEventListener("hashchange", () => {
    const h = (location.hash || "#about").toLowerCase();
    const m = links.find(a => (a.getAttribute("href") || "").toLowerCase() === h) || links[0];
    loadPage(m, false);
  });
});
