# Metro Runner India - Multi-file version

Chalane ke liye: `index.html` ko browser mein kholo (internet chahiye, Three.js CDN se aata hai).

## Structure
- index.html            -> page + script order
- css/style.css         -> saari styling
- js/config.js          -> CONFIG + LEVELS (naya level / theme yahin add karo; MAX_BUSTS, DETAIN_SECONDS bhi yahin)
- js/audio.js           -> sounds + music + siren
- js/textures.js        -> canvas textures (signs, posters, billboards)
- js/models.js          -> saare 3D models (player, auto, train, cow, jeep, coin, powerups)
- js/world.js           -> 3 alag raaste (paver / sadak / kachchi mitti), footpath, khula maidan, thele, dukaane, neta hoardings, sun/baadal, theme transition
- js/player.js          -> player movement / jump / roll / animation
- js/obstacles.js       -> spawn + collision
- js/collectibles.js    -> coins, power-ups, sparkles
- js/police.js          -> police chase
- js/input.js           -> keyboard + swipe
- js/ui.js              -> HUD / overlays
- js/game.js            -> main loop, score, levels, game states

## Naya level add karna
config.js mein MR.LEVELS array mein ek object add karo (name, from score, speeds, weights, theme).
## Naya obstacle add karna
models.js mein builder -> obstacles.js ke BUILDERS mein naam -> config.js ke weights mein naam.

## Is version mein kya badla
- Deep black hata diya: sab jagah grey / faded rang. Zyadatar levels din ke hain (subah, dopahar, shaam).
- Indian sadak: khula area (koi deewar/chhat nahi), 3 alag raaste, footpath par thele wale, machhali wala ("das ke chaar" awaaz), dukaanein, politician ke posters / hoardings (sab kaalpanik naam).
- Police pakad: 1st aur 2nd baar pakde gaye -> "DETAIN" screen + 5-4-3-2-1 countdown, phir chhod kar dobara running. 3rd baar -> BUSTED / Try Again.
  (config.js mein MAX_BUSTS aur DETAIN_SECONDS se badal sakte ho)
