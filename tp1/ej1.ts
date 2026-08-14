class Producto {
    nombre: string;
    precio: number;
    categoria: string;
    stock: number;

    constructor(nombre: string, precio: number, categoria: string, stock: number){
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;  
    }
    describir(): string {
        return `${this.nombre} ${this.categoria}: $${this.precio} - ${this.stock} unidades`
    }
    hayStock(cantidad: number): boolean {
        if (cantidad <= this.stock){
            return true
        } else {
            return false
        }
    }

    // tome la decisión de poner ERROR porque si es un caso que el 
    // trabajador obtenga una respuesta paro no lea la pantalla puede 
    // que vaya a buscar el producto o autorice la venta sin tener el stock, 
    // cortando de raiz el proceso esto no sucederia

    venderUnidades(cantidad: number): void {
        if (this.hayStock(cantidad)){
            this.stock = this.stock - cantidad;
        } else {
            throw new Error(`No se puede vender ${this.nombre} ya que solo no suficiente hay en stock`)
        }        
    }
}

const miProducto = new Producto("Chocolate", 1000, "Comidas", 10);
