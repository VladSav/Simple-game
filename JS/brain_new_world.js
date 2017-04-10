EnemyAngel = function (index, game, player, bullets) {
		var x = game.world.randomX;
		while (x >= 5740) x = game.world.randomX;
		var y = game.world.randomY;
    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1500;
    this.nextFire = 0;
    this.alive = true;
    this.Angel = game.add.sprite(x, y, 'EnemyAngel');
		this.Angel.animations.add ('Fly', [0, 1, 2]);
		this.Angel.animations.play ('Fly', 4 ,true);
		game.physics.enable(this.Angel, Phaser.Physics.ARCADE);
		this.Angel.body.immovable = false;
		this.Angel.body.collideWorldBounds = true;
		this.Angel.body.bounce.setTo(1, 1);
    this.Angel.anchor.set(0.5);
    this.Angel.name = index.toString();
};

EnemyAngel.prototype.damage = function(damage) {
    this.health -= damage;
    if (this.health <= 0) {
        this.alive = false;
        this.Angel.kill();
        return true;
    }
    return false;
};

EnemyAngel.prototype.update = function() {
	if (this.game.physics.arcade.distanceBetween(this.Angel, this.player) < 600)  {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.reset(this.Angel.x, this.Angel.y);
      bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
			AngelSpell.volume = 0.2;
			AngelSpell.play ();
    }
  }
};

EnemySkelet = function (index, game, player, bullets) {
	var x = game.world.randomX;
	while (x >= 5740) x = game.world.randomX;
	var y = game.world.randomY;
  this.game = game;
  this.health = 3;
  this.player = player;
  this.bullets = bullets;
  this.fireRate = 1700;
  this.nextFire = 0;
  this.alive = true;
  this.Skelet = game.add.sprite(x, y, 'EnemySkelet');
	this.Skelet.animations.add ('Skel', [6, 7, 8]);
	this.Skelet.animations.play ('Skel', 4 ,true);
	game.physics.enable(this.Skelet, Phaser.Physics.ARCADE);
	this.Skelet.body.immovable = false;
	this.Skelet.body.collideWorldBounds = true;
	this.Skelet.body.bounce.setTo(1, 1);
  this.Skelet.anchor.set(0.5);
  this.Skelet.name = index.toString();
};

EnemySkelet.prototype.damage = function(damage) {
    this.health -= damage;
    if (this.health <= 0) {
        this.alive = false;
        this.Skelet.kill();
        return true;
    }
    return false;
};

EnemySkelet.prototype.update = function() {
	if (this.game.physics.arcade.distanceBetween(this.Skelet, this.player) < 500)  {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.reset(this.Skelet.x, this.Skelet.y);
      bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 400);
			SkeletSpell.volume = 0.2;
			SkeletSpell.play ();
    }
  }
};

var game = new Phaser.Game(1360, 650, Phaser.AUTO, 'game', {preload: preload, create: create, update: update, render: render });

function preload() {
		game.load.tilemap ('tilemap', './Resources/world_map.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap ('collis', './Resources/collisions.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image ('terrain', './Img/terrain.png');
		game.load.image ('fire', './Img/fire.png');
		game.load.image ('ice', './Img/ice.png');
		game.load.image ('earth', './Img/earth.png');
		game.load.image ('AngelMagic', './Img/Angel_magic.png');
		game.load.image ('SkeletMagic', './Img/Skelet_magic.png');
		game.load.spritesheet ('hero', './Img/1716651.png', 32, 32, 96);
		game.load.spritesheet ('EnemyAngel', './Img/Enemy1.png', 96, 48, 12);
		game.load.spritesheet ('EnemySkelet', './Img/EnemyS.png', 32, 32, 96);
		game.load.spritesheet ('PoofWhite', './Img/Poof_white.png', 96, 48, 10);
		game.load.audio ('bgMusic1', './Music/Celtic.mp3');
		game.load.audio ('s_angel', './Music/spooky.wav');
		game.load.audio ('s_fire', './Music/sound_fireball.wav');
		game.load.audio ('s_ice', './Music/sound_weird.wav');
		game.load.audio ('s_earth', './Music/sound_boom.wav');
		game.load.audio ('bgMusic3', './Music/Lost_in_Paradise.mp3');
		game.load.audio ('bgMusic2', './Music/Master_of_the_Feast.mp3');
		game.load.audio ('bgMusic4', './Music/Vadodara.mp3');
		game.load.audio ('bgMusicEnd', './Music/Teller of the Tales.mp3');
}

var map, cursors, mapCollisions, layerCollision;
var layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8;
var hero, hero_collide, hp = 10, hpPlus = 10000, hpNext = 0, heroSpeed = 300;
var upButton, downButton, leftButton, rightButton, fireButton, iceButton, earthButton, pauseButton, changeSoundButton, speedButton;
var bulletType = 0, bulletsFire, bulletsIce, bulletsEarth, bullet, bulletSpeed = 500, fireRate = 1000, nextFire = 0;
var nextSound = 0, soundFire, soundIce, soundEarth, sound_spell, AngelSpell, SkeletSpell, bgMusic1, bgMusic2, bgMusic3, bgMusic4;
var enemiesAngel, enemyBulletsAngel, enemiesTotalA = 0, enemiesAliveA = 0;
var enemiesSkelet, enemyBulletsSkelet, enemiesTotalA = 0, enemiesAliveA = 0;
var explosions;

function create() {
	game.input.onDown.add(unpause, self);
	game.physics.startSystem(Phaser.Physics.P2JS);
	map = game.add.tilemap('tilemap');
	mapCollision = game.add.tilemap('collis');
	mapCollision.addTilesetImage('terrain');
	map.addTilesetImage('terrain');
	layer1 = map.createLayer('LayerWorld1');
	layer2 = map.createLayer('LayerWorld2');
	layer3 = map.createLayer('LayerWorld3');
	layer4 = map.createLayer('LayerWorld4');
	layer5 = map.createLayer('LayerWorld5');
	layer6 = map.createLayer('LayerWorld6');
	layer7 = map.createLayer('LayerWorld7');
	layer8 = map.createLayer('LayerWorld8');
	layer1.resizeWorld();
	layer2.resizeWorld();
	layer3.resizeWorld();
	layer4.resizeWorld();
	layer5.resizeWorld();
	layer6.resizeWorld();
	layer7.resizeWorld();
	layer8.resizeWorld();
	layerCollision = mapCollision.createLayer ('LayerCollisions');
	layerCollision.visible = false;
	layerCollision.resizeWorld();
	mapCollision.setCollisionBetween(1,12)
	game.physics.p2.convertTilemap(mapCollision, layerCollision);
	enemyBulletsAngel = game.add.group();
  enemyBulletsAngel.enableBody = true;
  enemyBulletsAngel.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBulletsAngel.createMultiple(100, 'AngelMagic');
  enemyBulletsAngel.setAll('anchor.x', 0.5);
  enemyBulletsAngel.setAll('anchor.y', 0.5);
  enemyBulletsAngel.setAll('outOfBoundsKill', true);
  enemyBulletsAngel.setAll('checkWorldBounds', true);
	enemyBulletsSkelet = game.add.group();
  enemyBulletsSkelet.enableBody = true;
  enemyBulletsSkelet.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBulletsSkelet.createMultiple(100, 'SkeletMagic');
  enemyBulletsSkelet.setAll('anchor.x', 0.5);
  enemyBulletsSkelet.setAll('anchor.y', 0.5);
  enemyBulletsSkelet.setAll('outOfBoundsKill', true);
  enemyBulletsSkelet.setAll('checkWorldBounds', true);
	hero_collide = game.add.sprite(6340, 1070, '');
	hero_collide.anchor.setTo(0.5, 0.5);
	game.physics.enable(hero_collide, Phaser.Physics.ARCADE);
	hero_collide.body.drag.set(0.2);
	hero_collide.body.maxVelocity.setTo(400, 400);
	hero_collide.body.collideWorldBounds = true;
	enemiesAngel = [];
	var number_enemies_angel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ,25];
	for (var num_ia = 0; num_ia < number_enemies_angel.length; num_ia++) {
		enemiesAngel.push(new EnemyAngel(/*6240 - num_i*100, 1110, */number_enemies_angel[num_ia], game, hero_collide, enemyBulletsAngel));
	}
	enemiesSkelet = [];
	var number_enemies_skelet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ,25];
	for (var num_is = 0; num_is < number_enemies_skelet.length; num_is++) {
		enemiesSkelet.push(new EnemySkelet(/*6240 - num_i*100, 1160, */number_enemies_skelet[num_is], game, hero_collide, enemyBulletsSkelet));
	}
	explosions = game.add.group();
	for (var i = 0; i < 10; i++){
    var explosionAnimation = explosions.create(0, 0, 'PoofWhite', [0], false);
    explosionAnimation.anchor.setTo(0.5, 0.5);
    explosionAnimation.animations.add('PoofWhite');
  }
	createBullets ();
	soundFire = game.add.audio ('s_fire');
	soundIce = game.add.audio ('s_ice');
	soundEarth = game.add.audio ('s_earth');
	AngelSpell = game.add.audio ('s_angel');
	SkeletSpell = game.add.audio ('s_angel');
	bgMusic1 = game.add.audio ('bgMusic1');
	bgMusic2 = game.add.audio ('bgMusic2');
	bgMusic3 = game.add.audio ('bgMusic3');
	bgMusic4 = game.add.audio ('bgMusic4');
	bgMusicEnd = game.add.audio ('bgMusicEnd');
	hero = game.add.sprite (6340, 1070, 'hero');
	game.physics.p2.enable(hero);
	hero.animations.add ('stop', [4]);
	hero.animations.add ('walkDown', [3,4,5]);
	hero.animations.add ('walkLeft', [14,15,16]);
	hero.animations.add ('walkRight', [25,26,27]);
	hero.animations.add ('walkUp', [36,37,38]);
	hero.animations.play ('stop');
	game.camera.follow (hero);
	game.physics.p2.setBoundsToWorld(true, true, true, true, false);
	keys ();
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	if (pauseButton.isDown) game.paused = true;
	game.physics.arcade.overlap(enemyBulletsAngel, hero_collide, bulletHitPlayerAngel, null, this);
	game.physics.arcade.overlap(enemyBulletsSkelet, hero_collide, bulletHitPlayerSkelet, null, this);
  enemiesAlive = 0;
  for (var i = 0; i < enemiesAngel.length; i++) {
    if (enemiesAngel[i].alive) {
      game.physics.arcade.collide(hero_collide, enemiesAngel[i].Angel);
      game.physics.arcade.overlap(bulletsFire, enemiesAngel[i].Angel, bulletHitEnemyAngel, null, this);
      game.physics.arcade.overlap(bulletsIce, enemiesAngel[i].Angel, bulletHitEnemyAngel, null, this);
      game.physics.arcade.overlap(bulletsEarth, enemiesAngel[i].Angel, bulletHitEnemyAngel, null, this);
      enemiesAngel[i].update();
    }
  }
  for (var i = 0; i < enemiesSkelet.length; i++) {
    if (enemiesSkelet[i].alive) {
      game.physics.arcade.collide(hero_collide, enemiesSkelet[i].Skelet);
      game.physics.arcade.overlap(bulletsFire, enemiesSkelet[i].Skelet, bulletHitEnemySkelet, null, this);
      game.physics.arcade.overlap(bulletsIce, enemiesSkelet[i].Skelet, bulletHitEnemySkelet, null, this);
      game.physics.arcade.overlap(bulletsEarth, enemiesSkelet[i].Skelet, bulletHitEnemySkelet, null, this);
      enemiesSkelet[i].update();
    }
  }
	hero.body.setZeroDamping();
	hero.body.fixedRotation = true;
	hero.body.setZeroVelocity();
  if (cursors.left.isDown || leftButton.isDown){
  	hero.body.moveLeft(heroSpeed);
		hero_collide.x = hero.x;
		hero.animations.play ('walkLeft', 4, true);
	}	else if (cursors.right.isDown || rightButton.isDown){
  	hero.body.moveRight(heroSpeed);
		hero_collide.x = hero.x;
		hero.animations.play ('walkRight', 4, true);
	} else if (cursors.up.isDown || upButton.isDown){
  	hero.body.moveUp(heroSpeed);
		hero.animations.play ('walkUp', 4, true);
		hero_collide.y = hero.y;
	} else if (cursors.down.isDown || downButton.isDown){
  	hero.body.moveDown(heroSpeed);
		hero_collide.y = hero.y;
		hero.animations.play ('walkDown', 4, true);
	} else {
		hero.animations.play ('stop');
	}
	if (fireButton.isDown) {
		bulletType = 0;
		fireRate = 1000;
		bulletSpeed = 700;
	}
	if (iceButton.isDown) {
		bulletType = 1;
		fireRate = 1500;
		bulletSpeed = 900;
	}
	if (earthButton.isDown) {
		bulletType = 2;
		fireRate = 2500;
		bulletSpeed = 500;
	}
	if (game.input.activePointer.isDown){
		if (hp > 0)
			fire();
	}
	if (speedButton.isDown){
		if (heroSpeed === 300){
			heroSpeed = 1000;
		} else {
			heroSpeed = 300;
		}
	}
	changeSound ();
	playBgSound ();
	if (hp > 0)
		hpPlease ();
}

function unpause(event) {
	game.paused = false;
}

// function theEnd (event){
//
// }

function fire (){
	if (game.time.now > nextFire && bulletsFire.countDead() > 0) {
    nextFire = game.time.now + fireRate;
		if (bulletType === 0) {
			bullet = bulletsFire.getFirstExists(false);
			sound_spell = soundFire;
		}	else if (bulletType === 1) {
			bullet = bulletsIce.getFirstExists(false);
			sound_spell = soundIce;
		} else if (bulletType === 2) {
			bullet = bulletsEarth.getFirstExists(false);
			sound_spell = soundEarth;
		}
	  bullet.reset(hero.x, hero.y);
	  bullet.rotation = game.physics.arcade.moveToPointer(bullet, bulletSpeed);
		sound_spell.play ();
	}
}

function hpPlease () {
	if (game.time.now > hpNext) {
    hpNext = game.time.now + hpPlus;
		if (hp < 0) hp = -10;
		if (hp < 10) hp++;
	}
}

function playBgSound () {
	if (nextSound === 0 && bgMusic1.isPlaying === true)
		nextSound = 1;
	else if (nextSound === 0 && bgMusic1.isPlaying === false && bgMusic2.isPlaying === false && bgMusic3.isPlaying === false && bgMusic4.isPlaying === false) {
		bgMusic1.play ();
		bgMusic1.volume = 0.2;
	}
	if (nextSound === 1 && bgMusic2.isPlaying === true)
		nextSound = 2;
	else if (nextSound === 1 && bgMusic1.isPlaying === false && bgMusic2.isPlaying === false && bgMusic3.isPlaying === false && bgMusic4.isPlaying === false) {
		bgMusic2.play ();
		bgMusic2.volume = 0.2;
	}
	if (nextSound === 2 && bgMusic3.isPlaying === true)
		nextSound = 3;
	else if (nextSound === 2 && bgMusic1.isPlaying === false && bgMusic2.isPlaying === false && bgMusic3.isPlaying === false && bgMusic4.isPlaying === false) {
		bgMusic3.play ();
		bgMusic3.volume = 0.2;
	}
	if (nextSound === 3 && bgMusic4.isPlaying === true)
		nextSound = 0;
	else if (nextSound === 3 && bgMusic1.isPlaying === false && bgMusic2.isPlaying === false && bgMusic3.isPlaying === false && bgMusic4.isPlaying === false) {
		bgMusic4.play ();
		bgMusic4.volume = 0.2;
	}
	if (nextSound === 5 &&	bgMusicEnd.isPlaying === true)
			nextSound = 5;
		else if (nextSound === 5 && bgMusicEnd.isPlaying === false) {
			bgMusicEnd.play ();
			bgMusicEnd.volume = 0.3;
		}
}

function changeSound () {
	if (changeSoundButton.isDown){
		if (bgMusic1.isPlaying === true)
			bgMusic1.stop ();
		if (bgMusic2.isPlaying === true)
			bgMusic2.stop ();
		if (bgMusic3.isPlaying === true)
			bgMusic3.stop ();
		if (bgMusic4.isPlaying === true)
			bgMusic4.stop ();
		nextSound++;
		if (nextSound === 4)
			nextSound = 0;
	}
}

function createBullets () {
	bulletsFire = game.add.group();
  bulletsFire.enableBody = true;
  bulletsFire.physicsBodyType = Phaser.Physics.ARCADE;
  bulletsFire.createMultiple(30, 'fire', 0, false);
  bulletsFire.setAll('anchor.x', 0.5);
  bulletsFire.setAll('anchor.y', 0.5);
  bulletsFire.setAll('outOfBoundsKill', true);
  bulletsFire.setAll('checkWorldBounds', true);
	bulletsIce = game.add.group();
  bulletsIce.enableBody = true;
  bulletsIce.physicsBodyType = Phaser.Physics.ARCADE;
  bulletsIce.createMultiple(30, 'ice', 0, false);
  bulletsIce.setAll('anchor.x', 0.5);
  bulletsIce.setAll('anchor.y', 0.5);
  bulletsIce.setAll('outOfBoundsKill', true);
  bulletsIce.setAll('checkWorldBounds', true);
	bulletsEarth = game.add.group();
  bulletsEarth.enableBody = true;
  bulletsEarth.physicsBodyType = Phaser.Physics.ARCADE;
  bulletsEarth.createMultiple(30, 'earth', 0, false);
  bulletsEarth.setAll('anchor.x', 0.5);
  bulletsEarth.setAll('anchor.y', 0.5);
  bulletsEarth.setAll('outOfBoundsKill', true);
  bulletsEarth.setAll('checkWorldBounds', true);
}

function keys () {
	upButton = game.input.keyboard.addKey(Phaser.Keyboard.W);
	downButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
	leftButton = game.input.keyboard.addKey(Phaser.Keyboard.A);
	rightButton = game.input.keyboard.addKey(Phaser.Keyboard.D);
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
	iceButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
	earthButton = game.input.keyboard.addKey(Phaser.Keyboard.C);
	speedButton = game.input.keyboard.addKey(Phaser.Keyboard.P);
	changeSoundButton = game.input.keyboard.addKey(Phaser.Keyboard.O);
	pauseButton = game.input.keyboard.addKey (Phaser.Keyboard.ESC);
}

function bulletHitPlayerAngel (Angel, bullet) {
	hp -= 1;
  bullet.kill();
	if (hp <= 0) {
		hp = -10;
		var remx = hero.x;
		hero.kill();
		hero_collide.kill ();
		hero.x = 10000;
		hero_collide.x = 10000;
		nextSound = 5;
		bgMusic1.stop ();
		bgMusic2.stop ();
		bgMusic3.stop ();
		bgMusic4.stop ();
		var explosionAnimation = explosions.getFirstExists(false);
	  explosionAnimation.reset(remx, hero.y);
	  explosionAnimation.play('PoofWhite', 25, false, true);
		// theEnd ();
  }
}

function bulletHitPlayerSkelet (Skelet, bullet) {
	hp -= 1;
  bullet.kill();
	if (hp <= 0) {
		var remx = hero.x;
	  hero.kill();
		hero_collide.kill ();
		hero.x = 10000;
		hero_collide.x = 10000;
		nextSound = 5;
		bgMusic1.stop ();
		bgMusic2.stop ();
		bgMusic3.stop ();
		bgMusic4.stop ();
	  var explosionAnimation = explosions.getFirstExists(false);
	  explosionAnimation.reset(remx, hero.y);
	  explosionAnimation.play('PoofWhite', 25, false, true);
		// theEnd ();
  }
}

function bulletHitEnemyAngel (Angel, bullet) {
	var destroyed;
	if (bullet.key === 'fire')
  	destroyed = enemiesAngel[Angel.name].damage(1);
	if (bullet.key === 'ice')
		destroyed = enemiesAngel[Angel.name].damage(2);
	if (bullet.key === 'earth')
		destroyed = enemiesAngel[Angel.name].damage(3);
	bullet.kill();
  if (destroyed) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(Angel.x, Angel.y);
    explosionAnimation.play('PoofWhite', 25, false, true);
  }
}

function bulletHitEnemySkelet (Skelet, bullet) {
	var destroyed;
	if (bullet.key === 'fire')
  	destroyed = enemiesSkelet[Skelet.name].damage(3);
	if (bullet.key === 'ice')
		destroyed = enemiesSkelet[Skelet.name].damage(0);
	if (bullet.key === 'earth')
		destroyed = enemiesSkelet[Skelet.name].damage(1);
	bullet.kill();
  if (destroyed) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(Skelet.x, Skelet.y);
    explosionAnimation.play('PoofWhite', 25, false, true);
  }
}

function render() {
	if (hp > 0){
		game.debug.text ('HP: ' + hp, 1300, 16);
	} else {
		game.debug.text ("GAME OVER", 655, 160);
	}
}
