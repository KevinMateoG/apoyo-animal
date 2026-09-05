(function () {
  const STORAGE_KEY = 'cs-theme';
  const html = document.documentElement;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') {
    html.setAttribute('data-theme', 'dark');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-theme');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem(STORAGE_KEY, 'light');
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
      }
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.animal-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      buttons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      cards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = show ? 'flex' : 'none';
      });
    });
  });
});
