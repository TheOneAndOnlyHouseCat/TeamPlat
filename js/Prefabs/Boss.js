function Boss(game, atlas_key, atlas_frame, x, y, world, player) {
	Phaser.Sprite.call(this, game, x, y, atlas_key, atlas_frame);

	this.ogX = x;
	this.ogY = y;
	
	this.type = "boss";
	
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	
	//this.animations.add('flail', Phaser.Animation.generateFrameNames('robobitch', 0, 7, '', 1), 15, true);
	//this.animations.add('idle', ['robobitch0'], 30, false);
	
	this.animations.add('idle', ['bossbot0'], 30, false);
	this.animations.add('charge', ['bossbot2'], 30, false);	
	this.animations.add('invincible', ['bossbot0'], 30, true);
	this.animations.add('control', ['bossbot5'], 30, false);
	this.animations.add('smash', ['bossbot6','bossbot7','bossbot8','bossbot9'], 11, false);
	this.animations.add('fire', ['bossbot3', 'bossbot4'], 6, false);
	this.animations.add('unfire', ['bossbot4', 'bossbot3','bossbot0'], 11, false);
	this.animations.add('death', ['bossbot11','bossbot12','bossbot13','bossbot14','bossbot15','bossbot16','bossbot17'], 10, true);
	this.animations.add('bobble', ['bossbot0','bossbot10','bossbot0','bossbot11'], 20, true);
	this.animations.add('flail', ['bossbot0','bossbot1','bossbot2','bossbot3','bossbot4','bossbot5','bossbot6','bossbot7','bossbot8','bossbot9',
 'bossbot10','bossbot11','bossbot12','bossbot13','bossbot14','bossbot15','bossbot16','bossbot17'], 3, true);
		
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 1000;
	this.body.drag.x = 600;
	this.body.maxVelocity.x = 500;
	this.anchor.set(.5);
	this.scale.x = this.scale.x;
	this.scale.y = this.scale.y;
	this.animations.play('idle');
	
	this.body.onWorldBounds = new Phaser.Signal();
	this.body.onWorldBounds.add(this.hitWorldBounds, this);
	
	this.chargeBox1 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.chargeBox1, Phaser.Physics.ARCADE);
	this.chargeBox1.body.setSize(50, 100);
	this.chargeBox1.anchor.set(0.5);
	
	this.chargeBox2 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.chargeBox2, Phaser.Physics.ARCADE);
	this.chargeBox2.body.setSize(50, 100);
	this.chargeBox2.anchor.set(0.5);
	
	this.chargeBox1 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.chargeBox1, Phaser.Physics.ARCADE);
	this.chargeBox1.body.setSize(50, 100);
	this.chargeBox1.anchor.set(0.5);
	
	this.chargeBox2 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.chargeBox2, Phaser.Physics.ARCADE);
	this.chargeBox2.body.setSize(50, 100);
	this.chargeBox2.anchor.set(0.5);
	
	this.killBox1 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.killBox1, Phaser.Physics.ARCADE);
	this.killBox1.body.setSize(50, 100);
	this.killBox1.anchor.set(0.5);
	
	this.killBox2 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.killBox2, Phaser.Physics.ARCADE);
	this.killBox2.body.setSize(50, 100);
	this.killBox2.anchor.set(0.5);
	
	this.killBox3 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.killBox3, Phaser.Physics.ARCADE);
	this.killBox3.body.setSize(80, 40);
	this.killBox3.anchor.set(0.5);
	
	this.myWorld = world;
	this.thePlayer = player;
	this.inAction = false;
	this.set = false;
	
	this.charging = false;
	this.chargeRight = true;
	this.chargeSpeed = 600;
	
	this.firing = false;
	
	this.idling = true;
	this.idleLeft = null;
	this.idleSpeed = 200;
	
	this.minionCount = 0;
	
	this.disabled = true;

	this.inControl = false;
	
	this.health = 50;
	
	this.weapon = this.game.add.weapon(100, 'evil_lemon');
	this.weapon.bullets.setAll('scale.x', .5);
	this.weapon.bullets.setAll('scale.y', .5);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon.fireAngle = 270; // In degrees
	this.weapon.bulletSpeed = 900;
	//this.weapon.fireRate = 1000;  Using attackCooldown instead
	//this.weapon.trackSprite(this); // Has the weapon follow the player
	
	this.weapon1 = this.game.add.weapon(100, 'evil_lemon');
	this.weapon1.bullets.setAll('scale.x', .5);
	this.weapon1.bullets.setAll('scale.y', .5);
	this.weapon1.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon1.fireAngle = 270; // In degrees
	this.weapon1.bulletSpeed = 900;
	//this.weapon1.fireRate = 1000;  Using attackCooldown instead
	//this.weapon1.trackSprite(this); // Has the weapon follow the player
	
	this.fire_sound = this.game.add.audio('boss_firing');
	this.fire_sound.loop = false;
	this.fire_sound.volume = 2;	
	
	this.death_sound = this.game.add.audio('boss_explode');
	this.death_sound.loop = false;
	this.death_sound.volume = 2;	
	
	this.invuln = true;
}

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.update = function() {
	this.game.physics.arcade.collide(this, this.myWorld.ground.children);

	if(!this.invuln) {
		this.game.physics.arcade.overlap(this.killBox1, this.thePlayer.weapon.bullets, this.takeBulletDmg, null, this);
		this.game.physics.arcade.overlap(this.killBox2, this.thePlayer.weapon.bullets, this.takeBulletDmg, null, this);
		this.game.physics.arcade.overlap(this.killBox3, this.thePlayer.weapon.bullets, this.takeBulletDmg, null, this);
	}
	
	if(!this.set) {
		this.setup();
	}
	
	if(!this.thePlayer.invincible) {
		this.game.physics.arcade.overlap(this.thePlayer, this.weapon.bullets, this.thePlayer.stupidPlayer2, null, this.thePlayer);
		this.game.physics.arcade.overlap(this.thePlayer, this.weapon1.bullets, this.thePlayer.stupidPlayer2, null, this.thePlayer);
		
		if(this.charging) {
			this.game.physics.arcade.overlap(this.thePlayer, this.chargeBox1, this.thePlayer.determineLoser, null, this.thePlayer);
			this.game.physics.arcade.overlap(this.thePlayer, this.chargeBox2, this.thePlayer.determineLoser, null, this.thePlayer);
		}
	}
	
	if(this.charging) {
		this.repoChargeHitboxes();
		this.letsCharge();
	}
	else if(this.firing) {
		this.setKillBoxesFire();
		this.fire();
	}
	else if(this.jumping) {
	}
	else if(this.idling) {
		this.setKillBoxesIdle();
		this.idleTime();
	}
	else if(this.disabled || this.inControl) {
	}
}

Boss.prototype.takeBulletDmg = function(killBox, bullet) {
	bullet.kill();
	this.health--;
	console.log(this.health);
	this.myWorld.shakeCameraLite();
}

Boss.prototype.setKillBoxesIdle = function() {
	var killBox = this.killBox1;
	killBox.body.x = this.x - killBox.width / 2 - 105;
	killBox.body.y = this.y - killBox.height / 2 + 30;
	killBox.anchor.set(0.5);
	killBox.body.width = 50;
	killBox.body.height = 100;
	
	killBox = this.killBox2;
	killBox.body.x = this.x - killBox.width / 2 + 55;
	killBox.body.y = this.y - killBox.height / 2 + 30;
	killBox.anchor.set(0.5);
	killBox.body.width = 50;
	killBox.body.height = 100;
	
	killBox = this.killBox3;
	killBox.body.x = this.x - this.body.width/5 + 8;
	killBox.body.y = this.y - killBox.height / 2 - 100;
	killBox.anchor.set(0.5);
}

Boss.prototype.determineMove = function() {
	this.idle();
	var nextAttack = 0;
	var rand = Math.floor(Math.random() * 4);
	
	if(rand < 1) {
		nextAttack = 0;
	}
	else if(rand >= 1 && rand < 2) {
		nextAttack = 1;
	}
	else if(rand >= 2 && rand < 3) {
		nextAttack = 2;
	}
	else if(rand >= 3) {
		nextAttack = 3;
	}
	
	nextAttack = 3;

	if(nextAttack == 0){
		this.game.time.events.add(Phaser.Timer.SECOND*2, this.charge, this);
	}
	else if(nextAttack == 1) {
		this.game.time.events.add(Phaser.Timer.SECOND*0.9, this.startFireAnim, this);
		this.game.time.events.add(Phaser.Timer.SECOND*2, this.openFire, this);
	}
	else if(nextAttack == 2) {
		this.invuln = true;
		this.game.time.events.add(Phaser.Timer.SECOND*.9, this.control, this);
	}
	else if(nextAttack == 3) {
		this.invuln = true;
		this.game.time.events.add(Phaser.Timer.SECOND*.9, this.jump, this);
	}
}

Boss.prototype.jump = function() {
	this.jumping = true;
	this.idling = false;
	
	this.animations.play('smash');
	this.body.velocity.y = -700;
	this.game.time.events.add(Phaser.Timer.SECOND*1.35, this.endJump, this);
}

Boss.prototype.endJump = function() {
	this.jumping = false;
	this.animations.play('control');
	this.myWorld.shakeCameraMed();
	this.game.time.events.add(Phaser.Timer.SECOND*1.5, this.determineMove, this);
}

Boss.prototype.control = function() {
	this.inControl = true;
	this.idling = false;
	this.animations.play('control');
	this.game.time.events.add(Phaser.Timer.SECOND*2, this.myWorld.callMinions, this.myWorld);
}

Boss.prototype.idle = function() {
	this.idling = true;
	var x = Math.floor(Math.random() * 2);
	if(x) {
		this.idleLeft = false;
	}
	else {
		this.idleLeft = true;
	}
}

Boss.prototype.idleTime = function() {
	if(this.animations.currentFrame.index == this.animations.frameTotal-1) {
		this.animations.play('idle');
	}
}

Boss.prototype.startFireAnim = function() {
	this.animations.play('fire');
	this.firing = true;
}

Boss.prototype.openFire = function() {
	this.idling = false;
	this.body.acceleration.x = 0;
	
	this.fireY = this.y - 600;
	this.fireX1 = this.x - 800;
	this.fireX2 = this.x + 800;
	
	this.weapon.x = this.x + this.width/2 - 8;
	this.weapon.y = this.y - 30;
	this.weapon1.x = this.x - this.width/2 + 8;
	this.weapon1.y = this.y - 30;
	
	this.fire_sound.play();
	this.game.time.events.add(Phaser.Timer.SECOND*1.3, this.ceaseFire, this);
}

Boss.prototype.setKillBoxesFire = function() {
	var killBox = this.killBox1;
	killBox.body.width = 100;
	killBox.body.height = 50;
	killBox.body.x = this.x - this.width / 2 + 20;
	killBox.body.y = this.y - 60;
	killBox.anchor.set(0.5);
	
	var killBox = this.killBox2;
	killBox.body.width = 100;
	killBox.body.height = 50;
	killBox.body.x = this.x + 125;
	killBox.body.y = this.y - 60;
	killBox.anchor.set(0.5);
}

Boss.prototype.fire = function() {
	this.weapon.fireAtXY(this.fireX2, this.fireY);
	this.weapon1.fireAtXY(this.fireX1, this.fireY);
	this.fireY += 15;
}

Boss.prototype.ceaseFire = function() {
	this.firing = false;
	this.idling = true;
	this.animations.play('unfire');
	this.game.time.events.add(Phaser.Timer.SECOND*2, this.determineMove, this);
}

Boss.prototype.charge = function() {
	this.animations.play('charge');
	this.charging = true;
	this.idling = false;
	
	var x = this.thePlayer.x;
	if(x > this.x) {
		this.chargeRight = true;
		if(this.scale.x > 0) {
			this.scale.x *= -1;
		}
	}
	else {
		this.chargeRight = false;
		if(this.scale.x < 0) {
			this.scale.x *= -1;
		}
	}
	this.game.time.events.add(Phaser.Timer.SECOND*2, this.endCharge, this);
}

Boss.prototype.letsCharge = function() {
	
	if(this.chargeRight) {
		this.body.acceleration.x = this.chargeSpeed;
	}
	else {
		this.body.acceleration.x = -1 * this.chargeSpeed;
	}
}

Boss.prototype.endCharge = function() {
	this.animations.play('idle');
	this.idling = true;
	this.body.acceleration.x = 0;
	this.charging = false;
	this.game.time.events.add(Phaser.Timer.SECOND*2, this.determineMove, this);
}

Boss.prototype.repoChargeHitboxes = function() {
	var chargeBox;
	var killBox;
	if(this.chargeRight) {
		chargeBox = this.chargeBox1;
		chargeBox.body.x = this.x - chargeBox.width / 2 - 100;
		chargeBox.body.y = this.y - chargeBox.height / 2 + 10;
		chargeBox.anchor.set(0.5);
		
		chargeBox = this.chargeBox2;
		chargeBox.body.x = this.x - chargeBox.width / 2 + 60;
		chargeBox.body.y = this.y - chargeBox.height / 2 + 40;
		chargeBox.anchor.set(0.5);
		
		killBox = this.killBox1;
		killBox.body.x = this.x - chargeBox.width / 2 - 100;
		killBox.body.y = this.y - chargeBox.height / 2 + 10;
		killBox.anchor.set(0.5);
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 60;
		killBox.body.y = this.y - killBox.height / 2 + 40;
		killBox.anchor.set(0.5);
		
		killBox = this.killBox3;
		killBox.body.x = this.x - killBox.width/2 + 25;
		killBox.body.y = this.y - killBox.height / 2 - 110;
		killBox.anchor.set(0.5);
	}
	else {
		chargeBox = this.chargeBox1;
		chargeBox.body.x = this.x - chargeBox.width / 2 - 100;
		chargeBox.body.y = this.y - chargeBox.height / 2 + 40;
		chargeBox.anchor.set(0.5);
		
		chargeBox = this.chargeBox2;
		chargeBox.body.x = this.x - chargeBox.width / 2 + 40;
		chargeBox.body.y = this.y - chargeBox.height / 2 + 10;
		chargeBox.anchor.set(0.5);
		
		killBox = this.killBox1;
		killBox.body.x = this.x - killBox.width / 2 - 100;
		killBox.body.y = this.y - killBox.height / 2 + 40;
		killBox.anchor.set(0.5);
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 40;
		killBox.body.y = this.y - killBox.height / 2 + 10;
		killBox.anchor.set(0.5);
		
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/2 + 25;
		killBox.body.y = this.y - killBox.height / 2 - 110;
		killBox.anchor.set(0.5);
	}
}

Boss.prototype.hitWorldBounds = function () {
//	this.myWorld.shakeCameraLite();
}

Boss.prototype.setup = function() {
	this.set = true;
	this.disabled = false;
	this.invuln = false;
}

Boss.prototype.kills = function() {
	this.box.kill();
	this.killBox.kill();
	this.kill();
}
