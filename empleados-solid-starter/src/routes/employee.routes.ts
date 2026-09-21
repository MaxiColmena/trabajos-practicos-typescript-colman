import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

// 1. Inicializamos el router de Express
export const employeeRouter = Router();

// 2. Instanciamos nuestro controlador
const employeeController = new EmployeeController();

// 3. Conectamos cada método HTTP y ruta con su función del controlador
employeeRouter.post('/', employeeController.create);
employeeRouter.get('/', employeeController.getAll);
employeeRouter.get('/:id', employeeController.getById);
employeeRouter.put('/:id', employeeController.update); 
employeeRouter.delete('/:id', employeeController.delete);

//no le pasamos (req, res) a las funciones del controlador en este archivo. Solo le "pasamos la referencia" de la función