abstract class EquipoElectronico {
    constructor(
        public nombre: string,
        public ram: string,
        public procesador: string
    ){}

    abstract detalles(): string
}

// 2. Creamos las clases específicas que heredan de la clase base

class Notebook extends EquipoElectronico {
  detalles(): string {
    return `Tipo: Notebook, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Desktop extends EquipoElectronico {
  detalles(): string {
    return `Tipo: Desktop, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class Servidor extends EquipoElectronico {
  detalles(): string {
    return `Tipo: Servidor, Nombre: ${this.nombre}, RAM: ${this.ram}, Procesador: ${this.procesador}`;
  }
}

class EquipoFactory {
  // Este método recibe qué tipo de equipo quieres y sus características
  public crearEquipo(tipo: string, nombre: string, ram: string, procesador: string): EquipoElectronico {
    
    // Usamos un condicional para decidir qué objeto construir
    if (tipo === "Notebook") {
      return new Notebook(nombre, ram, procesador);
    } 
    else if (tipo === "Desktop") {
      return new Desktop(nombre, ram, procesador);
    } 
    else if (tipo === "Servidor") {
      return new Servidor(nombre, ram, procesador);
    } 
    else {
      throw new Error("El tipo de equipo no es válido.");
    }
  }
}

// 1. Instanciamos nuestra fábrica
const factory = new EquipoFactory();

// 2. Le pedimos a la fábrica que nos cree una Notebook
const miNotebook = factory.crearEquipo("Notebook", "Dell XPS", "16GB", "i7");

// 3. Imprimimos los detalles
console.log(miNotebook.detalles());