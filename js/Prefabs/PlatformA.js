function PlatformA(game, atlas, frame, tileCount) {
	Phaser.Group.call(this, game);
	this.game = game;
	this.createPlat(atlas, frame, tileCount);
};

PlatformA.prototype = Object.create(Phaser.Group.prototype);
PlatformA.prototype.constructor = PlatformA;

// spawns a platform with the given tileCount and random tile rotations
PlatformA.prototype.createPlat = function(atlas, frame, tileCount) {
	for(i=0; i<tileCount; i+=1) {
		let rand = Math.floor(Math.random() * 3);
		this.add(new Tile(this.game, atlas, frame, 32 + (i * 32), 568, 0.5, 0.5, (rand * Math.PI/2)));
	}
}

