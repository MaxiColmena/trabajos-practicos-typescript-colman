# 🛠️ Sistema de Inventario de Equipos Informáticos

Este repositorio contiene una serie de ejercicios prácticos implementados en **TypeScript** con el objetivo de comprender y aplicar diversos **Patrones de Diseño de Software**. A través de la construcción de un sistema de inventario, se resuelven diferentes problemas arquitectónicos comunes en el desarrollo.

---
## 🚀 Cómo descargar y ejecutar el proyecto

### Requisitos previos
Para poder correr este proyecto, asegúrate de tener instalado [Node.js](https://nodejs.org/) en tu computadora. 

### Pasos para iniciar

**1. Clonar el repositorio**
Abre tu terminal y descarga el proyecto en tu computadora utilizando Git:
```bash
git clone [https://github.com/TU_USUARIO/NOMBRE_DEL_REPOSITORIO.git](https://github.com/TU_USUARIO/NOMBRE_DEL_REPOSITORIO.git)

cd NOMBRE_DEL_REPOSITORIO

npm install

npx ts-node nombre_del_archivo.ts

## 📚 Conceptos y Técnicas Aprendidas

Durante el desarrollo de estos ejercicios, se exploraron conceptos clave de la Programación Orientada a Objetos (POO) y el uso avanzado de TypeScript:
* **Interfaces y Tipado Fuerte:** Creación de "contratos" (Ej. `interface Equipo`) para asegurar que los objetos cumplan con una estructura de datos estricta.
* **Modificadores de Acceso:** Uso de `public` y `private` para encapsular la información y proteger el estado interno de las clases.
* **Clases Abstractas y Herencia:** Uso de `abstract class` y la palabra reservada `extends` para compartir atributos (como nombre, RAM, procesador) y obligar a las clases hijas a implementar sus propios métodos.

---

## 📐 Patrones de Diseño Implementados

### 1. Patrón Singleton (Creacional)
**Objetivo:** Garantizar que exista una única instancia del Inventario en toda la aplicación y proporcionar un punto de acceso global a ella.
* **Cómo se implementó:**
  * Se creó una propiedad `private static instancia`.
  * Se bloqueó el constructor haciéndolo `private` para evitar el uso de `new Inventario()` desde el exterior.
  * Se creó un método `public static obtenerInstancia()` que crea el inventario solo si no existe previamente, o devuelve el existente.

### 2. Patrón Factory Method (Creacional)
**Objetivo:** Delegar la lógica de creación de diferentes tipos de equipos a una clase específica (Fábrica), centralizando la instanciación.
* **Cómo se implementó:**
  * Se definió una clase abstracta `EquipoInformatico` como molde general.
  * Se crearon clases específicas (`Notebook`, `Desktop`, `Servidor`) que extienden del molde.
  * Se construyó una clase `EquipoFactory` con un método que, a través de condicionales, decide qué objeto específico instanciar y devolver de forma uniforme.

### 3. Patrón Observer (Comportamiento)
**Objetivo:** Establecer una relación de uno-a-muchos (suscripción) para que cuando un equipo cambie de estado, todos los departamentos interesados sean notificados automáticamente.
* **Cómo se implementó:**
  * Se definió una interfaz `Observador` para desacoplar el equipo de las clases concretas que lo observan.
  * La clase `Equipo` mantiene un arreglo privado de observadores y expone un método público para "suscribirse".
  * Al usar el método `cambiarEstado()`, el equipo invoca internamente un método privado que recorre la lista de suscripciones y ejecuta el método `notificar()` en cada una.

### 4. Patrón Adapter (Estructural)
**Objetivo:** Permitir que un sistema o clase antigua (`InventarioViejo`) con una interfaz incompatible funcione dentro de un sistema moderno que espera métodos diferentes.
* **Cómo se implementó:**
  * Se estableció el contrato esperado por el sistema nuevo (`interface Inventario`).
  * Se creó la clase `AdaptadorInventario` que implementa dicha interfaz para "hacerse pasar" por un inventario moderno.
  * Internamente, el adaptador recibe la clase antigua y traduce las llamadas modernas (ej. `agregarEquipo(nombre, tipo, estado)`) al formato que el sistema viejo comprende (ej. `agregarItem(objeto)`).

## 📖 Glosario Técnico (Conceptos y Palabras Clave)

**Fundamentos de POO (Programación Orientada a Objetos):**
* **Clase (`class`):** Es el "plano" o la "plantilla" maestra. Define qué datos y comportamientos tendrán los objetos que se creen a partir de ella (Ej. el plano de una fábrica).
* **Instancia:** Es el objeto real, único y tangible creado a partir de una clase. Se construye utilizando la palabra reservada `new` (Ej. el auto físico ya construido por la fábrica).
* **Método:** Es una función que vive dentro de una clase. Define las acciones o comportamientos que ese objeto puede realizar (Ej. `agregarEquipo()`).
* **Propiedad / Atributo:** Es una variable que vive dentro de una clase. Sirve para guardar los datos o las características del objeto (Ej. `nombre`, `ram`).
* **Constructor (`constructor`):** Es un método especial que se ejecuta automáticamente una sola vez al momento de instanciar (crear) el objeto. Se usa para configurar los valores iniciales.

**Modificadores de Acceso y Alcance:**
* **`public` (Público):** Significa que esa propiedad o método está expuesto y puede ser utilizado desde cualquier parte externa del programa.
* **`private` (Privado):** Significa que esa propiedad o método está "escondido" y solo puede ser usado desde **adentro** de la propia clase. Protege los datos internos para que no sean alterados por accidente desde afuera.
* **`static` (Estático):** Hace que una propiedad o método le pertenezca a la clase en sí misma, y no a los objetos individuales (instancias). No necesitas hacer un `new` para usarlo.

**Tipado en TypeScript:**
* **`any` (Cualquiera):** Es un comodín de TypeScript que desactiva la verificación de tipos. Significa que una variable puede ser texto, número, arreglo u objeto. Lo usamos en el sistema viejo del patrón Adaptador, aunque en código moderno se evita para mantener la seguridad.
* **`void` (Vacío):** Se utiliza en los métodos para indicarle al sistema que la función ejecutará una acción, pero **no va a devolver ningún valor** al finalizar.

**Relaciones entre Clases:**
* **`extends` (Extiende / Hereda):** Se utiliza para aplicar la herencia. Permite que una clase "hija" copie automáticamente todas las propiedades y métodos de una clase "padre".
* **`implements` (Implementa):** Se utiliza para que una clase firme el contrato de una `interface`. Obliga a la clase a programar obligatoriamente todos los métodos que la interfaz exige.