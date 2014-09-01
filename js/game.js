/*
Visto en: http://self_loving.blogspot.com/2013/01/como-crear-un-sencillo-juego-con.html

Editado por: César Jefferson Aquino Maximiliano
Sitio web: http://cesaraquino.com

*/


// DEFINIR VARIABLES QUE INDICA EL JUGADOR
var user_pokemon = prompt("¿Elige tu pokemon? Escribe el numero\n1.- Charmander\n2.- Squirtle\n3.- Bulbasaur", "");

if(user_pokemon > 0 && user_pokemon<  4)
{

	if(user_pokemon==1) {
		pokemon_select = "Charmander";
	
	} else if(user_pokemon==2) {
		pokemon_select = "Squirtle";
	
	} else if(user_pokemon==3) {
		pokemon_select = "Bulbasaur";
	}

}
else
{
	confirmar = confirm("Tienes que ingresar 1, 2 o 3\n\nSi pones cancelar se cargará por defecto a Charmander");
	
	if (confirmar) {
		window.location.reload();
	
	} else { 
		pokemon_select = "Charmander"; 
	} 

}
// Definir constantes
var TECLA_ARRIBA    = 38,
    TECLA_ABAJO     = 40,
    TECLA_DERECHA   = 39,
    TECLA_IZQUIERDA = 37,
    CANVAS_WIDTH    = 512,
    CANVAS_HEIGHT   = 480;
    SUBIR_DIFICULTAD = 5; // Cada cuantas capturas subir velocidad
    SUBIR_VELOCIDAD = 25; // Cuanta velocidad subir al icnrementarse la dificultad
    
var pokemonGraveyard = new Array();

// Crear el canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.appendChild(canvas);

// Imagen de fondo
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Imagen del personaje
var personajeReady = false;
var personajeImage = new Image();
personajeImage.onload = function () {
    personajeReady = true;
};
personajeImage.src = "images/ash.png";

// Imagen del pokemon
var pokemonReady = false;
var pokemonImage = new Image();
pokemonImage.onload = function () {
    pokemonReady = true;
};
pokemon_minuscula = pokemon_select.toLowerCase();
pokemonImage.src = "images/"+pokemon_minuscula+".png";

// Imagen de la pokebola
var pokebolaReady = false;
var pokebolaImage = new Image();
pokebolaImage.onload = function () {
    pokebolaReady = true;
};
pokebolaImage.src = "images/pokebola.png";

// Velocidad del personaje y pokemon

var personaje = {
    speed: 250 // movimiento de píxeles por segundo
};
var pokemon = {
    speed : 25  // movimiento de píxeles por segundo
};
var pokemonsCaught = 0;
var incrementador = 0;

// Manejar los controles del teclado
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Volver a iniciar el juego cuando se atrapa el pokemon
var start = true;

var reset = function () {
    if (start){
        personaje.x = canvas.width / 2;
        personaje.y = canvas.height / 2;
        start = false;
    }
    // Poner los personajes en algún lugar aleatoriamente
    pokemon.x = 32 + (Math.random() * (canvas.width - 64));
    pokemon.y = 32 + (Math.random() * (canvas.height - 64));
    pokemon.speed = (pokemon.speed > 100 ) ? ( pokemon.speed) : (pokemon.speed + pokemonsCaught);
};

// Actualizar objetos del juego
var update = function (modifier) {
    if (TECLA_ARRIBA in keysDown) { // Jugador se mueve arriba
        personaje.y = (personaje.y > 0) ? (personaje.y - personaje.speed * modifier) : canvas.height - 32;
        pokemon.y = ( pokemon.y >0 ) ? ( pokemon.y - pokemon.speed * modifier ) : canvas.height - 32;
    }

    if (TECLA_ABAJO in keysDown) { // Jugador se mueve abajo
        personaje.y = (personaje.y + personaje.speed * modifier) % canvas.height;
        pokemon.y = ( pokemon.y + pokemon.speed * modifier) % canvas.height;
    }

    if (TECLA_IZQUIERDA in keysDown) { // Jugador se mueve a la izquierda
        personaje.x = (personaje.x > 0) ? (personaje.x - personaje.speed * modifier) : canvas.width - 32;
        pokemon.x = (pokemon.x > 0) ? (pokemon.x - pokemon.speed * modifier) : canvas.width - 32;
    }

    if (TECLA_DERECHA in keysDown) { // Jugador se mueve a la derecha
        personaje.x = (personaje.x + personaje.speed * modifier) % canvas.width;
        pokemon.x = (pokemon.x +  pokemon.speed * modifier) % canvas.width;
    }

    // Atrapar pokemon
    if (
        personaje.x <= (pokemon.x + 32)
        && pokemon.x <= (personaje.x + 32)
        && personaje.y <= (pokemon.y + 32)
        && pokemon.y <= (personaje.y + 32)
    ) {
        ++pokemonsCaught;
        pokemonGraveyard.push({"x": pokemon.x, "y": pokemon.y });

        // Subir velocidad de pokemon cada 5 capturas

        incrementador++;
        if(incrementador == SUBIR_DIFICULTAD){
        	pokemon.speed = pokemon.speed + SUBIR_VELOCIDAD;
        	incrementador = 0;
        }

        reset();   
    }
};


// Encerrar poekbola
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (pokebolaReady) {
        for (pokebola in pokemonGraveyard) {
            ctx.drawImage(pokebolaImage, pokemonGraveyard[pokebola].x ,pokemonGraveyard[pokebola].y)
        }
    }
    
    if (personajeReady) {
        ctx.drawImage(personajeImage, personaje.x, personaje.y);
    }

    if (pokemonReady) {
        ctx.drawImage(pokemonImage, pokemon.x, pokemon.y);
    }


    // Puntuación
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(pokemon_select+"s atrapados: " + pokemonsCaught, 32, 32);
};

// Bucle del juego
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
};

// Empecemos a jugar
reset();
var then = Date.now();
setInterval(main, 1); // Ejecutar lo más rapido posible
