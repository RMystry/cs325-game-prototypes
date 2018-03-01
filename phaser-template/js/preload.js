let Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image('tile', 'assets/floor.png');
        this.game.load.image('player', 'assets/player.png');
	},

	create: function(){
		this.game.state.start("Main");
	}
}