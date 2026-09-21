# Guía Extensa para Defensa Oral: Refactorización SOLID

Este documento detalla paso a paso cómo y por qué se transformó un servidor Express monolítico en una arquitectura en capas, ideal para explicar en una defensa técnica.

---

## 1. El Problema Original (El "Monolito")
En el código inicial, teníamos un único archivo `server.ts`. Ese archivo hacía todo: se conectaba a la base de datos, definía cómo eran los datos, validaba lo que enviaba el usuario, calculaba el sueldo y respondía la petición web. 

**¿Por qué es un problema?**
* Violar el **Principio de Responsabilidad Única (SRP)** hace que el código sea frágil. Si alguien se equivoca cambiando una validación HTTP, puede romper el cálculo matemático del sueldo. 
* Impide el trabajo en equipo (si dos desarrolladores tocan el mismo archivo, hay conflictos).

**La Solución:** Dividir el sistema en **Capas**. La información ahora fluye paso a paso y cada archivo se ocupa de una sola cosa.

---

## 2. Explicación de las Capas con Ejemplos de Código

### Capa 1: El Modelo (`models/employee.model.ts`)
**Qué hace:** Define la estructura estricta de la información que vamos a guardar.
**Por qué se separó:** Porque la base de datos necesita saber qué tipos de datos acepta (ej: `baseSalary` debe ser un número). Usamos una **Interfaz** de TypeScript para que el editor de código nos ayude a no cometer errores.

**Fracción de ejemplo:**
```typescript
// Definimos el contrato estricto de qué es un Empleado
export interface IEmployee extends Document {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
  finalSalary: number; // Este lo calculamos nosotros
}

Capa 2: El Repositorio (repository/)
Qué hace: Es el único lugar de todo el proyecto que se comunica de forma directa con la base de datos (MongoDB).
Por qué se implementó así: Aquí aplicamos los principios Abierto/Cerrado (OCP) e Inversión de Dependencias (DIP). No conectamos nuestra lógica directamente a Mongo. En su lugar, creamos una Interfaz (un contrato) que dice qué se puede hacer, y luego una clase que dice cómo hacerlo con Mongo. Si mañana cambiamos a PostgreSQL, creamos otro archivo y el resto del sistema ni se entera.

Fracción de ejemplo (El Contrato y la Implementación):

// 1. El Contrato (Nadie sabe qué base de datos hay detrás)
export interface EmployeeRepository {
  create(employeeData: Partial<IEmployee>): Promise<IEmployee>;
  findById(id: string): Promise<IEmployee null |>;
}

// 2. La Implementación Específica (Esta sí usa Mongoose)
export class EmployeeMongoRepository implements EmployeeRepository {
  async create(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    return await EmployeeModel.create(employeeData);
  }
}

Capa 3: El Servicio (services/employee.service.ts)
Qué hace: Es el "Cerebro" del proyecto. Aquí viven las reglas de negocio.
Por qué se separó: El Servicio no sabe qué es una URL, no sabe qué es un error "404", ni sabe qué base de datos usamos. Solo sabe hacer matemáticas y lógica. Al aislarlo, nos aseguramos de que el cálculo del sueldo sea a prueba de balas y fácil de probar.

Fracción de ejemplo (Inyección de dependencias y Lógica):

export class EmployeeService {
  // INYECCIÓN DE DEPENDENCIAS: Pedimos "un repositorio" por el constructor.
  // No nos importa si es Mongo o SQL, solo que cumpla el contrato.
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  public async createEmployee(data: Partial<IEmployee>): Promise<IEmployee> {
    // REGLA DE NEGOCIO PURA: Matemática separada de las peticiones web
    const bonus = data.baseSalary! * 0.02 * data.yearsOfService!;
    const finalSalary = data.baseSalary! + bonus;

    const newEmployeeData = { ...data, finalSalary };

    // Le decimos al repositorio que guarde, sin saber cómo lo hace
    return await this.employeeRepository.create(newEmployeeData);
  }
}

Capa 4: El Controlador (controllers/employee.controllers.ts)
Qué hace: Es el "Director de Tráfico". Recibe la petición del usuario (req), revisa que no falten datos, le pasa los datos al Servicio para que haga la magia, y le devuelve la respuesta (res) al usuario.
Por qué se separó: Para que Express y la web no se mezclen con las matemáticas. Aquí es donde conectamos las piezas instanciando las clases.

Fracción de ejemplo:

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    // ACÁ OCURRE LA MAGIA: 
    // 1. Creamos la conexión real a Mongo
    const mongoRepository = new EmployeeMongoRepository();
    // 2. Se la pasamos (inyectamos) al Servicio
    this.employeeService = new EmployeeService(mongoRepository);
  }

  public create = async (req: Request, res: Response) => {
    try {
      // VALIDACIONES HTTP (Responsabilidad única del controlador)
      if (!req.body.name || !req.body.position) {
        return res.status(400).json({ message: 'Nombre y puesto obligatorios' });
      }

      // Llamamos al cerebro (Servicio)
      const employee = await this.employeeService.createEmployee(req.body);
      
      // Respondemos al cliente
      return res.status(201).json(employee);
    } catch (error) {
      return res.status(500).json({ message: 'Error interno' });
    }
  };
}

Capa 5: Las Rutas y el Servidor (routes/ y server.ts)
Qué hace: Las rutas solo emparejan una URL (ej: /employees) con una función del Controlador. El archivo server.ts ahora solo arranca la aplicación.
Por qué se separó: El archivo principal quedó completamente limpio. Si entra un programador nuevo, en 10 segundos entiende cómo arranca el proyecto.

Fracción de ejemplo (server.ts):

const app = express();
app.use(express.json());

// Delegamos el tráfico a nuestro archivo de rutas
app.use('/employees', employeeRouter);

const PORT = 3000;
app.listen(PORT, () => console.log('Servidor arriba'));

3. Decisiones de Infraestructura (Docker)
Se decidió utilizar Docker (a través del archivo docker-compose.yml) para aislar la base de datos del entorno local de la computadora.

Por qué se tomó esta decisión:
Si el proyecto lo clona otro desarrollador, no tiene que perder horas instalando MongoDB, configurando variables de entorno o lidiando con versiones incompatibles de su sistema operativo.

Explicación del código Docker:

services:
  mongodb:
    image: mongo:8 # Usa una versión específica y oficial para evitar errores
    container_name: empleados-mongodb # Nombre legible para la terminal
    restart: unless-stopped # Autorecuperación ante fallos del sistema
    ports:
      - "27017:27017" # Conecta el contenedor cerrado con nuestra red local
    volumes:
      - mongo_data:/data/db # Guarda los datos en el disco duro físico para no perderlos si el contenedor se apaga

## Conclusión para la Defensa
El resultado de esta refactorización no es solo un código que "funciona". Es un sistema escalable, predecible y profesional. Aplicando las capas y los principios SOLID, logramos aislar las tecnologías (Express y Mongo) de nuestra verdadera aplicación (el cálculo de sueldos y la gestión de empleados), preparando el proyecto para cualquier cambio futuro a un costo de modificación mínimo.