// El contrato del sistema NUEVO
// Nuestro sistema moderno espera que los inventarios funcionen obligatoriamente así:
interface Inventario {
  agregarEquipo(nombre: string, tipo: string, estado: string): void;
  listarEquipos(): any[];
}

class InventarioViejo {
  private items: any[] = [];

  // Recibe un objeto cualquiera y lo guarda
  public agregarItem(item: any): void {
    this.items.push(item);
  }

  // Método auxiliar para poder ver qué hay guardado
  public obtenerItems(): any[] {
    return this.items;
  }
}

// Acá va la lógica del adaptador
class AdaptadorInventario implements Inventario {
  
  // Guardamos una referencia al inventario viejo en secreto
  private inventarioViejo: InventarioViejo;

  // Cuando creamos el adaptador, le pasamos el inventario viejo
  constructor(inventarioViejo: InventarioViejo) {
    this.inventarioViejo = inventarioViejo;
  }

  // Cumplimos con el contrato del sistema nuevo
  public agregarEquipo(nombre: string, tipo: string, estado: string): void {
    // traducimos por dentro los datos para que el sistema anterior los entienda
    const objetoAdaptado = {
      nombre: nombre,
      tipo: tipo,
      estado: estado
    };
    
    this.inventarioViejo.agregarItem(objetoAdaptado);
  }

  // Cumplimos con el contrato
  public listarEquipos(): any[] {
    // y por dentro pedimos la información al sistema VIEJO
    return this.inventarioViejo.obtenerItems();
  }
}

// testeo

// 1. Instanciamos el sistema viejo (que no queremos tocar ni modificar)
const inventarioViejo = new InventarioViejo();

// 2. Le conectamos nuestro adaptador
const adaptador = new AdaptadorInventario(inventarioViejo);

// 3. A partir de ahora, usamos el ADAPTADOR con los métodos modernos
adaptador.agregarEquipo("Servidor Dell", "Servidor", "disponible");

// 4. Listamos los equipos
console.log(adaptador.listarEquipos());
// Salida esperada: [{ nombre: "Servidor Dell", tipo: "Servidor", estado: "disponible" }]