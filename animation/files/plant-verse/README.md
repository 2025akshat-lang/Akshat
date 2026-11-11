# Plantverse (modular)

Chalane ke liye: `index.html` double-click karo (internet chahiye: three.js + fonts CDN se aate hain).

## Kaunsi cheez badalni ho → kaunsi file
| Kaam | File |
|---|---|
| Rang / dark-light theme | `css/theme.css` |
| Layout, buttons, chips, card | `css/layout.css`, `css/controls.css` |
| Part ka naam / title | `js/data/parts-info.js` |
| Level 2 diagram ya uske buttons (spots) | `js/data/level2/<part>.js` |
| Kisi ek 3D cross-section ko badalna | `js/scenes/<part>/<scene>.js` (1 scene = 1 file) |
| Poora 3D paudha (Level 1) | `js/plant3d/build-plant.js` |
| Growth / flowering / fruit stages (time wala hissa) | `js/plant3d/stages.js` + `js/app/modes.js` |
| Level 1 camera, select, labels | `js/plant3d/viewer.js` |
| Level 3 viewer (cross-section screen) | `js/app/scene-viewer.js` |
| Naya feature | `js/features/<naam>.js` (neeche dekho) |

## Naya feature / scene kaise jodein (core file ko chhue bina)
1. `js/features/_template.js` ko copy karke naam do, jaise `4d-growth-timeline.js`
2. `js/manifest.js` ke `features:[ ]` mein ek line: `'features/4d-growth-timeline.js',`
3. Bas. Feature file mein `PV.after('openScene',...)`, `PV.ui.addPanel(...)`, `PV.ui.addTool(...)`, `SC[...]=`, `DIA.leaf.spots.push(...)` use karo.
   CSS chahiye to `css/features.css` mein.

Naya core file banaya (jaise naya scene)? Uska path `js/manifest.js` ke `core` list mein sahi jagah daalo
(scenes `_variants.js` se pehle, kyunki wrappers sabse baad mein chalte hain).

## Features ke liye suggested branches (abhi khaali, sirf plan)
- **3D (structure)**: tissue scenes (palisade, xylem, phloem), plant cell + organelles, flower microanatomy → `js/scenes/...` mein nayi files
- **4D (time)**: growth / germination / life-cycle slider → `js/features/4d-*.js`, base: `plant3d/stages.js`
- **5D (environment + physiology)**: light / water / CO₂ controls, transpiration, photosynthesis → `js/features/5d-*.js`
- Quiz, search, Hindi/English labels → `js/features/quiz.js`, `search.js`, `i18n.js`

Load order sirf `js/manifest.js` mein likha hai; `js/loader.js` ko chhoone ki zarurat nahi.
