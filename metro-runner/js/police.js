/* ===== police.js : police jeep ka peecha karna (chase) =====
   Chase ke dauran soft obstacle (barrier/tunnel/spinner) se takrane par player "stumble" karta hai
   aur jeep kareeb aa jaati hai. Jeep pakad le to BUSTED = game over. */
(function () {
  let jeep = null, active = false;
  let closeness = 0;            // 0 = door, 1 = pakda gaya
  const FAR_Z = -9, NEAR_Z = -2.4;

  const Police = {
    init(scene) {
      jeep = MR.Models.policeJeep();
      jeep.position.set(0, 0, -14);
      jeep.visible = false;
      scene.add(jeep);
    },

    reset() {
      active = false; closeness = 0;
      jeep.visible = false; jeep.position.set(0, 0, -14);
      MR.Audio.stopSiren();
    },

    get active() { return active; },

    setActive(on) {
      if (on === active) return;
      active = on;
      jeep.visible = on;
      if (on) { closeness = 0.15; MR.Audio.startSiren(); }
      else { MR.Audio.stopSiren(); }
    },

    // Return true agar pakda gaya
    stumble() {
      closeness += 0.45;
      return closeness >= 1;
    },

    // Detain ke baad: jeep wapas peeche, chase dobara shuru se
    pushBack() {
      closeness = 0.15;
      jeep.position.set(jeep.position.x, 0, -14);
    },

    // Detain scene ke dauran sirf jeep ki lights chamkao (jeep player ke peeche khadi rehti hai)
    flash(time) {
      if (!active) return;
      jeep.userData.lightBar.material.color.setHex(Math.sin(time * 20) > 0 ? 0xff3355 : 0x33a1ff);
      jeep.userData.lightBar.material.emissive.setHex(Math.sin(time * 20) > 0 ? 0xff0000 : 0x0044ff);
    },

    update(k, speed, time, playerX) {
      if (!active) return false;
      closeness = Math.max(0, closeness - 0.0016 * k);      // dheere dheere peeche hat-ti hai
      const targetZ = FAR_Z + (NEAR_Z - FAR_Z) * Math.min(1, closeness);
      jeep.position.z += (targetZ - jeep.position.z) * Math.min(1, 0.06 * k);
      jeep.position.x += (playerX - jeep.position.x) * Math.min(1, 0.06 * k);
      jeep.userData.lightBar.material.color.setHex(Math.sin(time * 20) > 0 ? 0xff3355 : 0x33a1ff);
      jeep.userData.lightBar.material.emissive.setHex(Math.sin(time * 20) > 0 ? 0xff0000 : 0x0044ff);
      jeep.position.y = Math.sin(time * 18) * 0.02;
      return closeness >= 1;
    }
  };

  MR.Police = Police;
})();
