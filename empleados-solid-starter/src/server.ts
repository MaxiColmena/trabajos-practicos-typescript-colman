import 'dotenv/config';
import express from 'express';
import { Database } from './config/database';
import { employeeRouter } from './routes/employee.routes';
import { errorHandler } from './errorHandler/errorHandler';

// 1. Inicializamos Express
const app = express();

// 2. Middlewares
app.use(express.json());

// 3. Rutas (Delegamos todo lo que empiece con /employees al router)
app.use('/employees', employeeRouter);

// 4. Middleware de errores: siempre al final, después de las rutas
app.use(errorHandler);

// 5. Conectamos la base de datos y recién después levantamos el servidor
const PORT = Number(process.env.PORT ?? 3000);
const db = new Database();

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
