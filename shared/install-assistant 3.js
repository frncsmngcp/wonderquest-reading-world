(() => {
  'use strict';

  const DISMISS_KEY = 'tfReadingWorldInstallAssistantDismissedAt';
  const DISMISS_FOR_MS = 3 * 24 * 60 * 60 * 1000;
  const homeScreen = document.getElementById('home-screen');
  const suiteShell = document.getElementById('suite');
  if (!homeScreen) return;

  let deferredPrompt = null;
  let modal = null;
  let launcher = null;
  let autoShown = false;
  let installedDetected = false;
  let installCheckInFlight = null;
  let lastInstallCheckAt = 0;
  let iosCoach = null;
  let iosCoachOpen = false;
  let videoGuide = null;
  let videoGuideOpen = false;
  const INSTALL_RECHECK_MS = 10000;

  const INSTALL_TUTORIALS = {
    android: {
      label: 'Android',
      title: 'Install on Android',
      duration: 'About 1 minute',
      src: './shared/tutorials/android-install-guide-v1.mp4',
      poster: './shared/tutorials/android-install-poster-v1.jpg',
      note: 'Follow along for Android phones and tablets. Browser menu labels can vary slightly.'
    },
    ios: {
      label: 'iPhone / iPad',
      title: 'Install on iPhone or iPad',
      duration: 'About 1 minute',
      src: './shared/tutorials/ios-install-guide-v1.mp4',
      poster: './shared/tutorials/ios-install-poster-v1.jpg',
      note: 'Follow the Safari steps for adding WonderQuest to the Home Screen.'
    },
    desktop: {
      label: 'PC / Mac',
      title: 'Install on PC or Mac',
      duration: 'About 35 seconds',
      src: './shared/tutorials/desktop-mac-install-guide-v1.mp4',
      poster: './shared/tutorials/desktop-mac-install-poster-v1.jpg',
      note: 'Follow along for desktop and laptop installation on supported browsers.'
    }
  };

  const isStandalone = () => {
    try {
      return window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        navigator.standalone === true ||
        document.referrer.startsWith('android-app://');
    } catch (_) {
      return navigator.standalone === true;
    }
  };

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isIOS = /iPad|iPhone|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
  const isIPad = /iPad/i.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isEdge = /Edg\//i.test(ua);
  const isChrome = /Chrome\//i.test(ua) && !isEdge;
  const isFirefox = /Firefox\//i.test(ua);
  const isSafari = /Safari\//i.test(ua) && !/Chrome|CriOS|Edg|EdgiOS|FxiOS|OPR|OPiOS/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobile/i.test(ua);

  function recentlyDismissed() {
    try {
      const value = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return value > 0 && (Date.now() - value) < DISMISS_FOR_MS;
    } catch (_) {
      return false;
    }
  }

  function rememberDismissal() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
  }

  function clearDismissal() {
    try { localStorage.removeItem(DISMISS_KEY); } catch (_) {}
  }

  function installCopy() {
    if (deferredPrompt) {
      return {
        eyebrow: isMobile ? 'QUICK INSTALL' : 'DESKTOP APP',
        title: 'Install Reading World',
        body: 'Keep all six reading adventures one tap away. The full library continues downloading quietly in the background so it can still work when the connection becomes weak or unavailable.',
        steps: [
          'Tap “Install Reading World” below.',
          'Confirm the browser’s install message.',
          isMobile ? 'Open Reading World from your Home Screen.' : 'Open Reading World from your desktop, Start menu, Dock, or app launcher.'
        ],
        native: true,
        action: 'Install Reading World'
      };
    }

    if (isIOS) {
      return {
        eyebrow: 'IPHONE / IPAD • GUIDED INSTALL',
        title: 'Put Reading World on your Home Screen',
        body: 'I’ll keep a visual guide on screen and point you toward the Safari controls. Apple still requires you to make the final taps yourself, but the guide will stay with you through the process.',
        steps: [
          'Tap “Show me where” below.',
          'Tap Safari’s Share button (↑), or tap ••• More and then Share.',
          'Choose “Add to Home Screen”, then tap “Add”.'
        ],
        tip: isSafari ? 'Safari detected. The guide adapts for iPhone and iPad and shows both common toolbar locations.' : 'If this browser does not show “Add to Home Screen”, open this same page in Safari and use the guided steps there.',
        native: false,
        iosGuide: true,
        action: 'Show me where'
      };
    }

    if (isAndroid) {
      return {
        eyebrow: 'ANDROID',
        title: 'Install Reading World',
        body: 'Your browser has not exposed the one-tap install prompt yet, but you can still install Reading World from its menu.',
        steps: [
          'Open the browser menu (usually ⋮).',
          'Tap “Install app” or “Add to Home screen”.',
          'Confirm, then open Reading World from your Home Screen.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isSafari) {
      return {
        eyebrow: 'MAC',
        title: 'Install Reading World on your Mac',
        body: 'You can keep Reading World in the Dock so it opens in its own app window.',
        steps: [
          'From Safari, open the File menu.',
          'Choose “Add to Dock…” and confirm.',
          'Open Reading World from the Dock or Applications.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isEdge) {
      return {
        eyebrow: 'MICROSOFT EDGE',
        title: 'Install Reading World on this laptop',
        body: 'Reading World can open in its own app window and stay easy to find.',
        steps: [
          'Open the Edge menu (⋯).',
          'Choose “Apps”, then “Install this site as an app”.',
          'Confirm the installation.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isChrome) {
      return {
        eyebrow: 'GOOGLE CHROME',
        title: 'Install Reading World on this laptop',
        body: 'Reading World can open in its own app window and stay easy to find.',
        steps: [
          'Open the Chrome menu (⋮).',
          'Choose the install option, such as “Install page as app” or “Install Reading World”.',
          'Confirm the installation.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    if (isFirefox) {
      return {
        eyebrow: 'LAPTOP / DESKTOP',
        title: 'Install Reading World',
        body: 'This browser does not currently provide Reading World’s normal app-install prompt.',
        steps: [
          'For the simplest app installation, open this page in Chrome or Microsoft Edge.',
          'Choose “Install Reading World” when the install button appears.',
          'You can continue using Reading World in this browser in the meantime.'
        ],
        native: false,
        action: 'Got it'
      };
    }

    return {
      eyebrow: 'LAPTOP / DESKTOP',
      title: 'Install Reading World',
      body: 'Use your browser’s Install app / Add to Dock option to keep Reading World one click away.',
      steps: [
        'Open your browser menu.',
        'Look for “Install app”, “Install page as app”, or “Add to Dock”.',
        'Confirm the installation.'
      ],
      native: false,
      action: 'Got it'
    };
  }

  function injectStyle() {
    if (document.getElementById('tf-install-assistant-style')) return;
    const style = document.createElement('style');
    style.id = 'tf-install-assistant-style';
    style.textContent = `
      #tf-install-launcher{
        position:fixed;left:1.45%;top:2.0%;z-index:9000;
        width:auto;min-width:var(--tf-launcher-min-width,86px);height:var(--tf-launcher-height,34px);min-height:0;padding:0 var(--tf-launcher-pad-x,6px);
        display:flex;align-items:center;justify-content:center;gap:var(--tf-launcher-gap,4px);
        border:var(--tf-launcher-border,1.5px) solid rgba(255,238,165,.92);border-radius:999px;
        color:#fff7d4;background:linear-gradient(180deg,rgba(82,45,126,.96),rgba(50,22,91,.97));
        box-shadow:0 var(--tf-launcher-shadow-y,3px) 0 rgba(25,9,50,.75),0 var(--tf-launcher-shadow-soft-y,5px) var(--tf-launcher-shadow-blur,9px) rgba(0,0,0,.3),inset 0 1px 2px rgba(255,255,255,.38);
        font:900 var(--tf-launcher-font-size,10px)/1 system-ui,-apple-system,"Segoe UI",sans-serif;
        letter-spacing:.01em;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;pointer-events:auto!important;-webkit-touch-callout:none;
        -webkit-user-select:none;user-select:none;transform:translateZ(0);-webkit-transform:translateZ(0);
        transition:transform .16s ease,filter .16s ease,opacity .18s ease;
      }
      #tf-install-launcher::before{content:"↓";display:grid;place-items:center;width:var(--tf-launcher-icon,16px);height:var(--tf-launcher-icon,16px);min-width:var(--tf-launcher-icon,16px);min-height:var(--tf-launcher-icon,16px);border-radius:50%;background:#ffd85b;color:#532372;font-weight:1000;box-shadow:inset 0 -1px 2px rgba(134,81,0,.25)}
      #tf-install-launcher:hover,#tf-install-launcher:focus-visible{outline:none;filter:brightness(1.13);transform:translateY(-2%)}
      #tf-install-launcher:active{transform:translateY(1%) scale(.98)}
      #tf-install-launcher[hidden]{display:none!important}
      #tf-install-launcher::after{content:"";position:absolute;inset:-7px;border-radius:999px;pointer-events:auto}

      #tf-install-modal{position:fixed;inset:auto;left:0;top:0;width:var(--tf-usable-width,100vw);height:var(--tf-usable-height,100vh);z-index:12000;display:none;place-items:center;padding:max(16px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(16px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));background:rgba(2,15,25,.7);backdrop-filter:blur(13px) saturate(.9);-webkit-backdrop-filter:blur(13px) saturate(.9)}
      #tf-install-modal.open{display:grid}
      .tf-install-card{position:relative;width:min(calc(var(--tf-usable-width,100vw) - 32px),640px);max-height:min(calc(var(--tf-usable-height,100vh) - 32px),720px);overflow:auto;overscroll-behavior:contain;padding:clamp(22px,4vw,38px);border-radius:30px;border:2px solid rgba(255,239,165,.92);color:#3f2a18;background:linear-gradient(180deg,#fff8db 0%,#f8e8bc 100%);box-shadow:0 30px 90px rgba(0,0,0,.48),inset 0 0 0 5px rgba(185,116,32,.14);-webkit-overflow-scrolling:touch}
      .tf-install-card::before{content:"";position:absolute;left:-12%;right:-12%;top:-95px;height:190px;pointer-events:none;background:radial-gradient(circle,rgba(255,214,75,.44),rgba(255,214,75,0) 68%)}
      .tf-install-close{position:absolute;top:14px;right:14px;width:42px;height:42px;border:0;border-radius:50%;background:#9d4b20;color:white;font:900 24px/1 system-ui;cursor:pointer;touch-action:manipulation}
      .tf-install-icon{position:relative;width:76px;height:76px;margin:0 auto 12px;display:grid;place-items:center;border-radius:24px;background:linear-gradient(160deg,#6f3cac,#3b1d77);border:4px solid #ffe38b;box-shadow:0 8px 0 #2f155f,0 14px 28px rgba(52,23,98,.28);font-size:38px}
      .tf-install-eyebrow{position:relative;margin:0 0 8px;text-align:center;color:#916019;font:900 12px/1.2 system-ui;letter-spacing:.13em}
      .tf-install-title{position:relative;margin:0;text-align:center;color:#5d2d19;font:950 clamp(28px,5vw,40px)/1.05 system-ui,-apple-system,"Segoe UI",sans-serif}
      .tf-install-body{position:relative;margin:14px auto 17px;max-width:520px;text-align:center;color:#5b4934;font:650 clamp(15px,2.5vw,18px)/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
      .tf-install-steps{position:relative;display:grid;gap:10px;margin:18px 0;padding:0;counter-reset:tfstep;list-style:none}
      .tf-install-steps li{counter-increment:tfstep;display:grid;grid-template-columns:36px 1fr;align-items:center;gap:11px;padding:11px 13px;border-radius:16px;background:rgba(255,255,255,.58);border:1px solid rgba(151,100,36,.18);font:750 15px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;color:#4e3824}
      .tf-install-steps li::before{content:counter(tfstep);width:32px;height:32px;display:grid;place-items:center;border-radius:50%;color:white;background:#7540a8;font-weight:950;box-shadow:0 3px 0 #492365}
      .tf-install-tip{position:relative;margin:12px 0 0;padding:11px 13px;border-radius:14px;background:#e6f5ff;border:1px solid #a9d6ef;color:#36546a;font:700 13px/1.35 system-ui}
      .tf-install-actions{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:10px;margin-top:20px}
      .tf-install-actions button{min-height:50px;border-radius:16px;padding:10px 16px;font:900 15px/1 system-ui;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
      #tf-install-later{border:2px solid #b99358;background:rgba(255,255,255,.55);color:#694925}
      #tf-install-action{border:2px solid #542277;background:linear-gradient(180deg,#8d51bf,#633090);color:#fff9de;box-shadow:0 5px 0 #3c175b}
      #tf-install-action:active{transform:translateY(3px);box-shadow:0 2px 0 #3c175b}
      #tf-install-action:disabled{opacity:.65;cursor:default}
      .tf-install-success{text-align:center;padding:18px 8px 5px;color:#365b28;font:850 18px/1.4 system-ui}
      @media(max-width:560px){.tf-install-card{border-radius:24px;padding:24px 18px 20px}.tf-install-actions{grid-template-columns:1fr}.tf-install-actions #tf-install-action{grid-row:1}.tf-install-icon{width:64px;height:64px;font-size:32px}.tf-install-close{width:38px;height:38px}.tf-install-steps li{font-size:14px}}
      @media(max-height:600px) and (orientation:landscape){
        /* Keep the visual button at the same proportional size as the original
           in-stage launcher. Its invisible hit area stays generous, so mobile
           landscape remains easy to tap without making the artwork look huge. */
        .tf-install-card{width:min(calc(var(--tf-usable-width,100vw) - 32px),760px);max-height:calc(var(--tf-usable-height,100vh) - 32px);padding:18px 24px}
        .tf-install-icon{width:48px;height:48px;margin-bottom:6px;font-size:25px;border-radius:16px}.tf-install-title{font-size:25px}.tf-install-body{font-size:13px;margin:8px auto}.tf-install-steps{grid-template-columns:repeat(3,1fr);gap:7px;margin:10px 0}.tf-install-steps li{grid-template-columns:26px 1fr;padding:8px;font-size:11px}.tf-install-steps li::before{width:24px;height:24px}.tf-install-actions{margin-top:10px}.tf-install-actions button{min-height:44px}.tf-install-tip{font-size:11px;padding:7px}
      }

      .tf-install-video-help{position:relative;margin:14px 0 0;padding:12px 13px;border-radius:16px;background:linear-gradient(145deg,rgba(91,49,140,.10),rgba(35,93,135,.10));border:1px solid rgba(101,57,145,.20)}
      .tf-install-video-help-copy{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;text-align:center;color:#5a3c6b;font:800 12px/1.3 system-ui}
      .tf-install-video-help-copy::before{content:"▶";display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#7540a8;color:#fff4c5;font-size:10px;box-shadow:0 3px 0 #492365}
      #tf-install-video-guide{width:100%;margin-top:9px;min-height:46px;border:2px solid #6c3598;border-radius:15px;padding:9px 12px;background:linear-gradient(180deg,#9660c4,#6b3696);color:#fff8df;box-shadow:0 4px 0 #47235f;font:900 13px/1.15 system-ui;cursor:pointer;touch-action:manipulation}
      #tf-install-video-guide small{display:block;margin-top:3px;color:#f3e4ff;font:750 10px/1.15 system-ui;letter-spacing:.02em}
      #tf-install-video-guide:active{transform:translateY(2px);box-shadow:0 2px 0 #47235f}

      #tf-install-video-modal{position:fixed;left:0;top:0;width:var(--tf-usable-width,100vw);height:var(--tf-usable-height,100vh);z-index:13150;display:none;place-items:center;padding:max(14px,env(safe-area-inset-top)) max(14px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));background:rgba(3,13,28,.82);backdrop-filter:blur(14px) saturate(.95);-webkit-backdrop-filter:blur(14px) saturate(.95);font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
      #tf-install-video-modal.open{display:grid}
      .tf-video-guide-card{position:relative;width:min(calc(var(--tf-usable-width,100vw) - 28px),860px);max-height:calc(var(--tf-usable-height,100vh) - 28px);overflow:auto;overscroll-behavior:contain;padding:clamp(18px,3vw,28px);border-radius:28px;border:2px solid rgba(255,226,126,.96);background:linear-gradient(155deg,rgba(52,26,101,.99),rgba(17,57,100,.99));box-shadow:0 30px 90px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.26),0 0 0 5px rgba(103,63,17,.25);color:#fff;-webkit-overflow-scrolling:touch}
      .tf-video-guide-card::before{content:"";position:absolute;left:-8%;right:-8%;top:-105px;height:210px;background:radial-gradient(circle,rgba(255,214,78,.34),rgba(255,214,78,0) 68%);pointer-events:none}
      .tf-video-guide-close{position:absolute;right:12px;top:12px;width:40px;height:40px;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font:900 24px/1 system-ui;cursor:pointer;z-index:3}
      .tf-video-guide-kicker{position:relative;margin:1px 50px 7px;text-align:center;color:#ffe48b;font:950 11px/1.2 system-ui;letter-spacing:.13em}
      .tf-video-guide-title{position:relative;margin:0;text-align:center;color:#fff7d8;font:950 clamp(25px,4vw,36px)/1.05 system-ui}
      .tf-video-guide-intro{position:relative;margin:9px auto 15px;max-width:610px;text-align:center;color:#e7e5fb;font:700 13px/1.4 system-ui}
      .tf-video-tabs{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 auto 14px;max-width:650px}
      .tf-video-tab{min-height:46px;border:1px solid rgba(255,255,255,.28);border-radius:14px;padding:8px 9px;background:rgba(255,255,255,.10);color:#fff3cc;font:900 12px/1.15 system-ui;cursor:pointer;touch-action:manipulation;transition:transform .15s ease,background .15s ease,box-shadow .15s ease}
      .tf-video-tab:hover,.tf-video-tab:focus-visible{outline:none;background:rgba(255,255,255,.16)}
      .tf-video-tab[aria-selected="true"]{color:#4e2a0b;background:linear-gradient(180deg,#ffe88b,#f0b33a);border-color:#ffe99e;box-shadow:0 4px 0 #96651e,inset 0 1px 0 rgba(255,255,255,.55);transform:translateY(-1px)}
      .tf-video-stage{position:relative;margin:0 auto;max-width:760px;border-radius:20px;padding:5px;background:linear-gradient(145deg,#ffe695,#b87925 48%,#ffe8a8);box-shadow:0 16px 38px rgba(0,0,0,.34),0 0 0 2px rgba(65,28,92,.78);overflow:hidden}
      #tf-install-video-player{display:block;width:100%;aspect-ratio:16/9;border-radius:15px;background:#07111e;object-fit:contain}
      .tf-video-guide-meta{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin:13px auto 0;max-width:760px}
      .tf-video-guide-copy{min-width:0}
      .tf-video-guide-name{display:block;color:#fff5cf;font:900 15px/1.25 system-ui}
      .tf-video-guide-note{display:block;margin-top:4px;color:#dce9ff;font:700 12px/1.35 system-ui}
      .tf-video-guide-duration{flex:0 0 auto;padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.16);color:#ffe7a5;font:850 11px/1 system-ui;white-space:nowrap}
      .tf-video-guide-actions{display:flex;justify-content:center;margin-top:16px}
      #tf-video-guide-back{min-height:44px;border:2px solid #ffe38c;border-radius:14px;padding:10px 18px;background:#fff3c4;color:#58306e;box-shadow:0 4px 0 #b3872e;font:900 13px/1.1 system-ui;cursor:pointer}
      @media(max-width:560px){.tf-video-guide-card{padding:19px 13px 16px;border-radius:23px}.tf-video-tabs{gap:6px}.tf-video-tab{min-height:44px;padding:7px 5px;font-size:11px}.tf-video-guide-meta{display:block}.tf-video-guide-duration{display:inline-block;margin-top:8px}.tf-install-video-help{padding:10px}.tf-install-video-help-copy{font-size:11px}}
      @media(max-height:600px) and (orientation:landscape){.tf-video-guide-card{width:min(calc(var(--tf-usable-width,100vw) - 24px),820px);padding:12px 16px}.tf-video-guide-title{font-size:24px}.tf-video-guide-intro{font-size:11px;margin:5px auto 8px}.tf-video-tabs{margin-bottom:8px}.tf-video-tab{min-height:38px}.tf-video-stage{max-width:610px}.tf-video-guide-meta{max-width:610px;margin-top:7px}.tf-video-guide-note{font-size:10px}.tf-video-guide-actions{margin-top:8px}#tf-video-guide-back{min-height:38px}}

      #tf-ios-install-coach{position:fixed;left:0;top:0;width:var(--tf-usable-width,100vw);height:var(--tf-usable-height,100vh);z-index:13050;display:none;pointer-events:none;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
      #tf-ios-install-coach.open{display:block}
      .tf-ios-coach-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,20,35,.28),rgba(7,20,35,.58));backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
      .tf-ios-coach-card{pointer-events:auto;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(calc(var(--tf-usable-width,100vw) * .88),430px);max-height:calc(var(--tf-usable-height,100vh) * .70);overflow:auto;padding:22px 20px 18px;border:2px solid rgba(255,235,142,.96);border-radius:26px;background:linear-gradient(165deg,rgba(83,42,132,.98),rgba(44,20,86,.98));box-shadow:0 24px 70px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.28);text-align:center;-webkit-overflow-scrolling:touch}
      .tf-ios-coach-close{position:absolute;right:10px;top:10px;width:38px;height:38px;border:0;border-radius:50%;background:rgba(255,255,255,.16);color:#fff;font:900 23px/1 system-ui;cursor:pointer}
      .tf-ios-coach-kicker{margin:1px 42px 8px;color:#ffe590;font:950 11px/1.2 system-ui;letter-spacing:.12em}
      .tf-ios-coach-title{margin:0;color:#fff8dc;font:950 clamp(24px,6vw,34px)/1.05 system-ui}
      .tf-ios-coach-intro{margin:10px auto 14px;max-width:370px;color:#efe7ff;font:700 14px/1.4 system-ui}
      .tf-ios-coach-steps{display:grid;gap:9px;text-align:left}
      .tf-ios-coach-step{display:grid;grid-template-columns:34px 44px 1fr;align-items:center;gap:9px;padding:9px 10px;border-radius:15px;background:rgba(255,255,255,.11);border:1px solid rgba(255,255,255,.14);color:#fff;font:780 13px/1.3 system-ui}
      .tf-ios-coach-number{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:#ffd759;color:#4e257a;font-weight:1000;box-shadow:0 3px 0 rgba(50,22,77,.72)}
      .tf-ios-coach-symbol{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#fff;color:#1768d2;font:950 24px/1 system-ui;box-shadow:0 5px 14px rgba(0,0,0,.2)}
      .tf-ios-coach-symbol.home{color:#66339b;font-size:20px}.tf-ios-coach-symbol.add{color:#2f7f35;font-size:16px}
      .tf-ios-coach-note{margin:12px 0 0;padding:9px 10px;border-radius:13px;background:rgba(16,144,214,.2);border:1px solid rgba(143,218,255,.45);color:#e7f8ff;font:720 12px/1.35 system-ui}
      .tf-ios-coach-actions{display:grid;grid-template-columns:1fr 1.35fr;gap:9px;margin-top:14px}
      .tf-ios-coach-actions button{min-height:44px;border-radius:14px;padding:9px 12px;font:900 13px/1.1 system-ui;cursor:pointer}
      #tf-ios-coach-close-button{border:1px solid rgba(255,255,255,.45);background:rgba(255,255,255,.12);color:#fff}
      #tf-ios-coach-reopen{border:2px solid #ffe28a;background:#fff4c4;color:#59307c;box-shadow:0 4px 0 #d3ad42}
      .tf-ios-target{position:absolute;z-index:2;display:flex;align-items:center;gap:8px;max-width:min(72vw,320px);padding:8px 11px;border-radius:999px;background:rgba(255,250,222,.97);border:2px solid #ffd857;color:#4d2a72;font:950 12px/1.15 system-ui;box-shadow:0 0 0 0 rgba(255,216,87,.7),0 8px 22px rgba(0,0,0,.32);animation:tfIOSCoachPulse 1.05s ease-in-out infinite;pointer-events:none}
      .tf-ios-target::before{content:"↑";display:grid;place-items:center;width:32px;height:32px;border-radius:10px;background:#1671dd;color:#fff;font:1000 20px/1 system-ui;box-shadow:0 3px 0 #0b4896}
      .tf-ios-target-top{right:max(8px,env(safe-area-inset-right));top:max(8px,env(safe-area-inset-top))}
      .tf-ios-target-bottom{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom))}
      .tf-ios-target-bottom::before{content:"•••";font-size:15px;letter-spacing:-1px}
      .tf-ios-target .tf-ios-arrow{position:absolute;width:0;height:0;border-style:solid;filter:drop-shadow(0 2px 2px rgba(0,0,0,.22))}
      .tf-ios-target-top .tf-ios-arrow{right:17px;top:-16px;border-width:0 9px 16px 9px;border-color:transparent transparent #ffd857 transparent}
      .tf-ios-target-bottom .tf-ios-arrow{right:17px;bottom:-16px;border-width:16px 9px 0 9px;border-color:#ffd857 transparent transparent transparent}
      #tf-ios-install-coach.ipad .tf-ios-target-bottom{display:none}
      #tf-ios-install-coach.ipad .tf-ios-target-top{top:max(12px,env(safe-area-inset-top));right:max(12px,env(safe-area-inset-right))}
      #tf-ios-install-coach.iphone .tf-ios-target-top{opacity:.58;transform:scale(.9);transform-origin:top right}
      @keyframes tfIOSCoachPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,216,87,.74),0 8px 22px rgba(0,0,0,.32);transform:translateY(0)}50%{box-shadow:0 0 0 12px rgba(255,216,87,0),0 10px 26px rgba(0,0,0,.36);transform:translateY(-2px)}}
      @media(max-width:560px){.tf-ios-coach-card{width:min(89vw,410px);padding:20px 15px 16px}.tf-ios-coach-step{grid-template-columns:30px 40px 1fr;gap:7px;font-size:12px}.tf-ios-coach-symbol{width:38px;height:38px}.tf-ios-target{font-size:11px;max-width:68vw;padding:7px 9px}.tf-ios-target::before{width:29px;height:29px}}
      @media(max-height:600px) and (orientation:landscape){.tf-ios-coach-card{width:min(calc(var(--tf-usable-width,100vw) * .70),520px);max-height:calc(var(--tf-usable-height,100vh) - 28px);top:50%;padding:15px}.tf-ios-coach-title{font-size:24px}.tf-ios-coach-intro{font-size:11px;margin:6px auto}.tf-ios-coach-steps{grid-template-columns:repeat(3,1fr);gap:6px}.tf-ios-coach-step{display:flex;flex-direction:column;align-items:center;text-align:center;padding:7px;font-size:10px}.tf-ios-coach-number{width:24px;height:24px}.tf-ios-coach-symbol{width:34px;height:34px}.tf-ios-coach-note{font-size:10px;margin-top:7px}.tf-ios-coach-actions{margin-top:8px}.tf-ios-coach-actions button{min-height:44px}.tf-ios-target{font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  function detectedTutorialCategory() {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'desktop';
  }

  function selectVideoTutorial(category, { autoplay = false } = {}) {
    const guide = ensureVideoGuide();
    const selected = INSTALL_TUTORIALS[category] ? category : detectedTutorialCategory();
    const data = INSTALL_TUTORIALS[selected];
    const player = guide.querySelector('#tf-install-video-player');
    const title = guide.querySelector('#tf-video-guide-name');
    const note = guide.querySelector('#tf-video-guide-note');
    const duration = guide.querySelector('#tf-video-guide-duration');

    guide.querySelectorAll('.tf-video-tab').forEach(button => {
      const active = button.dataset.tutorial === selected;
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });

    if (player.dataset.tutorial !== selected) {
      try { player.pause(); } catch (_) {}
      player.src = data.src;
      player.poster = data.poster;
      player.dataset.tutorial = selected;
      player.load();
    }
    title.textContent = data.title;
    note.textContent = data.note;
    duration.textContent = data.duration;
    try { window.TFAnalytics?.track('install_video_category', { install_video_platform: selected }); } catch (_) {}
    if (autoplay) {
      const promise = player.play();
      if (promise?.catch) promise.catch(() => {});
    }
  }

  function ensureVideoGuide() {
    if (videoGuide) return videoGuide;
    injectStyle();
    videoGuide = document.createElement('div');
    videoGuide.id = 'tf-install-video-modal';
    videoGuide.setAttribute('role', 'dialog');
    videoGuide.setAttribute('aria-modal', 'true');
    videoGuide.setAttribute('aria-labelledby', 'tf-video-guide-title');
    videoGuide.innerHTML = `
      <section class="tf-video-guide-card">
        <button class="tf-video-guide-close" type="button" aria-label="Close visual installation guide">×</button>
        <div class="tf-video-guide-kicker">WONDERQUEST • VISUAL INSTALL GUIDE</div>
        <h2 class="tf-video-guide-title" id="tf-video-guide-title">See exactly how to install it</h2>
        <p class="tf-video-guide-intro">Choose your device, press play, and follow the short step-by-step video.</p>
        <div class="tf-video-tabs" role="tablist" aria-label="Choose installation video">
          <button class="tf-video-tab" type="button" role="tab" data-tutorial="android">Android</button>
          <button class="tf-video-tab" type="button" role="tab" data-tutorial="ios">iPhone / iPad</button>
          <button class="tf-video-tab" type="button" role="tab" data-tutorial="desktop">PC / Mac</button>
        </div>
        <div class="tf-video-stage">
          <video id="tf-install-video-player" controls playsinline preload="metadata" aria-label="WonderQuest installation video"></video>
        </div>
        <div class="tf-video-guide-meta">
          <div class="tf-video-guide-copy">
            <strong class="tf-video-guide-name" id="tf-video-guide-name"></strong>
            <span class="tf-video-guide-note" id="tf-video-guide-note"></span>
          </div>
          <span class="tf-video-guide-duration" id="tf-video-guide-duration"></span>
        </div>
        <div class="tf-video-guide-actions">
          <button id="tf-video-guide-back" type="button">Back to install steps</button>
        </div>
      </section>`;
    document.body.appendChild(videoGuide);

    videoGuide.querySelectorAll('.tf-video-tab').forEach(button => {
      button.addEventListener('click', () => selectVideoTutorial(button.dataset.tutorial));
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        const tabs = Array.from(videoGuide.querySelectorAll('.tf-video-tab'));
        const current = tabs.indexOf(button);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(current + direction + tabs.length) % tabs.length];
        event.preventDefault();
        next.focus();
        selectVideoTutorial(next.dataset.tutorial);
      });
    });
    videoGuide.querySelector('.tf-video-guide-close').addEventListener('click', stopVideoGuide);
    videoGuide.querySelector('#tf-video-guide-back').addEventListener('click', stopVideoGuide);
    videoGuide.addEventListener('pointerdown', event => {
      if (event.target === videoGuide) stopVideoGuide();
    });
    selectVideoTutorial(detectedTutorialCategory());
    return videoGuide;
  }

  function startVideoGuide() {
    ensureVideoGuide();
    videoGuideOpen = true;
    videoGuide.classList.add('open');
    selectVideoTutorial(detectedTutorialCategory());
    try { window.TFAnalytics?.track('install_video_guide_open', { install_video_platform: detectedTutorialCategory() }); } catch (_) {}
    try { window.tfApplySafeViewport?.(); } catch (_) {}
    setTimeout(() => {
      try { videoGuide.querySelector('.tf-video-tab[aria-selected="true"]')?.focus({ preventScroll: true }); } catch (_) {}
    }, 30);
  }

  function stopVideoGuide() {
    if (!videoGuide) return;
    videoGuideOpen = false;
    videoGuide.classList.remove('open');
    try { videoGuide.querySelector('#tf-install-video-player')?.pause(); } catch (_) {}
    try { modal?.querySelector('#tf-install-video-guide')?.focus({ preventScroll: true }); } catch (_) {}
  }

  function ensureIOSCoach() {
    if (iosCoach) return iosCoach;
    injectStyle();
    iosCoach = document.createElement('div');
    iosCoach.id = 'tf-ios-install-coach';
    iosCoach.className = isIPad ? 'ipad' : 'iphone';
    iosCoach.setAttribute('role', 'dialog');
    iosCoach.setAttribute('aria-modal', 'true');
    iosCoach.setAttribute('aria-labelledby', 'tf-ios-coach-title');
    iosCoach.innerHTML = `
      <div class="tf-ios-coach-shade" aria-hidden="true"></div>
      <div class="tf-ios-target tf-ios-target-top" aria-hidden="true"><span class="tf-ios-arrow"></span><span>${isIPad ? 'Tap Safari’s ↑ Share button' : 'If your toolbar is at the top: tap ↑ Share'}</span></div>
      <div class="tf-ios-target tf-ios-target-bottom" aria-hidden="true"><span class="tf-ios-arrow"></span><span>Tap ••• More or ↑ Share</span></div>
      <section class="tf-ios-coach-card">
        <button class="tf-ios-coach-close" type="button" aria-label="Close iPhone install guide">×</button>
        <div class="tf-ios-coach-kicker">IPHONE / IPAD • KEEP THIS OPEN</div>
        <h2 class="tf-ios-coach-title" id="tf-ios-coach-title">Just 3 taps to install</h2>
        <p class="tf-ios-coach-intro">Use Safari’s toolbar while this guide stays on screen. The glowing labels point to the common Share / More button locations.</p>
        <div class="tf-ios-coach-steps">
          <div class="tf-ios-coach-step"><span class="tf-ios-coach-number">1</span><span class="tf-ios-coach-symbol">↑</span><span><strong>Tap Share.</strong> If you see <strong>••• More</strong> instead, tap it and choose <strong>Share</strong>.</span></div>
          <div class="tf-ios-coach-step"><span class="tf-ios-coach-number">2</span><span class="tf-ios-coach-symbol home">⌂＋</span><span>In Apple’s Share menu, scroll if needed and tap <strong>Add to Home Screen</strong>.</span></div>
          <div class="tf-ios-coach-step"><span class="tf-ios-coach-number">3</span><span class="tf-ios-coach-symbol add">ADD</span><span>On the final screen, tap <strong>Add</strong>. Reading World will appear on the Home Screen.</span></div>
        </div>
        <p class="tf-ios-coach-note">Apple keeps the Share and Add buttons under your control, so Reading World cannot press them for you. This guide stays visible until you close it.</p>
        <div class="tf-ios-coach-actions">
          <button id="tf-ios-coach-close-button" type="button">Close guide</button>
          <button id="tf-ios-coach-reopen" type="button">Show pointers again</button>
        </div>
      </section>`;
    document.body.appendChild(iosCoach);
    iosCoach.querySelector('.tf-ios-coach-close').addEventListener('click', () => stopIOSCoach(true));
    iosCoach.querySelector('#tf-ios-coach-close-button').addEventListener('click', () => stopIOSCoach(true));
    iosCoach.querySelector('#tf-ios-coach-reopen').addEventListener('click', () => {
      const targets = iosCoach.querySelectorAll('.tf-ios-target');
      targets.forEach(target => {
        target.style.animation = 'none';
        void target.offsetWidth;
        target.style.animation = '';
      });
    });
    return iosCoach;
  }

  function startIOSCoach() {
    if (!isIOS) return;
    ensureIOSCoach();
    modal?.classList.remove('open');
    iosCoachOpen = true;
    iosCoach.classList.add('open');
    try { window.TFAnalytics?.track('ios_install_guide_open'); } catch (_) {}
    try { window.tfApplySafeViewport?.(); } catch (_) {}
    setTimeout(() => {
      try { iosCoach.querySelector('.tf-ios-coach-card')?.focus?.({ preventScroll: true }); } catch (_) {}
    }, 30);
  }

  function stopIOSCoach(remember = false) {
    if (!iosCoach) return;
    iosCoachOpen = false;
    iosCoach.classList.remove('open');
    if (remember) rememberDismissal();
    try { launcher?.focus({ preventScroll: true }); } catch (_) {}
  }

  let launcherPositionRaf = 0;
  function positionLauncher() {
    if (!launcher || !suiteShell) return;
    cancelAnimationFrame(launcherPositionRaf);
    launcherPositionRaf = requestAnimationFrame(() => {
      const rect = suiteShell.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const vp = window.tfUsableViewport?.();
      const landscape = Number(vp?.width || innerWidth || 0) > Number(vp?.height || innerHeight || 0);
      // Keep the install control away from Safari/Chrome's edge gesture and
      // toolbar hit regions. Because the launcher is portaled to <body>, it is
      // no longer hit-tested through the transformed #suite ancestor.
      const insetX = landscape ? Math.max(14, rect.width * 0.0145) : Math.max(12, rect.width * 0.0145);
      const insetY = landscape ? Math.max(10, rect.height * 0.020) : Math.max(10, rect.height * 0.020);

      // The launcher lives outside #suite for reliable Safari hit testing, so
      // container/percentage units would otherwise size it against the browser
      // viewport and make it look oversized. Recreate the original in-suite
      // proportions from the suite's *rendered* rectangle instead.
      const fontSize = Math.max(10, Math.min(19, rect.width * 0.0114));
      const iconSize = Math.max(16, Math.min(31, rect.width * 0.0185));
      const padX = Math.max(5, Math.min(19, rect.width * 0.0115));
      const gap = Math.max(4, Math.min(8, rect.width * 0.0048));
      const minWidth = Math.max(78, rect.width * 0.106);
      const height = Math.max(30, Math.min(58, rect.height * 0.062));
      const border = Math.max(1.25, Math.min(2.7, rect.width * 0.0016));
      launcher.style.setProperty('--tf-launcher-font-size', `${fontSize.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-icon', `${iconSize.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-pad-x', `${padX.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-gap', `${gap.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-min-width', `${minWidth.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-height', `${height.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-border', `${border.toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-shadow-y', `${Math.max(2, rect.width * 0.0042).toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-shadow-soft-y', `${Math.max(3, rect.width * 0.007).toFixed(2)}px`);
      launcher.style.setProperty('--tf-launcher-shadow-blur', `${Math.max(6, rect.width * 0.013).toFixed(2)}px`);

      launcher.style.left = `calc(${Math.round(rect.left + insetX)}px + env(safe-area-inset-left))`;
      launcher.style.top = `calc(${Math.round(rect.top + insetY)}px + env(safe-area-inset-top))`;
    });
  }

  function syncLauncherVisibility() {
    if (!launcher) return;
    launcher.hidden = installedDetected || !homeScreen.classList.contains('active');
    if (!launcher.hidden) positionLauncher();
  }

  function launcherContainsPoint(clientX, clientY, extra = 3) {
    if (!launcher || launcher.hidden || !homeScreen.classList.contains('active')) return false;
    const r = launcher.getBoundingClientRect();
    return clientX >= r.left - extra && clientX <= r.right + extra &&
      clientY >= r.top - extra && clientY <= r.bottom + extra;
  }

  function ensureUI() {
    if (modal && launcher) return;
    injectStyle();

    launcher = document.createElement('button');
    launcher.id = 'tf-install-launcher';
    launcher.type = 'button';
    launcher.textContent = 'Install App';
    launcher.hidden = true;
    launcher.setAttribute('aria-label', 'Install WonderQuest: Reading World');
    // Portal the launcher above the transformed suite. Mobile Safari can
    // visually paint a transformed child correctly while exposing an unreliable
    // touch hit region after landscape toolbar changes.
    document.body.appendChild(launcher);

    modal = document.createElement('div');
    modal.id = 'tf-install-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tf-install-title');
    modal.innerHTML = `
      <section class="tf-install-card">
        <button class="tf-install-close" type="button" aria-label="Close install guide">×</button>
        <div class="tf-install-icon" aria-hidden="true">📚</div>
        <div class="tf-install-eyebrow" id="tf-install-eyebrow"></div>
        <h2 class="tf-install-title" id="tf-install-title"></h2>
        <p class="tf-install-body" id="tf-install-body"></p>
        <ol class="tf-install-steps" id="tf-install-steps"></ol>
        <div class="tf-install-tip" id="tf-install-tip" hidden></div>
        <div class="tf-install-video-help">
          <div class="tf-install-video-help-copy">Still not sure? Watch the installation from start to finish.</div>
          <button id="tf-install-video-guide" type="button">Watch Visual Installation Guide<small>Android • iPhone / iPad • PC / Mac</small></button>
        </div>
        <div class="tf-install-actions">
          <button id="tf-install-later" type="button">Maybe later</button>
          <button id="tf-install-action" type="button"></button>
        </div>
      </section>`;
    document.body.appendChild(modal);
    try { window.tfApplySafeViewport?.(); } catch (_) {}

    let launcherActivatedAt = 0;
    const activateLauncher = event => {
      const now = performance.now();
      if (now - launcherActivatedAt < 650) return;
      launcherActivatedAt = now;
      if (event?.cancelable) event.preventDefault();
      event?.stopPropagation?.();
      try { window.TFAnalytics?.track('install_button_tap'); } catch (_) {}
      void openModal(true);
    };
    // Keep the button's own handlers, then add a capture-phase geometry
    // fallback below. The fallback means every visible pixel of the launcher
    // activates it even if Safari temporarily assigns the touch to a neighboring
    // composited layer after an orientation / toolbar transition.
    launcher.addEventListener('pointerup', activateLauncher);
    launcher.addEventListener('click', activateLauncher);

    let launcherPress = null;
    document.addEventListener('pointerdown', event => {
      if (!event.isPrimary || !launcherContainsPoint(event.clientX, event.clientY, 6)) return;
      launcherPress = { id: event.pointerId, x: event.clientX, y: event.clientY };
    }, true);
    document.addEventListener('pointerup', event => {
      if (!launcherPress || event.pointerId !== launcherPress.id) return;
      const press = launcherPress;
      launcherPress = null;
      const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
      if (moved <= 18 && launcherContainsPoint(event.clientX, event.clientY, 8)) activateLauncher(event);
    }, true);
    document.addEventListener('pointercancel', event => {
      if (launcherPress && event.pointerId === launcherPress.id) launcherPress = null;
    }, true);

    // Older iOS WebKit builds that do not expose PointerEvent still receive a
    // coordinate-based touch fallback.
    if (!('PointerEvent' in window)) {
      let touchPress = null;
      document.addEventListener('touchstart', event => {
        const t = event.changedTouches?.[0];
        if (!t || !launcherContainsPoint(t.clientX, t.clientY, 6)) return;
        touchPress = { id: t.identifier, x: t.clientX, y: t.clientY };
      }, { capture: true, passive: true });
      document.addEventListener('touchend', event => {
        if (!touchPress) return;
        const t = Array.from(event.changedTouches || []).find(item => item.identifier === touchPress.id);
        if (!t) return;
        const press = touchPress;
        touchPress = null;
        const moved = Math.hypot(t.clientX - press.x, t.clientY - press.y);
        if (moved <= 18 && launcherContainsPoint(t.clientX, t.clientY, 8)) activateLauncher(event);
      }, { capture: true, passive: false });
      document.addEventListener('touchcancel', () => { touchPress = null; }, { capture: true, passive: true });
    }
    positionLauncher();
    modal.querySelector('.tf-install-close').addEventListener('click', () => closeModal(true));
    modal.querySelector('#tf-install-later').addEventListener('click', () => closeModal(true));
    modal.querySelector('#tf-install-video-guide').addEventListener('click', startVideoGuide);
    modal.addEventListener('pointerdown', event => {
      if (event.target === modal) closeModal(true);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      if (videoGuideOpen) {
        stopVideoGuide();
        return;
      }
      if (modal.classList.contains('open')) closeModal(true);
    });
    const primaryAction = modal.querySelector('#tf-install-action');
    let primaryActivatedAt = 0;
    const activatePrimary = event => {
      const now = performance.now();
      if (now - primaryActivatedAt < 650) return;
      primaryActivatedAt = now;
      if (event?.cancelable) event.preventDefault();
      event?.stopPropagation?.();
      void handlePrimaryAction();
    };
    primaryAction.addEventListener('pointerup', activatePrimary);
    primaryAction.addEventListener('click', activatePrimary);
  }

  function renderModal() {
    ensureUI();
    const copy = installCopy();
    modal.querySelector('#tf-install-eyebrow').textContent = copy.eyebrow;
    modal.querySelector('#tf-install-title').textContent = copy.title;
    modal.querySelector('#tf-install-body').textContent = copy.body;
    const steps = modal.querySelector('#tf-install-steps');
    steps.replaceChildren(...copy.steps.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    const tip = modal.querySelector('#tf-install-tip');
    tip.hidden = !copy.tip;
    tip.textContent = copy.tip || '';
    const action = modal.querySelector('#tf-install-action');
    action.textContent = copy.action;
    action.dataset.native = copy.native ? '1' : '0';
    action.dataset.iosGuide = copy.iosGuide ? '1' : '0';
    action.disabled = false;
  }

  async function openModal(manual = false) {
    if (await refreshInstallState({ force: true })) return;
    renderModal();
    modal.classList.add('open');
    modal.dataset.manual = manual ? '1' : '0';
    try { window.TFAnalytics?.track('install_guide_shown', { guide_trigger: manual ? 'manual' : 'automatic', guide_platform: isIOS ? 'ios' : (deferredPrompt ? 'native_prompt' : 'browser_help') }); } catch (_) {}
    setTimeout(() => modal.querySelector('#tf-install-action')?.focus({ preventScroll: true }), 50);
  }

  function closeModal(remember = false) {
    if (!modal) return;
    if (videoGuideOpen) stopVideoGuide();
    modal.classList.remove('open');
    if (remember) rememberDismissal();
    try { launcher?.focus({ preventScroll: true }); } catch (_) {}
  }

  async function handlePrimaryAction() {
    const action = modal.querySelector('#tf-install-action');
    if (isIOS && action.dataset.iosGuide === '1' && !deferredPrompt) {
      startIOSCoach();
      return;
    }
    if (!deferredPrompt || action.dataset.native !== '1') {
      closeModal(true);
      return;
    }

    action.disabled = true;
    action.textContent = 'Opening install…';
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      try { window.TFAnalytics?.track('install_prompt_result', { prompt_outcome: result?.outcome || 'unknown' }); } catch (_) {}
      if (result?.outcome === 'accepted') {
        clearDismissal();
        modal.querySelector('.tf-install-card').innerHTML = '<div class="tf-install-success">✓ Reading World is being installed.<br>You can open it from your app list or Home Screen.</div>';
        setTimeout(() => modal.classList.remove('open'), 1600);
      } else {
        rememberDismissal();
        modal.classList.remove('open');
      }
    } catch (_) {
      action.disabled = false;
      action.textContent = 'Install Reading World';
    } finally {
      deferredPrompt = null;
    }
  }

  function applyInstallVisibility(installed) {
    installedDetected = !!installed;
    syncLauncherVisibility();
    if (installedDetected) {
      modal?.classList.remove('open');
      if (videoGuideOpen) stopVideoGuide();
      if (iosCoachOpen) stopIOSCoach(false);
    }
  }

  async function detectInstalledPWA() {
    if (isStandalone()) return true;

    // Chromium can query whether this same-scope PWA is installed when the
    // manifest declares itself in related_applications. This also lets the
    // browser notice a later uninstall without relying on a stale saved flag.
    if (typeof navigator.getInstalledRelatedApps === 'function') {
      try {
        const apps = await navigator.getInstalledRelatedApps();
        return Array.isArray(apps) && apps.some(app => app?.platform === 'webapp');
      } catch (_) {}
    }

    // On browsers without an installed-app query (notably iOS Safari), the
    // reliable signal is whether this page is currently running as the
    // Home-Screen/standalone app. We deliberately do not persist an
    // "installed" flag because it would remain stale after an uninstall.
    return false;
  }

  async function refreshInstallState({ force = false } = {}) {
    ensureUI();

    if (isStandalone()) {
      applyInstallVisibility(true);
      return true;
    }

    const now = Date.now();
    if (!force && installCheckInFlight) return installCheckInFlight;
    if (!force && now - lastInstallCheckAt < 1200) return installedDetected;

    lastInstallCheckAt = now;
    installCheckInFlight = (async () => {
      // Avoid a brief flash of the install button while a supported browser is
      // checking the device-level installed state.
      if (typeof navigator.getInstalledRelatedApps === 'function' && launcher) launcher.hidden = true;
      const installed = await detectInstalledPWA();
      applyInstallVisibility(installed);
      return installed;
    })().finally(() => { installCheckInFlight = null; });

    return installCheckInFlight;
  }

  function updateVisibility() {
    void refreshInstallState({ force: true });
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    try { window.TFAnalytics?.track('install_prompt_available'); } catch (_) {}
    deferredPrompt = event;
    applyInstallVisibility(false);
    void refreshInstallState({ force: true });
    if (modal?.classList.contains('open')) renderModal();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    try { window.TFAnalytics?.recordInstallCompleted('browser_appinstalled'); } catch (_) {}
    clearDismissal();
    applyInstallVisibility(true);
    setTimeout(() => { void refreshInstallState({ force: true }); }, 1500);
  });

  try {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', updateVisibility);
  } catch (_) {}

  async function maybeAutoShow() {
    if (autoShown || recentlyDismissed()) return;
    if (!homeScreen.classList.contains('active')) return;
    if (window.__TF_STARTUP_OVERLAY__ && !window.__TF_STARTUP_OVERLAY__.dismissed()) return;
    if (await refreshInstallState()) return;

    autoShown = true;
    setTimeout(async () => {
      if (!homeScreen.classList.contains('active') || recentlyDismissed()) return;
      if (await refreshInstallState({ force: true })) return;
      await openModal(false);
    }, 900);
  }

  ensureUI();
  void refreshInstallState({ force: true });

  // Wait until the existing welcome card has been dismissed so the two guides
  // never stack on top of one another.
  const autoTimer = setInterval(() => {
    void maybeAutoShow();
    if (autoShown || installedDetected || isStandalone()) clearInterval(autoTimer);
  }, 500);
  setTimeout(() => {
    void maybeAutoShow();
    if (autoShown || installedDetected || isStandalone()) clearInterval(autoTimer);
  }, 1200);

  // Re-check while the site is open. On browsers that implement
  // getInstalledRelatedApps(), uninstalling the PWA makes the Install button
  // return automatically on the next check. Event-driven checks make this
  // nearly immediate when the user switches back to the browser.
  setInterval(() => {
    if (!document.hidden) void refreshInstallState({ force: true });
  }, INSTALL_RECHECK_MS);
  window.addEventListener('focus', () => { void refreshInstallState({ force: true }); });
  window.addEventListener('pageshow', () => { void refreshInstallState({ force: true }); });
  window.addEventListener('online', () => { void refreshInstallState({ force: true }); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void refreshInstallState({ force: true });
  });
  window.addEventListener('resize', () => {
    positionLauncher();
    if (iosCoachOpen || videoGuideOpen) { try { window.tfApplySafeViewport?.(); } catch (_) {} }
  });
  window.addEventListener('orientationchange', () => {
    positionLauncher();
    setTimeout(positionLauncher, 100);
    setTimeout(positionLauncher, 420);
    if (iosCoachOpen || videoGuideOpen) setTimeout(() => { try { window.tfApplySafeViewport?.(); } catch (_) {} }, 80);
  });
  window.addEventListener('tfviewportchange', () => {
    positionLauncher();
    if (iosCoachOpen && iosCoach) {
      iosCoach.style.width = 'var(--tf-usable-width,100vw)';
      iosCoach.style.height = 'var(--tf-usable-height,100vh)';
    }
    if (videoGuideOpen && videoGuide) {
      videoGuide.style.width = 'var(--tf-usable-width,100vw)';
      videoGuide.style.height = 'var(--tf-usable-height,100vh)';
    }
  });

  // If a user returns to All Apps later, keep the install launcher state fresh.
  new MutationObserver(() => {
    syncLauncherVisibility();
    positionLauncher();
    void refreshInstallState({ force: true });
    void maybeAutoShow();
  }).observe(homeScreen, { attributes: true, attributeFilter: ['class'] });
})();
