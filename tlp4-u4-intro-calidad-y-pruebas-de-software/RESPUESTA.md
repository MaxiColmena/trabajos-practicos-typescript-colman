# Trabajo Práctico: Calidad y Pruebas de Software
## Introducción al Testing Automatizado en Express.js y TypeScript

**Asignatura:** Taller de Lenguajes de Programación IV (TLP IV) · Unidad 4  
**Estudiante:** Colman Máximo  
**Fecha:** Octubre de 2026  

---

## 1. Introducción y Propósito del Trabajo

El propósito de este trabajo práctico es comprender y aplicar los fundamentos de la calidad y el testing de software mediante el desarrollo e implementación de pruebas automatizadas sobre una API REST construida con **Node.js**, **Express.js** y **TypeScript nativo**.

A lo largo del proyecto se abordan:
- La diferenciación y aplicación de pruebas unitarias y pruebas de integración.
- El uso de la herramienta de testing **Vitest** y la biblioteca de pruebas HTTP **Supertest**.
- La implementación del ciclo de desarrollo guiado por pruebas (**TDD**: *Rojo → Verde → Refactorización*).
- La validación rigurosa de entradas y reglas de negocio con manejo tipado de excepciones (`RangeError`).
- La complementariedad entre el análisis estático de tipos (`tsc --noEmit`) y las pruebas de comportamiento en tiempo de ejecución.
- La automatización de flujos de Integración Continua (**CI**) mediante **GitHub Actions**.

---

## 2. Conocer la Aplicación y Separación de Responsabilidades

### Preguntas de análisis:

#### 1. ¿Qué archivo contiene la regla de cálculo?
El archivo que contiene la regla de cálculo es `src/services/precios.ts`, a través de la función `calcularPrecioFinal(precio: number, descuento: number): number`.

#### 2. ¿Qué archivo define la ruta HTTP?
El archivo que define las rutas HTTP es `src/app.ts`, donde se configuran los endpoints de Express (la ruta de chequeo de salud `GET /healthy` y la ruta de cálculo `POST /api/precios/calcular`). La puesta en marcha del servidor y la escucha en el puerto de red se encuentra delegada en `src/server.ts`.

#### 3. ¿En qué se diferencian sus responsabilidades?
Se aplica el **Principio de Responsabilidad Única (SRP)** y una clara separación de capas de software:

* **Capa de Dominio / Servicio (`src/services/precios.ts`):**  
  Su responsabilidad es estrictamente el cálculo matemático y la aplicación de las reglas del negocio de precios. Valida que las variables de entrada sean números válidos dentro de los dominios admisibles y calcula el total. Es una capa completamente agnóstica al protocolo de transporte: no conoce HTTP, ni Express, ni peticiones `req`, respuestas `res`, ni códigos de estado.
  
* **Capa de Transporte / Controlador HTTP (`src/app.ts`):**  
  Su responsabilidad es gestionar la comunicación externa vía HTTP: enrutamiento, deserialización del cuerpo JSON de la petición (`req.body`), invocación del servicio de precios pasándole los parámetros correspondientes, y traducción de los resultados u excepciones a respuestas HTTP estándar (por ejemplo, retornando código `200 OK` con el total o interceptando errores `RangeError`/`TypeError` para transformarlos en respuestas `400 Bad Request` con un mensaje JSON).

---

## 3. Diagnóstico e Interpretación de la Falla Inicial (TDD: Fase Roja)

Al ejecutar inicialmente `npm test` en el proyecto provisto, se obtuvieron **4 pruebas exitosas y 1 fallida**:

```text
 ❯ tests/precios.test.ts (3 tests | 1 failed)
   ✓ calcularPrecioFinal > aplica un descuento del 10 %
   ✓ calcularPrecioFinal > conserva el precio si el descuento es cero
   × calcularPrecioFinal > rechaza descuentos superiores al 100 %
     → expected function to throw an error, but it didn't
 ✓ tests/api.test.ts (2 tests)
```

### Respuestas a las preguntas de diagnóstico:

#### 1. ¿Qué total devuelve actualmente un descuento del 150 % sobre $1.000?
Devuelve **`-$500`** (menos quinientos pesos).  
Al aplicar la fórmula matemática inicial sin validaciones:  
$$\text{total} = 1000 - \frac{1000 \times 150}{100} = 1000 - 1500 = -500$$

#### 2. ¿Por qué ese resultado no cumple la regla de negocio?
Porque en un sistema de comercio legítimo un descuento representa una bonificación sobre el precio, no un crédito que subsidie al comprador hasta el punto de generar un saldo a favor de este. Un descuento no puede superar el 100 % del valor del producto ni generar totales negativos (la empresa le terminaría pagando al cliente por adquirir el producto). La regla de negocio estipula que los descuentos válidos son porcentajes comprendidos entre 0 % y 100 %.

#### 3. ¿Por qué la prueba falla si la función terminó de ejecutarse?
Porque la aserción de la prueba exigía que la función detectara la transgresión de la regla de negocio y lanzara una excepción de tipo `RangeError`:
```typescript
expect(() => calcularPrecioFinal(1000, 150)).toThrow(RangeError);
```
Como la función no contenía ninguna comprobación previa, se ejecutó normalmente hasta el final retornando `-500`. Para Vitest, que la función haya retornado un valor en lugar de arrojar la excepción esperada constituye un incumplimiento de la expectativa del test.  
Esto evidencia un principio fundamental de la calidad de software: **que un programa se ejecute sin arrojar errores técnicos de sintaxis o ejecución no significa que funcione correctamente ni que cumpla los requisitos de negocio**.

#### 4. ¿Por qué `toThrow` recibe una función flecha `() => ...` en lugar del resultado directo?
Si se escribiera `expect(calcularPrecioFinal(1000, 150))`, el motor de JavaScript evaluaría la función `calcularPrecioFinal` antes de invocar a `expect`. Si la función lanzara una excepción en ese momento, el error se propagaría interrumpiendo abruptamente el runner de pruebas antes de que `toThrow` tuviera la oportunidad de atraparlo e inspeccionarlo.  
Al envolver la llamada dentro de una función flecha `() => calcularPrecioFinal(...)`, se le pasa a Vitest una referencia diferida (callback). Esto le permite a Vitest invocar la función de forma controlada dentro de su propio bloque `try/catch` interno, verificando si se produjo una excepción, si pertenece a la clase esperada (`RangeError`) y si contiene el mensaje adecuado.

---

## 4. Corrección de la Función de Cálculo (TDD: Fase Verde)

Siguiendo la metodología TDD, una vez aislado el caso que falla (fase roja), se implementaron las validaciones requeridas en `src/services/precios.ts` manteniendo la fórmula matemática para las entradas válidas:

```typescript
/** Calcula el precio luego de aplicar un porcentaje de descuento. */
export function calcularPrecioFinal(precio: number, descuento: number): number {
  if (!Number.isFinite(precio) || precio < 0) {
    throw new RangeError('El precio debe ser un número finito mayor o igual a 0');
  }

  if (!Number.isFinite(descuento) || descuento < 0 || descuento > 100) {
    throw new RangeError('El descuento debe ser un número finito entre 0 y 100');
  }

  return precio - (precio * descuento) / 100;
}
```

### Justificación de las validaciones elegidas:
- `Number.isFinite(valor)`: Es más riguroso que `typeof valor === 'number'`, ya que descarta tanto `NaN` (que en JavaScript tiene tipo `number`) como los infinitos (`Infinity`, `-Infinity`).
- `precio < 0`: Impide precios negativos que no tienen sentido en el dominio de ventas.
- `descuento < 0 || descuento > 100`: Asegura que el descuento sea un porcentaje real entre 0 % y 100 %, inclusive.

Tras guardar los cambios y volver a ejecutar `npm test`, **las 5 pruebas iniciales pasaron exitosamente**.

---

## 5. Nuevas Pruebas Unitarias y Casos Límite

Se expandió el archivo `tests/precios.test.ts` para cubrir casos límite y casos inválidos:

```typescript
import { describe, expect, it } from 'vitest';
import { calcularPrecioFinal } from '../src/services/precios.ts';

describe('calcularPrecioFinal', () => {
  it('aplica un descuento del 10 %', () => {
    expect(calcularPrecioFinal(1000, 10)).toBe(900);
  });

  it('conserva el precio si el descuento es cero', () => {
    expect(calcularPrecioFinal(1000, 0)).toBe(1000);
  });

  it('rechaza descuentos superiores al 100 %', () => {
    expect(() => calcularPrecioFinal(1000, 150)).toThrow(RangeError);
  });

  it('devuelve cero con un descuento del 100 %', () => {
    expect(calcularPrecioFinal(1000, 100)).toBe(0);
  });

  it('rechaza un precio negativo', () => {
    expect(() => calcularPrecioFinal(-100, 10)).toThrow(RangeError);
  });

  it('rechaza un descuento negativo', () => {
    expect(() => calcularPrecioFinal(1000, -10)).toThrow(RangeError);
  });

  it('rechaza NaN como precio', () => {
    expect(() => calcularPrecioFinal(NaN, 10)).toThrow(RangeError);
  });

  it('rechaza NaN como descuento', () => {
    expect(() => calcularPrecioFinal(1000, NaN)).toThrow(RangeError);
  });
});
```

### Desafío adicional: Prueba con `NaN`
* **¿La validación implementada rechaza `NaN` como precio?**  
  **Sí.** La función estándar `Number.isFinite(NaN)` evalúa a `false`. En consecuencia, la condición de guarda `!Number.isFinite(precio)` resulta verdadera (`true`), activando inmediatamente el lanzamiento del `RangeError`. Esto garantiza que los valores corruptos o indeterminados provenientes de cálculos erróneos no se propaguen silenciosamente en el sistema.

---

## 6. Pruebas de Integración con Express y Supertest

En `tests/api.test.ts` se incorporaron pruebas de integración utilizando **Supertest** para verificar la interacción entre las rutas HTTP de Express y el servicio de cálculo.

```typescript
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.ts';

describe('API de precios', () => {
  it('responde al chequeo de salud', async () => {
    const respuesta = await request(app).get('/healthy');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ estado: 'ok' });
  });

  it('calcula un precio mediante HTTP', async () => {
    const respuesta = await request(app)
      .post('/api/precios/calcular')
      .send({ precio: 1000, descuento: 10 });
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ total: 900 });
  });

  it('responde HTTP 400 ante un descuento inválido', async () => {
    const respuesta = await request(app)
      .post('/api/precios/calcular')
      .send({ precio: 1000, descuento: 150 });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty('error');
  });

  it('responde HTTP 400 ante un precio inválido', async () => {
    const respuesta = await request(app)
      .post('/api/precios/calcular')
      .send({ precio: -100, descuento: 10 });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toHaveProperty('error');
  });
});
```

### ¿Por qué esta comprobación es de integración y no solamente una prueba unitaria?
Una prueba unitaria evalúa una función en aislamiento completo, llamándola directamente en memoria sin ninguna capa intermedia.  
En cambio, la prueba con Supertest es de **integración** porque comprueba la colaboración coordinada de múltiples subsistemas de la aplicación:
1. El motor de enrutamiento de Express (`app.post`).
2. El middleware de parseo de JSON (`express.json()`) para procesar el cuerpo de la petición.
3. El pasaje de parámetros desde el controlador hacia la capa de servicios (`calcularPrecioFinal`).
4. El mecanismo de captura de excepciones en el controlador (`try/catch`).
5. La serialización de la respuesta y el mapeo correcto de la excepción a un código de estado HTTP (`400 Bad Request`) con formato JSON.

Se comprueba que la arquitectura completa trabaje armoniosamente ante solicitudes HTTP de clientes reales sin necesidad de abrir un socket de red físico en el puerto 3000.

---

## 7. Diferenciar Pruebas Automatizadas y Verificación de Tipos

Comandos evaluados:
* `npm test`: Ejecuta Vitest sobre la suite de tests.
* `npm run typecheck`: Ejecuta `tsc --noEmit`.

### ¿Por qué conviene utilizar tanto `typecheck` como `npm test`?
Porque abordan aspectos cualitativos y temporales totalmente distintos y complementarios del software:

| Aspecto | `npm run typecheck` (`tsc --noEmit`) | `npm test` (`vitest run`) |
| --- | --- | --- |
| **Momento de análisis** | Tiempo de diseño/compilación (estático). | Tiempo de ejecución (dinámico). |
| **Alcance** | Estructuras de datos, firmas de funciones, contratos de interfaces y consistencia tipográfica. | Lógica de negocio, algoritmos, cálculos matemáticos y comportamiento ante flujos reales. |
| **Lo que detecta** | Incompatibilidad de tipos (ej. pasar un `string` o un objeto a un parámetro tipado como `number`). | Fallas semánticas y de negocio (ej. pasar un número válido pero negativo, cálculos con porcentajes superiores a 100, respuestas HTTP con estado incorrecto). |
| **Datos que analiza** | El código fuente escrito por el programador. | Entradas dinámicas reales o simuladas, como payloads JSON recibidos desde la red. |

**Conclusión:** Un programa puede no tener ningún error de tipos en TypeScript y, sin embargo, calcular incorrectamente un descuento o devolver un total negativo. Del mismo modo, un código puede tener tests unitarios para ciertos casos y contener errores sutiles de tipado en ramas secundarias. Por ello, ambas comprobaciones deben combinarse siempre en el pipeline de desarrollo.

---

## 8. Integración Continua (CI) con GitHub Actions

El archivo `.github/workflows/pruebas.yml` automatiza la verificación en el servidor de CI:

```yaml
name: Pruebas automatizadas
on: [push, pull_request]

jobs:
  pruebas:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
```

### Análisis del flujo:
1. **`actions/checkout@v4`**: Clona el código del repositorio en el contenedor virtual limpio.
2. **`actions/setup-node@v4`**: Instala y configura la versión de Node.js estipulada (versión 24).
3. **`npm ci`**: Instala las dependencias de manera estricta y reproducible utilizando el archivo `package-lock.json`, garantizando que en el servidor se utilicen exactamente las mismas versiones que en el entorno de desarrollo local.
4. **`npm run typecheck`**: Valida que no existan errores estáticos de tipos mediante el compilador de TypeScript sin emitir artefactos (`--noEmit`).
5. **`npm test`**: Ejecuta las suites de pruebas unitarias y de integración, asegurando que todos los tests pasen exitosamente.

### ¿Qué aporta GitHub Actions al trabajo colaborativo?
- **Detección temprana de regresiones:** Cada vez que un miembro del equipo sube código o abre un Pull Request, el servidor de CI valida automáticamente que el nuevo código no rompa funcionalidades previas.
- **Eliminación del sesgo "en mi máquina funciona":** Provee un entorno de ejecución estandarizado, neutral y aislado que previene fallas causadas por configuraciones locales o dependencias no declaradas.
- **Confianza en la integración:** Permite a los revisores de código aprobar cambios con la certeza técnica de que la suite de pruebas y el chequeo de tipos han sido superados satisfactoriamente.

---

## 9. Registro de Resultados

A continuación se presenta la tabla completa de comprobaciones realizadas durante la práctica, conforme a la Sección 10 de la guía:

| Comprobación | Resultado | Observación |
| --- | --- | --- |
| **Respuesta de `GET /healthy`** | **Exitoso (HTTP 200)** | Devuelve el objeto JSON `{"estado":"ok"}` confirmando que la API está disponible y respondiendo según lo especificado en la guía. |
| **Primera ejecución de `npm test`** | **1 Fallida, 4 Exitosas (4/5)** | Falló intencionalmente la prueba que requería rechazar descuentos mayores al 100 % (`calcularPrecioFinal(1000, 150)` no lanzaba `RangeError`). |
| **Corrección del servicio (`src/services/precios.ts`)** | **Exitoso (5/5 pruebas aprobadas)** | Se implementaron comprobaciones con `Number.isFinite` y lanzamiento de `RangeError` para precios negativos y descuentos fuera de $[0, 100]$. |
| **Nuevas pruebas unitarias** | **Exitoso (8/8 pruebas unitarias aprobadas)** | Se agregaron pruebas para descuento del 100 %, precio negativo, descuento negativo y rechazo de `NaN` tanto en precio como en descuento. |
| **Prueba de integración HTTP 400** | **Exitoso (4/4 pruebas de integración aprobadas)** | Se verificó mediante Supertest que peticiones con descuentos superiores al 100 % o precios negativos devuelvan código HTTP `400 Bad Request` y la propiedad `error`. |
| **Verificación `npm run typecheck`** | **Exitoso (0 errores de tipos)** | `tsc --noEmit` completó el análisis de tipos estáticos sin advertencias ni errores en ningún archivo de `src/` o `tests/`. |

> **Nota sobre el endpoint de salud:** En algunas plantillas iniciales o borradores figuraba la ruta en español (`/salud`). De acuerdo con la guía oficial del trabajo práctico (`Testing-Guía_Practica.md`), se unificó la ruta a `GET /healthy` tanto en la definición de rutas de Express (`src/app.ts`) como en la prueba de integración de Supertest (`tests/api.test.ts`), verificando su correcto funcionamiento.

---

## 10. Preguntas de Cierre y Síntesis Teórica

### 1. ¿Qué diferencia hay entre comprobar manualmente una respuesta y ejecutar una prueba automatizada?
Una comprobación manual depende de la intervención humana (ingresar datos en una interfaz o ejecutar comandos manuales en la terminal), es susceptible a olvidos, insume tiempo y rara vez se repite ante cada pequeño cambio en el código.  
Una prueba automatizada expresa la comprobación en código de forma reproducible, determinista e instantánea. Puede ejecutarse miles de veces por día, en la terminal o en servidores de CI, garantizando que el comportamiento esperado se mantenga inalterado a lo largo del tiempo.

### 2. ¿Cuál fue la causa de la primera prueba fallida?
La función `calcularPrecioFinal` no realizaba ninguna validación sobre los argumentos que recibía. Al ingresar un descuento del 150 %, restaba el 150 % del valor y devolvía un total negativo ($-500$), en lugar de arrojar una excepción `RangeError` como exigía la regla de negocio y la aserción `toThrow(RangeError)` del test.

### 3. ¿Por qué es útil incluir casos inválidos además de los casos habituales?
En el desarrollo de software los errores más costosos ocurren frecuentemente fuera del "camino feliz" (*happy path*). Probar casos inválidos (descuentos mayores a 100 %, valores negativos, `NaN`, entradas vacías) asegura que la aplicación sea robusta, prevenga estados inconsistentes, proteja la integridad de la base de datos y responda a los clientes con mensajes claros y códigos de estado apropiados en lugar de fallar catastróficamente.

### 4. ¿Qué parte del sistema comprueba `tests/precios.test.ts` y qué partes comprueba `tests/api.test.ts`?
* `tests/precios.test.ts` comprueba exclusivamente la **unidad de lógica de negocio**: la función `calcularPrecioFinal` en `src/services/precios.ts`, de manera aislada y sin dependencias de red ni frameworks.
* `tests/api.test.ts` comprueba la **integración entre capas**: el enrutador de Express, los middlewares de JSON, la captura de errores en el controlador (`src/app.ts`) y la delegación al servicio de cálculo, verificando la respuesta HTTP final.

### 5. ¿Qué ventajas ofrece ejecutar las pruebas después de cada modificación?
Permite detectar **regresiones** al instante. Una regresión es un defecto que se introduce inadvertidamente en una funcionalidad que previamente funcionaba al modificar otra parte del código. Ejecutar las pruebas inmediatamente brinda retroalimentación rápida, permitiendo corregir el defecto mientras el cambio está fresco en la mente del desarrollador, ahorrando horas de depuración posterior.

### 6. ¿Por qué una API que devuelve una respuesta HTTP 200 puede contener errores de negocio?
El código HTTP 200 únicamente indica que el protocolo de transporte y el servidor web procesaron la petición sin fallar técnicamente. Si el código no valida las reglas de negocio, puede responder un código 200 con un resultado absurdo (como calcular un descuento del 150 % y responder `{"total": -500}`). Desde el punto de vista de HTTP todo fue correcto (200), pero desde el punto de vista del negocio existió una falla grave.

### 7. ¿Qué diferencia existe entre un Stub, un Mock y un Spy?
Son **dobles de prueba** (*test doubles*) utilizados cuando se necesita aislar el código de dependencias externas (bases de datos, APIs de terceros, reloj del sistema):
* **Stub:** Proporciona respuestas enlatadas o predeterminadas a las llamadas efectuadas durante la prueba.
* **Mock:** Simula un objeto o servicio con expectativas preprogramadas sobre cómo debe interactuar, permitiendo verificar qué métodos se llamaron y con qué parámetros.
* **Spy:** Envuelve a una función real o simulada para registrar metadatos de su uso (cantidad de veces invocada, argumentos pasados, valores retornados).

### 8. ¿Qué descubre una prueba automatizada que una prueba manual podría pasar por alto?
Las pruebas manuales tienden a concentrarse en los flujos principales y en los casos esperados. Una suite de pruebas automatizadas bien diseñada evalúa simultáneamente decenas de casos límite, tipos de datos especiales (`NaN`, valores fuera de rango) y casos negativos que un operador humano difícilmente probaría de manera exhaustiva en cada iteración del software.

### 9. ¿Por qué se vuelven a ejecutar todas las pruebas después de corregir el código?
Para verificar no solo que el error puntual que motivó la corrección haya quedado resuelto, sino fundamentalmente para cerciorarse de que el nuevo código no haya roto ninguna de las funcionalidades preexistentes (prevención de regresiones colaterales).

---

**Firma del estudiante:**  
Colman Máximo  
*Taller de Lenguajes de Programación IV — Unidad 4*
