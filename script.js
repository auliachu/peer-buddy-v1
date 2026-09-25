(() => {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileLinks = document.querySelectorAll('.mobile-panel a');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      mobileToggle.textContent = open ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', String(open));
    });
    mobileLinks.forEach(link => link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      mobileToggle.textContent = '☰';
      mobileToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const backTop = document.getElementById('backTop');
  if (backTop) {
    const updateBackTop = () => backTop.classList.toggle('show', window.scrollY > 700);
    window.addEventListener('scroll', updateBackTop, { passive: true });
    updateBackTop();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const publicationItems = [...document.querySelectorAll('.publication-item')];
  const searchInput = document.getElementById('publicationSearch');
  const noResults = document.getElementById('noResults');
  let activeFilter = 'all';

  const filterPublications = () => {
    if (!publicationItems.length) return;
    const q = (searchInput?.value || '').toLowerCase().trim();
    let visible = 0;
    publicationItems.forEach(item => {
      const categoryOK = activeFilter === 'all' || item.dataset.category === activeFilter;
      const searchableText = `${item.dataset.title || ''} ${item.textContent || ''}`.toLowerCase();
      const textOK = !q || searchableText.includes(q);
      const show = categoryOK && textOK;
      item.hidden = !show;
      item.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (noResults) noResults.classList.toggle('show', visible === 0);
  };

  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter || 'all';
    filterPublications();
  }));
  searchInput?.addEventListener('input', filterPublications);

  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // When opening a page with #anchor, offset sticky header neatly.
  if (location.hash) {
    window.addEventListener('load', () => {
      const target = document.querySelector(location.hash);
      if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const name = document.getElementById('contactName')?.value.trim() || '';
      const email = document.getElementById('contactEmail')?.value.trim() || '';
      const topic = document.getElementById('contactTopic')?.value.trim() || 'Collaboration';
      const message = document.getElementById('contactMessage')?.value.trim() || '';
      const subject = encodeURIComponent(`[Peer Buddy Collaboration] ${topic}`);
      const body = encodeURIComponent(`Hello Peer Buddy,\n\nMy name is ${name}.\nEmail: ${email}\nTopic: ${topic}\n\n${message}\n\nThank you.`);
      const status = document.getElementById('contactStatus');
      if (status) status.textContent = 'Opening your email application…';
      window.location.href = `mailto:hello@peerbuddy.org?subject=${subject}&body=${body}`;
    });
  }

})();
