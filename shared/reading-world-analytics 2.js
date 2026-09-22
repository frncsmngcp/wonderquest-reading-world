(() => {
  'use strict';

  const MEASUREMENT_ID = 'G-759JM3JJNM';
  const APP_VERSION = '1.5.15';
  const QUEUE_KEY = 'tfReadingWorldAnalyticsQueueV1';
  const INSTALL_RECORDED_KEY = 'tfReadingWorldAnalyticsInstallRecordedV1';
  const OFFLINE_READY_RECORDED_KEY = 'tfReadingWorldAnalyticsOfflineReadyRecordedV1';
  const MAX_QUEUE = 120;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  let tagRequested = false;
  let tagLoaded = false;
  let flushing = false;

  function standaloneMode() {
    try {
      return window.matchMedia?.('(display-mode: standalone)').matches ||
        window.matchMedia?.('(display-mode: fullscreen)').matches ||
        window.navigator.standalone === true;
    } catch (_) {
      return window.navigator.standalone === true;
    }
  }

  function platformName() {
    const ua = navigator.userAgent || '';
    const platform = navigator.userAgentData?.platform || navigator.platform || '';
    if (/iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios_ipados';
    if (/Android/i.test(ua)) return 'android';
    if (/CrOS/i.test(ua)) return 'chromeos';
    if (/Windows/i.test(platform) || /Windows/i.test(ua)) return 'windows';
    if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return 'macos';
    if (/Linux/i.test(platform) || /Linux/i.test(ua)) return 'linux';
    return 'other';
  }

  function deviceCategory() {
    const ua = navigator.userAgent || '';
    if (/iPad|Tablet/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'tablet';
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  function commonParams() {
    return {
      app_version: APP_VERSION,
      launch_mode: standaloneMode() ? 'standalone' : 'browser',
      platform_family: platformName(),
      device_category_hint: deviceCategory()
    };
  }

  function readQueue() {
    try {
      const parsed = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function writeQueue(queue) {
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE))); } catch (_) {}
  }

  function queueEvent(name, params) {
    const queue = readQueue();
    queue.push({ name, params, queued_at: Date.now() });
    writeQueue(queue);
  }

  function safeParams(params = {}) {
    const out = {};
    for (const [key, raw] of Object.entries(params || {})) {
      if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(key)) continue;
      if (raw == null) continue;
      if (typeof raw === 'number' || typeof raw === 'boolean') out[key] = raw;
      else out[key] = String(raw).slice(0, 100);
    }
    return out;
  }

  function configureGoogleTag() {
    if (window.__TF_GA_CONFIGURED__) return;
    window.__TF_GA_CONFIGURED__ = true;
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      transport_type: 'beacon'
    });
  }

  function requestGoogleTag() {
    configureGoogleTag();
    if (tagRequested || !navigator.onLine || location.protocol === 'file:') return;
    tagRequested = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    script.dataset.tfReadingWorldAnalytics = '1';
    script.addEventListener('load', () => {
      tagLoaded = true;
      void flushQueue();
    }, { once: true });
    script.addEventListener('error', () => {
      tagRequested = false;
      tagLoaded = false;
    }, { once: true });
    document.head.appendChild(script);
  }

  function track(name, params = {}, { persistOffline = true } = {}) {
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/.test(name)) return;
    const payload = { ...commonParams(), ...safeParams(params) };
    configureGoogleTag();

    if (!navigator.onLine && persistOffline) {
      queueEvent(name, payload);
      return;
    }

    window.gtag('event', name, payload);
    requestGoogleTag();
  }

  async function flushQueue() {
    if (flushing || !navigator.onLine) return;
    flushing = true;
    try {
      requestGoogleTag();
      const queue = readQueue();
      if (!queue.length) return;
      writeQueue([]);
      for (const item of queue) {
        const params = { ...(item.params || {}) };
        if (item.queued_at) params.offline_delay_seconds = Math.max(0, Math.round((Date.now() - item.queued_at) / 1000));
        window.gtag('event', item.name, params);
      }
    } finally {
      flushing = false;
    }
  }

  function recordInstallCompleted(method = 'standalone_detected') {
    try {
      if (localStorage.getItem(INSTALL_RECORDED_KEY) === '1') return false;
      localStorage.setItem(INSTALL_RECORDED_KEY, '1');
    } catch (_) {}
    track('pwa_install_completed', { install_method: method });
    return true;
  }

  function recordOfflineReady(params = {}) {
    try {
      if (localStorage.getItem(OFFLINE_READY_RECORDED_KEY) === '1') return false;
      localStorage.setItem(OFFLINE_READY_RECORDED_KEY, '1');
    } catch (_) {}
    track('offline_library_ready', params);
    return true;
  }

  window.TFAnalytics = {
    measurementId: MEASUREMENT_ID,
    appVersion: APP_VERSION,
    track,
    flush: flushQueue,
    recordInstallCompleted,
    recordOfflineReady,
    isStandalone: standaloneMode
  };

  // Count every Reading World launch, including installed PWA launches.
  track('reading_world_launch', {
    connection_state: navigator.onLine ? 'online' : 'offline'
  });

  // On iOS/iPadOS there is no web appinstalled event. The first standalone
  // launch is therefore the strongest signal that Add to Home Screen worked.
  // This also acts as a fallback on browsers where appinstalled was missed.
  if (standaloneMode()) recordInstallCompleted('standalone_first_launch');

  window.addEventListener('online', () => {
    requestGoogleTag();
    setTimeout(() => { void flushQueue(); }, 400);
  });
  window.addEventListener('pageshow', () => { if (navigator.onLine) requestGoogleTag(); });

  navigator.serviceWorker?.addEventListener?.('message', event => {
    if (event.data?.type !== 'READING_WORLD_CACHE_COMPLETE') return;
    recordOfflineReady({
      cached_jobs: Number(event.data.cached_jobs || 0),
      library_items: Number(event.data.library_items || 0)
    });
  });

  // Child modules can report tightly-scoped, non-personal usage events through
  // the same-origin parent instead of loading a second Google tag in iframes.
  window.addEventListener('message', event => {
    if (event.origin && event.origin !== location.origin) return;
    const data = event.data;
    if (data?.type !== 'teacher-francis-analytics') return;
    const allowed = new Set(['kuwento_story_open', 'kuwento_story_complete']);
    if (!allowed.has(data.event)) return;
    track(data.event, data.params || {});
  });

  requestGoogleTag();
})();
