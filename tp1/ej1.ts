// Abstraccion: de un producto real solo nos quedamos con los datos que importan para vender
class Producto {
    public nombre: string;
    public precio: number;
    public categoria: string;
    public stock: number;

    constructor(nombre: string, precio: number, categoria: string, stock: number) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    describir(): string {
        return `${this.nombre} (${this.categoria}): $${this.precio} - ${this.stock} unidades`;
    }

    hayStock(cantidad: number): boolean {
        return this.stock >= cantidad;
    }

    venderUnidades(cantidad: number): void {
        if (cantidad <= 0) {
            throw new Error("La cantidad a vender debe ser mayor a cero");
        }
        if (!this.hayStock(cantidad)) {
            throw new Error(`No hay stock suficiente de ${this.nombre}`);
        }
        this.stock -= cantidad;
    }

    // Devuelve el precio con descuento sin modificar el precio original
    aplicarDescuento(porcentaje: number): number {
        if (porcentaje < 0 || porcentaje > 100) {
            throw new RangeError("El descuento debe estar entre 0 y 100");
        }
        return this.precio - (this.precio * porcentaje) / 100;
    }
}

const teclado = new Producto("Teclado", 10000, "electrónica", 5);
console.log(teclado.describir());

console.log(`¿Hay stock para 3?: ${teclado.hayStock(3)}`);
teclado.venderUnidades(3);
console.log(`Después de la venta: ${teclado.describir()}`);

console.log(`Precio con 10% de descuento: $${teclado.aplicarDescuento(10)}`);
console.log(`Precio original (sin cambios): $${teclado.precio}`);

try {
    // Solo quedan 2 unidades, así que esto debe fallar
    teclado.venderUnidades(5);
} catch (error) {
    console.log(`Error: ${(error as Error).message}`);
}
