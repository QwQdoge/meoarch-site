# MeoArch Site

The public umbrella website for MeoArch at `https://meoarch.org/`: what the project is, its products
(MeoArch OS, Meo AI, OmniStore, Meo Settings, MeoUI, Meo Login), how to install them (ISO, the Meo pacman
repository, AUR/yay once published), and a few other public projects.

The OS-specific site lives in the separate `MeoArch-os-webside` repository (`os.meoarch.org`).

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure and content. |
| `styles.css` | Visual system and responsive layout. |
| `app.js` | Language switcher (zh-CN / en) and menu behavior. |
| `assets/` | Fonts (Comfortaa, Roboto Flex, SIL OFL), logo, and compressed product screenshots. |

## Local preview

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. A local preview proves only local rendering, not hosting or deployment.

## Content rules

- Only claim what the product repositories and releases show; label states honestly (development preview, Beta, test ISO).
- Screenshots come from development builds; keep them compressed (WebP, about 1280 px wide).
- Both languages must stay in sync: every `data-i18n` key exists in `zh` and `en` in `app.js`.
- Install commands must match the Meo repository (`packages.meoarch.org`) and AUR packages that really exist.
