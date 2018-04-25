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
    
    var game = new Phaser.Game(800,600, Phaser.AUTO, 'phaser-demo', {preload: preload, create: create, update: update, render: render});

    var player;
    var greenEnemies;
    var blueEnemies;
    var yellowEnemies;
    var enemyBullets;
    var starfield;
    var cursors;
    var bank;
    var shipTrail;
    var explosions;
    var playerDeath;
    var bullets;
    var fireButton;
    var bulletTimer = 0;
    var shields;
    var score = 0;
    var scoreText;
    var greenEnemyLaunchTimer;
    var greenEnemySpacing = 1000;
    var blueEnemyLaunchTimer;
    var blueEnemyLaunched = false;
    var yellowEnemyLaunchTimer;
    var yellowEnemyLaunched = false;
    var gameOver;
    
    var ACCLERATION = 600;
    var DRAG = 400;
    var MAXSPEED = 400;
    
    function preload() {
        game.load.image('starfield', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/starfield.png');
        game.load.image('ship', 'assets/player.jpg');
        game.load.image('bullet', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/bullet.png');
        game.load.image('enemy-green', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-green.png');
        game.load.image('enemy-blue', 'assets/red-Ship.jpg');
        game.load.image('blueEnemyBullet', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-blue-bullet.png');
        game.load.spritesheet('explosion', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/explode.png', 128, 128);
        game.load.bitmapFont('spacefont', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/spacefont/spacefont.png', 'https://rawgit.com/jschomay/phaser-demo-game/master/assets/spacefont/spacefont.xml');
        game.load.image('yellow-enemy', 'assets/yellow-enemy.png');  
    }
    
    function create() {
        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    
        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
    
        //  The hero!
        player = game.add.sprite(400, 500, 'ship');
        player.health = 100;
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        player.body.drag.setTo(DRAG, DRAG);
        player.weaponLevel = 1
        player.events.onKilled.add(function(){
            shipTrail.kill();
        });
        player.events.onRevived.add(function(){
            shipTrail.start(false, 5000, 10);
        });
    
        //  The baddies!
        greenEnemies = game.add.group();
        greenEnemies.enableBody = true;
        greenEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        greenEnemies.createMultiple(5, 'enemy-green');
        greenEnemies.setAll('anchor.x', 0.5);
        greenEnemies.setAll('anchor.y', 0.5);
        greenEnemies.setAll('scale.x', 0.5);
        greenEnemies.setAll('scale.y', 0.5);
        greenEnemies.setAll('angle', 180);
        greenEnemies.forEach(function(enemy){
            addEnemyEmitterTrail(enemy);
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.damageAmount = 20;
            enemy.events.onKilled.add(function(){
                enemy.trail.kill();
            });
        });
    
        game.time.events.add(1000, launchGreenEnemy);
    
        //  Blue enemy's bullets
        blueEnemyBullets = game.add.group();
        blueEnemyBullets.enableBody = true;
        blueEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemyBullets.createMultiple(30, 'blueEnemyBullet');
        blueEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
        blueEnemyBullets.setAll('alpha', 0.9);
        blueEnemyBullets.setAll('anchor.x', 0.5);
        blueEnemyBullets.setAll('anchor.y', 0.5);
        blueEnemyBullets.setAll('outOfBoundsKill', true);
        blueEnemyBullets.setAll('checkWorldBounds', true);
        blueEnemyBullets.forEach(function(enemy){
            enemy.body.setSize(20, 20);
        });
          //  More baddies!
        blueEnemies = game.add.group();
        blueEnemies.enableBody = true;
        blueEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        blueEnemies.createMultiple(30, 'enemy-blue');
        blueEnemies.setAll('anchor.x', 0.5);
        blueEnemies.setAll('anchor.y', 0.5);
        blueEnemies.setAll('scale.x', 0.5);
        blueEnemies.setAll('scale.y', 0.5);
        blueEnemies.setAll('angle', 180);
        blueEnemies.forEach(function(enemy){
            enemy.damageAmount = 40;
        });
        //yellow enemy's bullets
        yellowEnemyBullets = game.add.group();
        yellowEnemyBullets.enableBody = true;
        yellowEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        yellowEnemyBullets.createMultiple(30, 'blueEnemyBullet');
        yellowEnemyBullets.callAll('crop', null, {x: 90, y: 0, width: 90, height: 70});
        yellowEnemyBullets.setAll('alpha', 0.9);
        yellowEnemyBullets.setAll('anchor.x', 0.5);
        yellowEnemyBullets.setAll('anchor.y', 0.5);
        yellowEnemyBullets.setAll('outOfBoundsKill', true);
        yellowEnemyBullets.setAll('checkWorldBounds', true);
        yellowEnemyBullets.forEach(function(enemy){
            enemy.body.setSize(20, 20);
        });
        //  More baddies!
        yellowEnemies = game.add.group();
        yellowEnemies.enableBody = true;
        yellowEnemies.physicsBodyType = Phaser.Physics.ARCADE;
        yellowEnemies.createMultiple(30, 'yellow-enemy');
        yellowEnemies.setAll('anchor.x', 0.5);
        yellowEnemies.setAll('anchor.y', 0.5);
        yellowEnemies.setAll('scale.x', 0.5);
        yellowEnemies.setAll('scale.y', 0.5);
        yellowEnemies.setAll('angle', 180);
        yellowEnemies.forEach(function(enemy){
            enemy.damageAmount = 20;
        });
      
    
        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
        //  Add an emitter for the ship's trail
        shipTrail = game.add.emitter(player.x, player.y + 10, 400);
        shipTrail.width = 10;
        shipTrail.makeParticles('bullet');
        shipTrail.setXSpeed(30, -30);
        shipTrail.setYSpeed(200, 180);
        shipTrail.setRotation(50,-50);
        shipTrail.setAlpha(1, 0.01, 800);
        shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
        shipTrail.start(false, 5000, 10);
    
        //  An explosion pool
        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(30, 'explosion');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach( function(explosion) {
            explosion.animations.add('explosion');
        });
    
        //  Big explosion
        playerDeath = game.add.emitter(player.x, player.y);
        playerDeath.width = 50;
        playerDeath.height = 50;
        playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
        playerDeath.setAlpha(0.9, 0, 800);
        playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);
    
        //  Shields stat
        shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 50);
        shields.render = function () {
            shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
        };
        shields.render();
    
        //  Score
        scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
        scoreText.render = function () {
            scoreText.text = 'Score: ' + score;
        };
        scoreText.render();
    
        //  Game over text
        gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
        gameOver.x = gameOver.x - gameOver.textWidth / 2;
        gameOver.y = gameOver.y - gameOver.textHeight / 3;
        gameOver.visible = false;
    }
    
    function update() {
        //  Scroll the background
        starfield.tilePosition.y += 2;
    
        //  Reset the player, then check for movement keys
        player.body.acceleration.x = 0;
    
        if (cursors.left.isDown)
        {
            player.body.acceleration.x = -ACCLERATION;
        }
        else if (cursors.right.isDown)
        {
            player.body.acceleration.x = ACCLERATION;
        }
    
        //  Stop at screen edges
        if (player.x > game.width - 50) {
            player.x = game.width - 50;
            player.body.acceleration.x = 0;
        }
        if (player.x < 50) {
            player.x = 50;
            player.body.acceleration.x = 0;
        }
    
        //  Fire bullet
        if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
            fireBullet();
        }
    
        //  Move ship towards mouse pointer
        if (game.input.x < game.width - 20 &&
            game.input.x > 20 &&
            game.input.y > 20 &&
            game.input.y < game.height - 20) {
            var minDist = 200;
            var dist = game.input.x - player.x;
            player.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);
        }
    
        //  Squish and rotate ship for illusion of "banking"
        bank = player.body.velocity.x / MAXSPEED;
        player.scale.x = 1 - Math.abs(bank) / 2;
        player.angle = bank * 30;
    
        //  Keep the shipTrail lined up with the ship
        shipTrail.x = player.x;
    
        //  Check collisions
        game.physics.arcade.overlap(player, greenEnemies, shipCollide, null, this);
        game.physics.arcade.overlap(greenEnemies, bullets, hitEnemy, null, this);
    
        game.physics.arcade.overlap(player, blueEnemies, shipCollide, null, this);
        game.physics.arcade.overlap(bullets, blueEnemies, hitEnemy, null, this);
    
        game.physics.arcade.overlap(blueEnemyBullets, player, enemyHitsPlayer, null, this);
    
        //  Game over?
        if (! player.alive && gameOver.visible === false) {
            gameOver.visible = true;
            gameOver.alpha = 0;
            var fadeInGameOver = game.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();
            function setResetHandlers() {
                //  The "click to restart" handler
                tapRestart = game.input.onTap.addOnce(_restart,this);
                spaceRestart = fireButton.onDown.addOnce(_restart,this);
                function _restart() {
                  tapRestart.detach();
                  spaceRestart.detach();
                  restart();
                }
            }
        }
    }
    
    function render() {
        // for (var i = 0; i < greenEnemies.length; i++)
        // {
        //     game.debug.body(greenEnemies.children[i]);
        // }
        // game.debug.body(player);
    }
    
    function fireBullet() {
        switch (player.weaponLevel) {
            case 1:
            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > bulletTimer)
            {
                var BULLET_SPEED = 400;
                var BULLET_SPACING = 250;
                //  Grab the first bullet we can from the pool
                var bullet = bullets.getFirstExists(false);
    
                if (bullet)
                {
                    //  And fire it
                    //  Make bullet come out of tip of ship with right angle
                    var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                    bullet.reset(player.x + bulletOffset, player.y);
                    bullet.angle = player.angle;
                    game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
                    bullet.body.velocity.x += player.body.velocity.x;
    
                    bulletTimer = game.time.now + BULLET_SPACING;
                }
            }
            
    
            case 2:
            if (game.time.now > bulletTimer) {
                var BULLET_SPEED = 400;
                var BULLET_SPACING = 550;
    
    
                for (var i = 0; i < 3; i++) {
                    var bullet = bullets.getFirstExists(false);
                    if (bullet) {
                        //  Make bullet come out of tip of ship with right angle
                        var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                        bullet.reset(player.x + bulletOffset, player.y);
                        //  "Spread" angle of 1st and 3rd bullets
                        var spreadAngle;
                        if (i === 0) spreadAngle = -20;
                        if (i === 1) spreadAngle = 0;
                        if (i === 2) spreadAngle = 20;
                        bullet.angle = player.angle + spreadAngle;
                        game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                        bullet.body.velocity.x += player.body.velocity.x;
                    }
                    bulletTimer = game.time.now + BULLET_SPACING;
                }
            }
            case 3:
            if (game.time.now > bulletTimer) {
                var BULLET_SPEED = 400;
                var BULLET_SPACING = 550;
    
    
                for (var i = 0; i < 5; i++) {
                    var bullet = bullets.getFirstExists(false);
                    if (bullet) {
                        //  Make bullet come out of tip of ship with right angle
                        var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
                        bullet.reset(player.x + bulletOffset, player.y);
                        //  "Spread" angle of 1st and 3rd bullets
                        var spreadAngle;
                        if (i === 0) spreadAngle = -20;
                        if (i === 1) spreadAngle = 0;
                        if (i === 2) spreadAngle = 20;
                        if (i === 3) spreadAngle = -40;
                        if (i === 4) spreadAngle = 40;
                        bullet.angle = player.angle + spreadAngle;
                        game.physics.arcade.velocityFromAngle(spreadAngle - 90, BULLET_SPEED, bullet.body.velocity);
                        bullet.body.velocity.x += player.body.velocity.x;
                    }
                    bulletTimer = game.time.now + BULLET_SPACING;
                }
            }
        }
    }
    
    
    function launchGreenEnemy() {
        var ENEMY_SPEED = 300;
    
        var enemy = greenEnemies.getFirstExists(false);
        if (enemy) {
            enemy.reset(game.rnd.integerInRange(0, game.width), -20);
            enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;
    
            enemy.trail.start(false, 800, 1);
    
            //  Update function for each enemy ship to update rotation etc
            enemy.update = function(){
              enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
    
              enemy.trail.x = enemy.x;
              enemy.trail.y = enemy.y -10;
    
              //  Kill enemies once they go off screen
              if (enemy.y > game.height + 200) {
                enemy.kill();
                enemy.y = -20;
              }
            }
        }
    
        //  Send another enemy soon
        greenEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(greenEnemySpacing, greenEnemySpacing + 1000), launchGreenEnemy);
    }
    function launchYellowEnemy() {
        var ENEMY_SPEED = 300;
    
        var enemy = yellowEnemies.getFirstExists(false);
        if (enemy) {
            enemy.reset(game.rnd.integerInRange(0, game.width), -20);
            enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
            enemy.body.velocity.y = ENEMY_SPEED;
            enemy.body.drag.x = 100;
    
            //  Update function for each enemy ship to update rotation etc
            enemy.update = function(){
              enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
              var bulletSpeed = 800;
              var firingDelay = 1000;
              enemy.bullets = 5;
              enemy.lastShot = 0;
              enemyBullet = blueEnemyBullets.getFirstExists(false);
              if (enemyBullet &&
                  this.alive &&
                  this.bullets &&
                  this.y > game.width / 8 &&
                  game.time.now > firingDelay + this.lastShot) {
                    this.lastShot = game.time.now;
                    this.bullets--;
                    enemyBullet.reset(this.x, this.y + this.height / 2);
                    enemyBullet.damageAmount = this.damageAmount;
                    var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                    enemyBullet.angle = game.math.radToDeg(angle);
                }
              //  Kill enemies once they go off screen
              if (enemy.y > game.height + 200) {
                enemy.kill();
                enemy.y = -20;
              }
            }
        }
    
        //  Send another enemy soon
        greenEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(greenEnemySpacing * 2, greenEnemySpacing + 4000), launchYellowEnemy);
    }
    function launchBlueEnemy() {
        var startingX = game.rnd.integerInRange(100, game.width - 100);
        var verticalSpeed = 180;
        var spread = 60;
        var frequency = 70;
        var verticalSpacing = 70;
        var numEnemiesInWave = 5;
        var timeBetweenWaves = 2500;
    
        //  Launch wave
        for (var i =0; i < numEnemiesInWave; i++) {
            var enemy = blueEnemies.getFirstExists(false);
            if (enemy) {
                enemy.startingX = startingX;
                enemy.reset(game.width / 2, -verticalSpacing * i);
                enemy.body.velocity.y = verticalSpeed;
    
                //  Set up firing
                var bulletSpeed = 400;
                var firingDelay = 2000;
                enemy.bullets = 1;
                enemy.lastShot = 0;
    
                //  Update function for each enemy
                enemy.update = function(){
                  //  Wave movement
                  this.body.x = this.startingX + Math.sin((this.y) / frequency) * spread;
    
                  //  Squish and rotate ship for illusion of "banking"
                  bank = Math.cos((this.y + 60) / frequency)
                  this.scale.x = 0.5 - Math.abs(bank) / 8;
                  this.angle = 180 - bank * 2;
    
                  //  Fire
                  enemyBullet = blueEnemyBullets.getFirstExists(false);
                  if (enemyBullet &&
                      this.alive &&
                      this.bullets &&
                      this.y > game.width / 8 &&
                      game.time.now > firingDelay + this.lastShot) {
                        this.lastShot = game.time.now;
                        this.bullets--;
                        enemyBullet.reset(this.x, this.y + this.height / 2);
                        enemyBullet.damageAmount = this.damageAmount;
                        var angle = game.physics.arcade.moveToObject(enemyBullet, player, bulletSpeed);
                        enemyBullet.angle = game.math.radToDeg(angle);
                    }
    
                  //  Kill enemies once they go off screen
                  if (this.y > game.height + 200) {
                    this.kill();
                    this.y = -20;
                  }
                };
            }
        }
    
        //  Send another wave soon
        blueEnemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(timeBetweenWaves, timeBetweenWaves + 4000), launchBlueEnemy);
    }
    
    function addEnemyEmitterTrail(enemy) {
        var enemyTrail = game.add.emitter(enemy.x, player.y - 10, 100);
        enemyTrail.width = 10;
        enemyTrail.makeParticles('explosion', [1,2,3,4,5]);
        enemyTrail.setXSpeed(20, -20);
        enemyTrail.setRotation(50,-50);
        enemyTrail.setAlpha(0.4, 0, 800);
        enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
        enemy.trail = enemyTrail;
    }
    
    
    function shipCollide(player, enemy) {
        enemy.kill();
    
        player.damage(enemy.damageAmount);
        shields.render();
    
        if (player.alive) {
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
        } else {
            playerDeath.x = player.x;
            playerDeath.y = player.y;
            playerDeath.start(false, 1000, 10, 10);
        }
    }
    
    
    function hitEnemy(enemy, bullet) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('explosion', 30, false, true);
        enemy.kill();
        bullet.kill()
    
        // Increase score
        score += 200;
        scoreText.render();
    
        //  Pacing
        //  Enemies come quicker as score increases
        greenEnemySpacing *= 0.9;
        //  Blue enemies come in after a score of 1000
        if (!blueEnemyLaunched && score > 1000) {
          blueEnemyLaunched = true;
          launchBlueEnemy();
          //  Slow green enemies down now that there are other enemies
          greenEnemySpacing *= 2;
        }
        //  Weapon upgrade
        if (score >= 4000 && player.weaponLevel < 2) {
          player.weaponLevel = 2;
        }
        if (score >= 10000 && player.weaponLevel < 3) {
            player.weaponLevel = 3;
          }
    }
    
    function enemyHitsPlayer (player, bullet) {
        bullet.kill();
    
        player.damage(bullet.damageAmount);
        shields.render()
    
        if (player.alive) {
            var explosion = explosions.getFirstExists(false);
            explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
            explosion.alpha = 0.7;
            explosion.play('explosion', 30, false, true);
        } else {
            playerDeath.x = player.x;
            playerDeath.y = player.y;
            playerDeath.start(false, 1000, 10, 10);
        }
    }
    
    
    function restart () {
        //  Reset the enemies
        greenEnemies.callAll('kill');
        game.time.events.remove(greenEnemyLaunchTimer);
        game.time.events.add(1000, launchGreenEnemy);
        blueEnemies.callAll('kill');
        blueEnemyBullets.callAll('kill');
        game.time.events.remove(blueEnemyLaunchTimer);
    
        blueEnemies.callAll('kill');
        game.time.events.remove(blueEnemyLaunchTimer);
        //  Revive the player
        player.weaponLevel = 1;
        player.revive();
        player.health = 100;
        shields.render();
        score = 0;
        scoreText.render();
    
        //  Hide the text
        gameOver.visible = false;
    
        //  Reset pacing
        greenEnemySpacing = 1000;
        blueEnemyLaunched = false;
    }
};
