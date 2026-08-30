document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  // 1. Theme Management
  function updateTheme() {
    const isDark = root.dataset.theme === 'dark';
    themeColor?.setAttribute('content', isDark ? '#070709' : '#f8f9fa');
    themeToggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('pi-cloud-theme', root.dataset.theme);
    } catch {}
    updateTheme();
  });
  updateTheme();

  // 2. Command Box Launcher Tabs (npm / npx)
  const launcherTabs = document.querySelectorAll('.launcher-tab');
  const cliCode = document.getElementById('cli-code');
  const mainCopyBtn = document.getElementById('main-copy-btn');

  launcherTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      launcherTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cmd = tab.dataset.cmd;
      if (cliCode) cliCode.textContent = cmd;
      if (mainCopyBtn) mainCopyBtn.dataset.copy = cmd;
    });
  });

  // 3. Generic Copy Button Functionality
  document.querySelectorAll('.copy-button').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.dataset.copy || cliCode?.textContent || '';
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copied!</span>';
        btn.style.borderColor = 'var(--green)';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });

  // 4. Interactive Showcase Switcher
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const showcaseImg = document.getElementById('showcase-img');
  const showcaseTitle = document.getElementById('showcase-title');
  const showcaseDesc = document.getElementById('showcase-desc');
  const zoomHint = document.querySelector('.zoom-hint');

  showcaseTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      showcaseTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const imgSrc = tab.dataset.img;
      const title = tab.dataset.title;
      const desc = tab.dataset.desc;

      if (showcaseImg && imgSrc) {
        showcaseImg.src = imgSrc;
        showcaseImg.alt = title;
      }
      if (showcaseTitle) showcaseTitle.textContent = title;
      if (showcaseDesc) showcaseDesc.textContent = desc;
      if (zoomHint) {
        zoomHint.dataset.lightbox = imgSrc;
        zoomHint.dataset.caption = title;
      }
    });
  });

  // 5. Lightbox Modal Controller
  const dialog = document.getElementById('lightbox-dialog');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    if (!dialog || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    dialog.showModal();
  }

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', () => {
      const src = el.dataset.lightbox || el.getAttribute('src');
      const caption = el.dataset.caption || el.getAttribute('alt') || '';
      openLightbox(src, caption);
    });
  });

  closeBtn?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
});
