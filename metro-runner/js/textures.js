/* ===== textures.js : canvas se banne wale saare textures (shared, ek hi baar) ===== */
(function () {
  function canvasTex(w, h, draw) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    return t;
  }

  function symbol(sym, color, bg) {
    return canvasTex(128, 128, (ctx) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = '#ffffff33'; ctx.strokeRect(2, 2, 124, 124);
      ctx.font = 'bold 74px Arial'; ctx.fillStyle = color;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(sym, 64, 67);
    });
  }

  function poster(l1, l2, c1, c2) {
    return canvasTex(256, 384, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 256, 384);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 384);
      ctx.strokeStyle = '#ffffffcc'; ctx.lineWidth = 8; ctx.strokeRect(10, 10, 236, 364);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff'; ctx.font = 'bold 34px Arial'; ctx.fillText(l1, 128, 150);
      ctx.fillStyle = '#ffeaa7'; ctx.font = 'bold 28px Arial'; ctx.fillText(l2, 128, 205);
      ctx.fillStyle = 'rgba(90,90,90,0.25)'; ctx.fillRect(20, 290, 216, 52);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Arial'; ctx.fillText('CITY VIBES', 128, 323);
    });
  }

  // Billboard: har ad ka apna alag texture (purane code mein sab posters ek hi texture share karte the = bug)
  function ad(a) {
    return canvasTex(512, 256, (ctx, w, h) => {
      ctx.fillStyle = a.color; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(110,110,110,0.6)'; ctx.lineWidth = 10; ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.fillStyle = '#4a4a4a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let size = 64;
      ctx.font = 'bold ' + size + 'px Arial';
      while (ctx.measureText(a.text).width > w - 50 && size > 20) {
        size -= 4; ctx.font = 'bold ' + size + 'px Arial';
      }
      ctx.fillText(a.text, w / 2, h / 2);
    });
  }

  function label(text, color) {
    return canvasTex(256, 128, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = 'bold 90px Arial'; ctx.fillStyle = color;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#6a6a6a'; ctx.lineWidth = 8;
      ctx.strokeText(text, w / 2, h / 2); ctx.fillText(text, w / 2, h / 2);
    });
  }

  // Politician poster (fictional netaji + fictional party) - namaste wala classic Indian poster
  function neta(name, party, slogan, c1, c2, capCol) {
    return canvasTex(256, 384, (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 384);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 384);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.strokeRect(8, 8, 240, 368);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px Arial'; ctx.fillText(party, 128, 38);
      // kurta
      ctx.fillStyle = '#f7f3ea'; ctx.beginPath();
      ctx.moveTo(48, 300); ctx.quadraticCurveTo(128, 170, 208, 300); ctx.lineTo(208, 312); ctx.lineTo(48, 312); ctx.fill();
      // chehra
      ctx.fillStyle = '#d9a073'; ctx.beginPath(); ctx.arc(128, 130, 44, 0, Math.PI * 2); ctx.fill();
      // topi
      ctx.fillStyle = capCol; ctx.beginPath(); ctx.moveTo(82, 112); ctx.lineTo(174, 112); ctx.lineTo(160, 82); ctx.lineTo(96, 82); ctx.fill();
      // aankhein + moonchh + tilak
      ctx.fillStyle = '#5a5a5a'; ctx.fillRect(108, 128, 8, 5); ctx.fillRect(140, 128, 8, 5);
      ctx.fillRect(104, 150, 48, 7);
      ctx.fillStyle = '#e04040'; ctx.fillRect(125, 108, 6, 12);
      // haath jode hue (namaste)
      ctx.fillStyle = '#d9a073'; ctx.beginPath(); ctx.ellipse(128, 222, 15, 24, 0, 0, Math.PI * 2); ctx.fill();
      // naam + slogan
      ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(18, 318, 220, 52);
      ctx.fillStyle = '#6a3a1a'; ctx.font = 'bold 19px Arial'; ctx.fillText(name, 128, 340);
      ctx.fillStyle = '#c0392b'; ctx.font = 'bold 14px Arial'; ctx.fillText(slogan, 128, 360);
    });
  }

  function fishSign() {
    return canvasTex(256, 128, (ctx, w, h) => {
      ctx.fillStyle = '#2f8fd6'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.strokeRect(5, 5, w - 10, h - 10);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 40px Arial'; ctx.fillText('MACHHLI 🐟', w / 2, 40);
      ctx.fillStyle = '#ffe066'; ctx.font = 'bold 44px Arial'; ctx.fillText('10 KE 4!', w / 2, 90);
    });
  }

  function shopSign(text, bg) {
    return canvasTex(256, 96, (ctx, w, h) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let size = 40; ctx.font = 'bold ' + size + 'px Arial';
      while (ctx.measureText(text).width > w - 30 && size > 16) { size -= 2; ctx.font = 'bold ' + size + 'px Arial'; }
      ctx.fillText(text, w / 2, h / 2);
    });
  }

  // Raaste ke upar tangne wale CHAUDE banners (gantry). 1024x300
  function bannerNeta(name, party, slogan, c1, c2, capCol) {
    return canvasTex(1024, 300, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, c1); g.addColorStop(0.5, c2); g.addColorStop(1, c1);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.strokeRect(8, 8, w - 16, h - 16);
      function face(cx) {
        ctx.fillStyle = '#f7f3ea'; ctx.beginPath();
        ctx.moveTo(cx - 95, 292); ctx.quadraticCurveTo(cx, 170, cx + 95, 292); ctx.fill();          // kurta
        ctx.fillStyle = '#d9a073'; ctx.beginPath(); ctx.arc(cx, 130, 62, 0, Math.PI * 2); ctx.fill(); // chehra
        ctx.fillStyle = capCol; ctx.beginPath();                                                       // topi
        ctx.moveTo(cx - 62, 108); ctx.lineTo(cx + 62, 108); ctx.lineTo(cx + 44, 62); ctx.lineTo(cx - 44, 62); ctx.fill();
        ctx.fillStyle = '#5a5a5a'; ctx.fillRect(cx - 28, 128, 12, 7); ctx.fillRect(cx + 16, 128, 12, 7);
        ctx.fillRect(cx - 32, 158, 64, 9);                                                             // moonchh
        ctx.fillStyle = '#e04040'; ctx.fillRect(cx - 4, 96, 8, 16);                                    // tilak
        ctx.fillStyle = '#d9a073'; ctx.beginPath(); ctx.ellipse(cx, 238, 20, 32, 0, 0, Math.PI * 2); ctx.fill(); // namaste
      }
      face(130); face(w - 130);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Arial'; ctx.fillText(party, w / 2, 62);
      ctx.fillStyle = 'rgba(255,255,255,0.93)'; ctx.fillRect(250, 84, w - 500, 92);
      ctx.fillStyle = '#6a3a1a'; ctx.font = 'bold 50px Arial'; ctx.fillText(name, w / 2, 148);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 40px Arial'; ctx.fillText(slogan, w / 2, 224);
      ctx.fillStyle = '#ffeaa7'; ctx.font = 'bold 30px Arial'; ctx.fillText('★ VOTE KARO ★', w / 2, 270);
    });
  }

  function bannerAd(a) {
    return canvasTex(1024, 300, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, a.color); g.addColorStop(1, '#ffffff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(80 + i * 170, i % 2 ? 40 : 260, 46, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.fillStyle = '#4a4a4a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let size = 100; ctx.font = 'bold ' + size + 'px Arial';
      while (ctx.measureText(a.text).width > w - 90 && size > 24) { size -= 4; ctx.font = 'bold ' + size + 'px Arial'; }
      ctx.fillText(a.text, w / 2, h / 2 - 8);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Arial'; ctx.fillText('★ LIMITED OFFER ★  AAJ HI AAIYE ★', w / 2, h - 34);
    });
  }

  function signBoard(l1, l2, bg, w, h) {
    return canvasTex(w, h, (ctx, W, H) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.strokeRect(4, 4, W - 8, H - 8);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const two = !!l2;
      let size = two ? Math.floor(H * 0.34) : Math.floor(H * 0.5);
      ctx.font = 'bold ' + size + 'px Arial';
      while (ctx.measureText(l1).width > W - 24 && size > 12) { size -= 2; ctx.font = 'bold ' + size + 'px Arial'; }
      ctx.fillText(l1, W / 2, two ? H * 0.32 : H / 2);
      if (two) {
        ctx.fillStyle = '#ffe066'; size = Math.floor(H * 0.34); ctx.font = 'bold ' + size + 'px Arial';
        while (ctx.measureText(l2).width > W - 24 && size > 12) { size -= 2; ctx.font = 'bold ' + size + 'px Arial'; }
        ctx.fillText(l2, W / 2, H * 0.72);
      }
    });
  }

  MR.Tex = {
    up:   symbol('▲', '#ff9900', '#5a4a3a'),
    down: symbol('▼', '#e879f9', '#554a5e'),
    side: symbol('◄►', '#ff5570', '#5e4a4e'),
    x2:   label('x2', '#ffd166'),
    posters: [
      poster('MUMBAI', 'STREET FEST', '#ff7a00', '#ffb347'),
      poster('DELHI', 'METRO RAPID', '#00b4d8', '#0077b6'),
      poster('KOLKATA', 'NIGHT MARKET', '#9b5de5', '#5a189a'),
      poster('CHAI TIME', 'CUTTING SPECIAL', '#43aa8b', '#2d6a4f'),
      poster('AUTO RIDES', 'CITY EXPRESS', '#f8961e', '#f3722c')
    ],
    ads: MR.AD_DATA.map(ad),
    netas: [
      neta('SHRI BHOLA PRASAD', 'JANTA VIKAS DAL', 'VOTE DO, KAAM LO!', '#ff9933', '#f7c873', '#ffffff'),
      neta('SHRI RAMLAL YADAV', 'AAM AADMI MORCHA', 'HAATH KA SAATH', '#3fae5a', '#a8e0b0', '#f7f3ea'),
      neta('SHRI KISHAN VERMA', 'NAV BHARAT SANGH', 'SABKA SAATH SABKA VIKAS', '#3a8fd6', '#a8d4f5', '#ffb347'),
      neta('SMT. SUNITA DEVI', 'GRAMIN KRANTI PARTY', 'NARI SHAKTI ZINDABAD', '#d6567a', '#f5b8cc', '#ffffff')
    ],
    netaBanners: [
      bannerNeta('SHRI BHOLA PRASAD', 'JANTA VIKAS DAL', 'VOTE DO, KAAM LO!', '#ff9933', '#f7c873', '#ffffff'),
      bannerNeta('SHRI RAMLAL YADAV', 'AAM AADMI MORCHA', 'HAATH KA SAATH', '#3fae5a', '#a8e0b0', '#f7f3ea'),
      bannerNeta('SHRI KISHAN VERMA', 'NAV BHARAT SANGH', 'SABKA SAATH SABKA VIKAS', '#3a8fd6', '#a8d4f5', '#ffb347'),
      bannerNeta('SMT. SUNITA DEVI', 'GRAMIN KRANTI PARTY', 'NARI SHAKTI ZINDABAD', '#d6567a', '#f5b8cc', '#ffffff')
    ],
    adBanners: MR.AD_DATA.map(bannerAd),
    fishSign: fishSign(),
    kapdeSign: signBoard('KAPDE 👕👗', '150 KE 2!', '#d6567a', 256, 128),
    kabadiSign: signBoard('KABADI WALA', 'PURANA SAMAAN', '#8a6a3a', 256, 128),
    truckSign: signBoard('HORN OK PLEASE', '', '#d6402a', 256, 64),
    busSign: signBoard('STATE TRANSPORT', '', '#2f6fd6', 256, 64),
    shopSigns: [
      shopSign('CHAI SUTTA BAR', '#c0562a'), shopSign('KIRANA STORE', '#2f8f5a'),
      shopSign('PAAN SHOP', '#8a4fbf'), shopSign('MOBILE REPAIR', '#2f7fbf'),
      shopSign('HOTEL DHABA', '#bf8a2f')
    ]
  };
})();
