function Boss(game, atlas_key, atlas_frame, x, y, world, player, ironMode) {
	Phaser.Sprite.call(this, game, x, y, atlas_key, atlas_frame);

	this.ogX = x;
	this.ogY = y;
	
	this.ironMode = ironMode;
	this.type = "boss";
	
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	
	//this.animations.add('flail', Phaser.Animation.generateFrameNames('robobitch', 0, 7, '', 1), 15, true);
	//this.animations.add('idle', ['robobitch0'], 30, false);
	
	this.animations.add('idle', ['bossbot0'], 30, false);
	this.animations.add('charge', ['bossbot2'], 30, false);	
	this.animations.add('charge1', ['bossbot1'], 30, false);	
	this.animations.add('invincible', ['bossbot0'], 30, true);
	this.animations.add('control', ['bossbot5'], 30, false);
	this.animations.add('smash', ['bossbot6','bossbot7','bossbot8','bossbot9'], 11, false);
	this.animations.add('fire', ['bossbot3', 'bossbot4'], 11, false);
	this.animations.add('unfire', ['bossbot4', 'bossbot3','bossbot0'], 11, false);
	this.animations.add('almost', ['bossbot12','bossbot13'], 12, true);
	this.animations.add('death', ['bossbot12','bossbot13','bossbot12','bossbot13','bossbot12','bossbot13','bossbot14','bossbot15','bossbot16','bossbot17','bossbot18','bossbot19','bossbot20','bossbot21','bossbot22'], 7, false);
	this.animations.add('deathEnd', ['bossbot21'], 1, true);
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
	this.chargeBox1.type = "boss";
	this.chargeBox1.parent = this;
	
	this.chargeBox2 = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.chargeBox2, Phaser.Physics.ARCADE);
	this.chargeBox2.body.setSize(50, 100);
	this.chargeBox2.anchor.set(0.5);
	this.chargeBox2.type = "boss";
	this.chargeBox2.parent = this;
/*
	this.smashBox = this.game.add.sprite(this.x, this.y, null);
	this.game.physics.enable(this.smashBox, Phaser.Physics.ARCADE);
	this.smashBox.body.setSize(600, 20);
	this.smashBox.anchor.set(0.5);
	//this.smashBox.type = "smash";
	this.smashBox.parent = this;*/
	
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
	//this.health = 20;
	this.health = 100;
	this.recovering = false;	
	this.invuln = true;
	this.firePrep = false;
	this.takingDmg = false;
	this.recFromDmg = false;
	
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
	this.death_sound.volume = 4;
	
	this.scream_sound = this.game.add.audio('boss_scream');
	this.scream_sound.loop = false;
	this.scream_sound.volume = 3;
	
	this.pound_sound = this.game.add.audio('boss_pound');
	this.pound_sound.loop = false;
	this.pound_sound.volume = 3;
	
	this.spawn_sound = this.game.add.audio('robot_idle');
	this.spawn_sound.loop = false;
	this.spawn_sound.volume = 3;
	
	this.fly_sound = this.game.add.audio('bossFly');
	this.fly_sound.loop = false;
	this.fly_sound.volume = 3;
	
	this.laugh_sound = this.game.add.audio('boss_laugh');
	this.laugh_sound.loop = false;
	this.laugh_sound.volume = 3;
	
	this.dmg_sound = this.game.add.audio('boss_take_dmg');
	this.dmg_sound.loop = false;
	this.dmg_sound.volume = 3;
	
	this.timer = this.game.time.create(false);
	this.timer.start();
}

Boss.prototype = Object.create(Phaser.Sprite.prototype);
Boss.prototype.update = function() {
	// Ignores collision when doing jump attack
	if(!this.jumping){
		this.game.physics.arcade.collide(this, this.myWorld.ground.children);
	}
	
	// Enables boss hitboxes if not enabled
	if(!this.set) {
		this.setup();
	}
	
	// If the boss isnt dying
	if(!this.dying) {
		// If the boss isnt invulnverable and the fight has started
		if(!this.invuln && !this.disabled) {
			// Track collision of player bullets
			this.game.physics.arcade.overlap(this.killBox1, this.thePlayer.weapon.bullets, this.takeBulletDmg, null, this);
			this.game.physics.arcade.overlap(this.killBox2, this.thePlayer.weapon.bullets, this.takeBulletDmg, null, this);
			this.game.physics.arcade.overlap(this.killBox3, this.thePlayer.weapon.bullets, this.takeBulletDmg, null, this);
		}
		
		// If the player isnt invincible and isnt dying
		if(!this.thePlayer.invincible && !this.thePlayer.dying) {
			// Track collision of boss bullets
			this.game.physics.arcade.overlap(this.thePlayer, this.weapon.bullets, this.thePlayer.stupidPlayer2, null, this.thePlayer);
			this.game.physics.arcade.overlap(this.thePlayer, this.weapon1.bullets, this.thePlayer.stupidPlayer2, null, this.thePlayer);
			
			// If the boss is shooting
			if(this.charging) {
				// Track collision of box charge boxes
				this.game.physics.arcade.overlap(this.thePlayer, this.chargeBox1, this.thePlayer.determineLoser, null, this.thePlayer);
				this.game.physics.arcade.overlap(this.thePlayer, this.chargeBox2, this.thePlayer.determineLoser, null, this.thePlayer);
			}


			if(this.recovering) {
				if(this.thePlayer.body.touching.down) {
					this.thePlayer.body.maxVelocity.x = 2000;
					this.thePlayer.body.acceleration.x = 0;

					if(this.thePlayer.x < this.x) {
						this.thePlayer.body.velocity.x = -1075;
					}
					else if(this.thePlayer.x > this.x) {
						this.thePlayer.body.velocity.x = 1075;
					}

					this.thePlayer.pauseInput(1.5);
					this.game.time.events.add(Phaser.Timer.SECOND*1.5, this.thePlayer.loseInvinc, this);

					this.game.time.events.add(Phaser.Timer.SECOND*1, function() {
						this.thePlayer.body.maxVelocity.x = 350;
					}, this);
				}
			//	this.game.physics.arcade.overlap(this.thePlayer, this.smashBox, this.thePlayer.determineLoser, null, this.thePlayer);
			}
		}
			
		// Do nothing if the boss is stunned
		if(this.takingDmg) {
		}
		// Repo charge hitboxes and charge if boss is charging
		else if(this.charging) {
			this.repoChargeHitboxes();
			this.letsCharge();
		}
		// Repo hitboxes if boss is about to firing
		else if(this.firePrep) {
			this.setKillBoxesFirePrep();
		}
		// Repo hitboxes and fire if boss is firing
		else if(this.firing) {
			this.setKillBoxesFire();
			this.fire();
		}
		// Repo hitboxes if boss is jumping
		else if(this.jumping) {
			this.setKillBoxesJump();
		}
		// Repo hitboxes if boss is landing from jump
		else if(this.recovering) {
			this.setKillBoxesRecovery();
		}
		// Repo hitboxes if boss is doing nothing
		else if(this.idling) {
			if(this.animations.currentFrame.index == 9) {
				this.setKillBoxesRecovery();
			}
			else {
				this.setKillBoxesIdle();
			}
			this.idleTime();
		}
		// Do nothing if disabled or controlling robots
		else if(this.disabled || this.inControl) {
		}
		// If boss is doing absolutely nothing
		else{
			this.setKillBoxesIdle();
		}
	}
}

// Plays boss scream sound
Boss.prototype.scream = function() {
	this.scream_sound.play();
}

// Plays boss death animation
Boss.prototype.deathAnim = function() {
	this.animations.play('death');
	this.dying = true;
}

// Is called when the player fires on the boss
Boss.prototype.takeBulletDmg = function(killBox, bullet) {
	bullet.kill();
	this.health--;
	
	console.log(this.health);
	// If the boss is at 75, 50, or 25, stun boss
	if(this.health == 75 || this.health == 50 || this.health == 25) {
		// Removes any pending events from the boss
		if(this.timer.events.length > 0) {
			this.timer.removeAll();
		}
		
		// Stuns boss
		this.body.acceleration.x = 0;
		this.body.acceleration.y = 0;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		
		this.takingDmg = true;
		this.idling = false;
		this.inControl = false;
		this.charging = false;
		this.jumping = false;
		this.firing = false;
		this.firePrep = false;
		this.recovering = false;
		
		if(this.laugh_sound.isPlaying) {
			this.laugh_sound.stop();
		}
		if(this.dmg_sound.isPlaying) {
			this.dmg_sound.stop();
		}
		if(this.fly_sound.isPlaying) {
			this.fly_sound.stop();
		}
		if(this.spawn_sound.isPlaying) {
			this.spawn_sound.stop();
		}
		if(this.fire_sound.isPlaying) {
			this.fire_sound.stop();
		}
		if(this.death_sound.isPlaying) {
			this.death_sound.stop();
		}
		if(this.scream_sound.isPlaying) {
			this.scream_sound.stop();
		}
		
		// Do super dmg
		this.dmg_sound.play();
		this.animations.play('bobble');
		this.invuln = true;
		this.myWorld.shakeCameraMed2();
		
		// If this is the first iteration of the boss
		if(!this.ironMode) {
			this.timer.add(Phaser.Timer.SECOND*1.5, function() {
				this.animations.play('idle');
				this.takingDmg = false;
				this.recFromDmg = false;
				this.invuln = false;
				this.control();
			},this);
		}
		// If this is the ironMode boss
		else {
			this.timer.add(Phaser.Timer.SECOND*1.5, function() {
				this.animations.play('idle');
				this.takingDmg = false;
				this.recFromDmg = false;
				this.invuln = false;
				this.determineMove();
			},this);
		}
	}
	// If the boss has no health left
	else if(this.health == 0) {
		// Remove any pending events from boss
		if(this.timer.events.length > 0) {
			this.timer.removeAll();
		}
		
		// Stun boss
		this.body.acceleration.x = 0;
		this.body.acceleration.y = 0;
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
		
		this.dying = true;
		this.takingDmg = false;
		this.idling = false;
		this.inControl = false;
		this.charging = false;
		this.firing = false;
		this.jumping = false;
		this.firePrep = false;
		this.recovering = false;
		
		this.animations.play('almost');
		this.timer.add(Phaser.Timer.SECOND*.1, function() {
			this.dmg_sound.play();
		}, this);
		this.timer.add(Phaser.Timer.SECOND*1, function() {
			this.dmg_sound.play();
		}, this);
		this.timer.add(Phaser.Timer.SECOND*2, function() {
			this.dmg_sound.play();
		}, this);
		this.timer.add(Phaser.Timer.SECOND*3, function() {
			this.dmg_sound.play();
		}, this);

		// Kills boss
		this.myWorld.bg_music.fadeTo(4000, 2.5);
		this.timer.add(Phaser.Timer.SECOND*4.1, this.toDie, this);
		this.myWorld.shakeCameraLong();
	}
	// if taking reg damage
	else {
		// Shakes camera a bit
		this.myWorld.shakeCameraLite();
	}
}

// Plays the death sequence
Boss.prototype.toDie = function() {
	this.death_sound.play();
	this.animations.play('death');
	this.timer.add(Phaser.Timer.SECOND*2, this.deathEnd, this);
	this.myWorld.bg_music.fadeTo()
}

// Last frame of boss death
Boss.prototype.deathEnd = function() {
	this.animations.play('deathEnd');
	this.timer.add(Phaser.Timer.SECOND*3, this.myWorld.revivePortal, this.myWorld);
}

// Reposition hit boxes for boss idle
Boss.prototype.setKillBoxesIdle = function() {
	var killBox = this.killBox1;
	killBox.body.x = this.x - killBox.width / 2 - 105;
	killBox.body.y = this.y - killBox.height / 2 + 40;
	killBox.anchor.set(0.5);
	killBox.body.width = 50;
	killBox.body.height = 100;
	
	killBox = this.killBox2;
	killBox.body.x = this.x - killBox.width / 2 + 50;
	killBox.body.y = this.y - killBox.height / 2 + 40;
	killBox.anchor.set(0.5);
	killBox.body.width = 50;
	killBox.body.height = 100;
	
	killBox = this.killBox3;
	killBox.body.x = this.x - this.body.width/5 + 8;
	killBox.body.y = this.y - 100;
	killBox.anchor.set(0.5);
}

// Reposition hit boxes for boss recovery
Boss.prototype.setKillBoxesRecovery = function() {
	var hitbox;
	var killBox;
	if(this.animations.currentFrame.index == 9) {
		killBox = this.killBox1;
		killBox.body.x = this.x - killBox.width / 2 - 145;
		killBox.body.y = this.y - killBox.height / 2 + 50;
		killBox.anchor.set(0.5);
		killBox.body.width = 50;
		killBox.body.height = 100;
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 95;
		killBox.body.y = this.y - killBox.height / 2 + 60;
		killBox.anchor.set(0.5);
		killBox.body.width = 50;
		killBox.body.height = 100;
		
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 50;
		killBox.anchor.set(0.5);	
/*
		hitbox = this.smashBox;
		hitbox.body.x = this.x - 300;
		hitbox.body.y = this.y + this.height/2;
		//hitbox.anchor.set(0.5);
*/	}
}

// Reposition hit boxes for boss jump
Boss.prototype.setKillBoxesJump = function() {
	var killBox;

	if(this.animations.currentFrame.index == 10) {
		killBox = this.killBox1;
		killBox.body.x = this.x - killBox.width / 2 - 155;
		killBox.body.y = this.y;
		killBox.anchor.set(0.5);
		killBox.body.width = 50;
		killBox.body.height = 80;
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 105;
		killBox.body.y = this.y;
		killBox.anchor.set(0.5);
		killBox.body.width = 50;
		killBox.body.height = 80;
		
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 75;
		killBox.anchor.set(0.5);
	}
	else if(this.animations.currentFrame.index == 11) {
		killBox = this.killBox1;
		killBox.body.x = this.x - killBox.width / 2 - 170;
		killBox.body.y = this.y + 50;
		killBox.anchor.set(0.5);
		killBox.body.width = 65;
		killBox.body.height = 50;
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 105;
		killBox.body.y = this.y + 50;
		killBox.anchor.set(0.5);
		killBox.body.width = 65;
		killBox.body.height = 50;
		
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 77;
		killBox.anchor.set(0.5);
	}
	else if(this.animations.currentFrame.index == 12) {
		killBox = this.killBox1;
		killBox.body.x = this.x - killBox.width / 2 - 187;
		killBox.body.y = this.y;
		killBox.anchor.set(0.5);
		killBox.body.width = 65;
		killBox.body.height = 50;
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 137;
		killBox.body.y = this.y;
		killBox.anchor.set(0.5);
		killBox.body.width = 65;
		killBox.body.height = 50;
		
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 77;
		killBox.anchor.set(0.5);
	}
	else if(this.animations.currentFrame.index == 13) {
		killBox = this.killBox1;
		killBox.body.x = this.x - killBox.width / 2 - 105;
		killBox.body.y = this.y - 150;
		killBox.anchor.set(0.5);
		killBox.body.width = 50;
		killBox.body.height = 100;
		
		killBox = this.killBox2;
		killBox.body.x = this.x - killBox.width / 2 + 55;
		killBox.body.y = this.y - 150;
		killBox.anchor.set(0.5);
		killBox.body.width = 50;
		killBox.body.height = 100;
		
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 77;
		killBox.anchor.set(0.5);
	}
}

// Reposition hit boxes for boss fire
Boss.prototype.setKillBoxesFire = function() {
	var killBox = this.killBox1;
	killBox.body.width = 100;
	killBox.body.height = 50;
	killBox.body.x = this.x - this.width / 2 + 20;
	killBox.body.y = this.y - 60;
	killBox.anchor.set(0.5);
	
	killBox = this.killBox2;
	killBox.body.width = 100;
	killBox.body.height = 50;
	killBox.body.x = this.x + 125;
	killBox.body.y = this.y - 60;
	killBox.anchor.set(0.5);
			
	killBox = this.killBox3;
	killBox.body.x = this.x - this.body.width/5 + 8;
	killBox.body.y = this.y - killBox.height / 2 - 100;
	killBox.anchor.set(0.5);
}

// Reposition hit boxes for boss fire prep
Boss.prototype.setKillBoxesFirePrep = function() {
	var killBox;
	
	if(this.animations.currentFrame.index == 0) {
		killBox = this.killBox1;
		killBox.body.width = 100;
		killBox.body.height = 50;
		killBox.body.x = this.x - this.width / 2 + 20;
		killBox.body.y = this.y - 60;
		killBox.anchor.set(0.5);
		
		killBox = this.killBox2;
		killBox.body.width = 100;
		killBox.body.height = 50;
		killBox.body.x = this.x + 125;
		killBox.body.y = this.y - 60;
		killBox.anchor.set(0.5);
				
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 100;
		killBox.anchor.set(0.5);
	}
	else if(this.animations.currentFrame.index == 3) {
		killBox = this.killBox1;
		killBox.body.width = 70;
		killBox.body.height = 50;
		killBox.body.x = this.x - this.width / 2 + 25;
		killBox.body.y = this.y + 25;
		killBox.anchor.set(0.5);
		
		killBox = this.killBox2;
		killBox.body.width = 70;
		killBox.body.height = 50;
		killBox.body.x = this.x + 140;
		killBox.body.y = this.y + 20;
		killBox.anchor.set(0.5);
				
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 100;
		killBox.anchor.set(0.5);
	}
	else if(this.animations.currentFrame.index == 4) {
		killBox = this.killBox1;
		killBox.body.width = 100;
		killBox.body.height = 50;
		killBox.body.x = this.x - this.width / 2 + 20;
		killBox.body.y = this.y - 60;
		killBox.anchor.set(0.5);

		killBox = this.killBox2;
		killBox.body.width = 100;
		killBox.body.height = 50;
		killBox.body.x = this.x + 125;
		killBox.body.y = this.y - 60;
		killBox.anchor.set(0.5);
				
		killBox = this.killBox3;
		killBox.body.x = this.x - this.body.width/5 + 8;
		killBox.body.y = this.y - killBox.height / 2 - 100;
		killBox.anchor.set(0.5);
	}
}

// Reposition hit boxes for boss charge
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

Boss.prototype.determineMove = function() {
	this.invuln = false;
	// Determine move if nothing else is being done
	if(!this.takingDmg && !this.charging && !this.firing && !this.inControl && !this.jumping && !this.dying && !this.firePrep) {
		this.idle();
		var nextAttack = 0;
		var rand = 0;

		// gets distance to player
		var x = this.x - this.thePlayer.x;
		var y = this.y - this.thePlayer.y;
		var dist = Math.sqrt((x*x) + (y*y));
		
		// If this is the first boss iteration
		if(!this.ironMode) {
			rand = Math.floor(Math.random() * 6);
		
			if(rand >= 0 && rand <= 1) {
				nextAttack = 0;
			}
			else if(rand > 1 && rand <= 3) {
				nextAttack = 1;
			}
			else if(rand > 3 && rand <= 5) {
				nextAttack = 2;
			}
			
			// if the player is really far, boss will charge
			if(dist > 700 || this.checkWalls()) {
				nextAttack = 0;
			}

			// If boss isnt stunned and isnt dying
			if(!this.takingDmg && !this.dying) {
				// Calls charge, fire, or jump based on random number
				if(nextAttack == 0){
					this.timer.add(Phaser.Timer.SECOND*2, this.charge, this);
				}
				else if(nextAttack == 1) {
					this.timer.add(Phaser.Timer.SECOND*0.9, this.startFireAnim, this);
					this.timer.add(Phaser.Timer.SECOND*1.7, this.openFire, this);
				}
				else if(nextAttack == 2) {
					this.timer.add(Phaser.Timer.SECOND*.9, this.jump, this);
				}
			}
		}
		// If this is the 2nd iteration of the boss
		else {
			rand = Math.floor(Math.random() * 8);

			if(rand >= 0 && rand <= 1) {
				nextAttack = 0;
			}
			else if(rand > 1 && rand <= 3) {
				nextAttack = 1;
			}
			else if(rand > 3 && rand <= 5) {
				nextAttack = 2;
			}
			else if(rand > 5 && rand <= 7) {
				nextAttack = 3;
			}
			
			// Charges if player is really far
			if(dist > 700 || this.checkWalls()) {
				nextAttack = 0;
			}

			// If boss isnt stunned and isnt dying
			if(!this.takingDmg && !this.dying) {
				// Calls charge, fire, jump, or control based on random number
				if(nextAttack == 0){
					this.timer.add(Phaser.Timer.SECOND*2, this.charge, this);
				}
				else if(nextAttack == 1) {
					this.timer.add(Phaser.Timer.SECOND*0.9, this.startFireAnim, this);
					this.timer.add(Phaser.Timer.SECOND*1.7, this.openFire, this);
				}
				else if(nextAttack == 2) {
					this.timer.add(Phaser.Timer.SECOND*.9, this.jump, this);
				}
				else if(nextAttack == 3) {
					this.timer.add(Phaser.Timer.SECOND*1.2, this.control, this);
				}
			}	
		}
	}
}

// Super cool jump attack
Boss.prototype.jump = function() {
	// Jumps
	this.jumping = true;
	this.idling = false;
	
	this.animations.play('smash');
	this.body.velocity.y = -700;
	// Ends jump in 1.35 seconds
	this.timer.add(Phaser.Timer.SECOND*1.35, this.endJump, this);
}

Boss.prototype.recover = function() {
	this.recovering = false;
}

// Boss lands from jump
Boss.prototype.endJump = function() {
	// Ends jump
	this.jumping = false;
	this.recovering = true;
	this.idling = true;
	this.pound_sound.play();
	this.animations.play('control');
	this.myWorld.shakeCameraMed();
	// Goes to next attack
	this.timer.add(Phaser.Timer.SECOND*.4, this.recover, this);
	this.timer.add(Phaser.Timer.SECOND*.9, this.determineMove, this);
}

// Spawns minions to take control of
Boss.prototype.control = function() {
	// Stops movement
	// Turns invulverable
	this.inControl = true;
	this.idling = false;
	this.invuln = true;
	this.animations.play('control');
	this.spawn_sound.play();
	this.laugh_sound.play();
	
	this.timer.add(Phaser.Timer.SECOND*.9, this.myWorld.callMinions, this.myWorld);
}

// Always nothing forever
Boss.prototype.idle = function() {
	this.idling = true;
	this.recovering = false;
	var x = Math.floor(Math.random() * 2);

	// moved left or right based on random num, no longer used i think
	if(x) {
		this.idleLeft = false;
	}
	else {
		this.idleLeft = true;
	}
}

// Literally do nothing
Boss.prototype.idleTime = function() {
	if(this.animations.currentFrame.index == this.animations.frameTotal-1) {
		this.animations.play('idle');
	}
}

// Starts firing animation
Boss.prototype.startFireAnim = function() {
	this.animations.play('fire');
	this.firePrep = true;
}

// Starts shooting
Boss.prototype.openFire = function() {
	this.idling = false;
	this.body.acceleration.x = 0;
	
	// Sets positioning for firing
	this.fireY = this.y - 600;
	this.fireX1 = this.x - 800;
	this.fireX2 = this.x + 800;
	this.firePrep = false;
	this.firing = true;
	
	// Sets weapon positions
	this.weapon.x = this.x + this.width/2 - 8;
	this.weapon.y = this.y - 30;
	this.weapon1.x = this.x - this.width/2 + 8;
	this.weapon1.y = this.y - 30;
	
	this.fire_sound.play();
	// Ends shooting in 1.3s
	this.timer.add(Phaser.Timer.SECOND*1.3, this.ceaseFire, this);
}

Boss.prototype.fire = function() {
	// Shoots left and right, from top to bottom
	this.weapon.fireAtXY(this.fireX2, this.fireY);
	this.weapon1.fireAtXY(this.fireX1, this.fireY);
	// increase y value of targe
	this.fireY += 15;
}

// Stops shooting
Boss.prototype.ceaseFire = function() {
	this.firing = false;
	this.idling = true;
	this.animations.play('unfire');
	// Moves to next attack
	this.timer.add(Phaser.Timer.SECOND*1, this.determineMove, this);
}

// Starts boss charge attack
Boss.prototype.charge = function() {
	this.charging = true;
	this.idling = false;
	
	this.fly_sound.play();
	
	// Charges towards the player
	var x = this.thePlayer.x;
	if(x > this.x) {
		this.animations.play('charge1');
		this.chargeRight = true;
	}
	else {
		this.animations.play('charge');
		this.chargeRight = false;
	}
	// Ends charge after 2 seconds
	this.timer.add(Phaser.Timer.SECOND*2, this.endCharge, this);
}

// Moves boss during charge
Boss.prototype.letsCharge = function() {
	// if charging right
	if(this.chargeRight) {
		// move boss right
		this.body.acceleration.x = this.chargeSpeed;
	}
	else {
		// move boss left
		this.body.acceleration.x = -1 * this.chargeSpeed;
	}
}

// Stops boss charge attack
Boss.prototype.endCharge = function() {
	// Ends charge
	this.fly_sound.stop();
	this.animations.play('idle');
	this.idling = true;
	this.body.acceleration.x = 0;
	this.charging = false;

	// Starts new attack
	this.timer.add(Phaser.Timer.SECOND*1, this.determineMove, this);
}

// Checks the distance between the boss and walls
Boss.prototype.checkWalls = function() {
	if(this.x < 0 + this.width/2 + 40 || this.x > this.game.world.width - this.width/2 - 40) {
		return true;
	}
	else {
		return false;
	}
}

// Stops all acceleration
Boss.prototype.dropAccel = function() {
	this.body.acceleration.x = 0;
	this.body.acceleration.y = 0;
}

// When boss hits world bounds
Boss.prototype.hitWorldBounds = function () {
//	this.myWorld.shakeCameraLite();
}

// Starts the boss fight
Boss.prototype.setup = function() {
	this.set = true;
	this.invuln = false;
}

// Enables boss at the start of fire
Boss.prototype.enable = function() {
	this.disabled = false;
}

// Kills boss
Boss.prototype.kills = function() {
	this.box.kill();
	this.killBox.kill();
	this.kill();
}
