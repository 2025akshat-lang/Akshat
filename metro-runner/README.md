# Metro Runner India - Multi-file version

Chalane ke liye: `index.html` ko browser mein kholo (internet chahiye, Three.js CDN se aata hai).

## Structure
- index.html            -> page + script order
- css/style.css         -> saari styling
- js/config.js          -> CONFIG, MAUSAM (WEATHERS), ILAAKE (REGIONS: raasta, camera, character ke kapde, khaas obstacles), 11 LEVELS
- js/models2.js         -> Gypsy, Thar, Truck, Bus, Camel, slum/beach/jungle ke obstacles, kela + nariyal ke ped, kapde/kabadi stalls
- js/settings.js        -> brightness, color shade, Automatic/Manual mausam (localStorage mein save)
- js/audio.js           -> sounds + music + siren
- js/textures.js        -> canvas textures (signs, posters, billboards)
- js/models.js          -> saare 3D models (player, auto, train, cow, jeep, coin, powerups)
- js/world.js           -> ilaake ke hisaab se raaste + scenery, sar ke upar neta/ad banners, thele, sun/baadal, mausam
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
- Deep black hata diya: sab jagah grey / faded rang. Roshni kam ki gayi (pehle sab safed dikhta tha), coins ab chamakte hain.
- Settings (⚙️): Brightness slider, Color Shade (Normal/Garam/Thanda/Rangeen/Saaf/Soft), Mausam mode:
  AUTOMATIC = jis state mein ho wahan ka mausam, MANUAL = Dhoop/Baadal/Barish/Kohra/Dhool/Barf/Shaam khud chuno.
- Neta ke posters aur ad ke bade banners ab raaste ke UPAR (gantry) tange hain.
- 10 levels, har level ek state: Maharashtra (pathar), Rajasthan (ret), Kerala (samundar kinara + train track),
  North East (jungle), Delhi, Gujarat (Rann), Goa, Uttarakhand, Kashmir (barf), Ladakh (pahad + prayer flags).
  Level badhne par speed, obstacles ki bheed aur double-obstacle ka chance badhta hai.
- Indian sadak: khula area, 3 alag raaste, thele wale, machhali wala ("das ke chaar"), dukaanein.
- Police pakad: 1st aur 2nd baar -> DETAIN + 5-4-3-2-1, phir dobara running. 3rd baar -> BUSTED / Try Again.

## Update 3
- Alag-alag awaazein: machhali wala ("das ke chaar"), kapde wale (aadmi / aurat / bachcha ki awaaz: "150 ke 2 kapde"),
  kabadi wale (basti mein), chai / sabzi / fruit wale, kutte ka bhaunkna. (audio.js: CRIES)
- Indian gaadiyaan: Gypsy, Thar, Truck ("HORN OK PLEASE"), Bus, Camel (registan). Side mein khadi bhi hain aur obstacle bhi.
- Naye levels / mode: MUMBAI BASTI (tedha-medha raasta, gandi nali = kudo, kapde dhote log = kudo, gande kutte, upar sookhte kapde = neeche se niklo),
  North East (jungle ki bus road, ghana jungle, baans), Kerala/Goa (nariyal ke ped, beach, dhoop sekte log = kudo,
  upar baithe log = neeche se niklo), Rajasthan (registan + camel).
- Sar ke upar ke banners ab camera paas aane par halke ho jaate hain; camera neecha kiya gaya.
- Camera aur character ke kapde har ilaake ke hisaab se badalte hain.
- Start screen par ab world scroll nahi hota.
