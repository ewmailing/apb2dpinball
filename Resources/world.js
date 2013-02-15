(function() {
	var g_shootMe = true;
	
    app.world = {
        nodes : []
    };

    app.createWorld = function(gameBoard) {

        // create the world, using view as the surface
        var world = box2d.createBox2dWorld({surface: gameBoard});
   //     world.surface = gameBoard;

        // create alloy scene
        // world.addBody adds sprites into the top scene of the game view automatically.
        var scene = alloy.createScene();
        gameBoard.pushScene(scene);
        
		var bgImage = alloy.createSprite({image:'images/gamebg.png', x:0, y:40, z:0});
		scene.add(bgImage);

        // This will be used to shoot the ball "harder" the longer the user holds the plunger
        var impulseIntervul, impulse = 1, score = 0;

        world.setGravity(0.0, -9.81);

        var nodeSettings = {
            image : "images/bumper1000.png",
            width : 60,
            height : 60
        };

        var node = [{
            x : 70,
            y : 300
        }, {
            x : 260,
            y : 240
        }, {
            x : 420,
            y : 300
        }, {
            x : 110,
            y : 490
        }, {
            x : 380,
            y : 490
        }];

        for( i = 0; i < node.length; i++) {

            nodeSettings.x = node[i].x;
            nodeSettings.y = node[i].y;
            nodeSettings.z = 1;
            nodeSettings.image = (i % 2 == 0) ? 'images/bumper10.png' : 'images/bumper50.png';
            nodeSettings.hit_value = (i % 2 == 0) ? 10 : 50;

            app.world.nodes[i] = world.addBody(alloy.createSprite(nodeSettings), {
                radius : 30,
                density : 10.0,
                friction : 0.3,
                restitution : 1.0,
                type : "static"
            });

        }
        
        app.world.rightWall = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 2,
            height : gameBoard.screen.height - 20,
            x : gameBoard.screen.width - 12,
            y : 40,
            z : 1
        }), {
            density : 12.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        app.world.leftWall = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 2,
            height : gameBoard.screen.height - 20,
            x :  4,
            y : 40,
            z : 1
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        app.world.topWall = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : gameBoard.screen.width,
            height : 2,
            x : 0,
            y : 120,
            z : 1
        }), {
            density : 12.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        app.world.wallCorner = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : gameBoard.screen.width * 0.5,
            height : 2,
            x : 0,
            y : 140,
            z : 1
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.wallCorner.setAngle(0.2);

        app.world.LsideDeflector = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 80,
            height : 2,
            x : 16,
            y : 645,
            z : 1
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.LsideDeflector.setAngle(-0.7);

        app.world.RsideDeflector = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 80,
            height : 2,
            x : gameBoard.screen.width - 90 - 80,
            y : 645,
            z : 1
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.RsideDeflector.setAngle(0.7);

        // add body to the world
        app.world.shoot = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 8,
            height : gameBoard.screen.height - 280,
            x : gameBoard.screen.width - 85,
            y : 280,
            z : 1
        }), {
            density : 1.0,
            friction : 0.1,
            restitution : 0.1,
            type : "static"
        });

        app.world.shootHook = world.addBody(alloy.createSprite({
            alpha : 0.0,
            height : 8,
            width : 75,
            y : gameBoard.screen.height - 700,
            x : gameBoard.screen.width - 150,
            z : 1
        }), {
            density : 12.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.shootHook.setAngle(-0.60);

        // add body to the world
        app.world.plunger = world.addBody(alloy.createSprite({
            image : "images/spring.png",
            width :  65,
            height : 65,
            x : gameBoard.screen.width  - 80,
            y : gameBoard.screen.height - 60,
            z : 1
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });

        // add body to the world
        app.world.deflector = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 160,
            height : 8,
            x : gameBoard.screen.width -100,
            y : 190,
            z : 1
        }), {
            density : 5.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.deflector.setAngle(-1);

        // add body to the world
        app.world.gutterRight = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 10,
            height : 30,
            x : gameBoard.screen.width - 165,
            y : gameBoard.screen.height - 120
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.gutterRight.setAngle(0.25);

        // add body to the world
        app.world.gutterLeft = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : 10,
            height : 30,
            x : 85,
            y : gameBoard.screen.height - 120
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 0.4,
            type : "static"
        });
        app.world.gutterLeft.setAngle(-0.25);

        // add body to the world
        app.world.flipperRight = world.addBody(alloy.createSprite({
            image : "images/flipper_r.png",
            width : 132,
            height : 42,
            x : gameBoard.screen.width - 110,
            y : gameBoard.screen.height - 20
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 1.0,
            type : "dynamic"
        });

        app.world.flipperRightmoter = world.createJoint(app.world.flipperRight, app.world.gutterRight, {
            enableLimit : true,
            upperAngle : 0.44,
            lowerAngle : 0.01,
            enableMotor : true,
            maxMotorTorque : 26000,
            motorSpeed : -100,
            jointPoint : 1.4,
            basePoint : -1.8,
            collideConnected : false
        });

        // add body to the world
        app.world.flipperLeft = world.addBody(alloy.createSprite({
            image : "images/flipper_l.png",
            width : 132,
            height : 42,
            x : 20,
            y : gameBoard.screen.height - 20
        }), {
            density : 10.0,
            friction : 0.3,
            restitution : 1.0,
            type : "dynamic"
        });

        app.world.flipperLeftmoter = world.createJoint(app.world.flipperLeft, app.world.gutterLeft, {
            enableLimit : true,
            upperAngle : 0.01,
            lowerAngle : -0.44,
            enableMotor : true,
            maxMotorTorque : 26000,
            motorSpeed : 100,
            jointPoint : -1.4,
            basePoint : 1.8,
            collideConnected : false
        });

        // add the ball body to the world
        app.world.ball = world.addBody(alloy.createSprite({
            image : "images/ball.png",
            width : 54,
            height : 54,
            x : gameBoard.screen.width  - 16,
            y : gameBoard.screen.height - 100,
            shootMe : true
        }), {
            radius : 30,
            density : 11.0,
            friction : 0.9,
            restitution : 0.2,
            type : "dynamic"
        });

        // This element is our "hole" we add this so we can control the collision of the ball
        // with an element below the flippers, this will be used to reset the ball
        app.world.hole = world.addBody(alloy.createSprite({
            alpha : 0.0,
            width : gameBoard.screen.width,
            height : 2,
            x : 0,
            y : gameBoard.screen.height + 20
        }), {
            density : 7.0,
            friction : 0.6,
            restitution : 0.4,
            type : "static"
        });

        world.addEventListener("collision", function(e) {
            //Ti.API.info(e);
            if(e.phase == "begin") {

                // Interactions
                switch(e.a) {
                    case app.world.hole :
                        app.balls--;

                        if(app.balls > 0) {
                            app.ui.ballsRemaining.text = 'Balls: ' + (app.balls - 1);

                            // setting the ball to awake false then back before/after moving it, removes all momentum the body had
                            app.world.ball.setAwake(false);
                            app.world.ball.SetTransform({
                                posX : 600,
                                posY : 600
                            });
                            app.world.ball.setAwake(true);
                        } else {

                            var modal = app.ui.createStartWindow();

                            modal.open();

                            if(score > app.hScore) {
                                alert('YOU BEAT THE HIGH SCORE!!');
                            } else {
                                alert("Game over!");
                            }

                            // save the high score
                            if(score > app.hScore) {
                                Ti.App.Properties.setInt('high_score', score);

                                app.hScore = score;

                                app.ui.highScore.text = 'High Score: ' + app.hScore;

                            }

                            // setting the ball to awake false then back before/after moving it, removes all momentum the body had
                            app.world.ball.setAwake(false);
                            app.world.ball.SetTransform({
                                posX : 600,
                                posY : 600
                            });
                        }
                        break;
                    case app.world.plunger:
                        //mark that its ready to shoot
//                        app.world.ball.view.shootMe = true;
g_shootMe = true;
                        break;
                }

                //Score
                if(app.isIn(e.a, app.world.nodes)) {
                    score = score + e.a.view.hit_value;

                    app.ui.scoreBoard.text = 'Score: ' + score;

                }
            }
        });
        
        app.ui.overlay.addEventListener('touchstart', function(e) {
            // make sure we are playing :)
            world.start();

            // Flip the flipper
            if(e.x > 160) {
                app.world.flipperRightmoter.setMotorSpeed(1000);
            } else {
                app.world.flipperLeftmoter.setMotorSpeed(-1000);
            }

//            if(app.world.ball.view.shootMe) {
            if(g_shootMe) {
                impulseIntervul = setInterval(function() {
                    impulse = impulse + 150;

                    if(impulse >= app.MAX_IMPULSE) {
                        impulse = app.MAX_IMPULSE;
                    } else {
                        app.plungerY = app.plungerY + 2;
                        app.world.plunger.SetTransform({
                            posX : 595,
                            posY : app.plungerY
                        });
                    }

                }, 150);
            }
        });

        app.ui.overlay.addEventListener('touchend', function(e) {

            app.world.flipperRightmoter.setMotorSpeed(-1000);
            app.world.flipperLeftmoter.setMotorSpeed(1000);


//            if(app.world.ball.view.shootMe) {
            if(g_shootMe) {

                // FIRE THE GUN!!!!
              //  app.world.ball.applyLinearImpulse([0, impulse], [19, 2]);
                
                app.world.ball.applyLinearImpulse([0, impulse], [19, 2.0]);


                //READY THE PLUNGER!!!!
                clearInterval(impulseIntervul);
                impulse = 1;

                //BATTLE STATIONS!!!
                app.plungerY = 930;
                app.world.plunger.SetTransform({
                    posX : 595,
                    posY : app.plungerY
                });

                // ...mark ball as shot
//                app.world.ball.view.shootMe = false;
                g_shootMe = false;
            }
        });
        return world;
    };
})();
