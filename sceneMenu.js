
var SceneMenu = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function () {
    Phaser.Scene.call(this, { key: "sceneMenu" });
  },
  preload() {
    this.load.image("bg_start", "assets/images/bg_start.png");
    this.load.image("btn_play", "assets/images/btn_play.png");
    this.load.image("title_game", "assets/images/title_game.png");
    this.load.image("panel_skor", "assets/images/panel_skor.png");
    this.load.audio("snd_ambience", "assets/audio/ambience.mp3");
    this.load.audio("snd_touch", "assets/audio/touch.mp3");
    this.load.audio("snd_transisi_menu", "assets/audio/transisi_menu.mp3");
    this.load.spritesheet("sps_mummy", "assets/sprite/mummy37x45.png", {
      frameWidth: 37,
      frameHeight: 45
    });
  },
  create() {
    X_POSITION = {
      LEFT: 0,
      CENTER: game.canvas.width / 2,
      RIGHT: game.canvas.width
    };
    Y_POSITION = {
      TOP: 0,
      CENTER: game.canvas.height / 2,
      BOTTOM: game.canvas.height
    };

    if (snd_ambience == null) {
      snd_ambience = this.sound.add("snd_ambience");
      snd_ambience.loop = true;
      snd_ambience.setVolume(0.35);
    }

      // Mengisikan variabel global dengan musik latar jika belum diatur
      if (snd_ambience == null) {
          snd_ambience = this.sound.add('snd_ambience');
          snd_ambience.loop = true;
          snd_ambience.setVolume(0.35);
          snd_ambience.play();
      }
  
      // Membuat variabel sound lain
      this.snd_touch = this.sound.add('snd_touch');
      var snd_transisi = this.sound.add('snd_transisi_menu');
  
      // Variabel untuk menyimpan skor tertinggi
      var skorTertinggi = localStorage['highscore'] || 0;
  
      // Menambahkan background ke dalam scene
      this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'bg_start');
  
      // Menambahkan sprite tombol Play ke dalam scene
      var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'btn_play');
      btnPlay.setDepth(10);
      btnPlay.setInteractive();
  
      // Menambahkan judul game
      this.titleGame = this.add.image(1024 / 2, 200, 'title_game');
      this.titleGame.setDepth(10);
      this.titleGame.y -= 384;
  
      // Membuat panel nilai
      var panelSkor = this.add.image(1024 / 2, 768 - 120, 'panel_skor');
      panelSkor.setOrigin(0.5);
      panelSkor.setDepth(10);
      panelSkor.setAlpha(0.8);
  
      // Membuat label skor pada panel
      var lblSkor = this.add.text(panelSkor.x + 25, panelSkor.y, "High Score : " + skorTertinggi);
      lblSkor.setOrigin(0.5);
      lblSkor.setDepth(10);
      lblSkor.setFontSize(27);
      lblSkor.setTint(0xff732e);

      mummy = this.add.sprite(1024 / 2, 768-170, 'sps_mummy');
      mummy.setDepth(10);
      mummy.setScale(3);
      this.anims.create({
          key: 'walk',
          frames: this.anims.generateFrameNumbers('sps_mummy', { start: 0, end: 4 }),
          frameRate: 16,
      });
      mummy.play({
          key: 'walk',
          repeat: -1
      });
  
      // Tambahkan variabel penanda apakah tombol sedang diklik atau tidak
      var btnClicked = false;
  
      // Tambahkan interaksi mouse pada tombol Play
      this.input.on('gameobjectover', function (pointer, gameObject) {
          console.log("Scene Menu | Object Over");
          if (btnClicked) return;
          if (gameObject === btnPlay)
              btnPlay.setTint(0x66161d);
      }, this);
  
      this.input.on('gameobjectout', function (pointer, gameObject) {
          console.log("Scene Menu | Object Out");
          if (btnClicked) return;
          if (gameObject === btnPlay)
              btnPlay.setTint(0xffffff);
          btnClicked = false;
      }, this);
  
      this.input.on('gameobjectdown', function (pointer, gameObject) {
          console.log("Scene Menu | Object Click");
          if (gameObject === btnPlay) {
              btnPlay.setTint(0x66161d);
              btnClicked = true;
          }
      }, this);
  
      this.input.on('gameobjectup', function (pointer, gameObject) {
          console.log("Scene Menu | Object End Click");
          if (gameObject === btnPlay) {
              btnPlay.setTint(0xffffff);
              this.scene.start('scenePlay');
              this.snd_touch.play();
          }
      }, this);
  
      this.input.on('pointerup', function (pointer, gameObject) {
          console.log("Scene Menu | Mouse Up");
          btnClicked = false;
      }, this);
  
      // Animasi judul game
      var diz = this;
  
      this.tweens.add({
          targets: diz.titleGame,
          ease: 'Bounce.easeOut',
          duration: 750,
          delay: 250,
          y: 200,
          onComplete: function () {
              snd_transisi.play();
          }
      });
  
      // Animasi tombol Play (dengan scale awal 0)
      btnPlay.setScale(0);
  
      this.tweens.add({
          targets: btnPlay,
          ease: 'Back',
          duration: 500,
          delay: 750,
          scaleX: 1,
          scaleY: 1
      });
  
      // Scale awal title juga 0 lalu diberi animasi masuk
      this.titleGame.setScale(0);
  
      this.tweens.add({
          targets: diz.titleGame,
          ease: 'Elastic',
          duration: 750,
          delay: 1000,
          scaleX: 1,
          scaleY: 1
      });
    },
  update() {}
});
