(() => {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;

  let cacheTarget = null;
  let warmupScheduled = false;
  let registration = null;
  let updatePrompt = null;
  let updatePromptDismissed = false;
  let reloadForUpdate = false;

  function preloadGateOwnsCaching() {
    return !!window.__WQ_PRELOAD_GATE__?.managesCaching;
  }

  function startFullLibraryWarmup() {
    if (!cacheTarget || !navigator.onLine) return;
    cacheTarget.postMessage({ type: 'PRECACHE_READING_WORLD' });
  }

  function scheduleFullLibraryWarmup() {
    if (!cacheTarget || warmupScheduled) return;
    warmupScheduled = true;
    const run = () => {
      warmupScheduled = false;
      startFullLibraryWarmup();
    };
    if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 6000 });
    else setTimeout(run, 3500);
  }

  function removeUpdatePrompt() {
    if (!updatePrompt) return;
    updatePrompt.remove();
    updatePrompt = null;
  }

  function ensureUpdateStyles() {
    if (document.getElementById('wq-update-prompt-style')) return;
    const style = document.createElement('style');
    style.id = 'wq-update-prompt-style';
    style.textContent = `
      #wq-update-prompt{position:fixed;z-index:2147483647;left:50%;bottom:max(16px,calc(env(safe-area-inset-bottom) + 12px));transform:translateX(-50%);width:min(560px,calc(100vw - 28px));font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff;filter:drop-shadow(0 14px 32px rgba(0,0,0,.42));}
      #wq-update-prompt .wq-update-card{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;padding:12px 14px;border:2px solid #e4b44c;border-radius:22px;background:linear-gradient(145deg,rgba(50,22,90,.98),rgba(20,58,112,.98));box-shadow:inset 0 1px rgba(255,255,255,.26),0 0 0 2px rgba(93,55,16,.42);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}
      #wq-update-prompt .wq-update-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffe97b,#f4ac23 62%,#9c5d12);box-shadow:0 0 0 3px #5f3610,0 3px 10px rgba(0,0,0,.25);font-size:22px;}
      #wq-update-prompt .wq-update-copy{min-width:0;line-height:1.18;}
      #wq-update-prompt .wq-update-title{display:block;font-weight:850;font-size:15px;letter-spacing:.01em;}
      #wq-update-prompt .wq-update-text{display:block;margin-top:3px;font-size:12px;color:#f8e9c6;}
      #wq-update-prompt .wq-update-actions{display:flex;gap:7px;align-items:center;}
      #wq-update-prompt button{appearance:none;border:0;font:inherit;font-weight:800;cursor:pointer;white-space:nowrap;-webkit-tap-highlight-color:transparent;}
      #wq-update-prompt .wq-update-now{padding:9px 12px;border-radius:14px;background:linear-gradient(#ffe979,#f0ae28);color:#4c290a;box-shadow:0 3px 0 #8d5415;}
      #wq-update-prompt .wq-update-later{padding:8px 9px;border-radius:12px;background:rgba(255,255,255,.12);color:#fff;}
      #wq-update-prompt button:active{transform:translateY(1px);}
      @media(max-width:560px){#wq-update-prompt .wq-update-card{grid-template-columns:auto 1fr;gap:9px 10px;padding:10px 11px;border-radius:18px}#wq-update-prompt .wq-update-icon{width:36px;height:36px;font-size:19px}#wq-update-prompt .wq-update-actions{grid-column:1/-1;justify-content:flex-end}#wq-update-prompt .wq-update-title{font-size:14px}#wq-update-prompt .wq-update-text{font-size:11px}}
    `;
    document.head.appendChild(style);
  }

  function showUpdatePrompt(reg) {
    if (!reg?.waiting || updatePrompt || updatePromptDismissed) return;
    ensureUpdateStyles();
    const host = document.createElement('div');
    host.id = 'wq-update-prompt';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    host.innerHTML = `
      <div class="wq-update-card">
        <div class="wq-update-icon" aria-hidden="true">✨</div>
        <div class="wq-update-copy">
          <strong class="wq-update-title">May bagong WonderQuest update!</strong>
          <span class="wq-update-text">I-update para makuha ang pinakabagong app, larawan, at mga pag-aayos.</span>
        </div>
        <div class="wq-update-actions">
          <button class="wq-update-later" type="button">Mamaya</button>
          <button class="wq-update-now" type="button">Update Now</button>
        </div>
      </div>`;
    host.querySelector('.wq-update-later')?.addEventListener('click', () => {
      updatePromptDismissed = true;
      removeUpdatePrompt();
    });
    host.querySelector('.wq-update-now')?.addEventListener('click', () => {
      const waiting = reg.waiting;
      if (!waiting) {
        location.reload();
        return;
      }
      reloadForUpdate = true;
      const button = host.querySelector('.wq-update-now');
      if (button) {
        button.disabled = true;
        button.textContent = 'Updating…';
      }
      waiting.postMessage({ type: 'SKIP_WAITING' });
      // Safety fallback for browsers that do not emit controllerchange promptly.
      setTimeout(() => { if (reloadForUpdate) location.reload(); }, 5000);
    });
    document.body.appendChild(host);
    updatePrompt = host;
  }

  function watchInstallingWorker(reg, worker) {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        showUpdatePrompt(reg);
      }
    });
  }

  async function registerReadingWorld() {
    try {
      registration = await navigator.serviceWorker.register('./service-worker.js', {
        scope: './',
        updateViaCache: 'none'
      });
      await navigator.serviceWorker.ready;

      cacheTarget = navigator.serviceWorker.controller || registration.active || registration.waiting;
      if (!preloadGateOwnsCaching()) scheduleFullLibraryWarmup();

      if (registration.waiting && navigator.serviceWorker.controller) showUpdatePrompt(registration);
      if (registration.installing) watchInstallingWorker(registration, registration.installing);
      registration.addEventListener('updatefound', () => {
        updatePromptDismissed = false;
        watchInstallingWorker(registration, registration.installing);
      });

      const checkForAppUpdate = async () => {
        if (!navigator.onLine) return;
        try {
          await registration.update();
          if (registration.waiting && navigator.serviceWorker.controller) showUpdatePrompt(registration);
        } catch (_) {}
      };

      setTimeout(checkForAppUpdate, 900);
      window.addEventListener('focus', checkForAppUpdate);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForAppUpdate();
      });
      setInterval(checkForAppUpdate, 45 * 60 * 1000);

      try { await navigator.storage?.persist?.(); } catch (_) {}

      window.addEventListener('online', () => {
        if (!preloadGateOwnsCaching()) setTimeout(startFullLibraryWarmup, 800);
        setTimeout(checkForAppUpdate, 1000);
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        cacheTarget = navigator.serviceWorker.controller || registration?.active || registration?.waiting;
        if (reloadForUpdate) {
          reloadForUpdate = false;
          location.reload();
          return;
        }
        if (!preloadGateOwnsCaching()) setTimeout(startFullLibraryWarmup, 500);
      });
    } catch (err) {
      console.warn('WonderQuest cache was not registered:', err);
    }
  }

  if (document.readyState === 'complete') registerReadingWorld();
  else window.addEventListener('load', registerReadingWorld, { once: true });
})();
