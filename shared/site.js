// shared/site.js
document.addEventListener("DOMContentLoaded", () => {
  // footer year
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  const nav = document.querySelector(".topnav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a.navlink"));
  const sections = Array.from(document.querySelectorAll("main .section"));

  // If your footer uses .footer, ensure it's not treated as a "section"
  // (it isn't, unless you gave it class="section")

  function activate(id, updateHash = true) {
    // activate section
    sections.forEach(sec => sec.classList.toggle("active", sec.id === id));

    // activate nav link
    links.forEach(a => {
      const target = (a.getAttribute("href") || "").replace("#", "");
      a.classList.toggle("active", target === id);
    });

    if (updateHash) {
      history.replaceState(null, "", `#${id}`);
    }
  }

  // click handling
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      e.preventDefault();
      const id = href.slice(1);
      activate(id, true);
    });
  });

  // initial tab
  const hashId = (location.hash || "").replace("#", "");
  const defaultId =
    (hashId && document.getElementById(hashId) ? hashId : null) ||
    (sections[0] ? sections[0].id : null);

  if (defaultId) activate(defaultId, false);

  // if user changes hash manually
  window.addEventListener("hashchange", () => {
    const id = (location.hash || "").replace("#", "");
    if (id && document.getElementById(id)) activate(id, false);
  });
});
