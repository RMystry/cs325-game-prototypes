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
    
    let game = new Phaser.Game( 600, 900, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image('floor', 'assets/floor.png');
        game.load.image('player', 'assets/player.png');
    }
    let platforms;
    let tileWidth;
    let tileHeight;
    let player;
    let timer;
    let spacing = 300;
    let scoreLabel;
    let score;

    function addTile(x, y)
    {
        let tile = platforms.getFirstDead();
        tile.reset(x, y);
        tile.body.velocity.y = 150;
        tile.body.immovable = true;
        tile.checkWorldBounds = true;
        tile.outOfBoundsKill = true;
    }
    function addPlatform(y)
    {
        if(typeof(y) == "undefined")
        {
            y = -tileHeight;
        }
        let tilesNeeded = Math.ceil(game.world.width / tileWidth);
        let hole = Math.floor(Math.random() * ((tilesNeeded - 3)) + 1);
        for(let i = 0; i < tilesNeeded; i++)
        {
            if(i != hole && i != hole + 1)
            {
                addTile(i * tileWidth, y);
            }
        }
        if(typeof(y) == "undefined"){
            y = -tileHeight;
            incrementScore();
        }
    }
    function initalPlatforms()
    {
        let tileWidth = game.cache.getImage('floor').width;
        let tileHeight = game.cache.getImage('player').height;
        let bottom = game.world.height - tileHeight,
            top = tileHeight;
        for(let y = bottom; y > top - tileHeight; y = y - spacing)
        {
            addPlatform(y);
        }
    }
    function createPlayer()
    {
        let player = game.add.sprite(game.world.centerX, game.world.height - (spacing * 2 + (3 * tileHeight)), 'player');
        player.anchor.setTo(0.5, 1.0);
        game.physics.arcade.enable(player);
        player.enableBody = true;
        player.physicsBodyType = Phaser.Physics.Arcade;
        player.body.gravity.y = 2000;
        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.1;
    }
    function createScore()
    {
        var scoreFont = "100px Arial";
        scoreLabel = game.add.text((game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"});
        scoreLabel.anchor.setTo(0.5, 0.5);
        scoreLabel.align = 'center';
    }
    function incrementScore(){

        score += 1;  
        scoreLabel.text = score;     
     
    }
    function create() {
        tileWidth = game.cache.getImage('floor').width;
        tileHeight = game.cache.getImage('player').height;
        game.stage.backgroundColor = '479cde';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        platforms = game.add.group();
        platforms.enableBody = true;
        platforms.createMultiple(250, 'floor');
        timer = game.time.events.loop(2000,addPlatform, this);
        initalPlatforms();
        player = game.add.sprite(game.world.centerX, game.world.height - (spacing * 2 + (3 * tileHeight)), 'player');
        player.anchor.setTo(0.5, 1.0);
        game.physics.arcade.enable(player);
        player.enableBody = true;
        player.physicsBodyType = Phaser.Physics.Arcade;
        player.body.gravity.y = 2000;
        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.1;
        score = 0;
        createScore();
     }
    function update() {
        
        game.physics.arcade.collide(player,platforms);
        if(player.body.y >=game.world.height -player.body.height){
            GameOver();
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
           player.body.velocity.x += -30;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
           player.body.velocity.x += 30;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.body.wasTouching.down)
        {
           player.body.velocity.y = -1400;
        }
    }
};
