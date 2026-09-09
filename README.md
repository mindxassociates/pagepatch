# PagePatch

PagePatch is a browser-based visual editor for existing static one-page websites. It is itself a static site and can be hosted on GitHub Pages.

The interface is bilingual. It opens in Chinese by default, with a compact Chinese/English switch in the top-right corner.

## Features

- Opens an existing `.html` file or website `.zip`
- Preserves supporting files in imported ZIPs
- Click-to-edit text, typography, colors, spacing, sizing, links, images, or raw element HTML
- Guided image insertion and replacement with alt text, optional links, sizing, and alignment
- Desktop, tablet, and phone previews
- Undo, redo, direct-on-canvas editing, and interaction preview mode
- Exports an updated HTML file or complete website ZIP
- Processes the website locally in the browser
- Includes plain-language help and GitHub upload instructions for nontechnical users

## Publish

Upload `index.html` and `.nojekyll` to a repository, then enable GitHub Pages under **Settings → Pages → Deploy from a branch**.

PagePatch is intended for static HTML/CSS/JavaScript sites. Build-tool projects such as React, Next.js, or Vue should be edited in source code.
