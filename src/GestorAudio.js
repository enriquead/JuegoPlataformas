const musicaAmbiente = new Audio("res/musica_ambiente.mp3");
musicaAmbiente.loop = true;

const efectos = {
    disparo : "res/efecto_disparo.mp3",
    explosion : "res/efecto_explosion.mp3",
}

function reproducirMusica() {
    musicaAmbiente.play();
}

function pararMusica() {
    musicaAmbiente.stop();
}

function reproducirEfecto( srcEfecto ) {
    const efecto = new Audio( srcEfecto );
    efecto.play();
}
