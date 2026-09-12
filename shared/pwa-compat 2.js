(() => {
  const moduleName = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '');
  // WonderQuest: Reading World intentionally uses full classroom motion on every
  // device. OS/browser Reduce Motion preferences must not pause defined app effects.
  document.documentElement.classList.add('tf-motion-persistent');
  const motionStyle = document.createElement('style');
  motionStyle.id = 'tf-persistent-motion-style';
  motionStyle.textContent = '.tf-motion-persistent *, .tf-motion-persistent *::before, .tf-motion-persistent *::after{animation-play-state:running!important}';
  document.head ? document.head.appendChild(motionStyle) : document.documentElement.appendChild(motionStyle);

  let smallProbe = null;

  function getSmallViewportSize() {
    try {
      if (!CSS?.supports?.('height','100svh')) return null;
      if (!smallProbe) {
        smallProbe = document.createElement('div');
        smallProbe.setAttribute('aria-hidden','true');
        smallProbe.style.cssText = 'position:fixed!important;left:-10000px!important;top:-10000px!important;width:100svw!important;height:100svh!important;visibility:hidden!important;pointer-events:none!important;contain:strict!important;';
        document.documentElement.appendChild(smallProbe);
      }
      const r = smallProbe.getBoundingClientRect();
      if (r.width > 100 && r.height > 100) return {width:r.width,height:r.height};
    } catch (_) {}
    return null;
  }

  function usableViewport() {
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs) {
      const r = fs.getBoundingClientRect?.();
      return {width:Math.max(1,r?.width||fs.clientWidth||innerWidth),height:Math.max(1,r?.height||fs.clientHeight||innerHeight),left:0,top:0};
    }
    const vv = window.visualViewport;
    const small = getSmallViewportSize();
    const doc = document.documentElement;
    const widths = [innerWidth, doc?.clientWidth, vv?.width, small?.width].map(Number).filter(n=>Number.isFinite(n)&&n>100);
    const heights = [innerHeight, doc?.clientHeight, vv?.height, small?.height].map(Number).filter(n=>Number.isFinite(n)&&n>100);
    // Use the smallest reported viewport. 100svh is especially important on
    // iPhone/iPad Safari landscape because the browser chrome can otherwise
    // cover the top/bottom of a fixed-size classroom app.
    const width = widths.length ? Math.min(...widths) : 1024;
    const height = heights.length ? Math.min(...heights) : 768;
    return {width,height,left:0,top:0};
  }
  window.tfUsableViewport = usableViewport;

  function portableFullscreenActive() {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) return true;
      if (document.documentElement.classList.contains('tf-pseudo-fullscreen')) return true;
      if (document.body?.classList.contains('tf-pseudo-fullscreen')) return true;
      if (window.top && window.top !== window) {
        try { return !!window.top.tfIsPortableFullscreenActive?.(); } catch (_) {}
      }
    } catch (_) {}
    return false;
  }
  window.tfIsPortableFullscreenActive = portableFullscreenActive;

  async function togglePortableFullscreen() {
    // Native wrapper hook, when the PWA is hosted inside one.
    try {
      const h = window.webkit?.messageHandlers?.nativeFullscreen || window.top?.webkit?.messageHandlers?.nativeFullscreen;
      if (h) { h.postMessage('toggle'); return true; }
    } catch (_) {}

    // Modules are same-origin iframes inside the WonderQuest suite. Asking the
    // top document directly keeps the original tap/click user activation, which
    // is important on mobile/tablet browsers for requestFullscreen().
    try {
      if (window.top && window.top !== window && typeof window.top.tfTogglePortableFullscreen === 'function') {
        return window.top.tfTogglePortableFullscreen();
      }
    } catch (_) {}

    const doc = document;
    const current = doc.fullscreenElement || doc.webkitFullscreenElement;
    if (current) {
      try {
        const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
        if (exit) {
          const result = exit.call(doc);
          if (result?.then) await result;
        }
      } catch (_) {}
      document.documentElement.classList.remove('tf-pseudo-fullscreen');
      document.body?.classList.remove('tf-pseudo-fullscreen');
      setTimeout(() => window.tfApplySafeViewport?.(), 40);
      return false;
    }

    const target = document.getElementById('suite') || document.getElementById('app') || document.documentElement;
    const request = target?.requestFullscreen || target?.webkitRequestFullscreen;
    if (request) {
      try {
        // navigationUI is ignored by browsers that do not implement the option.
        let result;
        try { result = request.call(target, { navigationUI: 'hide' }); }
        catch (_) { result = request.call(target); }
        if (result?.then) await result;
        document.documentElement.classList.remove('tf-pseudo-fullscreen');
        document.body?.classList.remove('tf-pseudo-fullscreen');
        setTimeout(() => window.tfApplySafeViewport?.(), 40);
        return true;
      } catch (_) {
        // Continue to the focus-view fallback below.
      }
    }

    // Browser fallback: on environments where element fullscreen is unavailable,
    // keep the button functional by expanding WonderQuest to every visible CSS
    // pixel. Installed PWAs already run without normal browser chrome.
    const enabled = !document.documentElement.classList.contains('tf-pseudo-fullscreen');
    document.documentElement.classList.toggle('tf-pseudo-fullscreen', enabled);
    document.body?.classList.toggle('tf-pseudo-fullscreen', enabled);
    try { window.scrollTo({ top: 1, left: 0, behavior: 'smooth' }); } catch (_) { try { window.scrollTo(0,1); } catch (_) {} }
    setTimeout(() => window.tfApplySafeViewport?.(), 40);
    setTimeout(() => window.tfApplySafeViewport?.(), 180);
    return enabled;
  }
  window.tfTogglePortableFullscreen = togglePortableFullscreen;

  const fullscreenStyle = document.createElement('style');
  fullscreenStyle.id = 'tf-portable-fullscreen-style';
  fullscreenStyle.textContent = `
    html.tf-pseudo-fullscreen,html.tf-pseudo-fullscreen body,
    body.tf-pseudo-fullscreen{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;}
    html.tf-pseudo-fullscreen #app,html.tf-pseudo-fullscreen #viewport,
    body.tf-pseudo-fullscreen #app,body.tf-pseudo-fullscreen #viewport{
      position:fixed!important;left:0!important;top:0!important;right:auto!important;bottom:auto!important;
      width:var(--tf-usable-width,100dvw)!important;height:var(--tf-usable-height,100dvh)!important;
      max-width:none!important;max-height:none!important;margin:0!important;
    }
  `;
  document.head ? document.head.appendChild(fullscreenStyle) : document.documentElement.appendChild(fullscreenStyle);

  let viewportRaf = 0;
  function applySafeViewport() {
    cancelAnimationFrame(viewportRaf);
    viewportRaf = requestAnimationFrame(() => {
      const vp = usableViewport();
      const de = document.documentElement;
      de.style.setProperty('--tf-usable-width', `${vp.width}px`);
      de.style.setProperty('--tf-usable-height', `${vp.height}px`);
      de.style.setProperty('--tf-usable-center-x', `${vp.width / 2}px`);
      de.style.setProperty('--tf-usable-center-y', `${vp.height / 2}px`);

      // The suite shell is aspect-ratio constrained. Center it against the measured
      // usable viewport instead of CSS 50%, which some mobile browsers calculate
      // from a taller layout viewport hidden behind their address/tool bars.
      const suite = document.getElementById('suite');
      if (suite) {
        const ratio = 1672 / 941;
        const usableW = Math.max(1, vp.width);
        const usableH = Math.max(1, vp.height);
        const w = Math.min(usableW, usableH * ratio);
        const h = w / ratio;
        suite.style.setProperty('left', `${usableW / 2}px`, 'important');
        suite.style.setProperty('top', `${usableH / 2}px`, 'important');
        suite.style.setProperty('width', `${w}px`, 'important');
        suite.style.setProperty('height', `${h}px`, 'important');
        suite.style.setProperty('transform', 'translate(-50%,-50%)', 'important');
      }

      // Fixed top-level dialogs need the same treatment in portrait browsers.
      // `inset:0` can otherwise use the larger layout viewport and make a visually
      // centered card appear too low on the actually visible phone screen.
      ['startup-overlay','global-reset-dialog','tf-install-modal'].forEach(id => {
        const overlay = document.getElementById(id);
        if (!overlay) return;
        overlay.style.setProperty('left','0px','important');
        overlay.style.setProperty('top','0px','important');
        overlay.style.setProperty('right','auto','important');
        overlay.style.setProperty('bottom','auto','important');
        overlay.style.setProperty('width',`${vp.width}px`,'important');
        overlay.style.setProperty('height',`${vp.height}px`,'important');
      });

      // Fixed root shells must use the actually visible browser viewport,
      // not the larger layout viewport hidden behind Safari's toolbars.
      const root = document.getElementById('app') || document.getElementById('viewport');
      if (root) {
        root.style.setProperty('position','fixed','important');
        root.style.setProperty('left','0px','important');
        root.style.setProperty('top','0px','important');
        root.style.setProperty('right','auto','important');
        root.style.setProperty('bottom','auto','important');
        root.style.setProperty('width',`${vp.width}px`,'important');
        root.style.setProperty('height',`${vp.height}px`,'important');
      }

      // The two responsive modules do not use a fixed design-space transform;
      // size their stage directly so the whole interface is always visible.
      const stage = document.getElementById('stage');
      if (stage && (moduleName === 'basa-tayo' || moduleName === 'kuwento-tayo')) {
        const ratio = 16/9;
        const margin = 8;
        const usableW = Math.max(1, vp.width - margin*2);
        const usableH = Math.max(1, vp.height - margin*2);
        const w = Math.min(usableW, usableH * ratio);
        const h = w / ratio;
        stage.style.setProperty('width',`${w}px`,'important');
        stage.style.setProperty('height',`${h}px`,'important');
        stage.style.setProperty('max-height','none','important');
      }

      // Keep the suite-return control in the truly visible lower-left corner.
      const allApps = document.getElementById('teacher-francis-suite-home');
      if (allApps) {
        const compact = vp.width <= 760 || vp.height <= 560;
        const btnH = 42;
        allApps.style.setProperty('bottom','auto','important');
        allApps.style.setProperty('top',`${Math.max(8, vp.height - btnH - 10)}px`,'important');
        allApps.style.setProperty('left','max(10px, env(safe-area-inset-left))','important');
      }

      window.dispatchEvent(new CustomEvent('tfviewportchange',{detail:vp}));
    });
  }
  window.tfApplySafeViewport = applySafeViewport;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applySafeViewport, {once:true});
  else applySafeViewport();
  window.addEventListener('resize', applySafeViewport, {passive:true});
  window.addEventListener('orientationchange', () => { applySafeViewport(); setTimeout(applySafeViewport,120); setTimeout(applySafeViewport,420); }, {passive:true});
  window.visualViewport?.addEventListener('resize', applySafeViewport, {passive:true});
  window.visualViewport?.addEventListener('scroll', applySafeViewport, {passive:true});
  document.addEventListener('fullscreenchange', applySafeViewport, {passive:true});
  document.addEventListener('webkitfullscreenchange', applySafeViewport, {passive:true});

  const primeSpeech = () => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.getVoices();
      window.speechSynthesis.resume?.();
    } catch (_) {}
  };
  window.addEventListener('pageshow', primeSpeech, {passive:true});
  window.addEventListener('focus', primeSpeech, {passive:true});
  document.addEventListener('pointerdown', primeSpeech, {passive:true, once:false});
  document.addEventListener('touchstart', primeSpeech, {passive:true, once:false});
  document.addEventListener('click', primeSpeech, {passive:true, once:false});
  try { navigator.storage?.persist?.(); } catch (_) {}

  // Kuwento Tayo owns its shelf and reader gestures. Do not install the
  // suite-wide capture gesture bridge there: capture-level preventDefault can
  // interfere with dragging across book buttons on iPhone/iPad Safari.
  if (moduleName === 'kuwento-tayo') return;

  // iPad/iPhone gesture bridge. This does not change module visuals; it maps
  // natural swipes to the same navigation actions the modules already expose.
  const interactiveSelector = [
    'button','a','input','textarea','select','option','label','audio','video',
    '[contenteditable="true"]','[role="button"]','[role="slider"]','[data-no-swipe]'
  ].join(',');

  let gesture = null;
  const minDistance = () => Math.max(42, Math.min(innerWidth || 1024, innerHeight || 768) * 0.055);

  function overlayOpen() {
    return !!document.querySelector(
      '.modal-layer.open,.modal-shade.show,.overlay.open,.tf-dialog-layer.open,' +
      '#settingsOverlay.open,#customOverlay.open,#wordManagerOverlay.open,#celebration.open'
    );
  }

  function keyboard(key, {shiftKey=false}={}) {
    const code = key.startsWith('Arrow') ? key : key;
    const down = new KeyboardEvent('keydown', { key, code, shiftKey, bubbles:true, cancelable:true });
    document.dispatchEvent(down);
    setTimeout(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { key, code, shiftKey, bubbles:true, cancelable:true }));
    }, 28);
  }

  function performSwipe(dx, dy) {
    const horizontal = Math.abs(dx) > Math.abs(dy) * 1.18;
    const vertical = Math.abs(dy) > Math.abs(dx) * 1.18;
    if (!horizontal && !vertical) return false;
    if (horizontal) {
      const swipeModules = new Set(['letter-slide','awad','basa-tayo','basa-bata-basa','fluency-pyramid','kuwento-tayo']);
      if (!swipeModules.has(moduleName)) return false;
      if (moduleName === 'kuwento-tayo') keyboard(dx < 0 ? 'ArrowRight' : 'ArrowLeft', {shiftKey:true});
      else keyboard(dx < 0 ? 'ArrowRight' : 'ArrowLeft');
      return true;
    }
    if (vertical && moduleName === 'fluency-pyramid') {
      keyboard(dy < 0 ? 'ArrowUp' : 'ArrowDown');
      return true;
    }
    return false;
  }

  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || overlayOpen()) { gesture = null; return; }
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest(interactiveSelector)) { gesture = null; return; }
    const t = event.touches[0];
    gesture = { x:t.clientX, y:t.clientY, lastX:t.clientX, lastY:t.clientY, time:performance.now(), locked:false };
  }, {passive:true, capture:true});

  document.addEventListener('touchmove', event => {
    if (!gesture || event.touches.length !== 1) return;
    const t = event.touches[0];
    gesture.lastX=t.clientX; gesture.lastY=t.clientY;
    const dx=t.clientX-gesture.x, dy=t.clientY-gesture.y;
    if (Math.hypot(dx,dy) > 16) gesture.locked=true;
    if (gesture.locked && event.cancelable) event.preventDefault();
  }, {passive:false, capture:true});

  document.addEventListener('touchend', event => {
    if (!gesture) return;
    const g=gesture; gesture=null;
    const t=event.changedTouches?.[0];
    const endX=t?.clientX ?? g.lastX, endY=t?.clientY ?? g.lastY;
    const dx=endX-g.x, dy=endY-g.y;
    const elapsed=performance.now()-g.time;
    if (elapsed > 1100 || Math.hypot(dx,dy) < minDistance()) return;
    const handled=performSwipe(dx,dy);
    if (handled && event.cancelable) event.preventDefault();
  }, {passive:false, capture:true});
  document.addEventListener('touchcancel', () => { gesture=null; }, {passive:true, capture:true});
})();
