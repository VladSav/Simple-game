Enemy = function (index, game, player, bullets, spriteName, animationsName, animations_masive) {
	var x = game.world.randomX;
	while (x >= 5540) x = game.world.randomX;
	var y = game.world.randomY;
  this.game = game;
  this.health = 3;
  this.player = player;
  this.bullets = bullets;
  this.fireRate = 1700;
  this.nextFire = 0;
  this.alive = true;
  this.Enemy = game.add.sprite(x, y, spriteName);
	this.Enemy.animations.add (animationsName, animations_masive);
	this.Enemy.animations.play (animationsName, 4 ,true);
	game.physics.enable(this.Enemy, Phaser.Physics.ARCADE);
	this.Enemy.body.immovable = false;
	this.Enemy.body.collideWorldBounds = true;
	this.Enemy.body.bounce.setTo(1, 1);
  this.Enemy.anchor.set(0.5);
  this.Enemy.name = index.toString();
	this.Enemy.angle = game.rnd.angle();
	game.physics.arcade.velocityFromRotation(this.Enemy.rotation, 100, this.Enemy.body.velocity);
	this.Enemy.angle = 0;
};

Enemy.prototype.damage = function(damage) {
    this.health -= damage;
		this.Enemy.angle = game.rnd.angle();
		game.physics.arcade.velocityFromRotation(this.Enemy.rotation, 100, this.Enemy.body.velocity);
		this.Enemy.angle = 0;

    if (this.health <= 0) {
			this.health = 3;
			this.Enemy.angle = game.rnd.angle();
			game.physics.arcade.velocityFromRotation(this.Enemy.rotation, 100, this.Enemy.body.velocity);
			this.Enemy.angle = 0;
        this.alive = false;
        this.Enemy.kill();
        return true;
    }
    return false;
};

Enemy.prototype.update = function() {
	if (this.game.physics.arcade.distanceBetween(this.Enemy, this.player) < 500)  {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
      this.nextFire = this.game.time.now + this.fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.reset(this.Enemy.x, this.Enemy.y);
      bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 400);
			EnemySpell.volume = 0.4;
			EnemySpell.play ();
    }
  }
	if (this.Enemy.body.x >= 5540){
		this.Enemy.angle = Math.random() * (270 - 90) + 90;
		game.physics.arcade.velocityFromRotation(this.Enemy.rotation, 100, this.Enemy.body.velocity);
		this.Enemy.angle = 0;
	}

};

var game = new Phaser.Game( screen.width-20, screen.height-120, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update, render: render });

function preload() {
		game.load.tilemap ('tilemap', './Resources/world_map.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.tilemap ('collis', './Resources/collisions.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image ('terrain', './Img/terrain.png');
		game.load.image ('fire', './Img/fire.png');
		game.load.image ('ice', './Img/ice.png');
		game.load.image ('earth', './Img/earth.png');
		game.load.image ('AngelMagic', './Img/Angel_magic.png');
		game.load.image ('SkeletMagic', './Img/Skelet_magic.png');
		game.load.image ('heart', './Img/heart.png');
		game.load.spritesheet ('hero', './Img/1716651.png', 32, 32, 96);
		game.load.spritesheet ('EnemyAngel', './Img/Enemy1.png', 96, 48, 12);
		game.load.spritesheet ('EnemySkelet', './Img/EnemyS.png', 32, 32, 96);
		game.load.spritesheet ('PoofWhite', './Img/Poof_white.png', 96, 48, 10);
		game.load.audio ('bgMusic1', './Music/Celtic.mp3');
		game.load.audio ('s_enemy', './Music/spooky.wav');
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
var nextSound = 0, soundFire, soundIce, soundEarth, sound_spell, bgMusic1, bgMusic2, bgMusic3, bgMusic4;
var enemiesAngel, enemyBulletsAngel, enemiesTotalA = 0, enemiesAliveA = 0;
var enemiesSkelet, enemyBulletsSkelet, enemiesTotalA = 0, enemiesAliveA = 0;
var explosions;
var hearts;

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
		enemiesAngel.push(new Enemy(number_enemies_angel[num_ia], game, hero_collide, enemyBulletsAngel, 'EnemyAngel', 'Fly', [0, 1, 2]));
	}
	enemiesSkelet = [];
	var number_enemies_skelet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24 ,25];
	for (var num_is = 0; num_is < number_enemies_skelet.length; num_is++) {
		enemiesSkelet.push(new Enemy(number_enemies_skelet[num_is], game, hero_collide, enemyBulletsSkelet, 'EnemySkelet', 'Skel', [6, 7, 8]));
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
	EnemySpell = game.add.audio ('s_enemy');
	bgMusic1 = game.add.audio ('bgMusic1');
	bgMusic2 = game.add.audio ('bgMusic2');
	bgMusic3 = game.add.audio ('bgMusic3');
	bgMusic4 = game.add.audio ('bgMusic4');
	bgMusicEnd = game.add.audio ('bgMusicEnd');
	hero = game.add.sprite (6340, 1070, 'hero');
	game.physics.p2.enable (hero);
	hero.animations.add ('stop', [4]);
	hero.animations.add ('walkDown', [3,4,5]);
	hero.animations.add ('walkLeft', [14,15,16]);
	hero.animations.add ('walkRight', [25,26,27]);
	hero.animations.add ('walkUp', [36,37,38]);
	hero.animations.play ('stop');
	hearts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	for (var i=0; i<10; i++){
		game.physics.p2.enable (hearts[i]);
		hearts[i] = game.add.sprite (hero.body.x+i*16, hero.body.y-320, 'heart');
	}
	game.camera.follow (hero);
	game.physics.p2.setBoundsToWorld(true, true, true, true, false);
	keys ();
	cursors = game.input.keyboard.createCursorKeys();
}

function update() {
	if (pauseButton.isDown)	game.paused = true;

	game.physics.arcade.overlap(enemyBulletsAngel, hero_collide, bulletHitPlayer, null, this);
	game.physics.arcade.overlap(enemyBulletsSkelet, hero_collide, bulletHitPlayer, null, this);
  enemiesAlive = 0;
  for (var i = 0; i < enemiesAngel.length; i++) {
    if (enemiesAngel[i].alive) {
      game.physics.arcade.collide(hero_collide, enemiesAngel[i].Enemy);
      game.physics.arcade.overlap(bulletsFire, enemiesAngel[i].Enemy, bulletHitEnemyAngel, null, this);
      game.physics.arcade.overlap(bulletsIce, enemiesAngel[i].Enemy, bulletHitEnemyAngel, null, this);
      game.physics.arcade.overlap(bulletsEarth, enemiesAngel[i].Enemy, bulletHitEnemyAngel, null, this);
      enemiesAngel[i].update();
    }
  }
  for (var i = 0; i < enemiesSkelet.length; i++) {
    if (enemiesSkelet[i].alive) {
      game.physics.arcade.collide(hero_collide, enemiesSkelet[i].Enemy);
      game.physics.arcade.overlap(bulletsFire, enemiesSkelet[i].Enemy, bulletHitEnemySkelet, null, this);
      game.physics.arcade.overlap(bulletsIce, enemiesSkelet[i].Enemy, bulletHitEnemySkelet, null, this);
      game.physics.arcade.overlap(bulletsEarth, enemiesSkelet[i].Enemy, bulletHitEnemySkelet, null, this);
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
		hero_collide.y = hero.y;
		hero.animations.play ('walkUp', 4, true);
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
	moveHp (hero.body.x, hero.body.y);
}

function moveHp (xx, yy) {

	for (var i=0; i<hp; i++){
			hearts[i].x = xx-48+i*16;
			hearts[i].y = yy+60;
	}
}

function unpause(event) {
	game.paused = false;
}

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

function bulletHitPlayer (Enemy, bullet) {
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
		for (var i=0; i<10; i++)
			hearts[i].visible = false;
	  var explosionAnimation = explosions.getFirstExists(false);
	  explosionAnimation.reset(remx, hero.y);
	  explosionAnimation.play('PoofWhite', 25, false, true);
  }
}

function bulletHitEnemyAngel (Enemy, bullet) {
	var destroyed;
	if (bullet.key === 'fire')
  	destroyed = enemiesAngel[Enemy.name].damage(1);
	if (bullet.key === 'ice')
		destroyed = enemiesAngel[Enemy.name].damage(2);
	if (bullet.key === 'earth')
		destroyed = enemiesAngel[Enemy.name].damage(3);
	bullet.kill();
  if (destroyed) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(Enemy.x, Enemy.y);
    explosionAnimation.play('PoofWhite', 25, false, true);
  }
}

function bulletHitEnemySkelet (Enemy, bullet) {
	var destroyed;
	if (bullet.key === 'fire')
  	destroyed = enemiesSkelet[Enemy.name].damage(3);
	if (bullet.key === 'ice')
		destroyed = enemiesSkelet[Enemy.name].damage(0);
	if (bullet.key === 'earth')
		destroyed = enemiesSkelet[Enemy.name].damage(1);
	bullet.kill();
  if (destroyed) {
    var explosionAnimation = explosions.getFirstExists(false);
    explosionAnimation.reset(Enemy.x, Enemy.y);
    explosionAnimation.play('PoofWhite', 25, false, true);
  }
}

function render() {
	// if (hp > 0)
	// 	game.debug.text ('HP: ' + hp, screen.width-100, 16);
	if (hp <= 0)
		game.debug.text ("GAME OVER", screen.width/2-50, screen.height/3);
}
