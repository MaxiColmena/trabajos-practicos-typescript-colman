class Empleado {
    protected nombre: string;
    protected antiguedad: number

    constructor(nombre: string, antiguedad: number){
        this.nombre = nombre;
        this.antiguedad = antiguedad;
    }
    calcularSueldo(): number {
        return 0
    }
    describir(): string {
        return(`${this.nombre} (${this.antiguedad} años) - sueldo: $${this.calcularSueldo()}`)
    }
}

 class EmpleadoFijo extends Empleado {
    //Agregamos el atributo que es exclusivo de esta subclase
    private sueldoBase: number;

    // El constructor recibe los datos del padre + el dato nuevo del hijo
    constructor(nombre: string, antiguedad: number, sueldoBase: number){
        super(nombre, antiguedad);
        this.sueldoBase = sueldoBase;
    }

    calcularSueldo(): number {
        return this.sueldoBase + (this.sueldoBase * 0.02 * this.antiguedad)
    }
}

const empleado = new EmpleadoFijo("Maxi", 10, 1000000)

console.log(`tu sueldo es: ${empleado.calcularSueldo()}`)

console.log(empleado.describir());