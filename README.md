# Sixth-grade math practice exam

A self-contained Spanish-language exam with 12 questions, automatic correction, and a drawing area for touch or Apple Pencil. Open [the exam](https://alexeirojas87.github.io/sons-study/) on an iPad or another browser.

## Use and privacy

Answers and drawings are saved in that browser's local storage, not sent to this repository or a server. The result page can download a copy containing the answers and drawings. Storage can be unavailable or cleared by the browser, so download a copy before relying on it long-term.

The HTML has no external assets. An already-loaded page can continue working without a connection, but this site does **not** install a service worker or guarantee that the URL will reopen offline. For a reliable offline copy, save `index.html` to the device and open that file directly.

## Update the site

Edit `index.html` on the `main` branch. GitHub Pages publishes from the branch root. Keep the exam self-contained if offline use matters. Check the 12 original questions and correction data, drawing tools, saved-state reload, result page, and downloaded copy before publishing a change.

The automated local checks cover those core behaviors. Apple Pencil and Safari on a physical iPad still need manual validation.
