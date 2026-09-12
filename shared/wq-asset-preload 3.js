(() => {
  const config = window.__WQ_PRELOAD_CONFIG__;
  if (!config || !Array.isArray(config.entries) || !('caches' in window)) return;

  const overlay = document.getElementById('wq-asset-preload-overlay');
  const progressFill = document.getElementById('wq-preload-fill');
  const percentValue = document.getElementById('wq-preload-percent');
  const statsDownloaded = document.getElementById('wq-preload-downloaded');
  const statsTotal = document.getElementById('wq-preload-total');
  const statsEta = document.getElementById('wq-preload-eta');
  const currentTask = document.getElementById('wq-preload-current');
  const statusText = document.getElementById('wq-preload-status');
  const counterText = document.getElementById('wq-preload-counter');
  const retryButton = document.getElementById('wq-preload-retry');
  const noteText = document.getElementById('wq-preload-note');
  if (!overlay || !progressFill || !percentValue || !statsDownloaded || !statsTotal || !statsEta || !currentTask || !statusText || !counterText || !retryButton || !noteText) return;

  const STORAGE_KEY = 'wonderquest-preload-complete::' + config.version;
  const EVER_KEY = 'wonderquest-preload-ever-complete';
  const COMPLETION_PREFIX = 'wonderquest-preload-complete::';
  const entries = config.entries.slice();
  const totalBytes = Math.max(1, Number(config.totalBytes) || entries.reduce((sum, entry) => sum + (Number(entry.size) || 0), 0));
  const absolute = url => new URL(url, location.href).href;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const cachePromises = new Map();
  let running = false;
  let preloadDone = false;
  let errorState = false;

  window.__WQ_PRELOAD_GATE__ = {
    managesCaching: true,
    isDone: () => preloadDone,
    isRunning: () => running
  };

  function readStoredDone() {
    try { return localStorage.getItem(STORAGE_KEY) === 'done'; }
    catch (_) { return false; }
  }

  function readEverDone() {
    try {
      if (localStorage.getItem(EVER_KEY) === 'done') return true;
      // Migrate users who already completed v29/v30 before the generic marker existed.
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i) || '';
        if (key.startsWith(COMPLETION_PREFIX) && localStorage.getItem(key) === 'done') {
          localStorage.setItem(EVER_KEY, 'done');
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function markDone() {
    try {
      localStorage.setItem(STORAGE_KEY, 'done');
      localStorage.setItem(EVER_KEY, 'done');
    } catch (_) {}
  }

  function clearDone() {
    try { localStorage.removeItem(STORAGE_KEY); }
    catch (_) {}
  }

  function getCache(entry) {
    const cacheName = entry.cache === 'asset' ? config.assetCache : config.coreCache;
    if (!cachePromises.has(cacheName)) cachePromises.set(cacheName, caches.open(cacheName));
    return cachePromises.get(cacheName);
  }

  function formatBytes(bytes) {
    const mb = bytes / (1024 * 1024);
    return mb >= 10 ? mb.toFixed(1) + ' MB' : mb.toFixed(2) + ' MB';
  }

  function formatEta(seconds) {
    if (!isFinite(seconds) || seconds < 0) return 'Calculating…';
    if (seconds < 1) return 'Less than 1s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins <= 0) return secs + 's';
    return mins + 'm ' + String(secs).padStart(2, '0') + 's';
  }

  function showOverlay() {
    overlay.classList.remove('is-complete');
    document.body.classList.add('wq-preload-active');
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
  }

  function hideOverlay() {
    document.body.classList.remove('wq-preload-active');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.add('is-complete');
    setTimeout(() => { overlay.hidden = true; }, 420);
  }

  function renderReadyState(readyBytes, readyCount, currentLabel = '', eta = 'Calculating…') {
    const boundedBytes = Math.max(0, Math.min(totalBytes, readyBytes));
    const percent = Math.max(0, Math.min(100, Math.round((boundedBytes / totalBytes) * 100)));
    progressFill.style.width = percent + '%';
    percentValue.textContent = percent + '%';
    statsDownloaded.textContent = formatBytes(boundedBytes);
    statsTotal.textContent = formatBytes(totalBytes);
    statsEta.textContent = eta;
    counterText.textContent = readyCount + ' / ' + entries.length + ' files ready';
    currentTask.textContent = currentLabel || (readyCount >= entries.length ? 'All magical lessons are ready.' : 'Gathering WonderQuest resources…');
  }

  async function inspectCaches({ showProgress = false } = {}) {
    const result = { readyBytes: 0, readyCount: 0, checkedCount: 0, missing: [] };
    const missingByIndex = new Array(entries.length);
    let cursor = 0;
    const workerCount = Math.min(14, Math.max(1, entries.length));

    async function worker() {
      while (true) {
        const index = cursor++;
        if (index >= entries.length) return;
        const entry = entries[index];
        try {
          const cache = await getCache(entry);
          const response = await cache.match(absolute(entry.url), { ignoreSearch: true });
          if (response) {
            result.readyCount += 1;
            result.readyBytes += Number(entry.size) || 0;
          } else {
            missingByIndex[index] = entry;
          }
        } catch (_) {
          missingByIndex[index] = entry;
        }
        result.checkedCount += 1;
        if (showProgress && (result.checkedCount % 8 === 0 || result.checkedCount === entries.length)) {
          renderReadyState(
            result.readyBytes,
            result.readyCount,
            'Checking downloaded assets… ' + result.checkedCount + ' / ' + entries.length,
            'Checking…'
          );
        }
      }
    }

    await Promise.all(Array.from({ length: workerCount }, worker));
    result.missing = missingByIndex.filter(Boolean);
    return result;
  }

  async function cacheStreamToResponse(response, onChunk) {
    if (!response.body || !response.body.getReader) {
      const buffer = await response.arrayBuffer();
      onChunk(buffer.byteLength);
      return new Response(buffer, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        onChunk(received);
      }
    }
    return new Response(new Blob(chunks, {
      type: response.headers.get('content-type') || undefined
    }), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  async function preloadMissing(initialScan = null, { blocking = true } = {}) {
    if (running || preloadDone) return;
    running = true;
    errorState = false;
    if (blocking) showOverlay();
    else {
      document.body.classList.remove('wq-preload-active');
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }
    retryButton.hidden = true;

    try {
      let scan = initialScan;
      if (!scan) {
        if (blocking) {
          statusText.textContent = 'Checking the WonderQuest files already saved on this device…';
          noteText.textContent = 'We will keep everything already downloaded and only fetch anything that is missing.';
          renderReadyState(0, 0, 'Checking downloaded assets…', 'Checking…');
        }
        scan = await inspectCaches({ showProgress: blocking });
      }

      if (!scan.missing.length) {
        preloadDone = true;
        markDone();
        if (blocking) {
          renderReadyState(totalBytes, entries.length, 'All magical lessons are ready.', 'Ready');
          statusText.textContent = 'Ready! All WonderQuest assets are already saved on this device.';
          noteText.textContent = 'Nothing needs to be downloaded again.';
          await delay(readStoredDone() ? 180 : 650);
          hideOverlay();
        }
        return;
      }

      clearDone();
      if (blocking) {
        statusText.textContent = scan.readyCount
          ? 'Finishing setup: downloading only the WonderQuest files that are missing.'
          : 'One-time setup: downloading WonderQuest assets before use.';
        noteText.textContent = scan.readyCount
          ? 'Your existing downloaded files are being kept. Please keep this open while the missing files finish.'
          : 'Please keep this open while we prepare the adventures, stories, sounds, and activities.';
      }

      const state = {
        readyBytes: scan.readyBytes,
        readyCount: scan.readyCount,
        partialByUrl: new Map(),
        transferredBytes: 0,
        transferStart: performance.now(),
        currentLabel: ''
      };

      const updateDownloadUI = () => {
        if (!blocking) return;
        let partialBytes = 0;
        for (const bytes of state.partialByUrl.values()) partialBytes += bytes;
        const displayedBytes = Math.max(0, Math.min(totalBytes, state.readyBytes + partialBytes));
        const elapsedSeconds = Math.max((performance.now() - state.transferStart) / 1000, 0.15);
        const speed = state.transferredBytes / elapsedSeconds;
        const remainingSeconds = speed > 0 ? (totalBytes - displayedBytes) / speed : Infinity;
        renderReadyState(
          displayedBytes,
          state.readyCount,
          state.currentLabel ? 'Preparing: ' + state.currentLabel : 'Gathering WonderQuest resources…',
          formatEta(remainingSeconds)
        );
      };
      updateDownloadUI();

      let cursor = 0;
      const failures = [];
      const workerCount = Math.min(4, Math.max(1, scan.missing.length));

      async function downloadWorker() {
        while (true) {
          const index = cursor++;
          if (index >= scan.missing.length) return;
          const entry = scan.missing[index];
          const cache = await getCache(entry);
          const url = absolute(entry.url);
          state.currentLabel = entry.label || entry.url;
          state.partialByUrl.set(url, 0);
          updateDownloadUI();

          try {
            // Another tab or the service worker may have filled this exact file
            // after the first inspection, so always re-check before fetching.
            const existing = await cache.match(url, { ignoreSearch: true });
            if (existing) {
              state.readyBytes += Number(entry.size) || 0;
              state.readyCount += 1;
              state.partialByUrl.delete(url);
              updateDownloadUI();
              continue;
            }

            let lastError = null;
            let stored = false;
            for (let attempt = 0; attempt < 2 && !stored; attempt += 1) {
              try {
                state.partialByUrl.set(url, 0);
                const request = new Request(url, { cache: entry.fresh ? 'reload' : 'default' });
                const response = await fetch(request);
                if (!response || !response.ok) throw new Error('HTTP ' + (response ? response.status : 'fetch failed'));
                let lastLoaded = 0;
                const rebuilt = await cacheStreamToResponse(response, loaded => {
                  const delta = Math.max(0, loaded - lastLoaded);
                  lastLoaded = loaded;
                  state.transferredBytes += delta;
                  state.partialByUrl.set(url, Math.min(loaded, Number(entry.size) || loaded));
                  updateDownloadUI();
                });
                await cache.put(url, rebuilt.clone());
                stored = true;
              } catch (error) {
                lastError = error;
                state.partialByUrl.set(url, 0);
                updateDownloadUI();
                await delay(700);
              }
            }

            if (!stored) throw lastError || new Error('Unable to cache ' + entry.url);
            const loadedBytes = state.partialByUrl.get(url) || 0;
            state.readyBytes += Number(entry.size) || loadedBytes;
            state.readyCount += 1;
            state.partialByUrl.delete(url);
            updateDownloadUI();
          } catch (error) {
            state.partialByUrl.delete(url);
            failures.push(error instanceof Error ? error : new Error(String(error)));
            updateDownloadUI();
          }
        }
      }

      await Promise.all(Array.from({ length: workerCount }, downloadWorker));
      if (failures.length) throw failures[0];

      // The completion flag is never trusted by itself. Verify the real caches
      // once more before allowing the user into WonderQuest.
      if (blocking) {
        statusText.textContent = 'Verifying the completed WonderQuest download…';
        noteText.textContent = 'Almost there — checking that every required file is really saved on this device.';
        statsEta.textContent = 'Checking…';
      }
      const finalScan = await inspectCaches({ showProgress: false });
      if (finalScan.missing.length) {
        throw new Error(finalScan.missing.length + ' files are still missing from device storage');
      }

      preloadDone = true;
      markDone();
      if (blocking) {
        renderReadyState(totalBytes, entries.length, 'All magical lessons are ready.', 'Ready');
        statusText.textContent = 'Ready! WonderQuest has finished downloading its assets.';
        noteText.textContent = 'You can now explore the app with the full artwork, sounds, and stories ready to go.';
        await delay(900);
        hideOverlay();
      }
    } catch (error) {
      console.error('WonderQuest preload failed:', error);
      clearDone();
      errorState = true;
      if (blocking) {
        statusText.textContent = 'We could not finish downloading WonderQuest yet.';
        noteText.textContent = navigator.onLine
          ? 'Please try again. If this keeps happening, the device may need more free storage for the offline library.'
          : 'Please connect to the internet, then try again. The app needs to finish downloading its assets first.';
        currentTask.textContent = error && error.message ? error.message : 'Download interrupted.';
        statsEta.textContent = 'Paused';
        retryButton.hidden = false;
      }
    } finally {
      running = false;
    }
  }

  retryButton.addEventListener('click', () => {
    if (!running) preloadMissing();
  });

  window.addEventListener('online', () => {
    if (errorState && !running && !preloadDone) preloadMissing(null, { blocking: !readEverDone() });
  });

  async function boot() {
    if (running || preloadDone) return;
    const returningUser = readEverDone();

    // After the first successful setup, cache verification and any repairs run
    // quietly in the background. The home screen is immediately usable.
    if (returningUser) {
      document.documentElement.classList.add('wq-preload-returning');
      document.body.classList.remove('wq-preload-active');
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      try {
        const scan = await inspectCaches({ showProgress: false });
        if (!scan.missing.length) {
          preloadDone = true;
          markDone();
          return;
        }
        await preloadMissing(scan, { blocking: false });
      } catch (error) {
        console.warn('WonderQuest background cache check will retry later:', error);
        errorState = true;
      }
      return;
    }

    // First-ever setup remains intentionally blocking so the complete offline
    // library is present before the learner starts using WonderQuest.
    showOverlay();
    retryButton.hidden = true;
    statusText.textContent = 'Checking the WonderQuest files already saved on this device…';
    noteText.textContent = 'Anything already downloaded will be kept, so interrupted setup can safely resume.';
    renderReadyState(0, 0, 'Checking downloaded assets…', 'Checking…');

    try {
      const scan = await inspectCaches({ showProgress: true });
      if (!scan.missing.length) {
        preloadDone = true;
        markDone();
        renderReadyState(totalBytes, entries.length, 'All magical lessons are ready.', 'Ready');
        statusText.textContent = 'Ready! All WonderQuest assets are already saved on this device.';
        noteText.textContent = 'Nothing needs to be downloaded again.';
        await delay(650);
        hideOverlay();
        return;
      }
      await preloadMissing(scan, { blocking: true });
    } catch (error) {
      console.error('WonderQuest cache verification failed:', error);
      clearDone();
      errorState = true;
      statusText.textContent = 'We could not check the saved WonderQuest files.';
      noteText.textContent = 'Please try again. WonderQuest will not open until the offline library is verified.';
      currentTask.textContent = error && error.message ? error.message : 'Cache verification failed.';
      statsEta.textContent = 'Paused';
      retryButton.hidden = false;
    }
  }

  boot();
})();
