TEACHER FRANCIS READING WORLD — PWA v1.1 iPad Touch Fix
=============================================

WHAT THIS IS
This is the same approved Reading World interface and the same six module apps, repackaged as a Progressive Web App (PWA) for Safari/iPad/iPhone and desktop browsers.

Important architecture change:
- No giant 60–90 MB single HTML file.
- Each module is its own HTML file.
- The original embedded image/audio/font bytes were extracted into local assets without changing the visuals.
- A service worker saves the app for offline use.
- Fonts are local files, so they travel with the app.
- Existing progress/localStorage and module logic remain intact.

HOW TO PUT IT ON AN iPAD / iPHONE
1. Upload the CONTENTS of this folder to an HTTPS static web host. The easiest choices are Netlify Drop, GitHub Pages, Cloudflare Pages, or another HTTPS host.
   IMPORTANT: opening index.html directly from Files/AirDrop (file://) cannot install a PWA because iOS only enables service workers on secure web origins.
2. On the iPad/iPhone, open the HTTPS URL in SAFARI.
3. Keep the first launch open while connected to Wi‑Fi so Reading World can save the offline files.
4. The full Reading World library downloads quietly in the background after the main interface loads. You do not need to open every module first.
5. Tap Safari Share → Add to Home Screen. If your iPad/iPhone shows an “Open as Web App” switch, leave it ON, then tap Add.
6. Launch Reading World from the Home Screen.
7. For an offline check, keep the site open on Wi‑Fi long enough for the background library download to finish, then turn off Wi‑Fi and reopen Reading World.


TOUCHSCREEN GESTURES
- Swipe LEFT on the main learning area = next / forward.
- Swipe RIGHT = previous / backward.
- Kuwento Tayo: left/right swipes turn complete story pages.
- Fluency Pyramid: up/down swipes also use its existing vertical navigation.
- Buttons, forms, sliders and dialog controls keep normal tap behavior and are excluded from swipe detection.

VOICE
Voice-over still uses iOS/iPadOS speech synthesis. This PWA primes speech synthesis on touch/click and keeps the existing fallback behavior, but the exact installed Filipino/English voices are supplied by the device.

UPDATES
Future updates are much easier: replace the hosted PWA files and bump the service-worker cache version. Users do not need a new giant HTML transfer.

LOCAL TEST ON MAC
From this folder in Terminal:
  python3 -m http.server 8080
Then open:
  http://localhost:8080
Service workers are allowed on localhost for testing. For an iPad, use a real HTTPS host.


LANDSCAPE PHONE / TABLET FIT (v1.4.9)
- All six modules now scale to the visible Safari/Chrome content area, not the larger hidden layout viewport.
- Browser toolbars/tab bars no longer cover the top or bottom of the learning interface.
- The full module remains visible and tappable; side margins may become wider in very short landscape browser windows.
- Add to Home Screen is still recommended for the largest distraction-free classroom view.
