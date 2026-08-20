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
    
    aplicarDescuento(porcentaje: number): number {
        if (porcentaje < 0 || porcentaje > 100){
            throw new Error(`El porcentaje de descuento debe estar entre 0 y 100`)
        }

        //El descuento se aplica sobre el precio actual del producto, no sobre el precio original
        this.precio = this.precio - (this.precio * (porcentaje / 100));
        return this.precio;
    }
}

// Prueba si funciona 
const miProducto = new Producto("Chocolate", 1000, "Comidas", 10);

console.log(miProducto.describir()); //Este es el estado inicial

console.log(miProducto.aplicarDescuento(10)); // Aplica un descuento del 10%
console.log(miProducto.describir()); // Muestra el estado después del descuento

