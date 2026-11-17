THAR GAME - FILE MAP  (kya badalna ho to kaunsi file)
=====================================================
Entry: thargame.html  (sirf HTML markup + <link>/<script> tags. Naya JS file add karo to yahan ek <script> line add karo)
Scripts CLASSIC hain (module nahi): upar se neeche ORDER mein load hote hain aur ek hi global scope share karte hain.
Isliye naya file add karte waqt use us file ke BAAD rakho jisse wo kuch use karta hai. main.js hamesha LAST.

CAR (Thar)
  js/car/car-model.js            Thar ka 3D look (hood, fenders)  -> car modify yahan
  js/traffic/vehicles.js         Traffic ki gaadiyan (auto, car, truck) buildDetailedVehicle()
  css/cockpit-interior.css, css/dashboard.css, css/controls.css   cockpit / dashboard / steering ka look
  js/game/physics.js             car physics: speed, steering, drift, collision

WORLD / ENVIRONMENT
  js/world/road-terrain.js       road, terrain textures, roundabout, curve + elevation
  js/world/scenery.js            farms, trees, hills, shops
  js/world/street-lights.js      street lights
  js/world/particles.js          smog + tyre smoke
  js/world/world-init.js         traffic/potholes/signals ko world mein rakhna
  js/traffic/obstacles-signals.js potholes, bumps, signals
  js/game/zones-theme.js         zones (Delhi/Farms/Hills...) + day/night

GAME / ENGINE
  js/core/config.js              graphics quality Low/Med/High
  js/render/scene-setup.js       scene, camera, renderers, lights
  js/render/view.js              camera follow, suspension, render
  js/game/state.js               speed/fuel/lives/drift variables, reset, game over
  js/game/hud.js                 speedometer/fuel/indicator updates
  js/game/main-loop.js           fixed timestep loop
  js/main.js                     startup (LAST)

INPUT / UI / AUDIO
  js/input/controls.js           steering wheel, pedals, keyboard
  js/ui/*.js                     settings panel, light buttons
  js/audio/*.js                  engine, horn, music, A/C sounds
