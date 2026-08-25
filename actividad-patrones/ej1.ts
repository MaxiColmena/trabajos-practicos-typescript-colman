interface Equipo {
    nombre: string;
    tipo: string;
    estado: string;
}

class Inventario {
    private static instancia: Inventario; //La variable para que no se pueda acceder desde adfuera donde guardamos el único inventario
    private equipos: Equipo[] = []; //acá se guardan los equipos

    private constructor(){

    }

    public static obtenerInstancia(): Inventario{ //esta es la puerta
        // en caso de que no exista la instancia, la creamos
        if(!Inventario.instancia) {
            Inventario.instancia = new Inventario();
        }
        return Inventario.instancia; //devolvemos la única instancia que hay
    }
    // acá hacemos el metodo para añadir un equipo
    public agregarEquipo(nombre: string, tipo: string, estado:string): void {
        const nuevoEquipo: Equipo = {
            nombre: nombre,
            tipo: tipo,
            estado: estado
        }
        this.equipos.push(nuevoEquipo);
    }
    
    public listarEquipo(): Equipo[]{ //acá observamos los equipos guardados
        return this.equipos;
    }
}

const inventario =  Inventario