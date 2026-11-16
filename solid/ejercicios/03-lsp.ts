// Codigo original (Square rompe lo que se espera de Rectangle):
// class Rectangle {
//   constructor(protected width: number, protected height: number) {}
//   setWidth(width: number): void { this.width = width; }
//   setHeight(height: number): void { this.height = height; }
//   area(): number { return this.width * this.height; }
// }
//
// class Square extends Rectangle {
//   setWidth(width: number): void { this.width = width; this.height = width; }
//   setHeight(height: number): void { this.width = height; this.height = height; }
// }
//
// function resizeRectangle(rectangle: Rectangle): void {
//   rectangle.setWidth(5);
//   rectangle.setHeight(10);
//   console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
// }
//
// resizeRectangle(new Rectangle(1, 1));
// resizeRectangle(new Square(1, 1)); // Area obtenida: 100

// Abstraccion comun: lo unico que comparten todas las figuras es que tienen area
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  area(): number {
    return this.width * this.height;
  }
}

// Square ya no hereda de Rectangle: tiene un solo lado
class Square implements Shape {
  private side: number;

  constructor(side: number) {
    this.side = side;
  }

  setSide(side: number): void {
    this.side = side;
  }

  area(): number {
    return this.side * this.side;
  }
}

function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(10);
  console.log(`Area esperada: 50. Area obtenida: ${rectangle.area()}`);
}

function printArea(shape: Shape): void {
  console.log(`Area: ${shape.area()}`);
}

resizeRectangle(new Rectangle(1, 1));
// resizeRectangle(new Square(1)); // Ahora TypeScript no lo permite: Square no es un Rectangle

// Cualquier Shape puede sustituir a otra donde solo se necesita el area
const shapes: Shape[] = [new Rectangle(5, 10), new Square(5)];
shapes.forEach(printArea);

// Preguntas:
// - Por que el area final no coincide con lo que espera `resizeRectangle`?
//   Porque resizeRectangle espera que ancho y alto cambien por separado (5 x 10 = 50),
//   pero Square modifica ambos lados en cada setter: el ultimo setHeight(10) deja 10 x 10 = 100.
//
// - Es siempre correcto modelar un cuadrado como un rectangulo por herencia?
//   No. Matematicamente lo es, pero en codigo Square no respeta el comportamiento de Rectangle,
//   asi que no lo puede sustituir sin romper a quien lo usa (viola LSP).
//
// - Que abstraccion comun podriamos usar?
//   Una interfaz Shape con area(): cada figura la implementa con sus propios datos.
