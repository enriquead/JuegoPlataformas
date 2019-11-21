class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar,480/2,320/2);
        this.pausa = true;

        this.iniciar();
    }

    iniciar() {

        reproducirMusica();
        this.botonSalto = new Boton(imagenes.boton_salto,480*0.9,320*0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8)

        this.espacio = new Espacio(1);
        this.scrollX = 0;
        this.bloques = [];
        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);
        this.puntos = new Texto(0,480*0.9,320*0.07);
        this.fondo = new Fondo(imagenes.fondo_2,480*0.5,320*0.5);

        this.disparosJugador = [];
        this.plataformas = [];
        this.recolectables = []
        this.enemigos = [];
        this.enemigosAplastables = [];
        this.bloquesDestructibles = [];

        this.cargarMapa("res/"+nivelActual+".txt");
        if(this.checkPassed){
            this.checkpoint.imagen.src = imagenes.bandera_verde;
            this.jugador.x = this.checkpoint.x;
            this.jugador.y = this.checkpoint.y;
        }

    }

    actualizar (){
        if (this.pausa){
            return;
        }


        if ( this.copa.colisiona(this.jugador)){
            nivelActual++;
            if (nivelActual > nivelMaximo){
                nivelActual = 0;
            }
            this.pausa = true;
            this.mensaje = new Boton(imagenes.mensaje_ganar,480/2,320/2);
            this.checkPassed = false;
            this.iniciar();
        }

        // Jugador se cae
        if ( this.jugador.y > 480 ){
            this.iniciar();
        }

        this.espacio.actualizar();
        this.fondo.vx = -1;
        this.fondo.actualizar();
        //Actalizo recolectables
        for(var i=0; i<this.recolectables.length;i++){
            this.recolectables[i].actualizar();
        }
        // Eliminar disparos sin velocidad
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                this.disparosJugador[i].vx == 0){

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }


        // Eliminar disparos fuera de pantalla
        for (let i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);

                this.disparosJugador.splice(i, 1);
                i--;
            }
        }

        this.jugador.actualizar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }
        for (var i=0; i < this.enemigosAplastables.length; i++){
            this.enemigosAplastables[i].actualizar();
        }
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }
        this.colisiones();

        // Enemigos muertos fuera del juego
        for (let j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {
                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);
                this.enemigos.splice(j, 1);
                j = j-1;
            }
        }
        for (let j=0; j < this.enemigosAplastables.length; j++){
            if ( this.enemigosAplastables[j] != null &&
                this.enemigosAplastables[j].estado == estados.muerto  ) {
                this.espacio
                    .eliminarCuerpoDinamico(this.enemigosAplastables[j]);
                this.enemigosAplastables.splice(j, 1);
                j = j-1;
            }
        }

    }
    colisiones(){
        // colisiones
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i]) ){
                if(this.enemigos[i].estado != estados.muriendo
                    && this.enemigos[i].estado != estados.muerto)
                    this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }

            }
        }

        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {
                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    if(this.enemigos[j].estado==estados.moviendo)
                        this.puntos.valor++;
                    this.enemigos[j].impactado();

                }
            }
        }
        // colisiones , disparoJugador - Tile destructible
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.bloquesDestructibles.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.bloquesDestructibles[j] != null &&
                    this.disparosJugador[i].colisiona(this.bloquesDestructibles[j])) {
                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    this.espacio.eliminarCuerpoEstatico(this.bloquesDestructibles[j]);
                    this.bloquesDestructibles.splice(j,1);
                    j = j-1;
                }
            }
        }
        // colisiones , Jugador - Recolectable
        for(var i = 0;i< this.recolectables.length;i++){
            if(this.recolectables[i]!=null && this.jugador.colisiona(this.recolectables[i])){
                this.espacio.eliminarCuerpoDinamico(this.recolectables[i]);
                this.recolectables.splice(i,1);
                i = i-1;
                this.puntos.valor++;
            }
        }
        // colisiones, Jugador - Plataforma de salto
        for(var i = 0;i< this.plataformas.length;i++){
            if(this.plataformas[i]!=null && this.jugador.colisiona(this.plataformas[i])){
                this.jugador.saltar(-20);
            }
        }
        //colisiones Jugador, enemigos aplastables
        for (var i=0; i < this.enemigosAplastables.length; i++){
            if ( this.jugador.colisiona(this.enemigosAplastables[i])){
                if(this.jugador.encimaDe(this.enemigosAplastables[i])
                    && this.jugador.vy > 0 && this.enemigosAplastables[i].estado != estados.muriendo
                    && this.enemigosAplastables[i].estado != estados.muerto){
                    this.enemigosAplastables[i].impactado();
                    this.puntos.valor++;
                }else{
                    if(this.enemigosAplastables[i].estado != estados.muriendo
                        && this.enemigosAplastables[i].estado != estados.muerto)
                        this.jugador.golpeado();
                    if (this.jugador.vidas <= 0){
                        this.iniciar();
                    }
                }
            }

        }
        // colisiones disparo jugador, enemigo aplastable. No afecta al enemigo pero desaparece el disparo
        for (var i=0; i < this.disparosJugador.length; i++) {
            for (var j = 0; j < this.enemigosAplastables.length; j++) {
                if (this.disparosJugador[i] != null &&
                    this.enemigosAplastables[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigosAplastables[j]) &&
                    this.enemigosAplastables[j].estado==estados.moviendo) {
                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i - 1;
                }
            }
        }
        // colision jugador con checkpoint
        if(this.jugador.colisiona(this.checkpoint)){
            this.checkpoint.imagen.src = imagenes.bandera_verde;
            this.checkPassed = true;
        }



    }

    dibujar (){
        this.calcularScroll();

        this.fondo.dibujar();
        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollX);
        }
        for (var i=0; i < this.bloquesDestructibles.length; i++){
            this.bloquesDestructibles[i].dibujar(this.scrollX);
        }
        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX);
        }
        this.copa.dibujar(this.scrollX);
        this.checkpoint.dibujar(this.scrollX);
        this.jugador.dibujar(this.scrollX);

        for (var i=0; i < this.plataformas.length; i++) {
            this.plataformas[i].dibujar(this.scrollX);
        }
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX);
        }
        for(var i=0;i<this.recolectables.length;i++){
            this.recolectables[i].dibujar(this.scrollX);
        }
        for (var i=0; i < this.enemigosAplastables.length; i++){
            this.enemigosAplastables[i].dibujar(this.scrollX);
        }


        //HUD
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        if ( entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
            this.pad.dibujar();
        }
        if(this.pausa){
            this.mensaje.dibujar();
        }


    }

    procesarControles( ) {
        if (controles.continuar){
            controles.continuar = false;
            this.pausa = false;
        }
        // disparar
        if (controles.disparo) {
            var nuevoDisparo = this.jugador.disparar();
            if ( nuevoDisparo != null ) {
                this.disparosJugador.push(nuevoDisparo);
                this.espacio.agregarCuerpoDinamico(nuevoDisparo);
            }

        }
        // Eje X
        if (controles.moverX > 0) {
            this.jugador.moverX(1);

        } else if (controles.moverX < 0) {
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if (controles.moverY > 0) {
            this.jugador.saltar(-16);

        } else if (controles.moverY < 0) {


        } else {

        }
    }

    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length-1) * 40;
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];
                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = 40/2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }


    cargarObjetoMapa(simbolo, x, y){
        switch(simbolo) {

            case "C":
                this.copa = new Bloque(imagenes.copa, x,y);
                this.copa.y = this.copa.y - this.copa.alto/2;
                // modificación para empezar a contar desde el suelo
                this.espacio.agregarCuerpoDinamico(this.copa);
                break;
            case "A":
                this.checkpoint = new Bloque (imagenes.bandera_roja,x,y);
                this.checkpoint.y = this.checkpoint.y - this.checkpoint.alto/2;
                this.espacio.agregarCuerpoDinamico(this.checkpoint);
                break;
            case "Y":
                var plataformaSalto = new Bloque(imagenes.plataforma_salto,x,y);
                plataformaSalto.y = plataformaSalto.y - plataformaSalto.alto/2;
                this.plataformas.push(plataformaSalto);
                this.espacio.agregarCuerpoDinamico(plataformaSalto);
                break;
            case "U":
                var tileDestructible =  new Bloque(imagenes.metal,x,y);
                tileDestructible.y = tileDestructible.y - tileDestructible.alto/2;
                this.bloquesDestructibles.push(tileDestructible);
                this.espacio.agregarCuerpoEstatico(tileDestructible);
                break;
            case "R":
                var recolectable = new Recolectable(imagenes.icono_recolectable,x,y,imagenes.animacion_recolectable,3,8);
                // modificación para empezar a contar desde el suelo
                recolectable.y = recolectable.y - recolectable.alto/2;
                this.recolectables.push(recolectable);
                this.espacio.agregarCuerpoDinamico(recolectable);
                break;

            case "E":
                var enemigo = new Enemigo(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "T":
                var enemigo = new EnemigoTanque(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigosAplastables.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;

            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;
            case "#":
                var bloque = new Bloque(imagenes.bloque_tierra, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
        }
    }

    calcularScroll(){
        // limite izquierda
        if ( this.jugador.x > 480 * 0.3) {
            if (this.jugador.x - this.scrollX < 480 * 0.3) {
                this.scrollX = this.jugador.x - 480 * 0.3;
            }
        }

        // limite derecha
        if ( this.jugador.x < this.anchoMapa - 480 * 0.3 ) {
            if (this.jugador.x - this.scrollX > 480 * 0.7) {
                this.scrollX = this.jugador.x - 480 * 0.7;
            }
        }

    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;

        controles.moverX = 0;
        // Suponemos a false
        controles.continuar = false;

        for(var i=0; i < pulsaciones.length; i++){
            // MUY SIMPLE SIN BOTON cualquier click en pantalla lo activa
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }


            if (this.pad.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if ( orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = orientacionX;
                }
                if ( orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = orientacionX;
                }
            }

            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonSalto.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if ( !this.botonSalto.pulsado ){
            controles.moverY = 0;
        }
    }






}

