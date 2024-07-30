
var plataformas;
var platillos;
var marcianoL;
var marcianoR;
var controles;
var score = 0;
var textoScore;
var fondo, boom;
var bullets;
var bulletTime = 0;
var backgroundv;
var spacefield;
var winText;
var level = 1;
var txtLevel;
var w = 800, h = 600;
var num = 1;

var marte = new Phaser.Game(800, 600, Phaser.AUTO, 'marte', {preload: preload,
    create: create, update: update});


function preload() {

//aqui se cargaran los sprites
    marte.load.image('espacio', 'sprites/espacio2.png');
    marte.load.image('platillo', 'sprites/disc.png');
    marte.load.image('barra', 'sprites/plataforma.png');
    marte.load.image('bullet1', 'sprites/bullet4.png');
    //marte.load.image('bullet2', 'sprites/bullet5.png', 68, 9);
    marte.load.spritesheet('marciano', 'sprites/marciano.png', 32, 48);
    marte.load.image('menu', 'sprites/menuPause.png');
    marte.load.audio('fondo', 'audio/shampoo.mp3');
    marte.load.audio('boom', 'audio/numkey.wav');
}

function create() {
    died = false;
    //agregar fisica
    marte.physics.startSystem(Phaser.Physics.ARCADE);

    //aqui se agrega el fondo
    spacefield = marte.add.tileSprite(0, 0, 800, 600, 'espacio');
    backgroundv = .5;

    fondo = marte.add.audio('fondo');
    boom = marte.add.audio('boom');
    pause();

    marte.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause() {
        // Only act if paused
        if (marte.paused) {

            marte.paused = false;
        }
    }

    bulletCreate();

    fireButton = marte.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    pauseButton = marte.input.keyboard.addKey(Phaser.Keyboard.ESC);

    //recibe varios parametros
    // 1-marcador de audio
    // 2-donde inicia 
    // 3-volumen 0.5 es la mitad
    // 4-ciclo = true


    plataformas = marte.add.group();
    //agrega masa para ser afectados por la gravedad o fisica
    plataformas.enableBody = true;

    //64 es el doble de la altura de barra o piso
    var piso = plataformas.create(0, marte.world.height - 64, 'barra');
    //escalar al doble
    piso.scale.setTo(2, 2);
    //inmovile no afectado por la fisica
    piso.body.immovable = true;

    var barra = plataformas.create(-180, 400, 'barra');
    barra.body.immovable = true;

    barra = plataformas.create(400, 300, 'barra');
    barra.body.immovable = true;

    barra = plataformas.create(600, 150, 'barra');
    barra.body.immovable = true;

    player();
    enemies();

    textoScore = marte.add.text(20, 20, 'Score:  ' + score, {fontSize: '28px', fill: '#fff'});
    txtLevel = marte.add.text(20, 50, 'Level:   ' + level, {fontSize: '28px', fill: '#fff'});
    //se crean los controles pero se asignan en la funcion update
    controles = marte.input.keyboard.createCursorKeys();

    winText = marte.add.text(marte.world.centerX - 50, marte.world.centerY,
            'You Win!', {font: '32px Arial', fill: '#fff'});
    winText.visible = false;
    
}


function update() {

    spacefield.tilePosition.y += backgroundv;

    marte.physics.arcade.overlap(bullets, platillos, collisionHandler, null, this);
    marte.physics.arcade.overlap(bullets, plataformas, collisionHandler2, null, this);
    marte.physics.arcade.overlap(platillos, marciano, collisionHandler3, null, this);

    marte.physics.arcade.collide(marciano, plataformas);
    marte.physics.arcade.collide(platillos, plataformas);
    marte.physics.arcade.collide(bullets, plataformas);
    marte.physics.arcade.collide(platillos, marciano);
    // primero que objecto esta sobre cual, lurgo las funciones, si no existe=null,
    // luego el contexto= this(osea marte)
    // marte.physics.arcade.overlap(marciano, platillos, recolectar, null, this);

    marciano.body.velocity.x = 0;

    if (controles.left.isDown) {

        marciano.body.velocity.x = -150;
        marciano.animations.play('izquierda');
    } else
    if (controles.right.isDown) {

        marciano.body.velocity.x = 150;
        marciano.animations.play('derecha');
    } else {
        marciano.animations.stop();
        marciano.frame = 4;
    }
    if (controles.up.isDown && marciano.body.touching.down) {
        marciano.body.velocity.y = -350;
    }
    if (fireButton.isDown) {
        fireBullet();
    }

}

/*function recolectar(bullets, platillos) {
 platillos.kill();
 
 score += 10;
 textoScore.text = 'Marcador: ' + score;
 
 boom.play();
 }*/

function restartMarkers() {
    score = 0;
    level = 1;
    textoScore.text = 'Score:  ' + score;
    txtLevel.text = 'Level:   ' + level;
}

function fireBullet() {
    if (marte.time.now > bulletTime) {

        bullet1 = bullets.getFirstExists(false);

        if (bullet1) {
            bullet1.reset(marciano.x + 16, marciano.y + 35);
            bulletTime = marte.time.now + 200;
            bullet1.body.velocity.y = -400;
        }
        if (bullet1) {
            if (controles.left.isDown) {
                bullet1.body.velocity.x = -300;
            } else if (controles.right.isDown) {
                bullet1.body.velocity.x = 300;
            }


        }
    }
}
//var salir = marte.input.keyboard.addKey(Phaser.Keyboard.ENTER);

function collisionHandler(bullets, platillos) {
    bullets.kill();
    platillos.kill();

    score += 10;

    textoScore.text = 'Score:  ' + score;
    txtLevel.text = 'Level:   ' + level;

    boom.play('', 0, 0.1, false);
    if (score%100 === 0) {
        
        enemies();
        level++;
    }
}

function collisionHandler2(bullets, plataformas) {
    bullets.kill();
}

function collisionHandler3(marciano, platillos) {
    marciano.kill();
    lost_label = marte.add.text(w / 2, h - 250, 'You lost!', {font: '30px Arial', fill: '#fff'});
    lost_label.anchor.setTo(0.5, 0.5);
    fondo.stop();
    reCreate();
    
}
function pause() {
    // Create a label to use as a button
    pause_label = marte.add.text(w - 100, 20, 'Pause', {font: '24px Arial', fill: '#fff'});
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        marte.paused = true;
        choiseLabel = marte.add.text(w / 2, h - 150, 'Click any part of the screen to continue', {font: '30px Arial', fill: '#fff'});
        choiseLabel.anchor.setTo(0.5, 0.5);

    });
}

function reCreate() {
    restartMarkers();
    platillos.kill();
    bullets.kill();
    player();
    enemies();
    bulletCreate();
    setTimeout(labelDestroy, 1000);
}

function enemies() {
    //agregar platillos en grupo
    platillos = marte.add.group();
    platillos.enableBody = true;
    //platillos.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 10; i++) {
        var platillo = platillos.create(50 + i * 55, 0, 'platillo');

        platillo.body.collideWorldBounds = true;
        platillo.body.gravity.x = marte.rnd.integerInRange(-100, 100);
        platillo.body.gravity.y = 100 + Math.random() * 100;
        platillo.body.bounce.setTo(1);

    }
}


function player() {
    
    fondo.play('', 0, 0.3, true);
    
    marciano = marte.add.sprite(32, marte.world.height - 160, 'marciano');
    
    marte.physics.arcade.enable(marciano);
    marciano.body.bounce.y = 0.3;
    marciano.body.gravity.y = 300;
    marciano.body.collideWorldBounds = true;

    //animacion 4 parametros
    // 1-nombre de la animacion 
    // 2-numero de frames en array 
    // 3-cuantos frames por segundo mayor numero es mas rapido
    // 4-se elige si hay ciclo o no = true 
    marciano.animations.add('izquierda', [0, 1, 2, 3], 10);
    marciano.animations.add('derecha', [5, 6, 7, 8], 10);
   
}

function labelDestroy() {
    lost_label.destroy();
}

function bulletCreate() {
    bullets = marte.add.group();

    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet1');
    //puntos de anclaje
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    // chequea si las balas salen de la pantalla para destruirlas 
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
}