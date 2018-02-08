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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/penguin.png' );
        game.load.audio( 'fast_drawing', 'assests/fast_drawing.mp3')
    }
    
    var bouncy;
    var se;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        se = game.add.audio('fast_drawing');
        se.play();
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Move it around using the arrow keys!", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function update() {
        se.mute = false;
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            bouncy.x -= 20;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            bouncy.x += 20; 
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            bouncy.y -= 20; 
            se.volume -= 0.1;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            bouncy.y += 20;
            se.volume += 0.1;
        }
    }
};
