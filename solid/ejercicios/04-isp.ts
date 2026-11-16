// Codigo original (una interfaz grande obliga a implementar metodos que no se usan):
// interface MultifunctionPrinter {
//   print(document: string): void;
//   scan(document: string): void;
//   fax(document: string): void;
// }
//
// class SimplePrinter implements MultifunctionPrinter {
//   print(document: string): void { console.log(`Imprimiendo: ${document}`); }
//   scan(_document: string): void { throw new Error("Esta impresora no puede escanear"); }
//   fax(_document: string): void { throw new Error("Esta impresora no puede enviar fax"); }
// }
//
// new SimplePrinter().print("tarea.txt");

// Interfaces chicas, una por capacidad
interface Printer {
  print(document: string): void;
}

interface Scanner {
  scan(document: string): void;
}

interface Fax {
  fax(document: string): void;
}

// La impresora simple solo implementa lo que realmente sabe hacer
class SimplePrinter implements Printer {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }
}

// Una multifuncion combina varias interfaces
class MultifunctionPrinter implements Printer, Scanner, Fax {
  print(document: string): void {
    console.log(`Imprimiendo: ${document}`);
  }

  scan(document: string): void {
    console.log(`Escaneando: ${document}`);
  }

  fax(document: string): void {
    console.log(`Enviando fax: ${document}`);
  }
}

new SimplePrinter().print("tarea.txt");

const multi = new MultifunctionPrinter();
multi.print("informe.pdf");
multi.scan("contrato.pdf");
multi.fax("factura.pdf");

// Preguntas:
// - Que metodo no necesita `SimplePrinter`?
//   scan y fax: solo sabe imprimir.
//
// - Que problema causa implementar metodos que lanzan errores?
//   Quien usa la interfaz cree que puede llamar a scan o fax y el programa falla en tiempo
//   de ejecucion. El contrato promete algo que la clase no cumple.
//
// - Como separar las capacidades de una impresora?
//   En interfaces chicas (Printer, Scanner, Fax). Cada clase implementa solo las que usa.
