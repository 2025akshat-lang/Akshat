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

/* Har level ki theme + difficulty.
   weights: kaun sa obstacle kitni baar aayega (relative). */
MR.LEVELS = [
  {
    name: 'MUMBAI SUBAH', from: 0,
    minSpeed: 0.28, maxSpeed: 0.55, gap: 1.0, doubleChance: 0.0,
    weights: { jump: 25, roll: 20, block: 20, spinner: 10, auto: 20, train: 5, cow: 0 },
    chase: { from: 0, to: 300 },
    theme: {
      bg: 0x9fd3f2, fogDensity: 0.006, ground: 0x9bb36a, wall: 0xcfc5b2,
      bldA: 0xe8a0b4, bldB: 0xf2d27a, leaf: 0x3fae5a, sun: 0xfff2b0,
      ambient: [0xffffff, 0.9], key: [0xfff1d0, 1.25], fill: [0xbfe0ff, 0.55],
      weather: { type: 'none', color: 0xffffff, opacity: 0.0, fall: 0 }
    }
  },
  {
    name: 'DELHI TRAFFIC CHAOS', from: 1200,
    minSpeed: 0.36, maxSpeed: 0.65, gap: 0.95, doubleChance: 0.15,
    weights: { jump: 15, roll: 12, block: 15, spinner: 10, auto: 22, train: 10, cow: 16 },
    chase: { from: 1500, to: 1850 },
    theme: {
      bg: 0xd8d0b8, fogDensity: 0.011, ground: 0xb9a878, wall: 0xd4c8b0,
      bldA: 0xa9c4d8, bldB: 0xe0b98a, leaf: 0x8aa84a, sun: 0xffe9b0,
      ambient: [0xfff0d6, 0.9], key: [0xffe2a8, 1.1], fill: [0xd8d8d8, 0.55],
      weather: { type: 'dust', color: 0xd8c8a8, opacity: 0.3, fall: 0.15 }
    }
  },
  {
    name: 'KOLKATA SHAAM', from: 3000,
    minSpeed: 0.45, maxSpeed: 0.75, gap: 0.9, doubleChance: 0.3,
    weights: { jump: 14, roll: 14, block: 14, spinner: 14, auto: 14, train: 18, cow: 12 },
    chase: null,
    theme: {
      bg: 0xf0b98a, fogDensity: 0.007, ground: 0x9fae6a, wall: 0xd8c4a8,
      bldA: 0xd9a0c8, bldB: 0xf0c080, leaf: 0x4fa86a, sun: 0xffc070,
      ambient: [0xffe0c8, 0.85], key: [0xffb870, 1.2], fill: [0xc8a8ff, 0.5],
      weather: { type: 'rain', color: 0xd0e4ff, opacity: 0.4, fall: 1.0 }
    }
  },
  {
    name: 'RAJASTHAN DESERT DASH', from: 5500,
    minSpeed: 0.55, maxSpeed: 0.82, gap: 0.88, doubleChance: 0.4,
    weights: { jump: 14, roll: 12, block: 16, spinner: 16, auto: 10, train: 18, cow: 14 },
    chase: { from: 5700, to: 6100 },
    theme: {
      bg: 0xf5d08a, fogDensity: 0.007, ground: 0xdcb878, wall: 0xe8d0a0,
      bldA: 0xe9a860, bldB: 0xf0c27a, leaf: 0x9aaa3a, sun: 0xfff0c0,
      ambient: [0xfff4dc, 0.95], key: [0xffe0a8, 1.15], fill: [0xffe8c0, 0.5],
      weather: { type: 'dust', color: 0xeed0a0, opacity: 0.4, fall: 0.1 }
    }
  },
  {
    name: 'GOA SUNSET BEACH', from: 9000,
    minSpeed: 0.62, maxSpeed: 0.92, gap: 0.85, doubleChance: 0.5,
    weights: { jump: 14, roll: 14, block: 14, spinner: 16, auto: 12, train: 18, cow: 12 },
    chase: null,
    theme: {
      bg: 0xffa87a, fogDensity: 0.006, ground: 0xe6cf98, wall: 0xe8c8b0,
      bldA: 0xf08a9a, bldB: 0xf8b860, leaf: 0x3fcf81, sun: 0xff9a50,
      ambient: [0xffe0c8, 0.9], key: [0xffc888, 1.2], fill: [0xff9fc5, 0.55],
      weather: { type: 'none', color: 0xffffff, opacity: 0.0, fall: 0 }
    }
  }
];

/* Police pakad: kitni baar pakde jaane par game over (pehli aur doosri baar sirf detain + countdown) */
MR.CONFIG.MAX_BUSTS = 3;
MR.CONFIG.DETAIN_SECONDS = 5;

MR.AD_DATA = [
  { text: 'SASTA MILK 🥛',        color: '#FFD700' },
  { text: '20 KE 10 BHAII! 🥚',   color: '#FF4500' },
  { text: '100 KE 5 🍌! SALE ✨', color: '#32CD32' },
  { text: 'NEW SNEAKERS 👟⚡!',   color: '#1E90FF' }
];
