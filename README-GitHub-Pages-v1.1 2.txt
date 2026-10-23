Teacher Francis Reading World — PWA v1.1 iPad Touch Fix

WHAT THIS FIXES
1. Removes the malformed nested <script> that caused JavaScript source code to appear visibly above the Reading World dashboard in Safari.
2. Restores working dashboard module cards/taps.
3. Adds touch gestures without changing the six module visuals:
   - Swipe LEFT = next / forward
   - Swipe RIGHT = previous / backward
   - Kuwento Tayo: left/right swipe turns the STORY PAGE.
   - Fluency Pyramid: vertical swipes also map to its existing up/down navigation.
4. Bumps the offline cache to v1.1 and uses network-first page loading so GitHub Pages updates are less likely to remain stuck behind an older iPad cache.

HOW TO UPDATE GITHUB PAGES
- Replace the old repository files with ALL files from this folder.
- Commit and push the changes.
- Wait for GitHub Pages to finish deployment.
- On iPad Safari, reload the site. If the previous broken PWA was already added to the Home Screen, remove that old Home Screen copy and add the site again after verifying Safari shows the corrected dashboard.

IMPORTANT
Do not upload only index.html. The modules, assets, shared folder, manifest, service worker, icons and .nojekyll must stay together with the same folder structure.

Performance update (v1.4.8): Kuwento Tayo illustrations are stored as separate cacheable WebP files for faster online startup. Their exact image bytes and resolution are preserved. After the main interface loads, the complete Reading World library begins downloading quietly in the background whether opened in a browser or as an installed PWA. Cached files are skipped, interrupted downloads resume when the internet returns, and the completed cache supports offline or unstable-internet use.
Mobile landscape update (v1.5.0): all six learning modules now fit to Safari/Chrome's actually visible small viewport in landscape mode, including when browser toolbars and tab bars are showing. The complete stage scales down instead of being cropped, so bottom/top controls remain reachable. This also applies when switching orientation or when mobile browser chrome changes size.


v1.5.0: Kuwento Tayo mobile touch fixes, bookshelf swipe, responsive story/question text fitting, dual-orientation PWA support, and improved fullscreen/home controls.

v1.5.2: Kuwento Tayo portrait-phone story fitting now measures the real rendered text height (including late-loaded font metrics), preventing the last story lines from being clipped in the shallow 16:9 reader frame.
v1.5.3: AWAD now prioritizes the bundled reading font instead of device-specific system fallbacks, and the suite/startup/install dialogs center against the actual visible mobile viewport in portrait browsers.


v1.5.5: The Install App button and install guide now continuously re-check whether Reading World is already installed. Supported Chromium browsers use same-scope PWA installation detection; installed/standalone sessions hide installation UI immediately, and the UI returns after an uninstall is detected.
v1.5.4: The PWA and all six modules now explicitly opt out of OS/browser dark-mode color schemes. Native controls and page content stay in the app's designed light presentation even when the device itself uses Dark Mode.


v1.5.6: Incremental offline updates. Content-hashed library media is retained in a stable cache across releases, old versioned caches are migrated locally, removed assets are pruned, and only new/changed library assets plus mutable app files are fetched. The app also checks periodically for a newer service worker without interrupting an active lesson.

v1.5.7: The All Apps control in every module can now be dragged with touch, pen, or mouse. Its normalized position is shared across modules and remembered between sessions, while taps/clicks still return to the Reading World home screen.
v1.5.8: Motion and ambient visual effects now stay enabled even when the device has Reduce Motion turned on. AWAD and the Reading World home ambient layers also avoid mix-blend-mode dependency and use mobile-compositor-friendly layering so glitters, light rays, fireflies, orbs, and sheen effects remain visible more consistently.
v1.5.9: iPhone/iPad installation now includes an on-screen three-step coach with persistent animated pointers for Safari’s Share / More controls, plus clear Add to Home Screen and Add instructions. Apple’s required system confirmation remains user-controlled.
v1.5.10: Fixed mobile landscape installation controls. The Install App launcher now has a larger safe-edge touch target and pointer-up activation, while install/iOS guide cards size to the measured visible viewport so action buttons stay above browser chrome.
v1.5.11: Reworked the Install App launcher hit testing for mobile landscape. The launcher is portaled above the transformed suite, kept farther from browser edge-gesture regions, and uses capture-phase coordinate hit testing so the full visible button responds reliably after Safari/Chrome toolbar or orientation changes.
v1.5.12: Kept the reliable top-level Install App hit testing, but restored the launcher's original proportional visual sizing using the rendered Reading World stage dimensions. The invisible touch margin and coordinate fallback remain larger than the visible button, so landscape taps stay reliable without the button appearing oversized.
v1.5.13: Kuwento Tayo now loads the bundled Andika literacy font directly instead of relying on device-specific OpenDyslexic/system fallbacks. Story narration, story titles, comprehension questions, and the rest of the module inherit the same portable reading-friendly font consistently across iOS, Android, and desktop.


v1.5.14: Fixed Kuwento Tayo bookshelf clicks on desktop/laptop browsers. The shelf no longer captures the pointer on a normal press; pointer capture starts only after a genuine horizontal swipe/drag, preserving normal book-card clicks while retaining touch swiping.


v1.5.15: Added privacy-minimized Google Analytics 4 tracking (G-759JM3JJNM) for website/PWA launches, module opens, PWA install flow, iOS Home Screen detection, offline-library readiness, and Kuwento story opens/completions. No learner names, email addresses, story text, or user-entered content are sent. Google Signals and ads-personalization signals are disabled in the tag configuration.
