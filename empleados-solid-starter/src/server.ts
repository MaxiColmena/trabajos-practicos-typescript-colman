import 'dotenv/config';
import express from 'express';
import { Database } from './config/database';
import { employeeRouter } from './routes/employee.routes';

// 1. Inicializamos Express
const app = express();

// 2. Middlewares
app.use(express.json());

// 3. Rutas (Delegamos todo lo que empiece con /employees al router)
app.use('/employees', employeeRouter);

// 4. Conexión a la Base de Datos
const db = new Database();
db.connect();

// 5. Levantamos el servidor
const PORT = Number(process.env.PORT ?? 3000);
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});