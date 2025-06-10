
var scenePlay = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "scenePlay" });
  },

  preload: function () {
    this.load.image("chara", "assets/images/chara.png");
    this.load.image("fg_loop_back", "assets/images/fg_loop_back.png");
    this.load.image("fg_loop", "assets/images/fg_loop.png");
    this.load.image("obst", "assets/images/obstc.png");
    this.load.image("panel_skor", "assets/images/panel_skor.png");
    this.load.audio("snd_dead", "assets/audio/dead.mp3");
    this.load.audio("snd_klik_1", "assets/audio/klik_1.mp3");
    this.load.audio("snd_klik_2", "assets/audio/klik_2.mp3");
    this.load.audio("snd_klik_3", "assets/audio/klik_3.mp3");
  },

  create: function () {
    this.snd_dead = this.sound.add("snd_dead");
    this.snd_click = [
      this.sound.add("snd_klik_1"),
      this.sound.add("snd_klik_2"),
      this.sound.add("snd_klik_3")
    ];
    this.snd_click.forEach(s => s.setVolume(0.5));

    this.timerHalangan = 0;
    this.halangan = [];
    this.background = [];
    this.isGameRunning = false;

    this.chara = this.add.image(130, 768 / 2, "chara").setDepth(3).setScale(0);

    let bg_x = 1366 / 2;
    for (let i = 0; i < 2; i++) {
      const bg_back = this.add.image(bg_x, 768 / 2, "fg_loop_back").setData("kecepatan", 1);
      const bg_front = this.add.image(bg_x, 768 / 2, "fg_loop").setData("kecepatan", 2).setDepth(2);
      this.background.push([bg_back, bg_front]);
      bg_x += 1366;
    }

    this.tweens.add({
      targets: this.chara,
      delay: 250,
      ease: "Back.Out",
      duration: 900,
      scaleX: 1,
      scaleY: 1,
      onComplete: () => {
        this.isGameRunning = true;
      }
    });

    this.score = 0;
    this.panel_score = this.add.image(1024 / 2, 60, "panel_skor").setOrigin(0.5).setDepth(10).setAlpha(0.8);
    this.label_score = this.add.text(this.panel_score.x + 25, this.panel_score.y, this.score)
      .setOrigin(0.5).setDepth(10).setFontSize(30).setTint(0xff732e);

    // Tambahkan input keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    this.gameOver = () => {
      let highScore = localStorage["highscore"] || 0;
      if (this.score > highScore) localStorage["highscore"] = this.score;
      this.scene.start("sceneMenu");
    };
  },

  update: function () {
    if (!this.isGameRunning) return;

    // Kontrol keyboard
    if (this.cursors.up.isDown) {
      this.chara.y -= 3;
      this.snd_click[Math.floor(Math.random() * 3)].play();
    } else if (this.cursors.down.isDown) {
      this.chara.y += 3;
      this.snd_click[Math.floor(Math.random() * 3)].play();
    }

    if (this.chara.y > 690) this.chara.y = 690;
    if (this.chara.y < 0) this.chara.y = 0;

    for (let bg of this.background) {
      for (let layer of bg) {
        layer.x -= layer.getData("kecepatan");
        if (layer.x < -1366 / 2) {
          layer.x += 1366 * 2;
        }
      }
    }

    if (this.timerHalangan === 0) {
      let acak_y = Math.floor(Math.random() * 680) + 60;
      let halangan = this.add.image(1500, acak_y, "obst").setOrigin(0.5).setDepth(5);
      halangan.setData("status_aktif", true);
      halangan.setData("kecepatan", Math.floor(Math.random() * 8) + 5);
      this.halangan.push(halangan);
      this.timerHalangan = Math.floor(Math.random() * 50) + 10;
    } else {
      this.timerHalangan--;
    }

    for (let i = this.halangan.length - 1; i >= 0; i--) {
      let h = this.halangan[i];
      h.x -= h.getData("kecepatan");
      if (h.x < -200) {
        h.destroy();
        this.halangan.splice(i, 1);
        continue;
      }

      if (this.chara.x > h.x + 60 && h.getData("status_aktif")) {
        h.setData("status_aktif", false);
        this.score++;
        this.label_score.setText(this.score);
      }

      if (this.chara.getBounds().contains(h.x, h.y)) {
        this.isGameRunning = false;
        this.snd_dead.play();
        this.tweens.add({
          targets: this.chara,
          ease: "Elastic.easeOut",
          duration: 2000,
          alpha: 0,
          onComplete: this.gameOver
        });
        break;
      }
    }

    if (this.chara.y < -50) {
      this.isGameRunning = false;
      this.snd_dead.play();
      this.tweens.add({
        targets: this.chara,
        ease: "Elastic.easeOut",
        duration: 2000,
        alpha: 0,
        onComplete: this.gameOver
      });
    }
  }
});
