"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    let game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image('floor', 'assets/floor.png');
        game.load.image('player', 'assets/player.png');
    }
    function addTile(x, y)
    {
        let me = this;
        let tile = me.platforms.getFirstDead();
        tile.reset(x, y);
        tile.body.velocity.y = 150;
        tile.body.immovable = true;
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
    }
    function addPlatform(y)
    {
        let me = this;
        if(typeof(y) == "undefined")
        {
            y = -me.tileHeight;
        }
        let tilesNeeded = Math.ceil(me.game.world.width / me.tileWidth);
        let hole = Math.floor(Math.random() * (tilesNeeded - 3)) + 1;
        for(let i = 0; i < tilesNeeded; i++)
        {
            if(i != hole && i != hole + 1)
            {
                me.addTile(i * me.tileWidth, y);
            }
        }
        if(typeof(y) == "undefined"){
            y = -me.tileHeight;
            //Increase the players score
            me.incrementScore();
        }
    }
    function initPlatforms()
    {
        let me = this,
            bottom = me.game.world.height - me.tileHeight,
            top = me.tileHeight;
        for(let y = bottom; y > top - me.tileHeight; y = y - me.spacing)
        {
            me.addplatform(y);
        }
    }
    function createPlayer()
    {
        let me = this;
        me.player = me.game.add.sprite(me.game.world.centerX, me.game.world.height - (me.spacing * 2 + (3 * me.tileHeight)), 'player');
        me.player.anchor.setTo(0.5, 1.0);
        me.game.physics.arcade.enable(me.player);
        me.player.body.gravity.y = 2000;
        me.player.body.collideWorldBounds = true;
        me.player.body.bounce.y = 0.1;
    }
    function createScore()
    {
        let me = this;
        let scoreFont = "100px Arial";
        me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
        me.scoreLabel.anchor.setTo(0.5, 0.5);
        me.scoreLabel.align = 'center';
    }
    function incrementScore(){
 
        var me = this;

        me.score += 1;  
        me.scoreLabel.text = me.score;     
     
    }
    function create() {
        let me = this;
        me.tileWidth = me.cache.getImage('floor').width;
        me.tileHeight = me.cache.getImage('flooe').height;
        me.game.stage.backgroundColor = '479cde';
        me.game.physics.startSystem(Phaser.Physics.ARCADE);
        me.platforms = me.game.add.group();
        me.platforms.enableBody = true;
        me.platforms.createMultiple(250, 'floor');
        me.timer = game.time.events.loop(2000, me.addPlatform, me);
        me.spacing = 300;
        me.initPlatforms();
        me.createPlayer();
        me.score = 0;
        me.createScore();
     }
    function update() {
        let me = this;
        me.game.physics.arcade.collide(me.player, me.platforms);
        if(me.player.body.position.y >= me.game.world.height - me.player.body.height){
            me.gameOver();
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            me.player.body.velocity.x += -30;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            me.player.body.velocity.x += 30;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP) && me.player.body.wasTouching.down)
        {
            me.player.body.velocity.y = -1400;
        }
    }
};
