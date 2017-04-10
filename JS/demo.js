var game = new Phaser.Game(600, 270, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

function preload () {
	game.load.image ('fire', './Img/fire.png');
	game.load.image ('ice', './Img/ice.png');
	game.load.image ('earth', './Img/earth.png');
	game.load.spritesheet ('hero', './Img/1716651.png', 32, 32, 96);
	game.load.spritesheet ('EnemyAngel', './Img/Enemy1.png', 96, 48, 12);
}

function create () {
	game.stage.setBackgroundColor(0x212429);
	angel = game.add.sprite (game.world.centerX-232, 10, 'EnemyAngel');
	angel.animations.add ('angel', [0,1,2]);
	heroD = game.add.sprite (game.world.centerX-200, 100, 'hero');
	heroL = game.add.sprite (game.world.centerX-200, 140, 'hero');
	heroR = game.add.sprite (game.world.centerX-200, 180, 'hero');
	heroU = game.add.sprite (game.world.centerX-200, 60, 'hero');
	textD = game.add.text (game.world.centerX-60, 104, "Press S or ↓ to move down");
	textD.font = 'Arial';
	textD.fontSize = 20;
	textD.fill = '#fff';
	textL = game.add.text (game.world.centerX-60, 144, "Press A or ← to move left");
	textL.font = 'Arial';
	textL.fontSize = 20;
	textL.fill = '#fff';
	textR = game.add.text (game.world.centerX-60, 184, "Press D or → to move right");
	textR.font = 'Arial';
  textR.fontSize = 20;
	textR.fill = '#fff';
	textU = game.add.text (game.world.centerX-60, 64, "Press W or ↑ to move up");
	textU.font = 'Arial';
  textU.fontSize = 20;
	textU.fill = '#fff';
	textCh = game.add.text (game.world.centerX-60, 224, "Z X C to change spell");
	textCh.font = 'Arial';
  textCh.fontSize = 20;
	textCh.fill = '#fff';
	textM = game.add.text (game.world.centerX-60, 24, "Use mouse to aim");
	textM.font = 'Arial';
  textM.fontSize = 20;
	textM.fill = '#fff';
	heroD.animations.add ('walkDown', [3,4,5]);
	heroL.animations.add ('walkLeft', [14,15,16]);
	heroR.animations.add ('walkRight', [25,26,27]);
	heroU.animations.add ('walkUp', [36,37,38]);
	hero = game.add.sprite (game.world.centerX-200, 220,'hero')
	hero.animations.add ('stop', [15]);
	createBullets ();
}

function update () {
	heroL.animations.play ('walkLeft', 4, true);
	heroR.animations.play ('walkRight', 4, true)
	heroU.animations.play ('walkUp', 4, true);
	heroD.animations.play ('walkDown', 4, true);
	hero.animations.play ('stop');
	angel.animations.play ('angel', 4, true);
	fire ();
}

var bulletType = 0 ,bulletSpeed = 250, fireRate = 1000, nextFire = 0;

function fire (){
	if (game.time.now > nextFire && bulletsFire.countDead() > 0) {
    nextFire = game.time.now + fireRate;
		if (bulletType === 0) {
			bullet = bulletsFire.getFirstExists(false);
		}	else if (bulletType === 1) {
			bullet = bulletsIce.getFirstExists(false);
		} else if (bulletType === 2) {
			bullet = bulletsEarth.getFirstExists(false);
		}
	  bullet.reset(hero.x, hero.y+20);
		bullet.body.velocity.x = -300;
	  bullet.rotation = game.physics.arcade.moveToXY(bullet, 0, hero.y+20, bulletSpeed);
		bulletType++;
		if (bulletType > 2){
			bulletType = 0;
		}
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
