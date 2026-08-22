class CuentaBancaria {
  //atributos
  readonly nombre: string;
  private saldo: number;
  private historial: string[] = [];

  //construcor
  constructor(nombre: string, saldo: number) {
    this.saldo = saldo;
    this.nombre = nombre;

  }
  //metodos
  depositar(monto: number){
    if (monto <= 0) {
        // a chekear
        throw new Error("No se puede menor a cero");
    } else {
        this.saldo += monto;
        this.historial.push(` Se Depósito: +${monto}. El nuevo saldo es de: ${this.saldo}`)
    }
  }
  retirar(monto: number): void { 
    if (monto > this.saldo || monto <= 0){
        throw new Error("No se puede retirar montos mayores a su saldo o montos negativos")
    } else {
        this.saldo -= monto
        this.historial.push(`Retiro exitoso de: ${monto}, el nuevo saldo es de: ${this.saldo}`)
    };
  }
  consultarSaldo(): number {
    return this.saldo
  }
  obtenerHistorial(): string[]{
    return [...this.historial];
  }
}

const yoTitular = new CuentaBancaria("Lucas", 2222);

// Hacemos que la cuenta tenga actividad antes de consultar
yoTitular.depositar(500);
yoTitular.retirar(100);
 
console.log(`Tu saldito es: ${yoTitular.consultarSaldo()}`)

console.log(`El nombre del titular es: ${yoTitular.nombre}`)

console.log(`El historial del titular es: ${yoTitular.obtenerHistorial()}`)