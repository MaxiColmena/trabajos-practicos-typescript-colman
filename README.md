# Trabajos prácticos de TypeScript

Repositorio de ejercicios de la materia TLP 4. El trabajo está dividido en dos partes: un primer trabajo práctico de Programación Orientada a Objetos (POO) y una actividad dedicada a patrones de diseño.

## Requisitos

- [Node.js](https://nodejs.org/), porque la consigna exige ejecutar los ejercicios con Node.
- Git, para clonar el repositorio.

Cada carpeta tiene su propio `package.json` y sus dependencias se instalan por separado. La ejecución se realiza con Node, tal como solicita la consigna.

## Clonar y preparar el proyecto

Desde una terminal, ejecutar:

```bash
git clone https://github.com/MaxiColmena/trabajos-practicos-typescript-colman.git
cd trabajos-practicos-typescript-colman
```

Instalar las dependencias del TP1:

```bash
cd tp1
npm install
```

Para instalar las dependencias de la actividad de patrones, volver a la raíz y ejecutar:

```bash
cd ../actividad-patrones
npm install
```

## Estructura del repositorio

```text
trabajos-practicos-typescript-colman/
├── tp1/
│   ├── ej1.ts              # Producto y control de stock
│   ├── ej2.ts              # Cuenta bancaria encapsulada
│   ├── ej3.ts              # Herencia y tipos de empleado
│   ├── ej4.ts              # Polimorfismo y cálculo de nómina
│   ├── ej5.ts              # Getters y setters de Persona
│   ├── package.json
│   └── tsconfig.json
├── actividad-patrones/
│   ├── ej1.ts              # Singleton
│   ├── ej2.ts              # Factory Method
│   ├── ej3.ts              # Observer
│   ├── ej4.ts              # Adapter
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
└── README.md
```

## Cómo ejecutar los ejercicios

### TP1

Ubicarse en la carpeta `tp1`:

```bash
cd tp1
npm run ej1
npm run ej2
npm run ej3
npm run ej4
npm run ej5
```

Cada script ejecuta el archivo correspondiente con el comando indicado por la consigna. También se puede ejecutar un ejercicio directamente:

```bash
node ej1.ts
```

### Actividad de patrones

Ubicarse en `actividad-patrones` y ejecutar cada archivo:

```bash
cd actividad-patrones
node ej1.ts
node ej2.ts
node ej3.ts
node ej4.ts
```

### Verificar los tipos

Los dos directorios incluyen un `tsconfig.json`. Para comprobar el tipado sin generar archivos JavaScript:

```bash
cd tp1
npx tsc --noEmit

cd ../actividad-patrones
npx tsc --noEmit
```

La opción `--noEmit` realiza únicamente la comprobación del código. No hay una suite de tests automatizados configurada; los ejemplos de cada archivo funcionan como demostraciones ejecutables.

## TP1: Programación Orientada a Objetos

### Ejercicio 1: Producto y stock

Archivo: `tp1/ej1.ts`

Se modela un producto con nombre, precio, categoría y cantidad disponible. La clase `Producto` permite:

- Mostrar una descripción mediante `describir()`.
- Consultar si hay unidades suficientes con `hayStock(cantidad)`.
- Vender unidades con `venderUnidades(cantidad)`, descontándolas del stock.
- Aplicar un descuento mediante `aplicarDescuento(porcentaje)`.

El porcentaje se valida para que esté entre 0 y 100. Si no hay stock suficiente o el descuento es inválido, se lanza un `Error`. Esto evita continuar con una venta o una operación que dejaría al objeto en un estado incorrecto.

### Ejercicio 2: Cuenta bancaria

Archivo: `tp1/ej2.ts`

La clase `CuentaBancaria` representa una cuenta con titular, saldo e historial de movimientos. Sus operaciones son:

- `depositar(monto)`: acepta montos positivos y registra el depósito.
- `retirar(monto)`: impide retirar cero, valores negativos o más dinero que el saldo.
- `consultarSaldo()`: devuelve el saldo actual.
- `obtenerHistorial()`: devuelve una copia del historial.

El saldo y el historial son `private`, por lo que no pueden modificarse directamente desde afuera. `nombre` es `readonly`: se puede asignar al crear la cuenta, pero no cambiar después. La copia creada con `[...this.historial]` evita que el código externo altere el arreglo interno.

### Ejercicio 3: Herencia de empleados

Archivo: `tp1/ej3.ts`

Se define una clase base `Empleado` y tres especializaciones:

- `EmpleadoFijo`: sueldo base más un adicional del 2% por cada año de antigüedad.
- `EmpleadoPorHoras`: horas trabajadas multiplicadas por el valor de la hora.
- `EmpleadoPorComision`: ventas del mes multiplicadas por el porcentaje de comisión.

Las clases hijas reutilizan los datos de la clase padre mediante `extends` y llaman al constructor padre con `super(...)`. Cada una redefine `calcularSueldo()`, aplicando su propia fórmula.

### Ejercicio 4: Polimorfismo y nómina

Archivo: `tp1/ej4.ts`

Se crea un arreglo de tipo `Empleado[]` que contiene empleados fijos, por horas y por comisión. La función `calcularNomina()` recorre el arreglo y solicita a todos los objetos el mismo método: `calcularSueldo()`.

Aunque el tipo declarado es `Empleado`, cada objeto ejecuta la versión del método que corresponde a su clase concreta. Esa capacidad de responder de distintas maneras ante la misma llamada es polimorfismo. La función no necesita conocer las fórmulas particulares y devuelve el total de la nómina.

### Ejercicio 5: Getters, setters y propiedades calculadas

Archivo: `tp1/ej5.ts`

La clase `Persona` tiene DNI, nombre, edad y email. El DNI se declara `private readonly`, mientras que el nombre es público. La edad y el email se controlan mediante getters y setters:

- El setter de `edad` rechaza valores menores que 0 o mayores que 120.
- El setter de `email` exige que el texto contenga `@`.
- El getter `esMayorDeEdad` calcula si la edad es mayor o igual a 18.
- El getter `datosPublicos` arma una descripción a partir de otros datos.

Un getter se utiliza como una propiedad de solo lectura, por ejemplo `persona.esMayorDeEdad`. Un setter permite asignar un valor usando una sintaxis de propiedad, pero ejecutando validaciones antes de guardarlo: `persona.edad = 22`.

## Actividad de patrones de diseño

El dominio común es un inventario de equipos informáticos. Cada ejercicio muestra un patrón independiente.

### Ejercicio 1: Singleton

Archivo: `actividad-patrones/ej1.ts`

`Inventario` debe tener una única instancia compartida. Para conseguirlo:

1. `private static instancia` guarda la única instancia dentro de la clase.
2. El `constructor` es `private`, así que desde afuera no se puede hacer `new Inventario()`.
3. `public static obtenerInstancia()` funciona como punto de acceso. Crea el objeto la primera vez y luego devuelve siempre el mismo.
4. `agregarEquipo()` incorpora equipos y `listarEquipos()` los consulta.

Es útil cuando toda la aplicación debe trabajar sobre un único inventario, evitando que distintos módulos creen listas separadas.

### Ejercicio 2: Factory Method

Archivo: `actividad-patrones/ej2.ts`

`EquipoElectronico` es una clase abstracta que concentra las características comunes: nombre, RAM y procesador. Declara el método abstracto `detalles()`, que cada clase concreta debe implementar.

`Notebook`, `Desktop` y `Servidor` heredan de esa clase. `EquipoFactory` recibe el tipo y las características, decide qué clase crear y devuelve un `EquipoElectronico`. Si el tipo no es válido, lanza un error.

La fábrica centraliza la creación de objetos. El código que la usa no necesita conocer qué constructor concreto debe invocar.

### Ejercicio 3: Observer

Archivo: `actividad-patrones/ej3.ts`

El patrón Observer permite que un objeto avise automáticamente a otros cuando cambia su estado:

- La interfaz `Observador` define el contrato `notificar(...)`.
- `Soporte` implementa ese contrato y reacciona mostrando el cambio.
- `Equipo` mantiene una lista privada de observadores.
- `agregarObservador()` suscribe un observador.
- `cambiarEstado()` actualiza el equipo y llama a `notificarObservadores()`.
- El método privado recorre la lista y notifica a cada suscriptor.

Esto reduce el acoplamiento: `Equipo` conoce el contrato de los observadores, pero no necesita depender de una implementación específica.

### Ejercicio 4: Adapter

Archivo: `actividad-patrones/ej4.ts`

Se integra un sistema antiguo (`InventarioViejo`) con una interfaz nueva (`Inventario`). El sistema viejo usa `agregarItem()` y `obtenerItems()`, mientras que el sistema nuevo espera `agregarEquipo()` y `listarEquipos()`.

`AdaptadorInventario` implementa la interfaz moderna y contiene una referencia privada al inventario viejo. Traduce cada llamada moderna al método equivalente del sistema antiguo. Así, el código cliente puede usar el contrato nuevo sin modificar la clase existente.

## Glosario de TypeScript y POO

### Clases y objetos

- `class`: plantilla que define propiedades y métodos de un tipo de objeto.
- Instancia: objeto creado a partir de una clase, normalmente usando `new`.
- Propiedad o atributo: dato almacenado en un objeto, como `nombre` o `saldo`.
- Método: función definida dentro de una clase, como `depositar()`.
- `constructor`: método especial que inicializa una instancia.
- `this`: referencia al objeto actual.

### Encapsulamiento y acceso

- `public`: miembro accesible desde cualquier parte que tenga el objeto. Es el nivel predeterminado de las clases.
- `private`: miembro accesible únicamente dentro de la clase que lo declara. Sirve para proteger el estado interno, como el saldo o la lista de observadores.
- `protected`: miembro accesible dentro de su clase y también desde las clases hijas. En el TP1 permite que las subclases usen `nombre` y `antiguedad` sin exponerlos al código externo.
- `readonly`: propiedad que solo puede recibir un valor durante su inicialización o en el constructor. En el trabajo se usa para que el DNI y el nombre del titular no cambien.
- `static`: miembro perteneciente a la clase, no a cada instancia. Se accede como `Inventario.obtenerInstancia()` y no desde un objeto individual.

### Acceso controlado

- `get`: define un getter, que se lee como una propiedad y puede calcular o devolver un valor.
- `set`: define un setter, que intercepta una asignación y permite validar el valor antes de guardarlo.
- Convención `_edad` y `_email`: los guiones bajos distinguen los atributos privados internos de los getters y setters públicos con nombres `edad` y `email`. No cambian el nivel de acceso por sí mismos.

### Tipos, contratos y herencia

- `string`, `number` y `boolean`: tipos básicos usados para texto, números y valores verdadero/falso.
- `string[]`: arreglo cuyos elementos son cadenas de texto.
- `interface`: contrato que indica qué propiedades o métodos debe ofrecer una estructura o clase.
- `implements`: obliga a una clase a cumplir una interfaz.
- `abstract class`: clase base que no se instancia directamente y puede definir métodos abstractos.
- `abstract`: método declarado sin implementación; las clases hijas deben implementarlo.
- `extends`: establece herencia entre una clase hija y una clase padre.
- `super(...)`: llama al constructor de la clase padre.
- `any`: desactiva gran parte de la comprobación de tipos. Se conserva en el ejemplo del inventario viejo para representar una API antigua y flexible, aunque conviene evitarlo en código nuevo.
- `void`: indica que un método realiza una acción pero no devuelve un valor.
- `boolean`: valor lógico `true` o `false`, como el resultado de `hayStock()`.

### Otras construcciones utilizadas

- `throw new Error(...)`: interrumpe la operación y comunica que los datos recibidos no son válidos.
- `for...of`: recorre los elementos de un arreglo, como los empleados o los observadores.
- Plantillas con backticks: permiten insertar valores con `${...}` dentro de un texto.
- `[...]`: crea una copia superficial de un arreglo cuando se usa como `[...this.historial]`.

## Configuración del compilador

Los `tsconfig.json` habilitan comprobación estricta mediante `strict: true`. En `tp1` se usa `noEmit: true`, por lo que TypeScript solo verifica el código. La configuración de `actividad-patrones` también activa opciones estrictas como `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`.

## Licencia

El proyecto utiliza la licencia `ISC`, según los archivos `package.json` incluidos en cada actividad.
