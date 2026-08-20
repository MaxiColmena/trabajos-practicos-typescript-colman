class Titular {
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
    if (monto >= 0) {
        // a chekear
      const miHistorial = this.historial.push(this.saldo += monto);
    } else {
      throw new Error("No se puede menor a cero");
    }
  }
  retirar(monto: number): number | void {
    if (monto > this.saldo && monto <= 0){
        return (this.saldo -= monto)
    } else {
        return console.log("OK")
    };
  }
  consultarSaldo(): number {
    let MiSaldo = this.saldo
    
    return MiSaldo
  }
}

const yoTitular = new Titular("Lucas", 2222, { deposito: 1222 });
 
console.log(`Tu saldito es: ${yoTitular.consultarSaldo()}`)

console.log(`El nombre del titular es: ${yoTitular.nombre}`)
