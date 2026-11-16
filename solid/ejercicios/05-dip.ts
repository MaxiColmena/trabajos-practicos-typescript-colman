// Codigo original (OrderService crea y depende de una clase concreta):
// class EmailSender {
//   send(to: string, message: string): void {
//     console.log(`Correo para ${to}: ${message}`);
//   }
// }
//
// class OrderService {
//   createOrder(customerEmail: string): void {
//     console.log("Pedido creado");
//     const emailSender = new EmailSender();
//     emailSender.send(customerEmail, "Tu pedido fue creado");
//   }
// }
//
// new OrderService().createOrder("ana@example.com");

// Abstraccion de la que dependen tanto el modulo de alto nivel como los de bajo nivel
interface Notifier {
  send(to: string, message: string): void;
}

class EmailSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`Correo para ${to}: ${message}`);
  }
}

class SmsSender implements Notifier {
  send(to: string, message: string): void {
    console.log(`SMS para ${to}: ${message}`);
  }
}

// OrderService recibe el Notifier por constructor (inyeccion de dependencias)
class OrderService {
  private readonly notifier: Notifier;

  constructor(notifier: Notifier) {
    this.notifier = notifier;
  }

  createOrder(customerContact: string): void {
    console.log("Pedido creado");
    this.notifier.send(customerContact, "Tu pedido fue creado");
  }
}

new OrderService(new EmailSender()).createOrder("ana@example.com");
new OrderService(new SmsSender()).createOrder("+54 9 11 1234-5678");

// Preguntas:
// - Que dependencia concreta crea `OrderService`?
//   EmailSender: la crea internamente con new, asi que queda atada a esa clase.
//
// - Como probarias la clase sin enviar un correo?
//   Inyectando un Notifier falso (mock) que solo registre la llamada, sin enviar nada real.
//
// - Que contrato comun podrian implementar el correo y el SMS?
//   La interfaz Notifier con send(to, message). EmailSender y SmsSender la implementan
//   y OrderService depende solo de ella.
