// Codigo original (cada medio de pago nuevo obliga a agregar un case):
// type PaymentType = "card" | "cash";
//
// class PaymentProcessor {
//   pay(type: PaymentType, amount: number): void {
//     switch (type) {
//       case "card":
//         console.log(`Pagando $${amount} con tarjeta`);
//         break;
//       case "cash":
//         console.log(`Pagando $${amount} en efectivo`);
//         break;
//       default:
//         throw new Error("Medio de pago no soportado");
//     }
//   }
// }
//
// new PaymentProcessor().pay("card", 100);

// Contrato comun para todos los medios de pago
interface PaymentMethod {
  pay(amount: number): void;
}

class CardPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} con tarjeta`);
  }
}

class CashPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} en efectivo`);
  }
}

// Medio nuevo: se agrega una clase sin modificar PaymentProcessor
class TransferPayment implements PaymentMethod {
  pay(amount: number): void {
    console.log(`Pagando $${amount} por transferencia`);
  }
}

// Cerrado para modificacion: delega en el medio de pago, sin switch
class PaymentProcessor {
  pay(method: PaymentMethod, amount: number): void {
    method.pay(amount);
  }
}

const processor = new PaymentProcessor();
processor.pay(new CardPayment(), 100);
processor.pay(new CashPayment(), 100);
processor.pay(new TransferPayment(), 100);

// Preguntas:
// - Que parte debe modificarse para agregar pago con transferencia?
//   En el original, el switch de PaymentProcessor (y el tipo PaymentType).
//   Ahora no se modifica nada: solo se crea la clase TransferPayment.
//
// - Como podriamos representar un medio de pago?
//   Con una interfaz PaymentMethod que cada medio implementa en su propia clase.
//
// - Que comportamiento comun tienen todos los medios de pago?
//   Todos saben pagar un monto: el metodo pay(amount).
