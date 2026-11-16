class CuentaBancaria {
  //atributos
  readonly titular: string;
  private saldo: number;
  private historial: string[] = [];

  //construcor
  constructor(titular: string, saldo: number) {
    this.saldo = saldo;
    this.titular = titular;
    this.historial.push(`Apertura de cuenta con saldo inicial de: ${saldo}`);

  }
  //metodos
  depositar(monto: number){
    if (monto <= 0) {
        throw new Error("No se puede depositar un monto menor o igual a cero");
    } else {
        this.saldo += monto;
        this.historial.push(`Depósito: +${monto}. El nuevo saldo es de: ${this.saldo}`)
    }
  }
  retirar(monto: number): void {
    if (monto > this.saldo || monto <= 0){
        throw new Error("No se puede retirar montos mayores a su saldo o montos negativos")
    } else {
        this.saldo -= monto
        this.historial.push(`Retiro: -${monto}. El nuevo saldo es de: ${this.saldo}`)
    };
  }
  consultarSaldo(): number {
    return this.saldo
  }
  // Devolvemos una copia para que no se pueda modificar el historial real desde afuera
  obtenerHistorial(): string[]{
    return [...this.historial];
  }
}

const yoTitular = new CuentaBancaria("Lucas", 2222);

// Hacemos que la cuenta tenga actividad antes de consultar
yoTitular.depositar(500);
yoTitular.retirar(100);

console.log(`Tu saldito es: ${yoTitular.consultarSaldo()}`)

console.log(`El nombre del titular es: ${yoTitular.titular}`)

console.log("El historial del titular es:")
console.log(yoTitular.obtenerHistorial())

// Probamos que se rechacen los montos invalidos
try {
    yoTitular.depositar(-50);
} catch (error) {
    console.log(`Error: ${(error as Error).message}`);
}

try {
    yoTitular.retirar(99999);
} catch (error) {
    console.log(`Error: ${(error as Error).message}`);
}

// Si modificamos la copia que nos devuelve, el historial de la cuenta no cambia
const copia = yoTitular.obtenerHistorial();
copia.push("movimiento falso: +1000000");
copia.length = 0;
console.log(`Movimientos en la copia: ${copia.length}`);
console.log(`Movimientos reales en la cuenta: ${yoTitular.obtenerHistorial().length}`);
console.log(`El saldo sigue siendo: ${yoTitular.consultarSaldo()}`);
