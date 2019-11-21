class EnemigoBase extends Modelo{

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x -scrollX, this.y);
    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

}