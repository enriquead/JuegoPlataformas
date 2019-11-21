class Recolectable extends Modelo {

    constructor(rutaImagen, x, y,animacion, velocidadRefresco, framesTotales) {
        super(rutaImagen, x, y);

        this.animacion = new Animacion(animacion,
            this.ancho, this.alto,  velocidadRefresco, framesTotales);
    }


    actualizar () {
        this.animacion.actualizar();
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }
}