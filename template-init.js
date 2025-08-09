(function initializeTemplate() {
  const SETTINGS = window.APP_SETTINGS || {};
  const SITE = SETTINGS.SITE || {};
  const FEATURES = SETTINGS.FEATURES || {};

  function setDocumentMeta() {
    if (SITE.NAME) document.title = SITE.NAME + ' - ' + (SITE.TAGLINE || '');
    setOrCreateMeta('description', SITE.DESCRIPTION || '');
    setOrCreateMeta('keywords', SITE.KEYWORDS || '');
    setOrCreateMeta('theme-color', SITE.THEME_COLOR || '#1a5f7a');
    setOrCreateOG('og:title', SITE.NAME || document.title);
    setOrCreateOG('og:description', SITE.DESCRIPTION || '');
    if (SITE.OG_IMAGE) setOrCreateOG('og:image', SITE.OG_IMAGE);
    if (SITE.FAVICON) setFavicon(SITE.FAVICON);
  }

  function setOrCreateMeta(name, content) {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function setOrCreateOG(property, content) {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }

  function setFavicon(href) {
    // standard icon
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;

    // shortcut icon
    let shortcut = document.querySelector('link[rel="shortcut icon"]');
    if (!shortcut) {
      shortcut = document.createElement('link');
      shortcut.rel = 'shortcut icon';
      document.head.appendChild(shortcut);
    }
    shortcut.href = href;

    // apple touch
    let apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (!apple) {
      apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      document.head.appendChild(apple);
    }
    apple.href = href;
  }

  function applyThemeColors() {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-template-colors', '1');
    const c = SITE.COLORS || {};
    const cssVars = [
      c.PRIMARY ? `--primary-color: ${c.PRIMARY};` : '',
      c.SECONDARY ? `--secondary-color: ${c.SECONDARY};` : '',
      c.BACKGROUND ? `--background-color: ${c.BACKGROUND};` : '',
      c.TEXT ? `--text-color: ${c.TEXT};` : ''
    ].filter(Boolean).join('\n');
    if (cssVars) {
      styleEl.textContent = `:root{${cssVars}}`;
      document.head.appendChild(styleEl);
    }
  }

  function applyBranding() {
    // logos
    if (SITE.LOGO) {
      document.querySelectorAll('img.logo').forEach(img => {
        img.src = SITE.LOGO;
        img.alt = SITE.NAME || img.alt || '';
      });
    }
    // names
    if (SITE.NAME) {
      document.querySelectorAll('header h1, .footer-logo h3').forEach(el => { el.textContent = SITE.NAME; });
    }
  }

  function applyHero() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    if (SITE.HERO_BG) {
      hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${SITE.HERO_BG}')`;
    }
    const titleEl = hero.querySelector('.hero-content h2');
    const subtitleEl = hero.querySelector('.hero-content p');
    const btn = hero.querySelector('.hero-content .btn');
    if (titleEl) titleEl.innerHTML = `${SITE.HERO?.TITLE || ''} <span>${SITE.NAME || ''}</span>`;
    if (subtitleEl && SITE.HERO?.SUBTITLE) subtitleEl.textContent = SITE.HERO.SUBTITLE;
    if (btn && SITE.HERO?.CTA_TEXT) btn.firstChild && (btn.firstChild.nodeType === 3 ? btn.firstChild.nodeValue = SITE.HERO.CTA_TEXT + ' ' : null);
    // Footer background = hero BG for coherence
    const footer = document.querySelector('footer');
    if (footer && SITE.HERO_BG) {
      footer.style.backgroundImage = `url('${SITE.HERO_BG}')`;
    }
  }

  function rebuildNav() {
    const ul = document.querySelector('nav.main-menu ul');
    if (!ul || !Array.isArray(SETTINGS.NAV_ITEMS)) return;
    ul.innerHTML = '';
    SETTINGS.NAV_ITEMS.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'menu-item';
      if (item.icon) {
        const i = document.createElement('i');
        i.setAttribute('data-lucide', item.icon);
        a.appendChild(i);
        a.appendChild(document.createTextNode(' '));
      }
      a.appendChild(document.createTextNode(item.label || ''));
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function rebuildCategories() {
    const container = document.querySelector('#categories .category-container');
    if (!container || !Array.isArray(SETTINGS.CATEGORIES)) return;
    container.innerHTML = '';
    SETTINGS.CATEGORIES.forEach((cat, idx) => {
      const div = document.createElement('div');
      div.className = 'category';
      div.setAttribute('onclick', `filterByCategory('${cat.key}')`);
      div.setAttribute('data-aos', 'zoom-in');
      div.setAttribute('data-aos-delay', String(300 + idx * 100));
      const img = document.createElement('img');
      img.src = cat.image;
      img.alt = cat.label;
      img.width = 250; img.height = 200; img.loading = 'lazy';
      const h3 = document.createElement('h3');
      h3.textContent = cat.label;
      div.appendChild(img);
      div.appendChild(h3);
      container.appendChild(div);
    });
  }

  function applyFeatureToggles() {
    // Daily offers section
    if (FEATURES.DAILY_OFFERS === false) {
      const sec = document.getElementById('daily-offers');
      if (sec) sec.style.display = 'none';
    }
    // Auth UI
    if (FEATURES.GOOGLE_AUTH === false) {
      const login = document.getElementById('loginBtn');
      const userInfo = document.getElementById('user-info');
      if (login) login.style.display = 'none';
      if (userInfo) userInfo.style.display = 'none';
    }
  }

  function run() {
    try { setDocumentMeta(); } catch (_) {}
    try { applyThemeColors(); } catch (_) {}
    try { applyBranding(); } catch (_) {}
    try { applyHero(); } catch (_) {}
    try { rebuildNav(); } catch (_) {}
    try { rebuildCategories(); } catch (_) {}
    try { applyFeatureToggles(); } catch (_) {}
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try { window.lucide.createIcons(); } catch (_) {}
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();


