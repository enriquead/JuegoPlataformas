class EnemigoTanque extends EnemigoBase {

    constructor(x, y) {
        super(imagenes.tanque, x, y)
        this.estado = estados.moviendo;
        this.vy = 0;
        this.vxInteligencia = -0.5;
        this.vx = this.vxInteligencia;
        this.aMoverIzda = new Animacion(imagenes.animacion_tanque_2_izquierda,this.ancho,this.alto,6,2);
        this.aMoverDcha = new Animacion(imagenes.animacion_tanque_2_derecha,this.ancho,this.alto,6,2);

        this.animacionActual = this.aMoverIzda;

        this.aMorir = new Animacion(imagenes.animacion_tanque_muerte,
            this.ancho,this.alto,4,8, this.finAnimacionMorir.bind(this));
        this.animacion = this.aMoverIzda;

    }

    actualizar (){
        this.animacion.actualizar();
        switch (this.estado){
            case estados.moviendo:
                this.animacion = this.animacionActual;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }
        if ( this.estado == estados.muriendo) {
            this.vx = 0;
        } else {
            if ( this.vx == 0){
                this.vxInteligencia = this.vxInteligencia * -1;
                this.vx = this.vxInteligencia;
                if(this.animacionActual == this.aMoverIzda){
                    this.animacionActual = this.aMoverDcha;
                }else {
                    this.animacionActual = this.aMoverIzda;

                }
            }
            if (this.fueraPorDerecha ){
                // mover hacia la izquierda vx tiene que ser negativa
                if ( this.vxInteligencia > 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                }
                this.vx = this.vxInteligencia;
                this.animacionActual = this.aMoverIzda;
            }
            if (this.fueraPorIzquierda ){
                // mover hacia la derecha vx tiene que ser positiva
                if ( this.vxInteligencia < 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                }
                this.vx = this.vxInteligencia;
                this.animacionActual = this.aMoverDcha;
            }

        }



    }






}

