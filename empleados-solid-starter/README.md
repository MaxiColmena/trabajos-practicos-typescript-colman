# Práctica SOLID - Refactorización de Empleados y Salarios

**Autor:** Colman Maximo

## Objetivo y Consigna
El objetivo de este proyecto fue tomar un servidor Express que funcionaba, pero que estaba deliberadamente mal estructurado (un archivo monolítico `server.ts` con todo mezclado), y refactorizarlo aplicando una separación clara de responsabilidades.
El comportamiento observable de la API se mantuvo igual, pero el código ahora cumple fuertemente con los principios de diseño SOLID.

## Regla de Negocio
El sistema gestiona empleados y calcula su salario final de manera automática basándose en su antigüedad.
**Fórmula:** Salario final = salario base + (2% del salario base por cada año de antigüedad)

*Ejemplo:*
- Salario base: 1.000.000
- Antigüedad: 5 años
- Adicional (2% x 5 = 10%): 100.000
- Salario final: 1.100.000

## Endpoints Disponibles
- `POST /employees` (Crear empleado y calcular salario)
- `GET /employees` (Obtener todos los empleados)
- `GET /employees/:id` (Obtener empleado por ID)
- `PUT /employees/:id` (Actualizar empleado y recalcular salario)
- `DELETE /employees/:id` (Eliminar empleado)

---

## Arquitectura: ¿Qué hicimos, por qué y para qué?
Dividimos el proyecto en capas separadas: `controllers`, `routes`, `services`, `repository` y `models`.

*   **¿Por qué lo hicimos?** Para aplicar **SOLID**, principalmente el **Principio de Responsabilidad Única (SRP)** (logrando que cada archivo tenga una sola tarea) y el **Principio de Inversión de Dependencias (DIP)** (aislando nuestro código de herramientas externas como MongoDB).
*   **¿Para qué sirve esto?** Para tener un código mucho más ordenado, fácil de leer, escalable y preparado para trabajar en equipo bajo metodologías ágiles, evitando conflictos cuando varios desarrolladores editan el proyecto.

### ¿Por qué usamos Clases?
Implementamos clases (Programación Orientada a Objetos) porque nos permiten crear "moldes" estructurados para nuestro código. Las clases nos facilitan el uso de **constructores**, lo cual fue clave para poder "inyectar dependencias". Por ejemplo, gracias a las clases, pudimos pasarle el Repositorio de MongoDB al Servicio de forma externa, en lugar de "atar" el Servicio directamente a la base de datos.

### Investigación: ¿Qué es la capa "Service" (Servicio)?
El Servicio es el "cerebro" o el corazón de nuestra aplicación. Su función en la arquitectura es **manejar exclusivamente la lógica de negocio** (en este proyecto: validar datos y calcular el sueldo final de los empleados). 

Lo más importante de un Servicio es que es completamente independiente: no sabe nada de Internet (no entiende de peticiones HTTP, rutas o Express) y tampoco sabe cómo se guardan los datos (no entiende de MongoDB ni SQL). Solo recibe información limpia del Controlador, aplica sus reglas matemáticas y le pide al Repositorio que guarde el resultado. Esto permite que el día de mañana podamos cambiar la base de datos sin tocar ni una línea de los cálculos de sueldos.

---

## Análisis de Infraestructura (`docker-compose.yml`)
El proyecto incluye un archivo Docker Compose que funciona como nuestra infraestructura automatizada. 
*   **Función principal:** Levanta un entorno aislado (contenedor) con el motor de base de datos, asegurando que funcione igual en cualquier PC sin necesidad de instalaciones manuales complejas.
*   **Servicio configurado:** Configura el servicio `mongodb` utilizando la imagen oficial `mongo:8`.
*   **Resiliencia (`restart: unless-stopped`):** Si hay una falla o se reinicia Docker, la base de datos vuelve a levantarse automáticamente.
*   **Puertos (`27017:27017`):** Actúa como puente, conectando el puerto interno del contenedor de Docker con el de la computadora anfitriona para que la API Express pueda conectarse.
*   **Volúmenes (`mongo_data:/data/db`):** Garantiza la persistencia de datos. Si el contenedor se apaga o se borra, la información de los empleados queda guardada de forma segura en este volumen de Docker.

---

## Cómo ejecutar el proyecto

Para probar el proyecto localmente, ejecuta los siguientes comandos en tu terminal:

```bash
# 1. Crear el archivo de variables de entorno
cp .env.example .env

# 2. Levantar la base de datos con Docker
docker compose up -d

# 3. Instalar las dependencias del proyecto
npm install

# 4. Iniciar el servidor en modo desarrollo
npm run dev