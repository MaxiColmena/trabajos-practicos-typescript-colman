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

class EmpleadoPorHoras extends Empleado{
    private horasTrabajadas: number 
    private valorHora: number
    
    constructor(nombre: string, antiguedad: number, horasTrabajadas: number, valorHora: number){
        super(nombre, antiguedad);
        this.horasTrabajadas = horasTrabajadas;
        this.valorHora = valorHora
    }

    calcularSueldo(): number {
        return this.horasTrabajadas * this.valorHora
    }
}

class EmpleadoPorComision extends Empleado{
    private ventasDelMes: number 
    private porcentajeComision: number

    constructor( nombre: string, antiguedad: number, ventasDelMes: number, porcentajeComision: number){
        super(nombre, antiguedad);
        this.ventasDelMes = ventasDelMes;
        this.porcentajeComision = porcentajeComision;
    }

    calcularSueldo(): number {
        return this.ventasDelMes * (this.porcentajeComision / 100)
    }
}

const equipo: Empleado[] = [
    new EmpleadoFijo("Maxi", 10, 1000000),
    
    new EmpleadoPorHoras("Mateo", 10, 100, 1000),

    new EmpleadoPorComision("Marcos", 10, 2000000, 10)
];

// Recorremos el equipo sin preguntar de qué tipo es cada empleado.
// El polimorfismo en acción: no nos importa si es fijo, por horas o por comisión,
// a todos les pedimos lo mismo y cada uno responde con su propia cuenta.
for (const trabajador of equipo) {
    console.log(`${trabajador.describir()} | calcularSueldo(): ${trabajador.calcularSueldo()}`);
}

// Función externa que recibe un arreglo de Empleados y devuelve el total a pagar
function calcularNomina(empleados: Empleado[]): number {
    let totalNomina = 0;

    for (const trabajador of empleados) {
        totalNomina += trabajador.calcularSueldo();
    }

    return totalNomina;
}

// Ponemos a prueba la función pasándole nuestro equipo
const totalAPagar = calcularNomina(equipo);

console.log(`El total de la nómina a pagar es: $${totalAPagar}`);