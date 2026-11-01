document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const links = [...document.querySelectorAll('.navlink')];
  const year = document.getElementById('y');
  year.textContent = new Date().getFullYear();
  let requestId = 0;
  async function render() {
    const id = ++requestId;
    const hash = location.hash || '#about';
    const link = links.find(a => a.hash === hash) || links[0];
    content.setAttribute('aria-busy', 'true');
    links.forEach(a => {
      a.classList.toggle('active', a === link);
      if (a === link) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    try {
      const response = await fetch(link.dataset.page, {cache: 'no-cache'});
      if (!response.ok) throw new Error('Page unavailable');
      const html = await response.text();
      if (id !== requestId) return;
      content.innerHTML = html;
      document.title = `${link.textContent} | Sameer Pokhrel`;
      window.scrollTo({top: 0, behavior: 'instant'});
    } catch (error) {
      if (id !== requestId) return;
      content.innerHTML = '<h1>Unable to load this page</h1><p>Please refresh to try again, or <a href="assets/CV_SameerPokhrel_October2026.pdf">read the full CV</a>.</p>';
    } finally { if (id === requestId) content.setAttribute('aria-busy', 'false'); }
  }
  content.addEventListener('click', event => {
    const jump = event.target.closest('a[data-section]');
    if (jump) {event.preventDefault(); document.getElementById(jump.dataset.section)?.scrollIntoView({behavior:'smooth'});}
  });
  document.querySelector('.skip-link').addEventListener('click', event => {event.preventDefault(); content.focus();});
  window.addEventListener('hashchange', render);
  render();
});
