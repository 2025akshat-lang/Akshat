/* ===== config.js : saari game settings aur levels yahan hain ===== */
window.MR = window.MR || {};

MR.CONFIG = {
  // Lane 0 = screen ka LEFT, lane 2 = screen ka RIGHT (camera +Z ki taraf dekhta hai,
  // isliye world X axis screen par ulta dikhta hai -> yahan pehle se sahi kar diya).
  LANES: [2.8, 0, -2.8],
  TRACK_LEN: 30,
  TRACK_SEGMENTS: 10,
  ENV_CHUNKS: 10,
  SPAWN_Z: 80,
  DESPAWN_Z: -14,

  GRAVITY: -0.017,
  JUMP_STRENGTH: 0.30,
  ROLL_TIME: 650,          // ms
  LANE_SMOOTH: 0.22,

  START_SPEED: 0.28,
  SCORE_FACTOR: 2,         // distance * factor = score
  COIN_SCORE: 10,

  STORAGE_KEY: 'metroRunnerIndia.v2',

  POWERUPS: {
    shield: { duration: 10, label: 'SHIELD', icon: '🛡️', color: 0x2bb5ff },
    magnet: { duration: 9,  label: 'MAGNET', icon: '🧲', color: 0xff3b5f },
    double: { duration: 12, label: 'x2',     icon: '✨', color: 0xffd166 }
  }
};

/* ===== MAUSAM (weather) =====
   sky:null  -> region ka apna sky. Manual mode mein player inme se chunta hai, Automatic mein region ka 'weather' lagta hai.
   Roshni (amb/key/fill) jaan-boojh kar halki rakhi hai taaki rang safed na hon aur objects saaf dikhein. */
MR.WEATHERS = {
  sunny:  { label: 'Dhoop',  icon: '☀️', sky: null,     fog: 0.0055, amb: [0xffffff, 0.55], key: [0xfff3d9, 0.90], fill: [0xcfe4ff, 0.30], sun: 1,
            cloud: { color: 0xffffff, opacity: 0.92, scale: 1.0 }, precip: { type: 'none', color: 0xffffff, opacity: 0, fall: 0, size: 0.06 } },
  cloudy: { label: 'Baadal', icon: '☁️', sky: 0xb4c4d2, fog: 0.0070, amb: [0xf2f5ff, 0.72], key: [0xe8eef8, 0.50], fill: [0xcfe4ff, 0.25], sun: 0,
            cloud: { color: 0xe2e8ee, opacity: 1.0, scale: 1.8 }, precip: { type: 'none', color: 0xffffff, opacity: 0, fall: 0, size: 0.06 } },
  rain:   { label: 'Barish', icon: '🌧️', sky: 0x9db0c0, fog: 0.0095, amb: [0xe6eefa, 0.70], key: [0xdde6f2, 0.38], fill: [0xbcd4ee, 0.25], sun: 0,
            cloud: { color: 0xbcc8d4, opacity: 1.0, scale: 2.0 }, precip: { type: 'rain', color: 0xd4e8ff, opacity: 0.55, fall: 1.1, size: 0.06 } },
  fog:    { label: 'Kohra',  icon: '🌫️', sky: 0xd2d6da, fog: 0.0200, amb: [0xffffff, 0.78], key: [0xf0f0f0, 0.34], fill: [0xe0e8f0, 0.20], sun: 0,
            cloud: { color: 0xe6eaee, opacity: 0.7, scale: 1.6 }, precip: { type: 'none', color: 0xffffff, opacity: 0, fall: 0, size: 0.06 } },
  dust:   { label: 'Dhool',  icon: '🌪️', sky: 0xe2cfa4, fog: 0.0120, amb: [0xfff0d6, 0.62], key: [0xffdcaa, 0.72], fill: [0xf0d8b0, 0.25], sun: 0.5,
            cloud: { color: 0xeadcc0, opacity: 0.8, scale: 1.4 }, precip: { type: 'dust', color: 0xe9d6ad, opacity: 0.35, fall: 0.12, size: 0.14 } },
  snow:   { label: 'Barf',   icon: '❄️', sky: 0xd6e2ec, fog: 0.0120, amb: [0xf0f6ff, 0.78], key: [0xeaf2ff, 0.50], fill: [0xc8dcf5, 0.25], sun: 0,
            cloud: { color: 0xeef3f8, opacity: 1.0, scale: 1.9 }, precip: { type: 'snow', color: 0xffffff, opacity: 0.9, fall: 0.26, size: 0.14 } },
  sunset: { label: 'Shaam',  icon: '🌇', sky: 0xf2a27c, fog: 0.0065, amb: [0xffe0c8, 0.50], key: [0xffb070, 0.85], fill: [0xc8a8ff, 0.30], sun: 1, sunCol: 0xff9a50,
            cloud: { color: 0xffc8a8, opacity: 0.9, scale: 1.1 }, precip: { type: 'none', color: 0xffffff, opacity: 0, fall: 0, size: 0.06 } }
};

/* ===== ILAAKE (states) =====
   kind: scenery ka type (city | rock | sand | coast | jungle | snow | mountain | slum)
   lanes[0..2]: left / beech / right raaste ka rang; detail[0..2]: surface ka design
   (paver | slab | tarmac | patch | ripple | rail); detailCol: us design ka rang.
   cam: camera ki height/doori/fov | outfit: is ilaake mein character ke kapde | bend: raasta kitna tedha-medha
   obs: is ilaake ke khaas obstacles (naam: weight) */
MR.CONFIG.CAM = { y: 3.9, z: -8.4, look: 1.0, fov: 60 };
MR.CONFIG.OUTFIT = { shirt: 0x00c2ff, cap: 0xff8a00, pants: 0x24324a };
MR.REGIONS = {
  maha: { state: 'MAHARASHTRA', label: 'Pathar ka raasta', kind: 'rock', weather: 'cloudy',
    sky: 0x9fd0f0, sun: 0xfff2b0, field: 0x8c7b66, foot: 0xb4a894, rock: 0x6f655c, leaf: 0x5a9a3a, bldA: 0xd9b38c, bldB: 0xcdbfa6,
    lanes: [0x8f8378, 0x6b6f73, 0x9a7b5a], detail: ['slab', 'tarmac', 'patch'], detailCol: [0x6a6057, 0xf2f2ee, 0x7a5c3e], gantry: 0.7,
    obs: { truck: 7, gypsy: 6 } },
  raj: { state: 'RAJASTHAN', label: 'Registan, ret par daud', kind: 'sand', weather: 'sunny',
    sky: 0x8fcdf2, sun: 0xfff0b8, field: 0xe3c386, foot: 0xe9d3a4, dune: 0xe8c88c, leaf: 0x8a9a3a, bldA: 0xe9a860, bldB: 0xf0c27a,
    lanes: [0xdcb878, 0xb9a070, 0xd8b680], detail: ['ripple', 'patch', 'ripple'], detailCol: [0xc79f5c, 0x8f7a50, 0xc79f5c], gantry: 0.6,
    outfit: { shirt: 0xf4ecd8, cap: 0xe0562a, pants: 0xf4ecd8 }, obs: { camel: 13, truck: 6, thar: 5 } },
  kerala: { state: 'KERALA', label: 'Samundar kinara', kind: 'coast', weather: 'rain',
    sky: 0x8fd4e8, sun: 0xfff2b0, field: 0xe8d9a8, foot: 0xd8cdb0, sea: 0x2f9fd6, leaf: 0x2f9a4a, bldA: 0xf4b6a0, bldB: 0xa8d8c0, fogMul: 1.1,
    lanes: [0xe6d2a0, 0x6a6e72, 0x8a8580], detail: ['patch', 'tarmac', 'rail'], detailCol: [0xcdb982, 0xf5f5f0, 0x7a5a3a], gantry: 0.7,
    outfit: { shirt: 0xffffff, cap: 0xf2c21e, pants: 0xf6f6f0 }, obs: { sunbather: 10, sitters: 9, bus: 3 } },
  ne: { state: 'NORTH EAST', label: 'Jungle ki bus road', kind: 'jungle', weather: 'fog', bend: 0.0004,
    sky: 0x9fd8b8, sun: 0xfff2b0, field: 0x3f7a34, foot: 0x6a7a44, leaf: 0x2f8a3a, leaf2: 0x4fa84a, bldA: 0xc89a6a, bldB: 0x9ab87a, fogMul: 0.9,
    lanes: [0x73756d, 0x686a63, 0x73756d], detail: ['tarmac', 'tarmac', 'tarmac'], detailCol: [0xf2f2ee, 0xf2c21e, 0xf2f2ee], gantry: 0.4,
    cam: { y: 3.4, z: -7.8 }, outfit: { shirt: 0x3f8f5a, cap: 0x9a6a3a, pants: 0x3a4a3a }, obs: { log: 10, machaan: 8, bus: 9 } },
  slum: { state: 'MUMBAI', label: 'Basti ki tedhi-medhi gali', kind: 'slum', weather: 'cloudy', bend: 0.0012,
    sky: 0xaabdc9, sun: 0xfff2b0, field: 0x8f7d68, foot: 0x9a9086, leaf: 0x5a8a3a, bldA: 0xc8704a, bldB: 0x4a90c8,
    lanes: [0x7d6a52, 0x6a5f55, 0x76624c], detail: ['patch', 'patch', 'patch'], detailCol: [0x5e4a36, 0x8a8478, 0x5a6a42], gantry: 0.3,
    cam: { y: 3.5, z: -7.6, look: 0.9, fov: 62 }, outfit: { shirt: 0xb8b8b8, cap: 0x8a7a6a, pants: 0x4a5a6a },
    obs: { drain: 13, washer: 10, dog: 10, clothesline: 11, auto: 4 } },
  delhi: { state: 'DELHI', label: 'Traffic ka chaos', kind: 'city', weather: 'dust',
    sky: 0xcfdce6, sun: 0xffe9b0, field: 0xb9a878, foot: 0xd4c8b0, leaf: 0x7aa04a, bldA: 0xa9c4d8, bldB: 0xe0b98a,
    lanes: [0xc8704a, 0x6e7074, 0x8a8580], detail: ['paver', 'tarmac', 'rail'], detailCol: [0xa65a38, 0xf5f5f0, 0x7a5a3a], gantry: 0.85,
    obs: { gypsy: 6, thar: 6, truck: 5 } },
  gujarat: { state: 'GUJARAT', label: 'Rann ka safed namak', kind: 'sand', weather: 'sunny',
    sky: 0x86c8f0, sun: 0xfff6c8, field: 0xf0ece0, foot: 0xe8e2d0, dune: 0xf4f0e6, leaf: 0x9aa84a, bldA: 0xf0b8c8, bldB: 0xf6e0a0,
    lanes: [0xe6e0d0, 0x8a8c90, 0xd8c8a8], detail: ['ripple', 'tarmac', 'patch'], detailCol: [0xcfc8b4, 0xf5f5f0, 0xb89c70], gantry: 0.6,
    outfit: { shirt: 0xd6567a, cap: 0xf2c21e, pants: 0xf4ecd8 }, obs: { camel: 8, truck: 7, thar: 5 } },
  goa: { state: 'GOA', label: 'Beach ki shaam', kind: 'coast', weather: 'sunset',
    sky: 0xf2a27c, sun: 0xff9a50, field: 0xeed9a8, foot: 0xe6d0b0, sea: 0x3fa8d8, leaf: 0x2fb060, bldA: 0xf08a9a, bldB: 0xf8c860,
    lanes: [0xe8d4a4, 0x707478, 0x8a8580], detail: ['patch', 'tarmac', 'rail'], detailCol: [0xcdb982, 0xf5f5f0, 0x7a5a3a], gantry: 0.7,
    outfit: { shirt: 0xff8a5a, cap: 0xffffff, pants: 0x3fa8d8 }, obs: { sunbather: 10, sitters: 8, thar: 7, gypsy: 5 } },
  uk: { state: 'UTTARAKHAND', label: 'Pahadi mod', kind: 'snow', snow: false, weather: 'sunny', bend: 0.0007,
    sky: 0x8ccbf0, sun: 0xfff2b0, field: 0x6a9a4a, foot: 0xa8a08a, leaf: 0x2f7a4a, bldA: 0xe0c09a, bldB: 0xc88a5a,
    lanes: [0x9a8a70, 0x6c6e72, 0x8a7a5e], detail: ['slab', 'tarmac', 'patch'], detailCol: [0x7a6c56, 0xf2f2ee, 0x6a5a40], gantry: 0.5,
    outfit: { shirt: 0x3a6fd6, cap: 0xd04a4a, pants: 0x3a4a6a }, obs: { truck: 8, thar: 6, log: 5, bus: 5 } },
  kashmir: { state: 'KASHMIR', label: 'Barf par daud', kind: 'snow', snow: true, weather: 'snow',
    sky: 0xc6dcf0, sun: 0xffffff, field: 0xeef3f8, foot: 0xdfe8f0, leaf: 0x2f6b4a, bldA: 0xc8a070, bldB: 0x9a7048,
    lanes: [0xe4edf5, 0x8fa0b0, 0xc4d8ec], detail: ['patch', 'tarmac', 'patch'], detailCol: [0xb8c8d8, 0xf5f8fc, 0x9fbad4], gantry: 0.5,
    cam: { y: 4.1 }, outfit: { shirt: 0xc0392b, cap: 0xf4f4f4, pants: 0x5a5a66 }, obs: { thar: 8, truck: 7 } },
  ladakh: { state: 'LADAKH', label: 'Pahad ka raasta', kind: 'mountain', weather: 'sunny', bend: 0.0005,
    sky: 0x6fb0ea, sun: 0xffffff, field: 0xb59a78, foot: 0xc8b496, rock: 0x8a7a68, leaf: 0x8a9a4a, bldA: 0xf4f0e8, bldB: 0xb04a3a, fogMul: 0.6,
    lanes: [0xb8a080, 0x76787c, 0xa3866a], detail: ['patch', 'tarmac', 'slab'], detailCol: [0x8a7458, 0xf2f2ee, 0x7a6450], gantry: 0.35,
    cam: { y: 4.3, z: -9.0, look: 1.2 }, outfit: { shirt: 0x8a2f3a, cap: 0xf2c21e, pants: 0x3a4a5a }, obs: { truck: 9, thar: 8 } }
};
Object.keys(MR.REGIONS).forEach(k => {
  const r = MR.REGIONS[k];
  r.key = k;
  r.cam = Object.assign({}, MR.CONFIG.CAM, r.cam || {});
  r.outfit = Object.assign({}, MR.CONFIG.OUTFIT, r.outfit || {});
  r.bend = r.bend || 0;
});

/* ===== LEVELS: 11 levels, har level ka alag ilaaka. Score badhne par speed, obstacle ki bheed,
   double-obstacle chance badhte jaate hain. Naya level: yahan ek key aur 'from' jodo. */
(function () {
  const order = ['maha', 'raj', 'kerala', 'ne', 'slum', 'delhi', 'gujarat', 'goa', 'uk', 'kashmir', 'ladakh'];
  const from  = [0, 1200, 2600, 4200, 6000, 8000, 10200, 12600, 15200, 18000, 21000];
  const chaseOn = { 0: true, 2: true, 5: true, 7: true, 9: true, 10: true };
  const n = order.length - 1;
  MR.LEVELS = order.map((key, i) => {
    const t = i / n;                       // 0 (aasaan) -> 1 (sabse mushkil)
    const rg = MR.REGIONS[key];
    const w = {
      jump: Math.round(26 - 12 * t), roll: Math.round(20 - 8 * t), block: Math.round(18 - 3 * t),
      spinner: Math.round(8 + 10 * t), auto: Math.round(18 + 4 * t),
      train: Math.round(4 + 14 * t), cow: i === 0 ? 0 : Math.round(8 + 8 * t)
    };
    if (!rg.detail.includes('rail')) w.train = 0;          // train sirf wahan jahan patri hai
    if (rg.kind === 'sand') w.cow = 0;                     // registan mein gaay ki jagah camel
    if (rg.kind === 'slum') { w.jump = Math.round(w.jump * 0.4); w.roll = Math.round(w.roll * 0.4); w.spinner = 0; w.block = Math.round(w.block * 0.5); w.auto = Math.round(w.auto * 0.25); }
    Object.keys(rg.obs || {}).forEach(k => { w[k] = (w[k] || 0) + Math.round(rg.obs[k] * (0.7 + 0.6 * t)); });
    return {
      name: rg.state + ' • ' + rg.label.toUpperCase(),
      region: key, from: from[i],
      minSpeed: +(0.28 + 0.40 * t).toFixed(3),
      maxSpeed: +(0.55 + 0.38 * t).toFixed(3),
      gap: +(1.0 - 0.36 * t).toFixed(2),
      doubleChance: +(0.0 + 0.65 * t).toFixed(2),
      weights: w,
      chase: chaseOn[i] ? (i === 0 ? { from: 0, to: 300 } : { from: from[i] + 300, to: from[i] + 650 }) : null
    };
  });
})();

/* Police pakad: kitni baar pakde jaane par game over (pehli aur doosri baar sirf detain + countdown) */
MR.CONFIG.MAX_BUSTS = 3;
MR.CONFIG.DETAIN_SECONDS = 5;

MR.AD_DATA = [
  { text: 'SASTA MILK 🥛',        color: '#FFD700' },
  { text: '20 KE 10 BHAII! 🥚',   color: '#FF4500' },
  { text: '100 KE 5 🍌! SALE ✨', color: '#32CD32' },
  { text: 'NEW SNEAKERS 👟⚡!',   color: '#1E90FF' },
  { text: 'SHAADI SALE 💍 50% OFF', color: '#FF69B4' },
  { text: 'DOODH JALEBI 😋 SPECIAL', color: '#FFA500' },
  { text: 'MELA! JHULA 🎡 SHAAM 6 BAJE', color: '#9370DB' },
  { text: 'COACHING: 100% SELECTION*', color: '#20B2AA' }
];
