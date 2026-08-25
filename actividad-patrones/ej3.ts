interface Observador {
    notificar(nombreEquipo: string, nuevoEstado: string): void
}

class Soporte implements Observador {
    public notificar(nombreEquipo: string, nuevoEstado: string): void {
        console.log(`soporte notificado: ${nombreEquipo}, cambió su estado a ${nuevoEstado}`)
    }
}

class Equipo {
    private observadores : Observador[] = []

    constructor(
        public nombre: string,
        public tipo: string,
        public estado: string
    ){}
    
    public agregarObservador( observador: Observador): void {
        this.observadores.push(observador)
    }
    
    public cambiarEstado(nuevoEstado: string): void{
        this.estado = nuevoEstado
        this.notificarObservadores()
    }

    private notificarObservadores(): void{
        for (const observador of this.observadores){
            observador.notificar(this.nombre, this.estado)
        }
    }
}

// 1. Creamos nuestro observador
const soporte = new Soporte();

// 2. Creamos nuestro equipo
const equipo = new Equipo("Notebook HP", "Portátil", "disponible");

// 3. Agregamos a soporte a la lista de observadores del equipo
equipo.agregarObservador(soporte);

// 4. Hacemos el cambio de estado (esto dispara el console.log automáticamente)
equipo.cambiarEstado("en reparación");